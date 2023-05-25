import React, { useState } from 'react';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

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

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log(credentials);
  }

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
            className="form-control"
            name="username"
            placeholder="Adresse de connection"
          />
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
