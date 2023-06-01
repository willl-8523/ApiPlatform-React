import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Field from '../components/forms/Field';
import Select from '../components/forms/Select';
import customersAPI from '../services/customersAPI';
import axios from 'axios';
import { async } from 'regenerator-runtime';

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

  const [errors, setErrors] = useState({
    amount: '',
    customer: '',
    status: '',
  });

  const fetchCustomers = async () => {
    try {
      const data = await customersAPI.findAll();
      setListeCustomers(data);
    } catch (error) {
      console.log(error.response);
    }
  };

  const fetchInvoice = async (id) => {
    try {
      const data = await axios
        .get('https://localhost:8000/api/invoices/' + id)
        .then((response) => response.data);

      // console.log(data);

      const { amount, status, customer } = data;

      setInvoice({ amount, status, customer: customer.id });
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    fetchCustomers(id);
  }, []);

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    /**
     * {...invoice, customer: `/api/customers/${invoice.customer}`}
     * Comme nous voulons l'adresse (IRI) qui mène au customer, on donne à
     * invoice.customer = /api/customers/${invoice.customer}
     */
    try {
      if (editing) {
        const response = await axios.put(
          'https://localhost:8000/api/invoices/' + id,
          {
            ...invoice,
            customer: `/api/customers/${invoice.customer}`,
          }
        );
        // TODO : Flash modification success 
        console.log(response);
      } else {
        const response = await axios.post(
          'https://localhost:8000/api/invoices',
          {
            ...invoice,
            customer: `/api/customers/${invoice.customer}`,
          }
        );
        // TODO/ Flash notification success
        navigate('/invoices', { replace: true });
      }
    } catch ({ response }) {
      console.log(response);
      const { violations } = response.data;

      if (violations) {
        const apiErrors = {};
        violations.forEach(({ propertyPath, message }) => {
          if (!apiErrors[propertyPath]) {
            apiErrors[propertyPath] = message;
          }
        });
        setErrors(apiErrors);

        // TODO: Flash notification d'erreur
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
      {(editing && <h2>Modification d'une facture</h2>) || (
        <h2>Création d'une facture</h2>
      )}
      <form onSubmit={handleSubmit}>
        <Field
          name={'amount'}
          type="number"
          placeholder={'Montant de la facture'}
          label={'Montant'}
          onChange={handleChange}
          value={invoice.amount}
          error={((!invoice.amount || !+invoice.amount) && errors.amount) || ''}
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
    </>
  );
};

export default InvoicePage;
