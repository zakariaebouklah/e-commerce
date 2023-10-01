<?php

namespace App\Controller;

use App\Entity\Client;
use App\Entity\Product;
use App\Entity\Review;
use App\Form\ReviewFormType;
use Doctrine\ORM\EntityManagerInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Filesystem\Exception\IOException;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\String\Slugger\SluggerInterface;

class ReviewController extends AbstractController
{
    #[Route('/reviews/product/{id}', name: 'app_reviews_product', methods: ['GET'])]
    public function reviewsOfProduct(
        EntityManagerInterface $manager,
        Product $product = null
    ): JsonResponse
    {
        if(!$product){
            return $this->json([
                "message" => "Unable to get reviews of a non-existent product."
            ], 404);
        }

        /**
         * @var Review[] $reviewsOfProduct
         */
        $reviewsOfProduct = $product->getReviews()->toArray();
        $avgRate = $this->calculateAverageRateOfProduct($reviewsOfProduct);

        $product->setRatingAvg($avgRate);

        $manager->flush();

        return $this->json([
            "reviewsCount" => $product->getReviews()->count(),
            "reviews" => $product->getReviews()
        ], 200, [], ["groups" => ["client", "review", "product"]]);
    }

    #[ParamConverter("review", class: Review::class, options: ["id" => "id1"])]
    #[ParamConverter("product", class: Product::class, options: ["id" => "id2"])]
    #[Route("/api/delete/review/{id1}/product/{id2}", name: "app_remove_review", methods: ['DELETE'])]
    public function removeReview(
        EntityManagerInterface $manager,
        Review $review = null,
        Product $product = null
    ): JsonResponse
    {
        if(!$review){
            return $this->json([
                "message" => "Unable to delete a non-existent review."
            ], 404);
        }

        if(!$product){
            return $this->json([
                "message" => "Unable to delete a review because the product doesn't exist."
            ], 404);
        }

        $product->removeReview($review);

        // delete the review's image from the filesystem

        $fs = new Filesystem();
        $errors = "";

        $filePath = "\\uploads\\reviews_snaps\\".$review->getSnapImage();

        try {
            if($fs->exists($_SERVER['DOCUMENT_ROOT'].$filePath)){
                $fs->remove($_SERVER['DOCUMENT_ROOT'].$filePath);
            }
        }
        catch (IOException $ex){
            $errors .= $ex->getMessage();
        }

        // calculate the average rating for the product

        /**
         * @var Review[] $reviewsOfProduct
         */
        $reviewsOfProduct = $product->getReviews()->toArray();
        $avgRate = $this->calculateAverageRateOfProduct($reviewsOfProduct);

        $product->setRatingAvg($avgRate);

        $manager->remove($review);
        $manager->flush();

        return $this->json([
            "message" => "Review deleted successfully",
            "review" => $review,
            "errors" => $errors
        ], 200, [], ["groups" => ["client", "review", "product"]]);
    }

