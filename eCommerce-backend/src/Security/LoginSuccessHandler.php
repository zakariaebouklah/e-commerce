<?php

namespace App\Security;

use App\Entity\Client;
use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Lexik\Bundle\JWTAuthenticationBundle\Events;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class LoginSuccessHandler implements EventSubscriberInterface
{
    public function onAuthenticationSuccess(AuthenticationSuccessEvent $event): void
    {
        $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https://' : 'http://';

        /**
         * @var Client $user
         */
        $user = $event->getUser();

        $data = $event->getData();
        $data['user'] = [
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'username' => $user->getUsername(),
            'phone' => $user->getPhone(),
            'roles' => $user->getRoles(),
            'street' => $user->getStreet(),
            'profile' => $user->getProfilePicture() !== null ?
                                    str_contains($user->getProfilePicture(), "https")
                                    ?
                                    $user->getProfilePicture()
                                    :
                                    $protocol.$_SERVER["HTTP_HOST"]."\\uploads\\profiles\\".$user->getProfilePicture()
                        :
                        $user->getProfilePicture(),
            'signedAt' => $user->getSignedAt(),
            'about' => $user->getAbout()
        ];
        $event->setData($data);
    }

    public static function getSubscribedEvents(): array
    {
        return [
            Events::AUTHENTICATION_SUCCESS => "onAuthenticationSuccess"
        ];
    }
}