<?php

namespace App\Controller;

use App\Entity\Cart;
use App\Entity\Client;
use App\Entity\CommandLine;
use App\Entity\Order;
use App\Entity\Product;
use App\Repository\CartRepository;
use Doctrine\ORM\EntityManagerInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class CartController extends AbstractController
{
    #[Route('/api/my/cart', name: 'app_my_cart', methods: ['GET'])]
    public function myCart(EntityManagerInterface $manager): JsonResponse
    {
        /**
         * @var Client $client
         */
        $client = $this->getUser();

        /**
         * @var Cart $cart
         */
        $cart = $client->getCart();

        if($cart == null){

            $cart = new Cart();

            $cart->setClient($client);

            $newOrder = new Order();
            $newOrder->setCreatedAt(new \DateTimeImmutable());

            $newOrder->setTotalCost(0.0);

            $cart->addOrder($newOrder);
            $client->addOrder($newOrder);

            $manager->persist($cart);
            $manager->persist($newOrder);
        }
        else{

            /**
             * @var Order $latestNonPurchasedOrder
             */
            $latestNonPurchasedOrder = $cart->getOrders()->filter(function (Order $order){
                return $order->getPurchasedAt() == null;
            })->first();

            if($latestNonPurchasedOrder == null){
                $newOrder = new Order();

                $newOrder->setCreatedAt(new \DateTimeImmutable());

                /**
                 * @var float $sum
                 */
                $sum = 0.0;
                foreach ($cart->getCommandLines() as $line){
                    $sum += $line->getTotalLineCost();
                }
                $newOrder->setTotalCost($sum);

                $cart->addOrder($newOrder);
                $client->addOrder($newOrder);

                $manager->persist($newOrder);

            }
            else {

                /**
                 * @var float $sum
                 */
                $sum = 0.0;
                foreach ($cart->getCommandLines() as $line){
                    $sum += $line->getTotalLineCost();
                }
                $latestNonPurchasedOrder->setTotalCost($sum);
                $latestNonPurchasedOrder->setUpdatedAt(new \DateTimeImmutable());

                /**
                 * @var Order[] $orders
                 */
                $orders = $cart->getOrders()->toArray();

                if(!in_array($latestNonPurchasedOrder, $orders)){
                    $cart->addOrder($latestNonPurchasedOrder);
                }
            }

        }

        $manager->flush();

        $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https://' : 'http://';

        foreach ($cart->getCommandLines() as $line) {
            /**
             * @var Product $product
             */
            $product = $line->getProduct();
            foreach ($product->getImages() as $image){
                $image->setImage($protocol.$_SERVER["HTTP_HOST"]."\\uploads\\product_images\\".$image->getImage());
            }
        }

        return $this->json([
            "cart" => $cart,
            "orders" => $cart->getOrders()
        ], 200, [], ["groups" => ["cart", "client", "order-line", "product", "order", "picture"]]);
    }

    #[Route("/api/delete/from/cart/product/{id}", name: "app_delete_from_cart", methods: ['DELETE'])]
    public function removeItemsFromCart(
        EntityManagerInterface $manager,
        Product $product = null
    ): JsonResponse
    {
        /**
         * @var Client $client
         */
        $client = $this->getUser();

        /**
         * @var Cart $clientCart
         */
        $clientCart = $client->getCart();

        /**
         * @var Order $latestNonPurchasedOrder
         */
        $latestNonPurchasedOrder = $clientCart->getOrders()->filter(function (Order $order){
            return $order->getPurchasedAt() == null;
        })->first();

        if(!$product){

            return $this->json([
                "message" => "Unable to delete a non-existing product from this cart."
            ], 404);
        }

        /**
         * @var CommandLine[] $orderLines
         */
        $orderLines = $clientCart->getCommandLines();

        foreach ($orderLines as $orderLine){

            /**
             * @var Product $p
             */
            $p = $orderLine->getProduct();

            if ($p->getId() == $product->getId()) {

                $quantity = $orderLine->getQuantity();
                $orderLine->setQuantity(--$quantity);
                if($product->getDiscountPrice()){
                    $orderLine->setTotalLineCost($orderLine->getQuantity() * $p->getDiscountPrice());
                }
                else{
                    $orderLine->setTotalLineCost($orderLine->getQuantity() * $p->getPrice());
                }
                $orderLine->setTotalWeight($orderLine->getQuantity() * $p->getWeight());

                $clientCart->setModifiedAt(new \DateTimeImmutable());

                if($orderLine->getQuantity() == 0){

                    $manager->remove($orderLine);

                    /**
                     * @var float $sum
                     */
                    $sum = 0.0;
                    foreach ($clientCart->getCommandLines() as $line){
                        $sum += $line->getTotalLineCost();
                    }
                    $latestNonPurchasedOrder->setTotalCost($sum);

                    $manager->flush();

                    return $this->json([
                        "message" => "Order line deleted.",
                        "cart" => $clientCart
                    ], 201, [], ["groups" => ["cart", "client", "order-line", "product", "order"]]);

                }

                /**
                 * @var float $sum
                 */
                $sum = 0.0;
                foreach ($clientCart->getCommandLines() as $line){
                    $sum += $line->getTotalLineCost();
                }
                $latestNonPurchasedOrder->setTotalCost($sum);

                $manager->flush();

                return $this->json([
                    "message" => "You updated the item : '{$product->getName()}' 's quantity in your cart",
                    "cart" => $clientCart
                ], 201, [], ["groups" => ["cart", "client", "order-line", "order", "product"]]);
            }
        }

        return $this->json([
            "message" => "Unable to delete from this cart."
        ], 403);
    }

    #[Route("/api/delete/from/cart/line/{id}", name: "app_delete_line_from_cart", methods: ['DELETE'])]
    public function removeCommandLineFromCart(
        EntityManagerInterface $manager,
        CommandLine $line = null
    ): JsonResponse
    {
        if(!$line){
            return $this->json([
                "message" => "Unable to delete a non-existing order-line from this cart."
            ], 404);
        }

        /**
         * @var Client $client
         */
        $client = $this->getUser();

        /**
         * @var Cart $clientCart
         */
        $clientCart = $client->getCart();

        $clientCart->removeCommandLine($line);

        $manager->remove($line);

        $manager->flush();

        return $this->json(
            [
                "message" => "Cart updated successfully : order-line removed.",
                "cart" => $clientCart
            ],
            200,
            [],
            ["groups" => ["cart", "client", "order-line", "product", "order", "picture"]]
        );
    }

    #[Route("/api/add/to/cart/product/{id}", name: "app_add_to_cart", methods: ['POST'])]
    public function addItemsToCart(EntityManagerInterface $manager, Product $product = null): JsonResponse
    {

        /**
         * @var Client $client
         */
        $client = $this->getUser();

        /**
         * @var Cart $clientCart
         */
        $clientCart = $client->getCart();

        if($clientCart == null){
            $clientCart = new Cart();

            $clientCart->setClient($client);

            $manager->persist($clientCart);
        }

        if(!$product){

            return $this->json([
                "message" => "Unable to add a non-existing product to this cart."
            ], 404);
        }

        // manipulate order-lines (command lines)

        /**
         * @var CommandLine[] $orderLines
         */
        $orderLines = $clientCart->getCommandLines();

        // check if there's still a non-purchased order to associate with the current cart

        /**
         * @var Order $latestNonPurchasedOrder
         */
        $latestNonPurchasedOrder = $clientCart->getOrders()->filter(function (Order $order){
            return $order->getPurchasedAt() == null;
        })->first();

        if(count($orderLines) != 0) {

            if($latestNonPurchasedOrder == null){
                $latestNonPurchasedOrder = new Order();
                $latestNonPurchasedOrder->setCreatedAt(new \DateTimeImmutable());

                $manager->persist($latestNonPurchasedOrder);
            }
            else{
                $latestNonPurchasedOrder->setUpdatedAt(new \DateTimeImmutable());
            }

            /**
             * @var float $sum
             */
            $sum = 0.0;
            foreach ($orderLines as $orderLine){
                $sum += $orderLine->getTotalLineCost();
            }
            $latestNonPurchasedOrder->setTotalCost($sum);

            foreach ($orderLines as $orderLine) {

                /**
                 * @var Product $p
                 */
                $p = $orderLine->getProduct();

                if ($p->getId() == $product->getId()) {

                    $clientCart->setModifiedAt(new \DateTimeImmutable());

                    $orderLine->setQuantity($orderLine->getQuantity() + 1);
                    if($product->getDiscountPrice()){
                        $orderLine->setTotalLineCost($orderLine->getQuantity() * $p->getDiscountPrice());
                    }
                    else{
                        $orderLine->setTotalLineCost($orderLine->getQuantity() * $p->getPrice());
                    }
                    $orderLine->setTotalWeight($orderLine->getQuantity() * $p->getWeight());

                    $originalCost = $latestNonPurchasedOrder->getTotalCost();
                    $latestNonPurchasedOrder->setTotalCost($originalCost + $p->getPrice());

                    $manager->flush();

                    return $this->json([
                        "message" => "You updated the item : '{$product->getName()}' 's quantity in your cart.",
                        "cart" => $clientCart
                    ], 201, [], ["groups" => ["cart", "client", "order-line", "order"]]);
                }

            }

        }

        $clientCart->setModifiedAt(new \DateTimeImmutable());

        $orderLine = new CommandLine();
        $orderLine->setProduct($product);
        $orderLine->setQuantity(1);
        if($product->getDiscountPrice()){
            $orderLine->setTotalLineCost($orderLine->getQuantity() * $product->getDiscountPrice());
        }
        else{
            $orderLine->setTotalLineCost($orderLine->getQuantity() * $product->getPrice());
        }
        $orderLine->setTotalWeight($orderLine->getQuantity() * $product->getWeight());

        $clientCart->addCommandLine($orderLine);

        $manager->persist($orderLine);

        if($latestNonPurchasedOrder == null){
            $newOrder = new Order();
            $newOrder->setCreatedAt(new \DateTimeImmutable());

            /**
             * @var float $sum
             */
            $sum = 0.0;
            foreach ($clientCart->getCommandLines() as $line){
                $sum += $line->getTotalLineCost();
            }
            $newOrder->setTotalCost($sum);

            $clientCart->addOrder($newOrder);
            $client->addOrder($newOrder);

            $manager->persist($newOrder);
        }
        else {

//            dd($clientCart->getCommandLines()->count());

            /**
             * @var float $sum
             */
            $sum = 0.0;
            foreach ($clientCart->getCommandLines() as $line){
                $sum += $line->getTotalLineCost();
            }
            $latestNonPurchasedOrder->setTotalCost($sum);

            $manager->persist($latestNonPurchasedOrder);
        }

        $manager->flush();

        return $this->json([
            "message" => "new Item with name '{$product->getName()}' has been added to your cart.",
            "cart" => $clientCart
        ], 201, [], ["groups" => ["cart", "client", "order-line", "order"]]);
    }

    #[IsGranted("ROLE_ADMIN")]
    #[Route('/api/users/carts', name: 'view_carts', methods: ['GET'])]
    public function viewCarts(
        CartRepository $repository
    ): JsonResponse
    {
        /**
         * @var Cart[] $carts
         */
        $carts = $repository->findAll();

        return $this->json([
            "carts" => $carts
        ], 200, [], ["groups" => ["client", "cart", "order-line", "product", "order"]]);
    }

    #[IsGranted("ROLE_ADMIN")]
    #[Route('/api/users/cart/{id}', name: 'view_cart', methods: ['GET'])]
    public function viewCart(Cart $cart = null): JsonResponse
    {
        if(!$cart){
            return $this->json([
                "message" => "Unable to view details of a non-existent cart."
            ], 404);
        }

        return $this->json([
            "cart" => $cart
        ], 200, [], ["groups" => ["client", "cart", "order-line", "product", "order"]]);
    }

}
