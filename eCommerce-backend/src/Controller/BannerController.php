<?php

namespace App\Controller;

use App\Entity\Banner;
use App\Entity\Product;
use App\Entity\SubCategory;
use App\Form\BannerFormType;
use App\Repository\BannerRepository;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Cache\InvalidArgumentException;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Filesystem\Exception\IOException;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\Cache\ItemInterface;

class BannerController extends AbstractController
{
    #[Route('/banners', name: 'app_banners', methods: ['GET'])]
    public function viewBanners(
        BannerRepository $repository,
        CacheInterface $cache,
        SerializerInterface $serializer
    ): JsonResponse
    {
        try {
            /**
             * @var Banner[] $banners
             */
            $banners = $cache->get('banners', function (ItemInterface $item) use ($repository, $serializer) {
                $item->expiresAfter(3600 * 2);

                $banners = $repository->findAll();

                $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https://' : 'http://';

                foreach ($banners as $banner) {
                    $banner->setBannerFile($protocol.$_SERVER["HTTP_HOST"]."\\uploads\\banners\\".$banner->getBannerFile());
                }

                return $serializer->serialize(
                    $banners,
                    "json",
                    ["groups" => ["banner", "product", "subCategory"]]
                );

            });

            return new JsonResponse($banners, 200, [], true);
        } catch (InvalidArgumentException $e) {

            return $this->json([
                'errors' => $e->getMessage()
            ], 400);
        }

    }

