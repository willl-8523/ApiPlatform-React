import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Pagination from '../components/Pagination';

const CustomerPageWithPaginationRequest = () => {
  const [customers, setCustomers] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Nombre de customers par pages
  const itemsPerPage = 10;

  useEffect(() => {
    /*
        127.0.0.1:8000/api/customers?pagination=true$page=1
        Cette requête retourne 10 customers à la page 1 (pagination)
    */
    https: axios
      .get(
        `https://localhost:8000/api/customers?pagination=true&page=${currentPage}`
      )
      .then((response) => {
        setCustomers(response.data['hydra:member']);
        setTotalItems(response.data['hydra:totalItems']);
        setLoading(false);
      })
      .catch((error) => console.log(error.response));
  }, [currentPage]);
  console.log(customers);

  const handleDelete = (id) => {
    console.log(id);
    // 1. On copie le tableau des customers
    const copyCustomers = [...customers];

    // 2. On filtre le tableau des customers pour rétirer le customer correspondant à l'id
    setCustomers(customers.filter((customer) => customer.id !== id));

    // 3. On supprime le customer dans la bdd
    axios
      .delete('https://localhost:8000/api/customers/' + id)
      .then((response) => console.log('ok'))
      .catch((error) => {
        // 4. Si on a une erreur on remet le tableau des customers (copyCustomers)
        setCustomers(copyCustomers);
        // console.log(error.response);
      });
  };

  // Mettre la classe active au li correspondant
  const handlePageChange = (page) => {
    setCurrentPage(page);
    setLoading(true);
  };

  return (
    <>
      <h1>Liste des clients (pagination avec apiPlatform)</h1>

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
        <tbody>
          {loading && (
            <tr>
              <td>Chargement ...</td>
            </tr>
          )}
          {!loading &&
            customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>
                  <a href="#">
                    {customer.firstName} {customer.lastName}
                  </a>
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
      </table>

      <Pagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        length={totalItems}
        onPageChanged={handlePageChange}
      />
    </>
  );
};

export default CustomerPageWithPaginationRequest;
