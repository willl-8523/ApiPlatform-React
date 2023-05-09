<?php

namespace App\Controller;

use App\Entity\Invoice;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class InvoiceIncrementationController extends AbstractController
{
    /** @var EntityManagerInterface */
    private $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    /**
     * Paramètre de la méthode __invoke() DOIT être appelé $data , sinon il 
     * ne sera pas rempli correctement !
     *
     * @param Invoice $data
     * @return void
     */
    public function __invoke(Invoice $data)
    {
        $data->setChrono($data->getChrono() + 1);

        $this->em->flush();
        // dd($data);

        return $data;
    }
}
