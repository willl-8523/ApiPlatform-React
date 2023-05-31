import axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Field from '../components/forms/Field';


const CustomerPage = () => {
  const [createCustomer, setCreateCustomer] = useState({
    lastName: 'Rodriguez',
    firstName: '',
    email: '',
    company: '',
  });

  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setCreateCustomer({ ...createCustomer, [name]: value });
  };

  const [errors, setErrors] = useState({
    lastName: '',
    firstName: '',
    email: '',
    company: '',
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
        const response = await axios.post("https://localhost:8000/api/customers", createCustomer);
        console.log(response.data);
    } catch (error) {
       console.log(error.response); 
    }
    // console.log(createCustomer);
  };

  return (
    <>
      <h2>Création d'un client</h2>

      <form onSubmit={handleSubmit}>
        <Field
          name="lastName"
          label="Nom de famille"
          value={createCustomer.lastName}
          onChange={handleChange}
          error={errors.lastName}
        />
        <Field
          name="firstName"
          label="Prénom"
          value={createCustomer.firstName}
          onChange={handleChange}
          error={errors.firstName}
        />
        <Field
          name="email"
          label="Adresse email"
          type="email"
          value={createCustomer.email}
          onChange={handleChange}
          error={errors.email}
        />
        <Field
          name="company"
          label="Entreprise"
          value={createCustomer.company}
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