    #[ParamConverter("review", class: Review::class, options: ["id" => "id1"])]
    #[ParamConverter("product", class: Product::class, options: ["id" => "id2"])]
    #[Route("/api/edit/review/{id1}/product/{id2}", name: "app_edit_review", methods: ['POST'])]
    public function editReview(
        Request $request,
        EntityManagerInterface $manager,
        SluggerInterface $slugger,
        Review $review = null,
        Product $product = null
    ): JsonResponse
    {

        if(!$review){
            return $this->json([
                "message" => "Unable to edit a non-existent review."
            ], 404);
        }

        if(!$product){
            return $this->json([
                "message" => "Unable to edit a review because the product doesn't exist."
            ], 404);
        }

        $data = [
            "experience" => $request->get("experience"),
            "rate" => intval($request->get("rate"))
        ];

        if($data['experience'])
            $review->setExperience($data['experience']);

        if($data['rate'])
            $review->setRate($data['rate']);

        if($request->files->get('snapImage')){
            $form = $this->createForm(ReviewFormType::class, $review);
            $form->submit(["snapImage" => $request->files->get('snapImage')]);
            $form->handleRequest($request);

            if($form->isSubmitted()) {

                $snapImg = $form->get('snapImage')->getData();

                if ($snapImg) {
                    $originalFilename = pathinfo($snapImg->getClientOriginalName(), PATHINFO_FILENAME);
                    // this is needed to safely include the file name as part of the URL
                    $safeFilename = $slugger->slug($originalFilename);
                    $newFilename = $safeFilename . '-' . uniqid() . '.' . $snapImg->guessExtension();

                    //store the file in the file system
                    try {
                        $snapImg->move(
                            $this->getParameter('review_images'),
                            $newFilename
                        );
                    } catch (FileException $ex) {
                        return $this->json([
                            "message" => $ex->getMessage()
                        ], 400);
                    }

                    // updates the 'snapImage' property to store the image file name
                    // instead of its contents
                    $review->setSnapImage($newFilename);

                }

            }
        }

        $review->setUpdatedAt(new \DateTimeImmutable());

        /**
         * @var Review[] $reviewsOfProduct
         */
        $reviewsOfProduct = $product->getReviews()->toArray();
        $avgRate = $this->calculateAverageRateOfProduct($reviewsOfProduct);

        $product->setRatingAvg($avgRate);

        $manager->flush();

        return $this->json([
            "message" => "Review updated successfully",
            "review" => $review
        ], 200, [], ["groups" => ["client", "review", "product"]]);
    }

    #[Route('/api/new/review/product/{id}', name: 'app_compose_review', methods: ['POST'])]
    public function composeReview(
        Request $request,
        EntityManagerInterface $manager,
        SerializerInterface $serializer,
        SluggerInterface $slugger,
        Product $product = null
    ): JsonResponse
    {

        if(!$product){
            return $this->json([
                "message" => "Unable to create a review for a non-existent product."
            ], 404);
        }

        $data = json_encode([
            "experience" => $request->get("experience"),
            "rate" => intval($request->get("rate"))
        ]);

        try {

            /**
             * @var Review $review
             */
            $review = $serializer->deserialize($data, Review::class, "json");

            $form = $this->createForm(ReviewFormType::class, $review);
            $form->handleRequest($request);

            if($form->isSubmitted()) {

                $snapImg = $form->get('snapImage')->getData();

                if ($snapImg) {
                    $originalFilename = pathinfo($snapImg->getClientOriginalName(), PATHINFO_FILENAME);
                    // this is needed to safely include the file name as part of the URL
                    $safeFilename = $slugger->slug($originalFilename);
                    $newFilename = $safeFilename . '-' . uniqid() . '.' . $snapImg->guessExtension();

                    //store the file in the file system
                    try {
                        $snapImg->move(
                            $this->getParameter('review_images'),
                            $newFilename
                        );
                    } catch (FileException $ex) {
                        return $this->json([
                            "message" => $ex->getMessage()
                        ], 400);
                    }


                    // updates the 'snapImage' property to store the image file name
                    // instead of its contents
                    $review->setSnapImage($newFilename);

                }

            }

        }
        catch(NotEncodableValueException $ex){
            return $this->json([
                "message" => $ex->getMessage()
            ], 400);
        }

        $product->addReview($review);

        /**
         * @var Review[] $reviewsOfProduct
         */
        $reviewsOfProduct = $product->getReviews()->toArray();
        $avgRate = $this->calculateAverageRateOfProduct($reviewsOfProduct);

        $product->setRatingAvg($avgRate);

        /**
         * @var Client $client
         */
        $client = $this->getUser();
        $client->addReview($review);

        $review->setCreatedAt(new \DateTimeImmutable());

        $manager->persist($review);
        $manager->flush();

        return $this->json([
            "message" => "new review has been added for the product '{$product->getName()}'",
            "review" => $review
        ], 201, [], ["groups" => ["client", "review", "product"]]);
    }

    //UTILS:

    /**
     * @param Review[] $productReviews
     * @return int
     */
    public function calculateAverageRateOfProduct(array $productReviews): int
    {
        $sum = 0;

        foreach ($productReviews as $r){
            $sum += $r->getRate();
        }

        return intval($sum/count($productReviews));
    }
}
