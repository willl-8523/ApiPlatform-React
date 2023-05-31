import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import authAPI from '../services/authAPI';
import Field from '../components/forms/Field';
// import customersAPI from '../services/customersAPI';

const LoginPage = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  const [error, setError] = useState('');

  // Gestion des champs
  const handleChange = ({ /*event*/ currentTarget }) => {
    // Value de l'input
    // const value = event.currentTarget.value;

    // Nom de l'input (exp: name="username")
    // const name = event.currentTarget.name;
    const { value, name } = currentTarget;

    /**
     * [name] => username ou password
     * concatène les aciennes valeurs avec les nouvelles valeurs
     */
    setCredentials({ ...credentials, [name]: value });
  };

  // Gestion du submit
  const handleSubmit = async (event) => {
    event.preventDefault();
    // credentials => Données qu'on souhaite envoyer
    // console.log(credentials);

    try {
      await authAPI.authenticate(credentials);

      // Retirer l'erreur
      setError('');

      // Dire qu'on est connecté
      setIsAuthenticated(true);

      // Remplace /login par /
      navigate('/', { replace: true });

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
        <Field
          label={'Adresse email'}
          name={'username'}
          type={'email'}
          value={credentials.username}
          onChange={handleChange}
          error={error}
        />
        <Field
          label={'Mot de passe'}
          name={'password'}
          type={'password'}
          value={credentials.password}
          onChange={handleChange}
        />
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
