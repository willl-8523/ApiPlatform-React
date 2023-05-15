<?php

namespace App\Events;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Customer;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Security;

class CustomerUserSubscriber implements EventSubscriberInterface
{
    private $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    public static function getSubscribedEvents()
    {
        /**
         * -> On utilise KernelEvents::VIEW parce qu'il intervient après la
         *     deserialisation par le controller d'apiPlatform (après que 
         *      le json
         *      a été recu et qu'on ait crée grace à ce json une entité 
         *      (Customer par exp))
         * -> On utilise le priorite PRE_VALIDATE pcq c'est elle qui 
         *      s'execute avant que le controller d'apiPlatform ne valide
         *      les données
         */
        return [
            KernelEvents::VIEW => ['setUserForCustomer', EventPriorities::PRE_VALIDATE]
        ];
    }

    public function setUserForCustomer(ViewEvent $event) {
        $customer = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();
        // dd($customer, $method);

        if ($customer instanceof Customer && $method === "POST") {
            // Récuperer l'utilisateur actuellement connecté
            $user = $this->security->getUser();

            // Assigner l'utilisateur au customer qu'on est en train de créer
            $customer->setUser($user);
        }
    }
}