    #[IsGranted("ROLE_ADMIN")]
    #[Route('/api/delete/banner/{id}', name: "app_delete_banner", methods: ['DELETE'])]
    public function deleteBanner(
        EntityManagerInterface $manager,
        Banner $banner = null
    ): JsonResponse
    {
        if(!$banner){
            return $this->json([
                'message' => "Unable to remove a non-existing banner."
            ], 400);
        }

        $manager->remove($banner);

        $filePath = "\uploads\\banners\\".$banner->getBannerFile();
        $fs = new Filesystem();
        $errors = "";

//        dump($_SERVER['DOCUMENT_ROOT'].$filePath);
//
//        if($fs->exists($_SERVER['DOCUMENT_ROOT'].$filePath)){
//            dd($_SERVER['DOCUMENT_ROOT'].$filePath);
//        }
//        else{
//            dd("no hh");
//        }

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
                "message" => "Banner removed successfully."
            ],200);
        }
        else{
            return $this->json([
                "error" => $errors
            ],400);
        }
    }

    #[IsGranted("ROLE_ADMIN")]
    #[Route('/api/new/banner/sub-category/{id}', name: 'app_new_banner_sc', methods: ['POST'])]
    public function addBannerForSubCategory(
        Request $request,
        EntityManagerInterface $manager,
        SluggerInterface $slugger,
        SubCategory $subCategory = null
    ): JsonResponse
    {

        if(!$subCategory){
            return $this->json([
                'message' => "Unable to add banner for a non-existing sub-category."
            ], 400);
        }

        try {

            $banner = new Banner();

            $form = $this->createForm(BannerFormType::class, $banner);
            $form->handleRequest($request);

            if($form->isSubmitted()) {

                $bannerFile = $form->get('bannerFile')->getData();

                if ($bannerFile) {
                    $originalFilename = pathinfo($bannerFile->getClientOriginalName(), PATHINFO_FILENAME);
                    // this is needed to safely include the file name as part of the URL
                    $safeFilename = $slugger->slug($originalFilename);
                    $newFilename = $safeFilename . '-' . uniqid() . '.' . $bannerFile->guessExtension();

                    //store the file in the file system
                    try {
                        $bannerFile->move(
                            $this->getParameter('banners_resources'),
                            $newFilename
                        );
                    } catch (FileException $ex) {
                        return $this->json([
                            "message" => $ex->getMessage()
                        ], 400);
                    }


                    // updates the 'banner file' property to store the image file name
                    // instead of its contents
                    $banner->setBannerFile($newFilename);

                }

            }

        }
        catch(NotEncodableValueException $ex){
            return $this->json([
                "message" => $ex->getMessage()
            ], 400);
        }

        $subCategory->addBanner($banner);
        $banner->setCreatedAt(new \DateTimeImmutable());

        $manager->persist($banner);
        $manager->flush();

        return $this->json([
            'message' => "New banner has been successfully added.",
            'banner' => $banner,
        ], 201, [], ["groups" => ["banner"]]);
    }

    #[IsGranted("ROLE_ADMIN")]
    #[Route('/api/new/banner/product/{id}', name: 'app_new_banner_p', methods: ['POST'])]
    public function addBannerForProduct(
        Request $request,
        EntityManagerInterface $manager,
        SluggerInterface $slugger,
        Product $product = null
    ): JsonResponse
    {

        if(!$product){
            return $this->json([
                'message' => "Unable to add banner for a non-existing product."
            ], 400);
        }

        try {

            $banner = new Banner();

            $form = $this->createForm(BannerFormType::class, $banner);
            $form->handleRequest($request);

            if($form->isSubmitted()) {

                $bannerFile = $form->get('bannerFile')->getData();

                if ($bannerFile) {
                    $originalFilename = pathinfo($bannerFile->getClientOriginalName(), PATHINFO_FILENAME);
                    // this is needed to safely include the file name as part of the URL
                    $safeFilename = $slugger->slug($originalFilename);
                    $newFilename = $safeFilename . '-' . uniqid() . '.' . $bannerFile->guessExtension();

                    //store the file in the file system
                    try {
                        $bannerFile->move(
                            $this->getParameter('banners_resources'),
                            $newFilename
                        );
                    } catch (FileException $ex) {
                        return $this->json([
                            "message" => $ex->getMessage()
                        ], 400);
                    }


                    // updates the 'banner file' property to store the image file name
                    // instead of its contents
                    $banner->setBannerFile($newFilename);

                }

            }

        }
        catch(NotEncodableValueException $ex){
            return $this->json([
                "message" => $ex->getMessage()
            ], 400);
        }

        $product->addBanner($banner);
        $banner->setCreatedAt(new \DateTimeImmutable());

        $manager->persist($banner);
        $manager->flush();

        return $this->json([
            'message' => "New banner has been successfully added.",
            'banner' => $banner,
        ], 201, [], ["groups" => ["banner"]]);
    }

    #[IsGranted("ROLE_ADMIN")]
    #[Route('/api/new/banner', name: 'app_new_banner_showcase', methods: ['POST'])]
    public function addBannerForShowCase(
        Request $request,
        EntityManagerInterface $manager,
        SluggerInterface $slugger
    ): JsonResponse
    {

        try {

            $banner = new Banner();

            $form = $this->createForm(BannerFormType::class, $banner);
            $form->handleRequest($request);

            if($form->isSubmitted()) {

                $bannerFile = $form->get('bannerFile')->getData();

                if ($bannerFile) {
                    $originalFilename = pathinfo($bannerFile->getClientOriginalName(), PATHINFO_FILENAME);
                    // this is needed to safely include the file name as part of the URL
                    $safeFilename = $slugger->slug($originalFilename);
                    $newFilename = $safeFilename . '-' . uniqid() . '.' . $bannerFile->guessExtension();

                    //store the file in the file system
                    try {
                        $bannerFile->move(
                            $this->getParameter('banners_resources'),
                            $newFilename
                        );
                    } catch (FileException $ex) {
                        return $this->json([
                            "message" => $ex->getMessage()
                        ], 400);
                    }


                    // updates the 'banner file' property to store the image file name
                    // instead of its contents
                    $banner->setBannerFile($newFilename);

                }

            }

        }
        catch(NotEncodableValueException $ex){
            return $this->json([
                "message" => $ex->getMessage()
            ], 400);
        }

        $banner->setCreatedAt(new \DateTimeImmutable());

        $manager->persist($banner);
        $manager->flush();

        return $this->json([
            'message' => "New banner has been successfully added.",
            'banner' => $banner,
        ], 201, [], ["groups" => ["banner"]]);
    }
}
