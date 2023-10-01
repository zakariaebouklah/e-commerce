<?php

namespace App\Controller;

use App\Entity\Coupon;
use App\Repository\CouponRepository;
use DateTimeImmutable;
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


class CouponController extends AbstractController
{
    #[Route("/verify/coupon", name: "app_verify_coupon", methods: ['POST'])]
    public function verifyCouponCode(
        Request $request,
        SerializerInterface $serializer,
        CouponRepository $repository
    ): JsonResponse
    {
        $data = $request->getContent();

        try {
            /**
             * @var Coupon $coupon
             */
            $coupon = $serializer->deserialize($data, Coupon::class, "json");
        }
        catch (NotEncodableValueException $exception)
        {
            return $this->json(["message" => $exception->getMessage()], 200);
        }

        $validCoupons = $repository->findNonExpiredCoupons();

        if(count($validCoupons) == 0){
            return $this->json([
                "message" => "Coupon code '{$coupon->getCode()}' is wrong or expired..."
            ], 403);
        }

        $codes = [];
        foreach ($validCoupons as $validCoupon){
            $codes[] = $validCoupon->getCode();
        }

        if(in_array($coupon->getCode(), $codes)){
            return $this->json(
                [
                    "message" => "coupon '{$coupon->getCode()}' is valid.",
                    "coupon" => $repository->findBy(['code' => $coupon->getCode()])
                ],
                200, [],
                ["groups" => ["coupon"]]
            );
        }

        return $this->json(["message" => "Coupon code '{$coupon->getCode()}' is invalid..."], 400, [], ["groups" => ["coupon"]]);
    }

    #[IsGranted("ROLE_ADMIN")]
    #[Route('/api/coupons', name: 'app_coupons', methods: ['GET'])]
    public function viewAllCoupons(
        CouponRepository $repository,
        SerializerInterface $serializer,
        CacheInterface $cache
    ): JsonResponse
    {
        /**
         * @var Coupon[] $coupons
         */
        $coupons = $cache->get('coupons', function (ItemInterface $item) use ($repository, $serializer){
            $item->expiresAfter(3600);

            $coupons = $repository->findAll();

            return $serializer->serialize($coupons, "json", ["groups" => ["coupon"]]);
        });

        return new JsonResponse($coupons, 200, [], true);
    }

    #[IsGranted("ROLE_ADMIN")]
    #[Route('api/delete/coupon/{id}', name: "app_delete_coupon", methods: ['DELETE'])]
    public function deleteCoupon(EntityManagerInterface $manager, Coupon $coupon = null):JsonResponse
    {
        if(!$coupon){
            return $this->json([
                'message' => "Unable to find the coupon.",
            ], 404);
        }

        $manager->remove($coupon);
        $manager->flush();

        return $this->json([
            "message" => "coupon deleted successfully."
        ], 200);
    }

    #[IsGranted("ROLE_ADMIN")]
    #[Route('/api/edit/coupon/{id}', name: 'app_edit_coupon', methods: ['PUT'])]
    public function editCoupon(
        Request $request,
        EntityManagerInterface $manager,
        Coupon $coupon = null
    ): JsonResponse
    {

        if(!$coupon){
            return $this->json([
                'message' => "Unable to find the coupon.",
            ], 404);
        }

        $data = json_decode($request->getContent(), true);

        if(isset($data['code']))
            $coupon->setCode($data['code']);

        if(isset($data['percentage']))
            $coupon->setPercentage($data['percentage']);

        if(isset($data['startsAt']) && isset($data['endsAt'])){

            /**
             * @var DateTimeImmutable $startsAt
             */
            $startsAt = DateTimeImmutable::createFromFormat('Y-m-d H:i:s', $data['startsAt']);
            $coupon->setStartsAt($startsAt);

            /**
             * @var DateTimeImmutable $endsAt
             */
            $endsAt = DateTimeImmutable::createFromFormat('Y-m-d H:i:s', $data['endsAt']);
            $coupon->setEndsAt($endsAt);
        }

        $manager->flush();

        return $this->json([
            'message' => "Coupon updated successfully",
            'coupon' => $coupon
        ], 200, [], ["groups" => ["coupon"]]);
    }

    #[IsGranted("ROLE_ADMIN")]
    #[Route('/api/new/coupon', name: 'app_new_coupon', methods: ['POST'])]
    public function newCoupon(
        Request $request,
        SerializerInterface $serializer,
        EntityManagerInterface $manager,
        CouponRepository $repository
    ): JsonResponse
    {
        $data = $request->getContent();

        try {
            /**
             * @var Coupon $coupon
             */
            $coupon = $serializer->deserialize($data, Coupon::class, "json");

            $c = $repository->findBy(['code' => $coupon->getCode()]);

            if($c){
                return $this->json([
                    "message" => "Coupon with code '{$coupon->getCode()}' Already Existing... try other code."
                ], 406);
            }

        }
        catch(NotEncodableValueException $ex){
            return $this->json([
                "error" => $ex->getMessage()
            ], 400);
        }

        $manager->persist($coupon);
        $manager->flush();

        return $this->json([
            'message' => "new Coupon has been added.",
            'coupon' => $coupon
        ], 201, [], ["groups" => ["coupon"]]);
    }
}
