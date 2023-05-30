import React from 'react';
import authAPI from '../services/authAPI';

const Navbar = (props) => {
  
  const handleLogout = () => {
    authAPI.logout();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <a className="navbar-brand" href="#">
        ApiPlatform_React
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarColor02"
        aria-controls="navbarColor02"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarColor02">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <a className="nav-link" href="#">
              Clients
            </a>
            <span className="sr-only">(current)</span>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              Factures
            </a>
          </li>
        </ul>
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <a href="#" className="nav-link mr-1">
              Inscription
            </a>
          </li>
          <li className="nav-item mb-3">
            <a href="#" className="btn btn-secondary mr-1">
              Connexion
            </a>
          </li>
          <li className="nav-item mr-1">
            <button onClick={handleLogout} href="#" className="btn btn-danger">
              Déconnexion
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
