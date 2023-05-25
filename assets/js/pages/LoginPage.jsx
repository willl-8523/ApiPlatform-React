import axios from 'axios';
import React, { useState } from 'react';
// import customersAPI from '../services/customersAPI';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleChange = (event) => {
    // Value de l'input
    const value = event.currentTarget.value;

    // Nom de l'input (exp: name="username")
    const name = event.currentTarget.name;

    /**
     * [name] => username ou password
     * concatène les aciennes valeurs avec les nouvelles valeurs
     */
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // credentials => Données qu'on souhaite envoyer
    console.log(credentials);

    try {
      // Si ça marche on stoke le token
      const token = await axios
        .post('https://127.0.0.1:8000/api/login_check', credentials)
        .then((response) => response.data.token);

      // Retirer l'erreur
      setError('');

      // Stoker le token dans le localStorage
      window.localStorage.setItem('authToken', token);

      // On previent axios qu'on a maintenant un header par defaut sur toutes nos futures requêtes 
      axios.defaults.headers["Authorization"] = "Bearer " + token;
      
      /* Liste les customers en fonction du user connecté
        const data = await customersAPI.findAll();
        console.log(data); 
      */
    } catch (error) {
      //   console.log(error.response);
      setError(
        'Aucun compte ne possède cette adresse ou les informations ne correspondent pas!'
      );
    }
  };

  return (
    <>
      <h1 className="text-center">Connection à l'application</h1>

      <form className="w-50 mx-auto mt-5" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Adresse email</label>
          <input
            value={credentials.username}
            onChange={handleChange}
            type="email"
            id="username"
            className={'form-control' + (error && ' is-invalid')}
            name="username"
            placeholder="Adresse de connection"
          />
          {/* 
                invalid-feedback => affiche p si l'info de input n'est pas valid
                pour cela rajouter la classe is-invalid
                <p className="invalid-feedback">
                  Aucun compte ne possède cette adresse ou les informations ne
                  correspondent pas
                </p>
            */}
          {error && <p className="invalid-feedback">{error}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input
            value={credentials.password}
            onChange={handleChange}
            type="password"
            id="password"
            className="form-control"
            name="password"
            placeholder="Mot de passe"
          />
        </div>
        {/*
            div.form-group>button:submit.btn.btn-success{Je me connecte}
        */}
        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Je me connecte
          </button>
        </div>
      </form>
    </>
  );
};

export default LoginPage;
