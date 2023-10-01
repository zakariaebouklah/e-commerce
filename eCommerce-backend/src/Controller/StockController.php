<?php

namespace App\Controller;

use App\Entity\Product;
use App\Entity\Stock;
use App\Repository\StockRepository;
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

#[IsGranted("ROLE_ADMIN")]
class StockController extends AbstractController
{
    #[Route('/api/stocks', name: 'app_all_stocks', methods: ['GET'])]
    public function viewAllStocks(
        StockRepository $repository,
        CacheInterface $cache,
        SerializerInterface $serializer
    ): JsonResponse
    {
        /**
         * @var Stock[] $stocks
         */
        $stocks = $cache->get("stocks", function (ItemInterface $item) use ($serializer, $repository){
            $item->expiresAfter(3600);

            $stocks = $repository->findAll();

            return $serializer->serialize($stocks, "json", ["groups" => ["stock", "product"]]);
        });

        return new JsonResponse($stocks, 200, [], true);
    }

    #[Route('/api/delete/stock/{id}', name: 'app_delete_stock', methods: ['DELETE'])]
    public function deleteStock(
        EntityManagerInterface $manager,
        Stock $stock = null
    ): JsonResponse
    {
        if($stock == null){
            return $this->json([
                "message" => "Unable to delete a non-existent stock."
            ], 404);
        }

        /**
         * @var ?Product $product
         */
        $product = $stock->getProduct();

        $product?->removeStock($stock);

        /**
         * @var Stock[] $productStocks
         */
        $productStocks = $product?->getStocks();
        if(count($productStocks) == 0){
            $product?->setInStock(false);
        }

        $manager->remove($stock);
        $manager->flush();

        return $this->json([
            "message" => "stock is deleted successfully",
        ], 200);
    }

    #[Route('/api/edit/stock/{id}', name: 'app_edit_stock', methods: ['PUT'])]
    public function ediStock(
        Request $request,
        EntityManagerInterface $manager,
        Stock $stock = null
    ): JsonResponse
    {
        if($stock == null){
            return $this->json([
                "message" => "Unable to edit a non-existent stock."
            ], 404);
        }

        $data = json_decode($request->getContent(), true);

        if(isset($data['name']))
            $stock->setName($data['name']);

        if(isset($data['quantity']))
            $stock->setQuantity($data['quantity']);

        $manager->flush();

        return $this->json([
            "message" => "stock is edited successfully",
        ], 200);
    }

    #[Route('/api/new/stock/product/{id}', name: 'app_new_stock', methods: ['POST'])]
    public function addNewStock(
        Request $request,
        SerializerInterface $serializer,
        EntityManagerInterface $manager,
        Product $product = null
    ): JsonResponse
    {
        if($product == null){
            return $this->json([
                "message" => "Unable to create a stock for a non-existent product."
            ], 404);
        }


        $data = $request->getContent();

        try {
            /**
             * @var Stock $stock
             */
            $stock = $serializer->deserialize($data, Stock::class, "json");
        }
        catch(NotEncodableValueException $ex){
            return $this->json([
                "message" => $ex->getMessage()
            ], 400);
        }

        /**
         * @var Product $product
         */
        $product->addStock($stock);
        $product->setInStock(true);

        $manager->persist($stock);
        $manager->flush();

        return $this->json([
            "message" => "new stock is available for the product '{$product->getName()}'",
            'stock' => $stock
        ], 201, [], ["groups" => ["stock", "product"]]);
    }
}
