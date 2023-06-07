import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Pagination from '../components/Pagination';
import TableLoader from '../components/loaders/TableLoader';
import invoicesAPI from '../services/invoicesAPI';

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
  const [loading, setLoading] = useState(true);

  // Nombre de invoices par pages
  const itemsPerPage = 10;

  const fetchInvoices = async () => {
    try {
      const data = await invoicesAPI.findAll();
      setInvoices(data);
      setLoading(false);
    } catch (error) {
      console.log(error.response);

      // Notification flash d'erreur
      toast.error(`Erreur lors du chargement des factures !`);
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
      // Notification flash d'un succès
      toast.success(`La facture n°${invoices.id} a bien été supprimée`);
    } catch (error) {
      // 4. Si on a une erreur on remet le tableau des invoices (copyInvoices)
      toast.error(`Une erreur est survenue !`);
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
        {!loading && (
          <tbody>
            {paginationInvoices.map((invoice) => (
              <tr key={invoice.id}>
                <td>{invoice.chrono}</td>
                <td>
                  <Link to={`/invoices/${invoice.id}`}>
                    {invoice.customer.firstName} {invoice.customer.lastName}
                  </Link>
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
                  <Link
                    to={'/invoices/' + invoice.id}
                    className="btn btn-sm btn-primary mr-1"
                  >
                    Editer
                  </Link>
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
        )}
      </table>
      {loading && <TableLoader />}
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
