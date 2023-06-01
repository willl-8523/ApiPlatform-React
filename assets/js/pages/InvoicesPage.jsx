import moment from 'moment';
import React, { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import invoicesAPI from '../services/invoicesAPI';
import { Link } from 'react-router-dom';


const STATUS_CLASSES = {
  PAID: 'success',
  SENT: 'primary',
  CANCELLED: 'danger',
};

const STATUS_LABELS = {
  PAID: 'Payée',
  SENT: 'Envoyée',
  CANCELLED: 'Annulée',
};

const InvoicesPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');

  // Nombre de invoices par pages
  const itemsPerPage = 10;

  const fetchInvoices = async () => {
    try {
      const data = await invoicesAPI.findAll(); 
      setInvoices(data);
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

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

  // Gestion de la suppression d'une invoice
  const handleDelete = async (id) => {
    // 1. On copie le tableau des invoices
    const copyInvoices = [...invoices];

    // 2. On filtre le tableau des invoices pour rétirer le customer correspondant à l'id
    setInvoices(invoices.filter((invoice) => invoice.id !== id));

    // 3. On supprime l'invoice dans la bdd
    try {
      await invoicesAPI.delete(id);
    } catch (error) {
      // 4. Si on a une erreur on remet le tableau des invoices (copyInvoices)
      setInvoices(copyInvoices);
    }
  };

  // Filtrer les invoices en fonction de la recherche
  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
      invoice.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
      invoice.amount.toString().startsWith(search.toLowerCase()) ||
      STATUS_LABELS[invoice.status].toLowerCase().includes(search.toLowerCase())
  );

  /*
    Pagination des données
    -> paginationInvoices => les invoices correspondant à la recherche 
  */
  const paginationInvoices = Pagination.getData(
    filteredInvoices,
    currentPage,
    itemsPerPage
  );

  // Formater la date avec moment.js
  const formatDate = (str) => {
    return moment(str).format('DD/MM/YYYY');
  };

  return (
    <>
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <h2>Liste des factures</h2>
        <Link to="/invoices/new" className="btn btn-primary">
          Créer une facture
        </Link>
      </div>
      <div className="form-group">
        <input
          type="text"
          className="form-control"
          placeholder="Rechercher facture ..."
          onChange={handleSearch}
          value={search}
        />
      </div>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Numero</th>
            <th>Client</th>
            <th className="text-center">Date d'envoi</th>
            <th className="text-center">Statut</th>
            <th className="text-center">Montant</th>
            <th className="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {paginationInvoices.map((invoice) => (
            <tr key={invoice.id}>
              <td>{invoice.chrono}</td>
              <td>
                <a href="#">
                  {invoice.customer.firstName} {invoice.customer.lastName}
                </a>
              </td>
              <td className="text-center">{formatDate(invoice.sentAt)}</td>
              {/*
                    <td className="text-center">
                    {new Date(invoice.sentAt).toLocaleDateString()}
                    </td>
                */}
              <td className="text-center">
                <span
                  className={'badge badge-' + STATUS_CLASSES[invoice.status]}
                >
                  {STATUS_LABELS[invoice.status]}
                </span>
              </td>
              <td className="text-center">
                {invoice.amount.toLocaleString()} €
              </td>
              <td className="d-flex justify-content-center">
                <button className="btn btn-sm btn-primary mr-1">Editer</button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(invoice.id)}
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
        length={filteredInvoices.length}
        onPageChanged={handlePageChange}
      />
    </>
  );
};

export default InvoicesPage;
