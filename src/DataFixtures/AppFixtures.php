<?php

namespace App\DataFixtures;

use DateInterval;
use DateTimeImmutable;
use App\Entity\Invoice;
use App\Entity\Customer;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Bundle\FixturesBundle\Fixture;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $faker = \Faker\Factory::create();
        $today = new DateTimeImmutable();
        $interval = new DateInterval('P6M'); // P6M représente une période de 6 mois
        $minDate = $today->sub($interval)->getTimestamp(); // la date minimum est aujourd'hui moins 6 mois
        $maxDate = $today->getTimestamp(); // la date maximum est aujourd'hui
        
        for ($c = 0; $c < 30; $c++) { 
            $customer = new Customer;
            $customer->setFirstName($faker->firstName())
                     ->setLastName($faker->lastName())
                     ->setCompany($faker->company)
                     ->setEmail($faker->email);
                     
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
                        ->setCustomer($customer); // Attribuer la facture au client

                $manager->persist($invoice);
            }
        }

        $manager->flush();
    }
}