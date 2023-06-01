import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Field from '../components/forms/Field';
import customersAPI from '../services/customersAPI';

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

  const [errors, setErrors] = useState({
    lastName: '',
    firstName: '',
    email: '',
    company: '',
  });

  const [editing, setEditing] = useState(false);

  // Récupration du customer en fonction de l'identifiant
  const fetchCustomer = async (id) => {
    try {
      const { firstName, lastName, email, company } =
        await customersAPI.findOne(id);
      //   console.log(firstName, lastName, email, company);

      setCustomer({ firstName, lastName, email, company });
    } catch (error) {
      console.log(error.response);
      // TODO: Notification flash d'une erreur
      navigate('/customers', { replace: true });
    }
  };

  // Chargement du customer si besion au chargement du composant ou au changement de l'identifiant
  useEffect(() => {
    if (id !== 'new') {
      setEditing(true);
      fetchCustomer(id);
    }
  }, [id]);

  // Gestion des changements des inputs dans le formulaire
  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setCustomer({ ...customer, [name]: value });
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editing) {
        const response = await customersAPI.updateCustomer(id, customer)
        // console.log(response.data);

        // TODO : Flash notification de succès
      } else {
        const response = await customersAPI.createCustomer(customer);
        // console.log(response.data);

        // TODO : Flash notification de succès

        navigate('/customers', { replace: true });
      }
      setErrors({});
    } catch ({ response }) {
      const { violations } = response.data;

      if (violations) {
        const apiErrors = {};
        violations.forEach(({propertyPath, message}) => {
          if (!apiErrors[propertyPath]) {
            apiErrors[propertyPath] = message;
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
