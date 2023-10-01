<?php

namespace App\Controller;

use App\Entity\Cart;
use App\Entity\Category;
use App\Entity\Client;
use App\Entity\CommandLine;
use App\Entity\Coupon;
use App\Entity\Order;
use App\Entity\Product;
use App\Entity\SubCategory;
use App\Repository\CouponRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;
use Symfony\Component\Serializer\SerializerInterface;

class OrderController extends AbstractController
{
    #[Route('/api/purchase/order', name: 'app_purchase_order', methods: ['POST'])]
    public function purchaseOrder(
        Request $request,
        SerializerInterface $serializer,
        EntityManagerInterface $manager,
        CouponRepository $couponRepository,
        MailerInterface $mailer
    ): JsonResponse
    {
        /**
         * @var Client $client
         */
        $client = $this->getUser();

        /**
         * @var Order $nonPurchasedOrder
         */
        $nonPurchasedOrder = $client->getOrders()->filter(function (Order $order){
            return $order->getPurchasedAt() == null;
        })->first();

        if($nonPurchasedOrder == null){
            return $this->json([
                'message' => 'it seems like your cart is empty at this point...',
            ], 403);
        }

        $data = $request->getContent();

        if($data){

            try {
                /**
                 * @var Coupon $coupon
                 */
                $coupon = $serializer->deserialize($data, Coupon::class, "json");
            }
            catch (NotEncodableValueException $ex){
                return $this->json([
                    "error" => $ex->getMessage()
                ], 400);
            }

            //get available coupons

            $nonExpiredCoupons = $couponRepository->findNonExpiredCoupons();

            if(count($nonExpiredCoupons) == 0){
                return $this->json([
                    "message" => "Coupon code '{$coupon->getCode()}' is wrong or expired..."
                ], 403);
            }

            $counter = 0;

            foreach ($nonExpiredCoupons as $nonExpiredCoupon){

//                dd(gettype($nonExpiredCoupon));

                ++$counter;

                if($nonExpiredCoupon->getCode() == $coupon->getCode()){

                    //calculate discount on whole order:
                    $originalCost = $nonPurchasedOrder->getTotalCost();
                    $nonPurchasedOrder->setDiscountTotalCost(
                        $originalCost - ($originalCost * $nonExpiredCoupon->getPercentage() / 100)
                    );

                    //set coupon for order
                    $coupon->addOrder($nonPurchasedOrder);

                    //purchase order:

                    $nonPurchasedOrder->setPurchasedAt(new \DateTimeImmutable());

                    // recuperate order details (elements of cart) before empty the cart:

                    $items = [];

                    /**
                     * @var Cart $cart
                     */
                    $cart = $nonPurchasedOrder->getCart();

                    /**
                     * @var CommandLine[] $lines
                     */
                    $lines = $cart->getCommandLines();

                    foreach ($lines as $line)
                    {
                        /**
                         * @var Product $product
                         */
                        $product = $line->getProduct();

                        /**
                         * @var SubCategory $subCategory
                         */
                        $subCategory = $product->getSubCategory();

                        /**
                         * @var Category $category
                         */
                        $category = $subCategory->getCategory();

                        $item = [
                            "product" => $product->getName(),
                            "subCategory" => $subCategory->getName(),
                            "category" => $category->getName(),
                            "quantity" => $line->getQuantity(),
                            "totalLineCost" => $line->getTotalLineCost(),
                            "totalWeight" => $line->getTotalWeight()
                            ];

                        $items[] = $item;
                    }

                    // send mail to shipping company:



                    //send mail bill to the customer:

                    /**
                     * @var string $clientEmail
                     */
                    $clientEmail = $client->getEmail();

                    // Calculate the total price of the order
                    $totalPrice = 0;
                    foreach ($items as $item) {
                        $totalPrice += $item['totalLineCost'];
                    }

                    $emailContent = "
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <title>HerboLAB : Order Confirmation</title>
                            <style>
                                body {
                                    font-family: Arial, sans-serif;
                                    background-color: #021639;
                                    color: #48BB78;
                                }
                                h1 {
                                    color: #33546C;
                                }
                                ul {
                                    list-style-type: none;
                                    padding: 0;
                                }
                                li {
                                    margin-bottom: 10px;
                                }
                                .coupon-applied p:first-of-type {
                                    text-decoration: line-through;
                                }
                            </style>
                        </head>
                        <body>
                            <h1>Your Order Confirmation</h1>
                            <p>Thank you for your purchase. Here are the details of your order:</p>
                            
                            <ul>
                    ";

                            foreach ($items as $item) {
                                $emailContent .= "
                            <li>Product: {$item['product']}</li>
                            <li>Subcategory: {$item['subCategory']}</li>
                            <li>Category: {$item['category']}</li>
                            <li>Quantity: {$item['quantity']}</li>
                            <li>Total Line Cost: {$item['totalLineCost']}</li>
                            <li>Total Weight: {$item['totalWeight']}</li>
                        ";
                            }

                            $emailContent .= "
                            </ul>
                            <p class='coupon-applied'>Total Order Price: $totalPrice MAD</p>
                            <p>Total Order Price (Coupon applied): {$nonPurchasedOrder->getDiscountTotalCost()} MAD</p>
                            <p>We appreciate your business!</p>
                        </body>
                        </html>
                    ";

                    $email = (new Email())
                        ->from("herbolab.herbolab@gmail.com")
                        ->to($clientEmail)
                        ->subject("Your order has been purchased.")
                        ->html($emailContent)
                    ;

                    try {
                        $mailer->send($email);
                    } catch (TransportExceptionInterface $e) {

                    }

                    //empty the cart of the current client:

                    /**
                     * @var Cart $clientCart
                     */
                    $clientCart = $client->getCart();

                    /**
                     * @var CommandLine[] $orderLines
                     */
                    $orderLines = $clientCart->getCommandLines();

                    foreach ($orderLines as $line){
                        $manager->remove($line);
                    }

                    $manager->flush();

                    /**
                     * TODO: what's the move when the user purchase his order?
                     *       -> send a bill to his mail-box
                     *       -> just inform him that the order is shipped
                     *       -> or what ???
                     */

                    return $this->json([
                        'message' => 'order purchased successfully',
                        "order" => $nonPurchasedOrder
                    ], 200, [], ["groups" => ["order"]]);
                }
            }

            if($counter == count($nonExpiredCoupons)) {
                return $this->json([
                    "message" => "Coupon code '{$coupon->getCode()}' is wrong..."
                ], 403);
            }

        }

        //purchase order:

        $nonPurchasedOrder->setPurchasedAt(new \DateTimeImmutable());

        // recuperate order details (elements of cart) before empty the cart:

        $items = [];

        /**
         * @var Cart $cart
         */
        $cart = $nonPurchasedOrder->getCart();

        /**
         * @var CommandLine[] $lines
         */
        $lines = $cart->getCommandLines();

        foreach ($lines as $line)
        {
            /**
             * @var Product $product
             */
            $product = $line->getProduct();

            /**
             * @var SubCategory $subCategory
             */
            $subCategory = $product->getSubCategory();

            /**
             * @var Category $category
             */
            $category = $subCategory->getCategory();

            $item = [
                "product" => $product->getName(),
                "subCategory" => $subCategory->getName(),
                "category" => $category->getName(),
                "quantity" => $line->getQuantity(),
                "totalLineCost" => $line->getTotalLineCost(),
                "totalWeight" => $line->getTotalWeight()
            ];

            $items[] = $item;
        }

        // send mail to shipping company:

        //send mail bill to the customer:

        /**
         * @var string $clientEmail
         */
        $clientEmail = $client->getEmail();

        // Calculate the total price of the order
        $totalPrice = 0;
        foreach ($items as $item) {
            $totalPrice += $item['totalLineCost'];
        }

        $emailContent = "
                <!DOCTYPE html>
                <html>
                <head>
                    <title>HerboLAB : Order Confirmation</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #021639;
                            color: #48BB78;
                        }
                        h1 {
                            color: #33546C;
                        }
                        ul {
                            list-style-type: none;
                            padding: 0;
                        }
                        li {
                            margin-bottom: 10px;
                        }
                    </style>
                </head>
                <body>
                    <h1>Your Order Confirmation</h1>
                    <p>Thank you for your purchase. Here are the details of your order:</p>
                    
