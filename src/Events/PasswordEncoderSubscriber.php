<?php

namespace App\Events;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\User;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class PasswordEncoderSubscriber implements EventSubscriberInterface
{
    /**
     * @var UserPasswordHasher
     */
    private $hacher;

    public function __construct(UserPasswordHasherInterface $hacher)
    {
        $this->hacher = $hacher;
    }
    /**
     * Interoge toutes les classes qui implementent le EventSubscriberInterface
     * pour dire à quelle moment vous voulez que j'appelle vos methodes
     * 
     *
     * @return void
     */
    public static function getSubscribedEvents()
    {
        /**
         * -> On utilise KernelEvents::VIEW parce qu'il intervient après la
         *      deserialisation par le controller d'apiPlatform (après que le json
         *      a été recu et qu'on ait crée grace à ce json une entité (User par 
         *      exp))
         * -> On utilise le priorite PRE_WRITE pcq c'est elle qui s'execute avant
         *      avant d'ecrire dans la bdd
         * -> encodePassword est la methode qui sera executée avant l'ecriture
         *      dans la bdd
         */
        return [
           KernelEvents::VIEW => ['encodePassword', EventPriorities::PRE_WRITE]
        ];
    }

    /**
     * -> https://symfony.com/doc/5.4/reference/events.html#kernel-view
     * 
     * -> Le rôle du controller de apiPlatform est de:
     *      - Recuperer le json et le transformer en entité(deserialisation) et
     *          de le retourner
     * -> getControllerResult() nous permet recuperer le resultat du controller
     *      apiPlatform
     * 
     * @param ViewEvent
     * @return void
     */
    public function encodePassword(ViewEvent $event) {
        $user = $event->getControllerResult();
        $method = $event->getRequest()->getMethod(); // POST ou GET ou PUT ...
        // dd($user, $method);

        /**
         * -> Comme getSubscribedEvents() sera appelé à chaque fois qu'on envoie
         *      une requête au controller de apiPlatform et qu'il ait finit de 
         *      deserialiser, nous allons filtrer la requête avec laquelle nous
         *      allons traiter
         * -> Le filtre: si $user est une instance de l'entite User et que la
         *      methode de la reuête est en POST alors traitons la requête
         */

        if ($user instanceof User && $method === "POST") {
            $hach = $this->hacher->hashPassword($user, $user->getPassword());
            $user->setPassword($hach);
        }
    }
}