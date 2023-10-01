<?php

namespace App\Controller\OAuth;

use App\Entity\Client;
use App\Repository\ClientRepository;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Events;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Contracts\EventDispatcher\EventDispatcherInterface;

class OAuthController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface   $manager,
        private readonly ClientRepository         $repository,
        private readonly JWTTokenManagerInterface $tokenManager,
        private readonly EventDispatcherInterface $dispatcher,
        private readonly MailerInterface $mailer
    ){}

    #[Route("/connect/oauth/check", name: "connect_oauth_check", methods: ['POST'])]
    public function connectCheckAction(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        try {

            /**
             * @var Client $oauthClient
             */
            $oauthClient = $this->repository->findOneBy(['email' => $data['email']]);

            if($oauthClient == null){
                $oauthClient = new Client();
                $oauthClient->setEmail($data['email']);
                $oauthClient->setUsername($data['name']);
                $oauthClient->setPassword('');
                $oauthClient->setProfilePicture($data['image']);
                $oauthClient->setPhone('');
                $oauthClient->setStreet('');
                $oauthClient->setSignedAt(new \DateTimeImmutable());

                $this->manager->persist($oauthClient);

                $this->manager->flush();
            }

            // Send welcoming mail:

            /**
             * @var string $clientEmail
             */
            $clientEmail = $oauthClient->getEmail();

            $emailContent = "
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Welcome to HerboLAB</title>
                    <style>
                        /* Add your CSS styles here */
                        body {
                            font-family: Arial, sans-serif;
                        }
                        h1 {
                            color: #48BB78;
                        }
                        /* Add more styles as needed */
                    </style>
                </head>
                <body>
                    <h1>Welcome to HerboLAB!</h1>
                    <p>Dear {$oauthClient->getUsername()},</p>
                    <p>Thank you for joining our community. We're excited to have you on board.</p>
                    <p>Feel free to explore our range of cosmetics and food supplements.</p>
                    <p>If you have any questions or need assistance, don't hesitate to reach out to us.</p>
                    <p>Best regards,</p>
                    <p>The HerboLAB Team</p>
                </body>
                </html>
            ";

            // Send Welcome Mail:
            $email = (new Email())
                ->from("herbolab.herbolab@gmail.com")
                ->to($clientEmail)
                ->subject("Your order has been purchased.")
                ->html($emailContent)
            ;

            $this->mailer->send($email);

            // Generate jwt for authorization purpose.

            $response = new JsonResponse();

            $event = new AuthenticationSuccessEvent(
                ["token" => $this->tokenManager->create($oauthClient)],
                $oauthClient,
                $response
            );

            $this->dispatcher->dispatch($event, Events::AUTHENTICATION_SUCCESS);

            $jwt = $event->getData()["token"];

            $timestamp = $this->tokenManager->parse($jwt)["exp"];

            $response->setData(array_merge($event->getData(), [
                'message' => 'New client has been registered to the app...',
                'jwt_expiration' => $timestamp
            ]));

            $response->setStatusCode(Response::HTTP_CREATED);

            //send request to nextjs api:

            return $response;

            // ...
        } catch (\Exception $e) {
            return $this->json([
                "message" => $e->getMessage()
            ], 400);
        } catch (TransportExceptionInterface $e) {
            return $this->json([
                "message" => $e->getMessage()
            ], 400);
        }
    }
}
