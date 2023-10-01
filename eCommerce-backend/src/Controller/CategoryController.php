<?php

namespace App\Controller;

use App\Entity\Category;
use App\Repository\CategoryRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\Cache\ItemInterface;

class CategoryController extends AbstractController
{
    #[Route('/categories', name: 'app_all_categories', methods: ['GET'])]
    public function getAllCategories(
        CategoryRepository $categoryRepository,
        CacheInterface $cache,
        SerializerInterface $serializer
    ): JsonResponse
    {
        /**
         * @var Category[] $categories
         */
        $categories = $cache->get('categories', function (ItemInterface $item) use ($categoryRepository, $serializer){
            $item->expiresAfter(3600);

            $categories = $categoryRepository->findAll();

            $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https://' : 'http://';

            // Assuming $categories contains the category data
            foreach ($categories as $category) {
                $subCategories = $category->getSubCategories();
                $subCategoryProducts = [];

                foreach ($subCategories as $subCategory) {
                    $subCategoryProducts = array_merge($subCategoryProducts, $subCategory->getProducts()->toArray());
                }

                $productsImages = [];

                foreach ($subCategoryProducts as $product) {
                    $productsImages = array_merge($productsImages, $product->getImages()->toArray());
                }

                foreach ($productsImages as $image) {
                    $imagePath = $protocol . $_SERVER["HTTP_HOST"] . "\\uploads\\product_images\\" . $image->getImage();
                    $image->setImage($imagePath);
                }
            }


            return $serializer->serialize(
                $categories,
                "json",
                ["groups" => ["category", "subCategory", "product", "picture", "review"]]
            );
        });

        return new JsonResponse($categories, 200, [], true);
    }

    #[IsGranted("ROLE_ADMIN")]
    #[Route('/api/delete/category/{id}', name: "app_delete_category", methods: ['DELETE'])]
    public function deleteCategory(
        EntityManagerInterface $manager,
        Category $category = null
    ): JsonResponse
    {
        if(!$category){
            return $this->json([
                "message" => "Unable to make delete because category is not found..."
            ], 404);
        }

        $manager->remove($category);
        $manager->flush();

        return $this->json(
            ["message" => "the category with name '{$category->getName()}' has been deleted successfully"]
            , 200
        );

    }

    #[IsGranted("ROLE_ADMIN")]
    #[Route('/api/edit/category/{id}', name: 'app_edit_category', methods: ['PUT'])]
    public function editCategory(
        Request $request,
        EntityManagerInterface $manager,
        Category $category = null
    ): JsonResponse
    {
        if(!$category){
            return $this->json([
                "message" => "Unable to make edit because category is not found..."
            ], 404);
        }

        $data = json_decode($request->getContent(), true);

        if(isset($data['name']))
            $category->setName($data['name']);

        $manager->flush();

        return $this->json(["message" => "category updated successfully."], 200);
    }

    #[IsGranted("ROLE_ADMIN")]
    #[Route('/api/new/category', name: 'app_new_category', methods: ['POST'])]
    public function newCategory(
        Request $request,
        SerializerInterface $serializer,
        EntityManagerInterface $manager,
        CategoryRepository $categoryRepository
    ): JsonResponse
    {

        $data = $request->getContent();

        try {

            /**
             * @var Category $category
             */
            $category = $serializer->deserialize($data, Category::class, "json");

            // disable the case when the admin tries to enter the same category multiple times.

            /**
             * @var Category $c
             */

            $c = $categoryRepository->findOneBy(['name' => $category->getName()]);

            if($c != null)
            {
                return $this->json([
                    "message" => "Category Already Existing... Try Adding new one."
                ], 406);
            }

        }
        catch (NotEncodableValueException $e){
            return $this->json([
                "error" => $e->getMessage()
            ], 400);
        }

        $manager->persist($category);
        $manager->flush();

        return $this->json([
            'message' => "new category with name '{$category->getName()}' has been created."
        ], 201, [], ["groups" => ["category", "subCategory", "product"]]);

    }
}
