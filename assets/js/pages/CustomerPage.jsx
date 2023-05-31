import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Field from '../components/forms/Field';

const CustomerPage = () => {
  // Permet de récupérer l'id de la route courante (avec router v6 ou >)
  const { id = 'new' } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState({
    lastName: '',
    firstName: '',
    email: '',
    company: '',
  });

  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setCustomer({ ...customer, [name]: value });
  };

  const [errors, setErrors] = useState({
    lastName: '',
    firstName: '',
    email: '',
    company: '',
  });

  const [editing, setEditing] = useState(false);

  const fetchCustomer = async (id) => {
    try {
      const data = await axios
        .get('https://localhost:8000/api/customers/' + id)
        .then((response) => response.data);
      const { firstName, lastName, email, company } = data;
      //   console.log(firstName, lastName, email, company);
      setCustomer({ firstName, lastName, email, company });
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    if (id !== 'new') {
      setEditing(true);
      fetchCustomer(id);
    }
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editing) {
        const response = await axios.put(
          'https://localhost:8000/api/customers/' + id,
          customer
        );
        console.log(response.data);

        // TODO : Flash notification de succès
      } else {
        const response = await axios.post(
          'https://localhost:8000/api/customers',
          customer
        );

        // TODO : Flash notification de succès


        navigate('/customers', { replace: true });
      }
      setErrors({});
    } catch (error) {
      if (error.response.data.violations) {
        const apiErrors = {};
        error.response.data.violations.forEach((violation) => {
          if (!apiErrors[violation.propertyPath]) {
            apiErrors[violation.propertyPath] = violation.message;
          }
        });
        setErrors(apiErrors);

        // TODO: Flash notification d'erreur
      }
      //    console.log(error.response);
    }
    // console.log(customer);
  };

  return (
    <>
      {(!editing && <h2>Création d'un client</h2>) || (
        <h2>Modification d'un client</h2>
      )}

      <form onSubmit={handleSubmit}>
        <Field
          name="lastName"
          label="Nom de famille"
          value={customer.lastName}
          onChange={handleChange}
          error={errors.lastName}
        />
        <Field
          name="firstName"
          label="Prénom"
          value={customer.firstName}
          onChange={handleChange}
          error={errors.firstName}
        />
        <Field
          name="email"
          label="Adresse email"
          type="email"
          value={customer.email}
          onChange={handleChange}
          error={errors.email}
        />
        <Field
          name="company"
          label="Entreprise"
          value={customer.company}
          onChange={handleChange}
        />

        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Enregistrer
          </button>
          <Link to="/customers" className="btn btn-link">
            Retour à la liste
          </Link>
        </div>
      </form>
    </>
  );
};

export default CustomerPage;
