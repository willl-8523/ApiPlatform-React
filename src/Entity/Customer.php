<?php

namespace App\Entity;

use App\Repository\CustomerRepository;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiSubresource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;

use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass=CustomerRepository::class)
 * @ORM\Table(name="customers")
 * @ApiResource(
 *  subresourceOperations={
 *      "invoices_get_subresource"={
 *          "path"="/customers/{id}/invoices",
 *      }
 *  },
 *  collectionOperations={
 *      "GET"={
 *          "path"="/customers",
 *      },
 *      "POST"
 *  },
 *  itemOperations={
 *      "GET"={
 *          "path"="/customers/{id}"
 *      },
 *      "PUT", 
 *      "DELETE", 
 *      "PATCH"
 *  },
 *  normalizationContext={
 *      "groups"={"customer_read"}
 *  },
 * )
 * @ApiFilter(SearchFilter::class)
 */
class Customer
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"customer_read", "invoices_read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"customer_read", "invoices_read"})
     * @Assert\NotBlank(message="Le prénom du customer est obligatoire")
     * @Assert\Length(
     *  min=3,
     *  minMessage= "Le prenom doit avoir minimum 3 caracteres",
     *  max=10,
     *  maxMessage= "Le prenom doit avoir maximum 10 caracteres"
     * )
     */
    private $firstName;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"customer_read", "invoices_read"})
     * @Assert\NotBlank(message="Le nom du customer est obligatoire")
     * @Assert\Length(
     *  min=3,
     *  minMessage= "Le nom doit avoir minimum 3 caracteres",
     *  max=10,
     *  maxMessage= "Le nom doit avoir maximum 10 caracteres"
     * )
     */
    private $lastName;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"customer_read", "invoices_read"})
     * @Assert\NotBlank(message="L'adresse mail du customer est obligatoire")
     * @Assert\Email(
     *  message = "L'adresse mail doit être valide"
     * )
     */
    private $email;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"customer_read", "invoices_read"})
     */
    private $company;

    /**
     * @ORM\OneToMany(targetEntity=Invoice::class, mappedBy="customer")
     * @Groups({"customer_read"})
     * @ApiSubresource
     */
    private $invoices;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="customers")
     * @Groups({"customer_read"})
     * @Assert\NotBlank(message = "L'utilisateur est obligatoire")
     */
    private $user;

    public function __construct()
    {
        $this->invoices = new ArrayCollection();
    }

    /**
     * Permet de récuperer le total des invoices
     * @Groups({"customer_read"})
     * @return float
     */
    public function getTotalAmount(): float 
    {
        return array_reduce($this->invoices->toArray(), function(?float $total, ?Invoice $invoice) {
            return $total + $invoice->getAmount();
        }, 0);
    }

    /**
     * Récuperer le montant total non payé (montant total hors factures 
     * payées ou annulées)
     * 
     * @Groups({"customer_read"})
     *
     * @return float|null
     */
    public function getUnpaidAmount(): ?float
    {
        return array_reduce($this->invoices->toArray(), function(?float $total, ?Invoice $invoice) {
            return $total + (($invoice->getStatus() === "PAID" || $invoice->getStatus() === "CANCELLED") ? 0 : $invoice->getAmount());
        }, 0);
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(string $firstName): self
    {
        $this->firstName = $firstName;

        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(string $lastName): self
    {
        $this->lastName = $lastName;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getCompany(): ?string
    {
        return $this->company;
    }

    public function setCompany(?string $company): self
    {
        $this->company = $company;

        return $this;
    }

    /**
     * @return Collection<int, Invoice>
     */
    public function getInvoices(): Collection
    {
        return $this->invoices;
    }

    public function addInvoice(Invoice $invoice): self
    {
        if (!$this->invoices->contains($invoice)) {
            $this->invoices[] = $invoice;
            $invoice->setCustomer($this);
        }

        return $this;
    }

    public function removeInvoice(Invoice $invoice): self
    {
        if ($this->invoices->removeElement($invoice)) {
            // set the owning side to null (unless already changed)
            if ($invoice->getCustomer() === $this) {
                $invoice->setCustomer(null);
            }
        }

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }
}
