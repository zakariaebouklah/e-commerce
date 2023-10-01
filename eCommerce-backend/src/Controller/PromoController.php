<?php

namespace App\Controller;

use App\Entity\Product;
use App\Entity\Promotion;
use App\Repository\PromotionRepository;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\Cache\ItemInterface;


#[IsGranted("ROLE_ADMIN")]
class PromoController extends AbstractController
{
    public function __construct(public PromotionRepository $repository){}

    #[Route("/api/promotions")]
    public function getAllPromotions(
        SerializerInterface $serializer,
        CacheInterface $cache
    ): JsonResponse
    {
        /**
         * @var Promotion[] $promos
         */
        $promos = $cache->get("promos", function (ItemInterface $item) use ($serializer){
            $item->expiresAfter(3600);

            $promos = $this->repository->findAll();

            return $serializer->serialize($promos, "json", ["groups" => ["promo", "product"]]);

        });

        return new JsonResponse($promos, 200, [], true);
    }

    #[Route('/api/new/promo/product/{id}', name: 'app_new_promo', methods: ['POST'])]
    public function newPromotion(
        Request $request,
        SerializerInterface $serializer,
        EntityManagerInterface $manager,
        Product $product = null
    ): JsonResponse
    {

//        dd($request->getContent());

        if(!$product){
            return $this->json([
                'message' => "Unable to create a new promotion within a non-existent product."
            ], 404);
        }

        $data = $request->getContent();

        try {

            /**
             * @var Promotion $promo
             */
            $promo = $serializer->deserialize($data, Promotion::class, "json");
        }
        catch (NotEncodableValueException $ex){
            return $this->json([
                "error" => $ex->getMessage()
            ], 400);
        }

        $product->addPromotion($promo);

        /**
         * product discount calculation
         */
        $originalPrice = $product->getPrice();
        $percentage = $promo->getPercentage();

        $product->setDiscountPrice($originalPrice - ($originalPrice * $percentage/100));

        $manager->persist($promo);
        $manager->flush();

        return $this->json([
            "message" => "new Promo has been attached to the product : '{$product->getName()}'",
            "promotion" => $promo,
            "product" => $product
        ], 201, [], ["groups" => ["promo", "product"]]);
    }

    #[ParamConverter("promotion", class: Promotion::class, options: ['id' => 'id1'])]
    #[ParamConverter("product", class: Product::class, options: ['id' => 'id2'])]
    #[Route("/api/edit/promotion/{id1}/product/{id2}", name: "app_edit_promo", methods: ['PUT'])]
    public function editPromo(
        Request $request,
        EntityManagerInterface $manager,
        Promotion $promotion = null,
        Product $product = null,
    ): JsonResponse
    {
        /**
         * TODO: modify the check for url parameters to be stronger
         *       because we need to check if the promotion we're trying to edit
         *       relates to the right product in the url...
         */

        if(!$product){
            return $this->json([
                "message" => "Unable to edit a promotion because the product doesn't exist."
            ], 404);
        }

        if(!$promotion){
            return $this->json([
                "message" => "Unable to edit a non-existent promotion."
            ], 404);
        }

        $data = json_decode($request->getContent(), true);

        if(isset($data['startsAt'])){
            /**
             * @var DateTimeImmutable $startsAt
             */
            $startsAt = DateTimeImmutable::createFromFormat('Y-m-d H:i:s', $data['startsAt']);
            $promotion->setStartsAt($startsAt);
        }

        if(isset($data['endsAt'])){
            /**
             * @var DateTimeImmutable $endsAt
             */
            $endsAt = DateTimeImmutable::createFromFormat('Y-m-d H:i:s', $data['endsAt']);
            $promotion->setEndsAt($endsAt);
        }

        if(isset($data['percentage'])){
            $promotion->setPercentage($data['percentage']);

            /**
             * product discount calculation
             */
            $originalPrice = $product->getPrice();
            $percentage = $promotion->getPercentage();

            $product->setDiscountPrice($originalPrice - ($originalPrice * $percentage/100));
        }

        $manager->flush();

        return $this->json([
            "message" => "Promo updated successfully.",
            "promotion" => $promotion,
            "product" => $product
        ], 200, [],["groups" => ["promo", "product"]]);
    }

    #[ParamConverter("promo", class: Promotion::class, options: ['id' => 'id1'])]
    #[ParamConverter("product", class: Product::class, options: ['id' => 'id2'])]
    #[Route("/api/delete/promo/{id1}/product/{id2}", name: "app_delete_promo", methods: ['DELETE'])]
    public function deletePromo(
        EntityManagerInterface $manager,
        Promotion $promotion = null,
        Product $product = null,
    ): JsonResponse
    {

        if(!$product){
            return $this->json([
                "message" => "Unable to delete a promotion because the product doesn't exist."
            ], 404);
        }

        if(!$promotion){
            return $this->json([
                "message" => "Unable to delete a non-existent promotion."
            ], 404);
        }

        $product->setDiscountPrice(null);

        $manager->remove($promotion);
        $manager->flush();

        return $this->json([
            "message" => "promotion deleted successfully.",
            "promotion" => $promotion
        ], 200, [], ["groups" => ["promo", "product"]]);
    }
}
