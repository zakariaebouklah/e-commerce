<?php

namespace App\Controller;

use App\Entity\Product;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\Cache\ItemInterface;

class SearchController extends AbstractController
{
    #[Route('/search', name: 'app_search', methods: ['POST'])]
    public function searchSomething(
        Request $request,
        EntityManagerInterface $manager,
        CacheInterface $cache,
        SerializerInterface $serializer
    ): JsonResponse
    {
        $searchWord = $request->get('word');

        /**
         * @var Product[] $products
         */
        $products = [];

        if($searchWord){

            $products = $cache->get($searchWord, function (ItemInterface $item) use ($manager, $serializer,$searchWord){
                $item->expiresAfter(3600);

                $queryBuilder = $manager->createQueryBuilder();

                $queryBuilder
                    ->select('p')
                    ->from(Product::class, 'p')
                    ->where($queryBuilder->expr()->like('p.name', ':searchTerm'))
                    ->orWhere($queryBuilder->expr()->like('p.description', ':searchTerm'))
                    ->setParameter('searchTerm', '%' . $searchWord . '%');

                /**
                 * @var Product[] $results
                 */
                $results = $queryBuilder->getQuery()->getResult();

                $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https://' : 'http://';

                foreach ($results as $product) {
                    foreach ($product->getImages() as $image){

                        $image->setImage($protocol.$_SERVER["HTTP_HOST"]."\\uploads\\product_images\\".$image->getImage());
                    }
                }

                return $serializer->serialize(
                    $results,
                    "json",
                    ["groups" => ["product", "picture"]]
                );
            });

        }

        return new JsonResponse($products, 200, [], true);

    }
}
