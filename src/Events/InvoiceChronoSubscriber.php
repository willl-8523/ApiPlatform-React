<?php

namespace App\Events;

use DateTimeImmutable;
use App\Entity\Invoice;
use App\Repository\InvoiceRepository;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use ApiPlatform\Core\EventListener\EventPriorities;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class InvoiceChronoSubscriber implements EventSubscriberInterface
{

    private $security;
    private $repo;

    public function __construct(Security $security, InvoiceRepository $repo)
    {
        $this->security = $security;
        $this->repo = $repo;
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['setChronoForInvoice', EventPriorities::PRE_VALIDATE]
        ];
    }

    // public function setChronoForInvoice(ViewEvent $event) {

    //     /**
    //      * Trouver l'utilisateur actuellement connecté (security)
    //      * Récuperer le repo des factures (InvoiceRepository)
    //      * Récuperer la derniere facture qui a été inserée pour avoir son chrono
    //      * Dans la facture créee, on donne le dernier chrono + 1
    //      */

    //     $invoice = $event->getControllerResult();
    //     // dd($invoice);
    //     $method = $event->getRequest()->getMethod();

    //     /** @var User $user */
    //     $user = $this->security->getUser();

    //     // if($user !== $invoice->getCustomer()->getUser()) {
    //     //     throw new AccessDeniedHttpException("Ce client ne vous appartient pas, merci de vous rapprocher de l'utilisateur auquel il se rapporte.");
    //     // }

    //     if ($invoice instanceof Invoice && $method === "POST") {
    //         $nextChrono = $this->repo->findNextChrono($this->security->getUser());
    //         $invoice->setChrono($nextChrono);

    //         $invoice->setSentAt(new DateTimeImmutable("now"));
    //     }

    // }
    public function setChronoForInvoice(ViewEvent $event)
    {
        $invoice = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();
        
        if ($invoice instanceof Invoice && $method === "POST") {
            $user = $this->security->getUser();
            if ($user !== $invoice->getCustomer()->getUser()) {
                throw new AccessDeniedHttpException("Ce client ne vous appartient pas, merci de vous rapprocher de l'utilisateur auquel il se rapporte.");
            }
            $invoice->setChrono($this->repo->findNextChrono($user));
        }
    }
}