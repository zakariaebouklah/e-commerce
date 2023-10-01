<?php

namespace App\Controller;

use App\Entity\Client;
use App\Form\ClientPictureFormType;
use App\Repository\ClientRepository;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Events;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Contracts\EventDispatcher\EventDispatcherInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;
use Symfony\Component\Serializer\SerializerInterface;

class RegistrationController extends AbstractController
{
    #[Route("/api/account/picture/edit", name: "app_account_edit_pic", methods: ['POST'])]
    public function editProfilePicture(
        Request $request,
        EntityManagerInterface $manager,

        SluggerInterface $slugger,
    ): JsonResponse
    {

        /**
         * @var Client $customer
         */
        $customer = $this->getUser();

        $form = $this->createForm(ClientPictureFormType::class, $customer);
        $form->handleRequest($request);

        if($form->isSubmitted()) {

            $img = $form->get('profilePicture')->getData();

            if ($img) {
                $originalFilename = pathinfo($img->getClientOriginalName(), PATHINFO_FILENAME);
                // this is needed to safely include the file name as part of the URL
                $safeFilename = $slugger->slug($originalFilename);
                $newFilename = $safeFilename . '-' . uniqid() . '.' . $img->guessExtension();

                //store the file in the file system
                try {
                    $img->move(
                        $this->getParameter('profile_pics'),
                        $newFilename
                    );
                } catch (FileException $ex) {
                    return $this->json([
                        "message" => $ex->getMessage()
                    ], 400);
                }


                // updates the 'image' property to store the image file name
                // instead of its contents
                $customer->setProfilePicture($newFilename);

            }
        }

        $manager->flush();

        return $this->json([
            "message" => "Profile Picture Updated with Success."
        ], 200);
    }

    #[Route("/api/complete/account", name: "app_complete_account", methods: ['POST'])]
    public function completeAccount(Request $request, EntityManagerInterface $manager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        /**
         * @var Client $customer
         */
        $customer = $this->getUser();

        if(isset($data['street'])){
            $customer->setStreet($data['street']);
        }

        if(isset($data['phone'])){
            $customer->setPhone($data['phone']);
        }

        if(isset($data['about'])){
            $customer->setAbout($data['about']);
        }

        $manager->flush();

        return $this->json([
            "message" => "Account Completed with Success."
        ], 200);
    }

    /**
     * @throws TransportExceptionInterface
     */
    #[Route('/register', name: 'shop_registration', methods: ['POST'])]
    public function register(
        Request $request,
        EntityManagerInterface $manager,
        SerializerInterface $serializer,
        UserPasswordHasherInterface $hasher,
        ClientRepository $clientRepository,
        JWTTokenManagerInterface $tokenManager,
        EventDispatcherInterface $dispatcher,
        ValidatorInterface $validator,
        MailerInterface $mailer
    ): JsonResponse
    {

        // Recuperate data sent from registration form
        $data = $request->getContent();

        /**
         * the try--catch bloc is used to determine if the data we got from request (body) is Encodable
         * i.e. in a good json format...
         */

        try {

            // Turn the json received by the endpoint to a Client Entity object.

            /**
             * @var Client $client
             */
//            $client = $serializer->deserialize($data, Client::class, "json", ['groups' => ['client']]);
            $client = $serializer->deserialize($data, Client::class, "json");

            // Check if the user already got an account on the app.

            $xClient = $clientRepository->findOneBy(['email' => $client->getEmail(), 'phone' => $client->getPhone()]);

            if ($xClient != null){
                return $this->json([
                    "message" => "Account Already Existing..."
                ], 406);
            }

        }
        catch (NotEncodableValueException $ex){
            return $this->json([
                "message" => $ex->getMessage()
            ], 400);
        }

        // Validate the Client object before persisting & storing in db

        $errors = $validator->validate($client);

        if (count($errors) > 0) return $this->json(
            [
             "validation_status" => "Validation failed.",
             "errors" => $errors
            ], 400);

        // Hashing Client's Password

        /**
         * @var string $plainPassword
         */
        $plainPassword = $client->getPassword();
        $client->setPassword($hasher->hashPassword($client, $plainPassword));

        $client->setSignedAt(new \DateTimeImmutable());

        // Store the newly created client in the database.

        $manager->persist($client);
        $manager->flush();

        /**
         * @var string $clientEmail
         */
        $clientEmail = $client->getEmail();

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
                    <p>Dear {$client->getUsername()},</p>
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

        $mailer->send($email);

        // Generate jwt for authorization purpose.

        $response = new JsonResponse();

        $event = new AuthenticationSuccessEvent(
            ["token" => $tokenManager->create($client)],
            $client,
            $response
        );

        $dispatcher->dispatch($event, Events::AUTHENTICATION_SUCCESS);

        $jwt = $event->getData()["token"];

        $timestamp = $tokenManager->parse($jwt)["exp"];

        $response->setData(array_merge($event->getData(), [
            'message' => 'New client has been registered to the app...',
            'jwt_expiration' => $timestamp
        ]));

        $response->setStatusCode(Response::HTTP_CREATED);

        /**
         * creating httpOnly cookie to be stored in the client side
         * as it is considered to be the best option to store sensitive data
         * in this case the jw-token so that the user is authorized to serf in the app through API endpoints
         *  moreover we are immune to XSS and CSRF attacks .
         */

        $cookie = new Cookie(
            "auth", $jwt, $timestamp, '/', null,
            true, true, false, Cookie::SAMESITE_STRICT
        );

        $response->headers->setCookie($cookie);

        return $response;
    }
}
