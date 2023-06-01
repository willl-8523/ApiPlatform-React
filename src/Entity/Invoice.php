<?php

namespace App\Entity;

use App\Entity\User;

use Doctrine\ORM\Mapping as ORM;

use App\Repository\InvoiceRepository;
use App\Controller\InvoiceIncrementationController;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;

use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass=InvoiceRepository::class)
 * @ORM\Table(name="invoices")
 * @ApiResource(
 *  subresourceOperations={
 *      "api_customers_invoices_get_subresource"={
 *          "normalization_context"={
 *              "groups"={"invoices_subresource"}
 *          }
 *      }
 *  },
 *  itemOperations={"GET", "PUT", "DELETE", "increment"={
 *                  "method"="post", 
 *                  "path"="/invoices/{id}/increment",
 *                  "controller"=InvoiceIncrementationController::class,
 *                  "openapi_context"={
 *                      "summary"="Incremente une facture",
 *                      "description"="Incremente le chrono d'une facture 
 *                                     donnée",
 *                    }
 *                 }
 *  },
 *  attributes={
 *      "pagination_enabled"=false,
 *      "pagination_items_per_page"=10,
 *  },
 *  normalizationContext={"groups"={"invoices_read"}},
 *  denormalizationContext={"disable_type_enforcement"=true}
 * )
 * @ApiFilter(SearchFilter::class, properties={"customer.firstName": "partial"})
 * @ApiFilter(OrderFilter::class, properties={"sentAt"})
 */
class Invoice
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"invoices_read", "customer_read", "invoices_subresource"})
     */
    private $id;

    /**
     * @ORM\Column(type="float")
     * @Groups({"invoices_read", "customer_read", "invoices_subresource"})
     * @Assert\NotBlank(message="Le montant de la facture est obligatoire ou doit être un nombre")
     * @Assert\Type(type="numeric", message="Le montant de la facture doit être un nombre"
     * )
     */
    private $amount;

    /**
     * @ORM\Column(type="datetime_immutable")
     * @Groups({"invoices_read", "customer_read", "invoices_subresource"})
     * @Assert\NotBlank(message="La date d'envoie doit être renseignée")
     * @Assert\Type(
     *  type="DateTimeImmutable",
     *  message="La date doit être au format YYY-MM-DD"
     * )
     */
    private $sentAt;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"invoices_read", "customer_read", "invoices_subresource"})
     * @Assert\NotBlank(message="Le status de la facture doit être renseigné")
     * @Assert\Choice(
     *  {"SENT", "CANCELLED", "PAID"},
     *  message="Le satut doit être SENT, CANCELLED, PAID"
     * )
     */
    private $status;

    /**
     * @ORM\ManyToOne(targetEntity=Customer::class, inversedBy="invoices")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"invoices_read"})
     * @Assert\NotBlank(message="Le client doit être renseigné")
     */
    private $customer;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"invoices_read", "customer_read", "invoices_subresource"})
     * @Assert\NotBlank(message="Le numero de la facture doit être renseigné")
     * @Assert\Type(
     *  type="integer", 
     *  message="Le numero de facture doit être un nombre"
     * )
     */
    private $chrono;

    /**
     * Permet de récuperer le user à qui appartient finalement la facture
     * @Groups({"invoices_read", "invoices_subresource"})
     * @return User|null
     */
    public function getUser(): ?User
    {
        return $this->customer->getUser();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAmount(): ?float
    {
        return $this->amount;
    }

    public function setAmount($amount): self
    {
        $this->amount = $amount;

        return $this;
    }

    public function getSentAt(): ?\DateTimeImmutable
    {
        return $this->sentAt;
    }

    public function setSentAt($sentAt): self
    {
        $this->sentAt = $sentAt;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getCustomer(): ?Customer
    {
        return $this->customer;
    }

    public function setCustomer(?Customer $customer): self
    {
        $this->customer = $customer;

        return $this;
    }

    public function getChrono(): ?int
    {
        return $this->chrono;
    }

    public function setChrono($chrono): self
    {
        $this->chrono = $chrono;

        return $this;
    }
}
