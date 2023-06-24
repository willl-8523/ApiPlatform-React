import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../components/Pagination';
import customersAPI from '../customersAPI';
import { toast } from 'react-toastify';
import TableLoader from '../components/loaders/TableLoader';

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Nombre de customers par pages
  const itemsPerPage = 10;

  // Permet d'aller récuperer les customers
  const fetchCustomers = async () => {
    try {
      const data = await customersAPI.findAll();
      setCustomers(data);
      setLoading(false);
    } catch (error) {
      console.log(error.response);
      // Notification flash erreur
      toast.error(`Impossible de charger les clients`);
    }
  };

  // Au chargement du composant on va chercher les customers
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Gestion de la suppression d'un customer
  const handleDelete = async (id) => {
    // 1. On copie le tableau des customers
    const copyCustomers = [...customers];

    // 2. On filtre le tableau des customers pour rétirer le customer correspondant à l'id
    setCustomers(customers.filter((customer) => customer.id !== id));

    // 3. On supprime le customer dans la bdd
    try {
      await customersAPI.delete(id);
      // Notification flash d'un succès
      toast.success(`Le client a bien été supprimé 😀`);
    } catch (error) {
      // 4. Si on a une erreur on remet le tableau des customers (copyCustomers)
      setCustomers(copyCustomers);
      // console.log(error.response);
      // Notification flash d'un succès
      toast.success(`La suppression du client n'a pas pu fonctionner`);
    }
  };

  // Gestion du changement de page (Mettre la classe active au li correspondant)
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Gestion de la recherche (Récuperer la valeur de input)
  const handleSearch = ({ currentTarget }) => {
    // {currentTarget} => event.currentTarget
    setSearch(currentTarget.value);

    // Pour que chaque rechercher commence toujours par la page 1
    setCurrentPage(1);
  };

  // Filtrer les customers en fonction de la recherche
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
      customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
      customer.email.toLowerCase().includes(search.toLowerCase()) ||
      (customer.company &&
        customer.company.toLowerCase().includes(search.toLowerCase()))
  );

  /*
    Pagination des données
    -> paginationCustomers => les customers correspondant à la recherche 
  */
  const paginationCustomers = Pagination.getData(
    filteredCustomers,
    currentPage,
    itemsPerPage
  );
  // console.log(paginationCustomers);

  return (
    <>
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <h2>Liste des clients</h2>
        <Link to="/customers/new" className="btn btn-primary">
          Créer un client
        </Link>
      </div>
      <div className="form-group">
        {/*input.form-control[placeholder="Rechercher cutomer ..."]*/}
        <input
          type="text"
          className="form-control"
          placeholder="Rechercher customer ..."
          onChange={handleSearch}
          value={search}
        />
      </div>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Id</th>
            <th>Client</th>
            <th>Email</th>
            <th>Entreprise</th>
            <th className="text-center">Factures</th>
            <th className="text-center">Montant total</th>
            <th />
          </tr>
        </thead>
        {!loading && (
          <tbody>
            {paginationCustomers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>
                  <Link to={`/customers/${customer.id}`}>
                    {customer.firstName} {customer.lastName}
                  </Link>
                </td>
                <td>{customer.email}</td>
                <td>{customer.company}</td>
                {/* customer.invoices.length => Nombre de facture */}
                <td className="text-center">{customer.invoices.length}</td>
                {/* toLocaleString() => Affiche au format correspondant a la localisation */}
                <td className="text-center">
                  {customer.totalAmount.toLocaleString()} €
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(customer.id)}
                    disabled={customer.invoices.length > 0}
                    className="btn btn-sm btn-danger"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
      {loading && <TableLoader />}

      {/* Si le nombre de customers est < au nombre d'item par page (10) enlever la pagination */}
      {itemsPerPage < filteredCustomers.length && (
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          length={filteredCustomers.length}
          onPageChanged={handlePageChange}
        />
      )}
    </>
  );
};

export default CustomersPage;
