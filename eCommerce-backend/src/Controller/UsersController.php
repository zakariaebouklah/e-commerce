<?php

namespace App\Controller;

use App\Entity\Client;
use App\Repository\ClientRepository;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\Cache\ItemInterface;

#[IsGranted('ROLE_ADMIN')]
class UsersController extends AbstractController
{
    #[Route('/api/users', name: 'app_users', methods: ['GET'])]
    public function fetchUsers(
        CacheInterface $cache,
        SerializerInterface $serializer,
        ClientRepository $repository
    ): JsonResponse
    {
        /**
         * @var Client[] $users
         */
        $users = $cache->get('users', function (ItemInterface $item) use ($repository, $serializer){

            $item->expiresAfter(3600*2);

            $clients = $repository->findAll();

            return $serializer->serialize($clients, "json", [
                "groups"=> ['client']
            ]);

        });

        return new JsonResponse($users, 200, [], true);
    }
}
