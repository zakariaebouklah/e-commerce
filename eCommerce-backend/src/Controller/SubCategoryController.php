<?php

namespace App\Controller;

use App\Entity\Category;
use App\Entity\SubCategory;
use App\Repository\SubCategoryRepository;
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

class SubCategoryController extends AbstractController
{
    #[Route('/sub/category/all', name: 'app_all_sub_category')]
    public function getAllSubCategories(
        SubCategoryRepository $subCategoryRepository,
        SerializerInterface $serializer,
        CacheInterface $cache
    ): JsonResponse
    {
        /**
         * @var SubCategory[] $subCategories
         */
        $subCategories = $cache->get('sub-categories', function (ItemInterface $item) use ($subCategoryRepository, $serializer){

            $item->expiresAfter(3600*2);

            $subCategories = $subCategoryRepository->findAll();

            return $serializer->serialize(
                $subCategories,
                "json",
                ["groups" => ["subCategory", "product", "picture"]]
            );
        });



        return new JsonResponse($subCategories, 200, [], true);
    }

    #[IsGranted("ROLE_ADMIN")]
    #[Route('/api/delete/subcategory/{id}', name: "app_delete_sub_category", methods: ['DELETE'])]
    public function deleteSubCategory(
        EntityManagerInterface $manager,
        SubCategory $subCategory = null
    ): JsonResponse
    {

        if(!$subCategory){
            return $this->json([
                "message" => "Unable to make delete because sub-category is not found..."
            ], 404);
        }

        $manager->remove($subCategory);
        $manager->flush();

        return $this->json(
            ["message" => "the subCategory with name '{$subCategory->getName()}' has been deleted successfully"]
            , 200
        );

    }

    #[IsGranted("ROLE_ADMIN")]
    #[Route('/api/edit/subcategory/{id}', name: 'app_edit_sub_category', methods: ['PUT'])]
    public function editSubCategory(
        Request $request,
        EntityManagerInterface $manager,
        SubCategory $subCategory = null
    ): JsonResponse
    {
        if(!$subCategory){
            return $this->json([
                "message" => "Unable to make edit because sub-category is not found..."
            ], 404);
        }

        $data = json_decode($request->getContent(), true);

        if(isset($data['name']))
            $subCategory->setName($data['name']);

        $manager->flush();

        return $this->json(["message" => "Sub-Category updated successfully."], 200);
    }

    #[IsGranted("ROLE_ADMIN")]
    #[Route('/api/new/subcategory/category/{id}', name: 'app_new_sub_category', methods: ['POST'])]
    public function newSubCategory(
        Request $request,
        SerializerInterface $serializer,
        EntityManagerInterface $manager,
        SubCategoryRepository $subCategoryRepository,
        Category $category = null
    ): JsonResponse
    {

        if(!$category){
            return $this->json([
                "message" => "Unable to create a sub-category within a non-existent category."
            ], 404);
        }

        $data = $request->getContent();

        try {

            /**
             * @var SubCategory $subCategory
             */
            $subCategory = $serializer->deserialize($data, SubCategory::class, "json");

            // disable the case when the admin tries to enter the same category multiple times.

            /**
             * @var SubCategory $c
             */

            $c = $subCategoryRepository->findOneBy(['name' => $subCategory->getName()]);

            if($c != null)
            {
                return $this->json([
                    "message" => "Sub-Category Already Existing... Try Adding new one."
                ], 406);
            }

        }
        catch (NotEncodableValueException $e){
            return $this->json([
                "error" => $e->getMessage()
            ], 400);
        }

        $category->addSubCategory($subCategory);

        $manager->persist($subCategory);
        $manager->flush();

        return $this->json([
            'message' => "new Sub-Category with name '{$subCategory->getName()}' has been created.",
            'sub-category' => $subCategory
        ], 201, [], ["groups" => ["category", "subCategory", "product"]]);

    }

}
