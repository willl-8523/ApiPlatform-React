<?php

namespace App\Entity;

use App\Repository\UserRepository;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;

use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiSubresource;

use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

/**
 * @ORM\Entity(repositoryClass=UserRepository::class)
 * @ORM\Table(name="users")
 * @UniqueEntity("email", message="L'adresse mail existe déjà")
 * @ApiResource(
 *  normalizationContext={
 *      "groups"={"user_read"}
 *  }
 * )
 */
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups(
     *  {"invoices_read",
     *   "customer_read",
     *   "invoices_subresource",
     *    "user_read"
     *  }
     * )
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups(
     *  {"invoices_read", 
     *   "customer_read", 
     *   "invoices_subresource",
     *   "user_read"
     *  }
     * )
     * @Assert\NotBlank(message="Le prenom de l'utilisateur est obligatoire")
     * @Assert\Length(
     *  min=2,
     *  minMessage= "Le prenom de l'utilisateur doit avoir minimum 3 caracteres",
     *  max=255,
     *  maxMessage= "Le prenom de l'utilisateur doit avoir entre 2 et 255 caracteres"
     * )
     */
    private $firstName;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups(
     *  {"invoices_read", 
     *   "customer_read", 
     *   "invoices_subresource",
     *   "user_read"
     *  }
     * )
     * @Assert\NotBlank(message="Le nom de l'utilisateur est obligatoire")
     * @Assert\Length(
     *  min=2,
     *  minMessage= "Le nom de l'utilisateur doit avoir minimum 3 caracteres",
     *  max=255,
     *  maxMessage= "Le nom de l'utilisateur doit avoir entre 2 et 255 caracteres"
     * )
     */
    private $lastName;

    /**
     * @ORM\Column(type="string", length=180, unique=true)
     * @Groups(
     *  {"invoices_read", 
     *   "customer_read", 
     *   "invoices_subresource",
     *   "user_read"
     *  }
     * )
     * @Assert\NotBlank(message="L'email' est obligatoire")
     * @Assert\Email(message = "Email invalide")
     */
    private $email;

    /**
     * @var string The hashed password
     * @ORM\Column(type="string")
     * @Assert\NotBlank(message="Le mot de passe de est obligatoire")
     * @Assert\Length(
     *  min=2,
     *  minMessage= "Le mot de passe doit avoir minimum 2 caracteres",
     *  max=255,
     *  maxMessage= "Le mot de passe doit avoir entre 2 et 255 caracteres"
     * )
     */
    private $password;

    /**
     * @ORM\Column(type="json")
     * @Groups(
     *  {"invoices_read", 
     *   "customer_read", 
     *   "invoices_subresource",
     *   "user_read"
     *  }
     * )
     */
    private $roles = [];

    /**
     * @ORM\OneToMany(targetEntity=Customer::class, mappedBy="user")
     * @Groups(
     *  {"invoices_read", 
     *   "customer_read", 
     *   "invoices_subresource",
     *   "user_read"
     *  }
     * )
     */
    private $customers;

    public function __construct()
    {
        $this->customers = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
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

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @deprecated since Symfony 5.3, use getUserIdentifier instead
     */
    public function getUsername(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    /**
     * Returning a salt is only needed, if you are not using a modern
     * hashing algorithm (e.g. bcrypt or sodium) in your security.yaml.
     *
     * @see UserInterface
     */
    public function getSalt(): ?string
    {
        return null;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
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

    /**
     * @return Collection<int, Customer>
     */
    public function getCustomers(): Collection
    {
        return $this->customers;
    }

    public function addCustomer(Customer $customer): self
    {
        if (!$this->customers->contains($customer)) {
            $this->customers[] = $customer;
            $customer->setUser($this);
        }

        return $this;
    }

    public function removeCustomer(Customer $customer): self
    {
        if ($this->customers->removeElement($customer)) {
            // set the owning side to null (unless already changed)
            if ($customer->getUser() === $this) {
                $customer->setUser(null);
            }
        }

        return $this;
    }
}
