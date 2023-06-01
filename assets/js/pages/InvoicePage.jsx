import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Field from '../components/forms/Field';
import Select from '../components/forms/Select';

const InvoicePage = () => {
  const [invoice, setInvoice] = useState({
    amount: '',
    customer: '',
    status: '',
  });

  const [errors, setErrors] = useState({
    amount: '',
    customer: '',
    status: '',
  });

  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setInvoice({ ...invoice, [name]: value });
  };

  return (
    <>
      <h2>Création d'une facture</h2>
      <form>
        <Field
          name={'amount'}
          type="number"
          placeholder={'Montant de la facture'}
          label={'Montant'}
          onChange={handleChange}
          value={invoice.amount}
          error={errors.amount}
        />

        <Select
          name="customer"
          label="CLient"
          value={invoice.customer}
          error={errors.customer}
          onChange={handleChange}
        >
          <option value="1">Mboa Douala</option>
          <option value="2">Mboa Kamer</option>
        </Select>

        <Select
          name={'status'}
          label={'Statut'}
          value={invoice.status}
          error={errors.status}
          onChange={handleChange}
        >
          <option value="SENT">Envoyée</option>
          <option value="PAID">Payée</option>
          <option value="CANCELLED">Annulée</option>
        </Select>

        <div className="form-group">
          <button type="submit" className="btn btn-success">
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
