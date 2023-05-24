import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Pagination from '../components/Pagination';

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    axios
      .get('https://localhost:8000/api/customers')
      .then((response) => response.data['hydra:member'])
      .then((data) => setCustomers(data))
      .catch((error) => console.log(error.response));
  }, []);
  // console.log(customers);

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
  };

  // Nombre de customers par pages
  const itemsPerPage = 10;

  /*
    -> paginationCustomers => les customers correspondant à une page 
  */
  const paginationCustomers = Pagination.getData(customers, currentPage, itemsPerPage);
  // console.log(paginationCustomers);

  return (
    <>
      <h1>Liste des clients</h1>

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
          {paginationCustomers.map((customer) => (
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

      <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} length={customers.length} onPageChanged={handlePageChange} />
      
    </>
  );
};

export default CustomersPage;
