<?php

namespace App\Events;


use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;

class JwtCreatedSubscriber
{

    public function updateJwtData(JWTCreatedEvent $event)
    {

        /**
         * 1. Récuperer le payload du token JWT
         * 
         * $payloadJWT type Array
         */
        $payload = $event->getData();
        // dd($payload);

        /* 2. Récuperer l'utilisateur actuellement connecté (pour avoir son
            firstName et son lastName)*/
        $user = $event->getUser();

        // Enrichir les données de payload
        $payload['firstName'] = $user->getFirstName();
        $payload['lastName'] = $user->getLastName();

        $event->setData($payload);
    }
}