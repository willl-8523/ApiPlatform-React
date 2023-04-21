<?php

namespace App\DataFixtures;

use DateInterval;
use DateTimeImmutable;
use App\Entity\Invoice;
use App\Entity\Customer;
use App\Entity\User;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasher;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    /**
     * Le hacheur de mot de passe
     *
     * @var UserPasswordHasherInterface
     */
    private $encoder;

    public function __construct(UserPasswordHasherInterface $encoder)
    {
        $this->encoder = $encoder;
    }


    public function load(ObjectManager $manager): void
    {
        $faker = \Faker\Factory::create();

        $today = new DateTimeImmutable();
        $interval = new DateInterval('P6M'); // P6M représente une période de 6 mois
        $minDate = $today->sub($interval)->getTimestamp(); // la date minimum est aujourd'hui moins 6 mois
        $maxDate = $today->getTimestamp(); // la date maximum est aujourd'hui

        
        // Créer 10 utilisateurs
        for ($u = 0; $u < 10; $u++) { 
            $user = new User;
            
            $chrono = 1; //permet d'identifier une facture
            $hash = $this->encoder->hashPassword($user, "secret");

            $user->setFirstName($faker->firstName)
                 ->setLastName($faker->lastName)
                 ->setEmail($faker->email)
                 ->setPassword($hash);

            $manager->persist($user);

            // Créer entre 5 et 20 clients
            for ($c = 0; $c < mt_rand(5, 20); $c++) { 
                $customer = new Customer;
                $customer->setFirstName($faker->firstName)
                         ->setLastName($faker->lastName)
                         ->setCompany($faker->company)
                         ->setEmail($faker->email)
                         ->setUser($user);
                         
                $manager->persist($customer);
    
                // Generer entre 3 et 10 facture
                for ($i = 0; $i < mt_rand(3, 10) ; $i++) { 
                    $invoice = new Invoice;
    
                    $randomTimestamp = mt_rand($minDate, $maxDate); // génère un timestamp aléatoire entre la date minimum et la date maximum
    
                    $randomDate = new DateTimeImmutable();
                    $randomDate = $randomDate->setTimestamp($randomTimestamp); // crée un objet DateTimeImmutable à partir du timestamp aléatoire
    
                    $invoice->setAmount($faker->randomFloat(2, 250, 5000))
                            ->setSentAt($randomDate) 
                            ->setStatus($faker->randomElement(['SENT', 'PAID', 'CANCELLED'])) // récupere un element du tableau
                            ->setCustomer($customer) // Attribuer la facture au client
                            ->setChrono($chrono);
    
                    $manager->persist($invoice);
    
                    $chrono++;
                }
            }
        }

        $manager->flush();
    }
}