<?php

namespace App\Doctrine;

use Doctrine\ORM\QueryBuilder;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryItemExtensionInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use App\Entity\Customer;
use App\Entity\Invoice;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Core\Security;

/**
 * QueryCollectionExtensionInterface => concerne les requêtes de collection 
 * QueryItemExtensionInterface => concerne les requêtes d'item 
 */
class  CurrentUserExtension implements QueryCollectionExtensionInterface, QueryItemExtensionInterface
{
    private $security;
    /**
     * Permet de verifier les autorisations des utilisateurs
     *
     * @var AuthorizationCheckerInterface
     */
    private $auth;

    public function __construct(Security $security, AuthorizationCheckerInterface $checker)
    {
        $this->security = $security;
        $this->auth = $checker;
    }

    private function addWhere(QueryBuilder $queryBuilder, string $resourceClass) {
        // 1. Obtenir l'utilisateur connecté
        $user = $this->security->getUser();

        $role = $this->auth;

        // 2. Si on demande des invoices ou des customers alors, agir sur la requête pour qu'elle tienne compte de l'utilisateur 
        if (($resourceClass === Customer::class || $resourceClass === Invoice::class) && !$role->isGranted("ROLE_ADMIN")) {
            /**
             * dd($queryBuilder);
             * alias: "o" => SELECT * FROM customers (ou \App\Entity\Invoice) AS
             * o 
             */

            $rootAlias = $queryBuilder->getRootAliases()[0];
            // dd($rootAlias);

            if ($resourceClass === Customer::class) {
                /**
                 * Comme Customer (alias o) est directement lié au User, on peut
                 * directement recuperer les Customer lié au User
                 */
                $queryBuilder->andWhere("$rootAlias.user = :user");
            } else if ($resourceClass === Invoice::class) {
                /**
                 * Ici Invoice (alias o) est lié au Customer, qui lui est
                 * lié au User donc on doit joindre Invoice avec
                 * Customer avant d'avoir le User
                 */
                $queryBuilder->join("$rootAlias.customer", "c")
                    ->andWhere("c.user = :user");
            }

            $queryBuilder->setParameter("user", $user);
            // dd($queryBuilder);
        }
    }

    /**
     * @param QueryNameGeneratorInterface|LegacyQueryNameGeneratorInterface
     * $queryNameGenerator
     * $resourceClass => class (entite) ou l'on fait la requête
     */
    public function applyToCollection(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, string $operationName = null) {
        $this->addWhere($queryBuilder, $resourceClass);
    }

    /**
     * @param QueryNameGeneratorInterface|LegacyQueryNameGeneratorInterface 
     * $queryNameGenerator
     */
    public function applyToItem(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, array $identifiers, string $operationName = null, array $context = []) {
        $this->addWhere($queryBuilder, $resourceClass);
    }
}

