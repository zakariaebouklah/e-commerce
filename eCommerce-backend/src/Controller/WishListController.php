<?php

namespace App\Controller;

use App\Entity\Client;
use App\Entity\Product;
use App\Entity\WishList;
use App\Repository\WishListRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\Cache\ItemInterface;

class WishListController extends AbstractController
{
    #[Route('/api/my/wishlist', name: 'app_my_wish_list', methods: ['GET'])]
    public function myWishList(
        EntityManagerInterface $manager
    ): JsonResponse
    {
        /**
         * @var Client $client
         */
        $client = $this->getUser();

        /**
         * @var WishList $wishList
         */
        $wishList = $client->getWishList();

        if($wishList == null){
            $wishList = new WishList();

            $wishList->setClient($client);

            $manager->persist($wishList);
            $manager->flush();
        }

        $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https://' : 'http://';

        foreach ($wishList->getProducts() as $product) {
            foreach ($product->getImages() as $image){
                $image->setImage($protocol.$_SERVER["HTTP_HOST"]."\\uploads\\product_images\\".$image->getImage());
            }
        }

        return $this->json([
            'myWishList' => $wishList,
        ], 200, [], ["groups" => ["client", "product", "wishlist", "picture"]]);
    }

    #[Route("/api/add/to/wishlist/product/{id}", name: "add_to_wishlist", methods: ['POST'])]
    public function addProductToWishList(
        EntityManagerInterface $manager,
        Product $product = null,
    ): JsonResponse
    {

        /**
         * @var Client $client
         */
        $client = $this->getUser();

        $clientWishList = $client->getWishList();
        if(!$clientWishList){
            $clientWishList = new WishList();

            $client->setWishList($clientWishList);

            $manager->persist($clientWishList);
        }

        if(!$product){
            return $this->json([
                "message" => "Product to add doesn't exist."
            ], 404);
        }

        $clientWishList->addProduct($product);
        $clientWishList->setModifiedAt(new \DateTimeImmutable());

        $manager->flush();

        return $this->json([
            "message" => "one item has been added to your wishlist.",
            "wishListCount" => $clientWishList->getProducts()->count(),
            "wishListContent" => $clientWishList->getProducts(),
            "wishListOwner" => $clientWishList->getClient()
        ], 200, [], ["groups" => ["client", "product", "wishlist"]]);
    }

    #[Route("/api/delete/from/wishlist/product/{id}", name: "remove_from_wishlist", methods: ['DELETE'])]
    public function removeProductFromWishList(
        EntityManagerInterface $manager,
        Product $product = null,
    ): JsonResponse
    {

        /**
         * @var Client $client
         */
        $client = $this->getUser();

        /**
         * @var WishList $wishList
         */
        $wishList = $client->getWishList();
        if($wishList == null){

            return $this->json([
                "message" => "Unable to remove from empty wishlist."
            ], 400);
        }

        if(!$product){
            return $this->json([
                "message" => "Product to be removed doesn't exist."
            ], 404);
        }

        $wishList->removeProduct($product);
        $wishList->setModifiedAt(new \DateTimeImmutable());

        $manager->flush();

        return $this->json([
            "message" => "one item has been removed from your wishlist.",
            "wishListCount" => $wishList->getProducts()->count(),
            "wishListContent" => $wishList->getProducts(),
            "wishListOwner" => $wishList->getClient()
        ], 200, [], ["groups" => ["client", "product", "wishlist"]]);
    }

    #[IsGranted("ROLE_ADMIN")]
    #[Route('/api/users/wishlists', name: 'view_wishlists', methods: ['GET'])]
    public function viewWishLists(
        WishListRepository $repository
    ): JsonResponse
    {
        /**
         * @var WishList[] $wishLists
         */
        $wishLists = $repository->findAll();

        return $this->json([
            "wishLists" => $wishLists
        ], 200, [], ["groups" => ["client", "product", "wishlist"]]);
    }

    #[IsGranted("ROLE_ADMIN")]
    #[Route('/api/users/wishlist/{id}', name: 'view_wishlist', methods: ['GET'])]
    public function viewWishList(
        WishList $wishList = null
    ): JsonResponse
    {
        if(!$wishList){
            return $this->json([
                "message" => "Unable to view details of a non-existent wishlist."
            ], 404);
        }

        return $this->json([
            "wish-list" => $wishList
        ], 200, [], ["groups" => ["client", "product", "wishlist"]]);
    }
}
