import React from 'react';
import authAPI from '../services/authAPI';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authAPI.logout();
    onLogout(false);
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <Link className="navbar-brand" to="/">
        ApiPlatform_React
      </Link>
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
            <Link className="nav-link" to="/customers">
              Clients
            </Link>
            <span className="sr-only">(current)</span>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/invoices">
              Factures
            </Link>
          </li>
        </ul>
        <ul className="navbar-nav ml-auto">
          {(!isAuthenticated && (
            <>
              <li className="nav-item">
                <Link to="/register" className="nav-link mr-1">
                  Inscription
                </Link>
              </li>
              <li className="nav-item mb-3">
                <Link to="/login" className="btn btn-secondary mr-1">
                  Connexion
                </Link>
              </li>
            </>
          )) || (
            <li className="nav-item mr-1">
              <button
                onClick={handleLogout}
                to="/logout"
                className="btn btn-danger"
              >
                Déconnexion
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
