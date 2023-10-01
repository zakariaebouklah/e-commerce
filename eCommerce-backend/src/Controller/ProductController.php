<?php

namespace App\Controller;

use App\Entity\Product;
use App\Entity\SubCategory;
use App\Repository\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\Cache\ItemInterface;

class ProductController extends AbstractController
{
    #[Route('/products', name: 'app_products', methods: ['GET'])]
    public function products(
        CacheInterface $cache,
        SerializerInterface $serializer,
        ProductRepository $productRepository
    ): JsonResponse
    {
        /**
         * @var Product[] $products
         */
        $products = $cache->get('all-products', function (ItemInterface $item) use ($serializer, $productRepository){
            $item->expiresAfter(3600*2);

            $products = $productRepository->findAll();

            $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https://' : 'http://';

            foreach ($products as $product) {
                foreach ($product->getImages() as $image){
                    $image->setImage($protocol.$_SERVER["HTTP_HOST"]."\\uploads\\product_images\\".$image->getImage());
                }

                foreach ($product->getReviews() as $review){
                    $review->setSnapImage($protocol.$_SERVER["HTTP_HOST"]."\\uploads\\reviews_snaps\\".$review->getSnapImage());
                }
            }

            return $serializer->serialize(
                $products,
                "json",
                ["groups" => ["product", "review", "client", "picture"]]
            );
        });

        return new JsonResponse($products, 200, [], true);
    }

    #[Route('/products/{id}', name: 'app_product', methods: ['GET'])]
    public function getProductByID(Product $product = null): JsonResponse
    {
        if(!$product){
            return $this->json([
                "message" => "Unable to find the requested product."
            ], 404);
        }

        $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https://' : 'http://';

        foreach ($product->getImages() as $image){
            $image->setImage($protocol.$_SERVER["HTTP_HOST"]."\\uploads\\product_images\\".$image->getImage());
        }

        foreach ($product->getReviews() as $review){
            if($review->getSnapImage() !== null){
                $review->setSnapImage($protocol.$_SERVER["HTTP_HOST"]."\\uploads\\reviews_snaps\\".$review->getSnapImage());
            }
        }

        return $this->json([
            "product" => $product
        ], 200, [], ['groups' => ["product", "review", "picture", "client"]]);
    }

    #[Route('/products/sub/category/{id}', name: 'app_products_by_category', methods: ['GET'])]
    public function productsBySubCategory(
        ProductRepository $productRepository,
        SerializerInterface $serializer,
        CacheInterface $cache,
        SubCategory $subCategory = null
    ): JsonResponse
    {
        if(!$subCategory){
            return $this->json([
                "message" => "Unable to get any products because the sub-category does not exist..."
            ], 404);
        }

        /**
         * @var Product[] $products
         */
        $products = $cache->get('sub-category-'.$subCategory->getId(), function (ItemInterface $item) use ($subCategory, $productRepository, $serializer){
            $item->expiresAfter(3600*2);

            $products = $productRepository->findBy(['subCategory' => $subCategory]);

            $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https://' : 'http://';

            foreach ($products as $product) {
                foreach ($product->getImages() as $image){
                    $image->setImage($protocol.$_SERVER["HTTP_HOST"]."\\uploads\\product_images\\".$image->getImage());
                }
            }

            return $serializer->serialize(
                $products,
                "json",
                ["groups" => ["product", "review", "picture"]]
            );
        });

        return new JsonResponse($products, 200, [], true);
    }

    #[IsGranted("ROLE_ADMIN")]
    #[Route('/api/delete/product/{id}', name: 'app_delete_product', methods: ['DELETE'])]
    public function deleteProduct(
        EntityManagerInterface $manager,
        Product $product = null
    ):JsonResponse
    {
        if(!$product){
            return $this->json([
                "message" => "Unable to delete because the product does not exist..."
            ], 404);
        }

        $manager->remove($product);
        $manager->flush();

        return $this->json([
            "message" => "the product with name '{$product->getName()}' has been deleted successfully"
            ], 200);
    }

    #[IsGranted("ROLE_ADMIN")]
    #[Route("/api/edit/product/{id}", name: 'app_edit_product', methods: ['PUT'])]
    public function editProduct(
        EntityManagerInterface $manager,
        Request $request,
        Product $product = null
    ): JsonResponse
    {
        if(!$product){
            return $this->json([
                "message" => "Unable to edit because the product does not exist..."
            ], 404);
        }

        $data = json_decode($request->getContent(), true);

        if(isset($data['name']))
            $product->setName($data['name']);

        if(isset($data['price']))
            $product->setPrice($data['price']);

        if(isset($data['description']))
            $product->setDescription($data['description']);

        if(isset($data['inStock']))
            $product->setInStock($data['inStock']);

        if(isset($data['weight']))
            $product->setWeight($data['weight']);

        $product->setUpdatedAt(new \DateTimeImmutable());

        $manager->flush();

        return $this->json(["message" => "Product updated successfully."], 200);
    }

    #[IsGranted("ROLE_ADMIN")]
    #[Route("/api/new/product/subcategory/{id}", name: "app_new_product", methods: ['POST'])]
    public function newProduct(
        EntityManagerInterface $manager,
        SerializerInterface $serializer,
        Request $request,
        ProductRepository $productRepository,
        SubCategory $subCategory = null
    ): JsonResponse
    {
        if(!$subCategory){
            return $this->json([
                "message" => "Unable to create a product within a non-existent sub-category."
            ], 404);
        }

        $data = $request->getContent();

        try {
            /**
             * @var Product $product
             */
            $product = $serializer->deserialize($data, Product::class, "json");

            // disable the case when the admin tries to enter the same category multiple times.

            /**
             * @var Product $p
             */

            $p = $productRepository->findOneBy(['name' => $product->getName()]);

            if($p != null)
            {
                return $this->json([
                    "message" => "Product Already Existing... Try Adding new one."
                ], 406);
            }
        }
        catch(NotEncodableValueException $ex){
            return $this->json([
                "message" => $ex->getMessage()
            ], 400);
        }

        $product->setReleasedAt(new \DateTimeImmutable());
        $subCategory->addProduct($product);

        $manager->persist($product);
        $manager->flush();

        return $this->json([
            "message" => "new product with name '{$product->getName()}' has been created."
        ], 201, [], ["groups" => ["category", "subCategory", "product"]]);
    }
}
