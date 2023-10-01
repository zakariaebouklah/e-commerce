<?php

namespace App\Controller;

use App\Entity\Product;
use App\Entity\ProductImage;
use App\Form\ProductPicturesFormType;
use Doctrine\ORM\EntityManagerInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Filesystem\Exception\IOException;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\String\Slugger\SluggerInterface;

#[IsGranted("ROLE_ADMIN")]
class ProductImageCollectionController extends AbstractController
{
    #[Route('/api/product/{id}/pictures', name: 'app_product_pictures', methods: ['GET'])]
    public function viewProductPictures(
        Product $product = null
    ): JsonResponse
    {
        if(!$product){
            return $this->json([
                "message" => "Product doesn't exist."
            ], 404);
        }

        return $this->json([
            "pictures" => $product->getImages()
        ],200, [], ["groups" => ["picture", "product"]]);
    }

    #[ParamConverter("picture", class: ProductImage::class, options: ["id" => "id1"])]
    #[ParamConverter("product", class: Product::class, options: ["id" => "id2"])]
    #[Route('/api/remove/picture/{id1}/product/{id2}', name: "app_remove_picture", methods: ['DELETE'])]
    public function removePicture(
        EntityManagerInterface $manager,
        ProductImage $picture = null,
        Product $product = null,
    ): JsonResponse
    {
        if(!$product){
            return $this->json([
                "message" => "Unable to remove picture because the product doesn't exist."
            ], 404);
        }

        if(!$picture){
            return $this->json([
                "message" => "Unable to remove a non-existent picture."
            ], 404);
        }

        $product->removeImage($picture);

        $manager->remove($picture);

        $filePath = "\uploads\\product_images\\".$picture->getImage();
        $fs = new Filesystem();
        $errors = "";

        try {
            if($fs->exists($_SERVER['DOCUMENT_ROOT'].$filePath)){
                $fs->remove($_SERVER['DOCUMENT_ROOT'].$filePath);
            }
        }
        catch (IOException $ex){
            $errors .= $ex->getMessage();
        }

        if($errors == ""){
            $manager->flush();

            return $this->json([
                "message" => "picture removed successfully."
            ],200);
        }
        else{
            return $this->json([
                "error" => $errors
            ],400);
        }
    }

    #[Route('/api/add/picture/product/{id}', name: "app_add_pictures", methods: ['POST'])]
    public function associatePicture(
        Request $request,
        SluggerInterface $slugger,
        EntityManagerInterface $manager,
        Product $product = null,
    ): JsonResponse
    {
        if(!$product){
            return $this->json([
                "message" => "Unable to add picture because the product doesn't exist."
            ], 404);
        }

        try {

            $picture = new ProductImage();

            $form = $this->createForm(ProductPicturesFormType::class, $picture);
            $form->handleRequest($request);

            if($form->isSubmitted()) {

                $img = $form->get('image')->getData();

                if ($img) {
                    $originalFilename = pathinfo($img->getClientOriginalName(), PATHINFO_FILENAME);
                    // this is needed to safely include the file name as part of the URL
                    $safeFilename = $slugger->slug($originalFilename);
                    $newFilename = $safeFilename . '-' . uniqid() . '.' . $img->guessExtension();

                    //store the file in the file system
                    try {
                        $img->move(
                            $this->getParameter('product_images'),
                            $newFilename
                        );
                    } catch (FileException $ex) {
                        return $this->json([
                            "message" => $ex->getMessage()
                        ], 400);
                    }


                    // updates the 'image' property to store the image file name
                    // instead of its contents
                    $picture->setImage($newFilename);

                }

            }

        }
        catch(NotEncodableValueException $ex){
            return $this->json([
                "message" => $ex->getMessage()
            ], 400);
        }

        $product->addImage($picture);

        $manager->persist($picture);
        $manager->flush();

        return $this->json([
            "message" => "new picture for the product '{$product->getName()}' has been uploaded successfully",
            "picture" => $picture
        ],201, [], ["groups" => ["picture", "product"]]);
    }
}
