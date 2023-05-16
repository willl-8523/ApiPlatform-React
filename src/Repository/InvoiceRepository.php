<?php

namespace App\Repository;

use App\Entity\Invoice;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Invoice>
 *
 * @method Invoice|null find($id, $lockMode = null, $lockVersion = null)
 * @method Invoice|null findOneBy(array $criteria, array $orderBy = null)
 * @method Invoice[]    findAll()
 * @method Invoice[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class InvoiceRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Invoice::class);
    }

    public function add(Invoice $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Invoice $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * Trouver le dernier chrono
     * 
     * ############# DQL ############
     * 
     * $this->createQueryBuilder("i") // faire une requête sur les invoices
     *                                  alias i
     *  ->select("i.chrono") // Selectionné le champ chrono des invoices
     *  ->join("i.customer", "c") // Joindre le customer (c) lié aux invoices
     *  ->where("c.user = :user") // Prendre les invoices qui ont pour 
     *                                   customer un utilisateur = :user (qui 
     *                                   est 1e variable qui sera remplacé)
     *  ->setParameter("user", $user) // :user = $user
     *  ->orderBy("i.chrono", "DESC") // ordonner par chrono decroissant
     *  ->setMaxResults(1) // Prendre le dernier
     *  ->getQuery()
     *  ->getSingleScalarResult() + 1; // prendre uniquement le nombre qui
     *                                    correspond au chrono + 1
     * 
     * ############# SQL ############
     * 
     *  SELECT chrono FROM `invoices`
     *  JOIN customers ON invoices.customer_id = customers.id
     *  WHERE user_id = :user (31) 
     *  ORDER BY chrono DESC LIMIT 1;
     *
     * @param User $user
     * @return void
     */
    public function findNextChrono(User $user) 
    {
        return $this->createQueryBuilder("i")
            ->select("i.chrono")
            ->join("i.customer", "c")
            ->where("c.user = :user")
            ->setParameter("user", $user)
            ->orderBy("i.chrono", "DESC")
            ->setMaxResults(1)
            ->getQuery()
            ->getSingleScalarResult() + 1;
    }

//    /**
//     * @return Invoice[] Returns an array of Invoice objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('i')
//            ->andWhere('i.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('i.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Invoice
//    {
//        return $this->createQueryBuilder('i')
//            ->andWhere('i.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