                    <ul>
            ";

                    foreach ($items as $item) {
                        $emailContent .= "
                    <li>Product: {$item['product']}</li>
                    <li>Subcategory: {$item['subCategory']}</li>
                    <li>Category: {$item['category']}</li>
                    <li>Quantity: {$item['quantity']}</li>
                    <li>Total Line Cost: {$item['totalLineCost']}</li>
                    <li>Total Weight: {$item['totalWeight']}</li>
                ";
                    }

                    $emailContent .= "
                    </ul>
                    <p>Total Order Price: $totalPrice</p>
                    <p>We appreciate your business!</p>
                </body>
                </html>
            ";

        $email = (new Email())
            ->from("herbolab.herbolab@gmail.com")
            ->to($clientEmail)
            ->subject("Your order has been purchased.")
            ->html($emailContent)
        ;

        try {
            $mailer->send($email);
        } catch (TransportExceptionInterface $e) {

        }

        //empty the cart of the current client:

        /**
         * @var Cart $clientCart
         */
        $clientCart = $client->getCart();

        /**
         * @var CommandLine[] $orderLines
         */
        $orderLines = $clientCart->getCommandLines();

        foreach ($orderLines as $line){
            $manager->remove($line);
        }
        $manager->flush();

        /**
         * TODO: what's the move when the user purchase his order?
         *       -> send a bill to his mail-box
         *       -> just inform him that the order is shipped
         *       -> or what ???
         */

        return $this->json([
            'message' => 'order purchased successfully',
            "order" => $nonPurchasedOrder
        ], 200, [], ["groups" => ["order"]]);

    }
}
