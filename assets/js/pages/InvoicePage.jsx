import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Field from '../components/forms/Field';
import Select from '../components/forms/Select';
import customersAPI from '../customersAPI';
import invoicesAPI from '../invoicesAPI';
import FormContentLoader from '../components/loaders/FormContentLoader';

const InvoicePage = () => {
  const navigate = useNavigate();
  // Permet de récupérer l'id de la route courante (avec router v6 ou >)
  const { id = 'new' } = useParams();

  const [invoice, setInvoice] = useState({
    amount: '',
    customer: '',
    status: '',
  });

  const [listCustomers, setListeCustomers] = useState([]);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [errors, setErrors] = useState({
    amount: '',
    customer: '',
    status: '',
  });

  // Récuprération des clients
  const fetchCustomers = async () => {
    try {
      const data = await customersAPI.findAll();
      setListeCustomers(data);
      setLoading(false);
    } catch (error) {
      console.log(error.response);
      navigate('/invoices', { replace: true });
      // Flash notification erreur
      toast.error(`Impossible de charger les clients`);
    }
  };

  // Récuprération d'une facture
  const fetchInvoice = async (id) => {
    try {
      const { amount, status, customer } = await invoicesAPI.findInvoice(id);
      // const { amount, status, customer } = data;
      // console.log(data);

      setInvoice({ amount, status, customer: customer.id });
      setLoading(false);
    } catch (error) {
      console.log(error.response);
      // Flash notification error
      toast.error(`Impossible de charger la facture demandée`);
      navigate('/invoices', { replace: true });
    }
  };

  // Récupération de la liste des clients à chaque chargement
  useEffect(() => {
    fetchCustomers(id);
  }, []);

  // Récupération de la bonne facture quand l'identifiant de l'url change
  useEffect(() => {
    if (id !== 'new') {
      setEditing(true);
      fetchInvoice(id);
    }
  }, [id]);

  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setInvoice({ ...invoice, [name]: value });
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault();

    /**
     * {...invoice, customer: `/api/customers/${invoice.customer}`}
     * Comme nous voulons l'adresse (IRI) qui mène au customer, on donne à
     * invoice.customer = /api/customers/${invoice.customer}
     */
    try {
      if (editing) {
        await invoicesAPI.updateInvoice(id, invoice);
        // console.log(response);
        // Notification flash d'un succès
        toast.success(`La facture a bien été modifiée`);
      } else {
        await invoicesAPI.createInvoice(invoice);
        // Notification flash d'un succès
        toast.success(`La facture a bien été enregistrée`);
        navigate('/invoices', { replace: true });
      }
    } catch ({ response }) {
      // console.log(response);
      const { violations } = response.data;

      if (violations) {
        const apiErrors = {};
        violations.forEach(({ propertyPath, message }) => {
          if (!apiErrors[propertyPath]) {
            apiErrors[propertyPath] = message;
          }
        });
        setErrors(apiErrors);

        // Flash notification d'erreur
        toast.error(`Des erreurs dans votre formulaire`);
      }

      // Validateur côté client du champs client
      if (invoice.customer == '') {
        setErrors({ ...errors, customer: 'Le client est obligatoire' });
      }
    }

    console.log(invoice);
  };

  return (
    <>
      {
        (loading && <FormContentLoader />) ||
        (editing && <h2>Modification d'une facture</h2>) || (
          <h2>Création d'une facture</h2>
        )
      }
      {!loading && (
        <form onSubmit={handleSubmit}>
          <Field
            name={'amount'}
            type="number"
            placeholder={'Montant de la facture'}
            label={'Montant'}
            onChange={handleChange}
            value={invoice.amount}
            error={
              ((!invoice.amount || !+invoice.amount) && errors.amount) || ''
            }
          />

          <Select
            name={'customer'}
            label="Client"
            value={invoice.customer}
            error={(!invoice.customer && errors.customer) || ''}
            onChange={handleChange}
          >
            <option value="">Selectionner le client</option>
            {listCustomers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.firstName} {customer.lastName}
              </option>
            ))}
          </Select>

          <Select
            name={'status'}
            label={'Statut'}
            value={invoice.status}
            error={(!invoice.status && errors.status) || ''}
            onChange={handleChange}
          >
            <option value="">Choisir le statut de la facture</option>
            <option value="SENT">Envoyée</option>
            <option value="PAID">Payée</option>
            <option value="CANCELLED">Annulée</option>
          </Select>

          <div className="form-group">
            <button type="submit" className="btn btn-success" formNoValidate>
              Enregitrer
            </button>
            <Link to="/invoices" className="btn btn-link">
              Retour aux factures
            </Link>
          </div>
        </form>
      )}
    </>
  );
};

export default InvoicePage;
