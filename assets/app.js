import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Route, Routes } from 'react-router-dom';

import Navbar from './js/components/Navbar';
import CustomersPage from './js/pages/CustomersPage';
import HomePage from './js/pages/HomePage';
import InvoicesPage from './js/pages/InvoicesPage';
import LoginPage from './js/pages/LoginPage';
import authAPI from './js/services/authAPI';
// import CustomerPageWithPaginationRequest from './js/pages/CustomerPageWithPaginationRequest';

import './bootstrap';
require('bootstrap');

// On apporte le css personalisé
import './styles/app.css';

// Dès qu'on lance notre appilcation avant même de charger le composant, on execute:
authAPI.setup();

const App = () => {
  // Il faut par defaut qu'on demande à notre authAPI si on est connecté ou pas
  const [isAuthenticated, setIsAuthenticated] = useState(
    authAPI.beAuthenticated()
  );

  console.log(isAuthenticated);

  return (
    <HashRouter>
      <Navbar isAuthenticated={isAuthenticated} onLogout={setIsAuthenticated} />

      <main className="container pt-5">
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route
            path="/login"
            element={<LoginPage onLogin={setIsAuthenticated} />}
          />
          {/* 
            <Route
              path="/customers"
              element={<CustomerPageWithPaginationRequest />}
            ></Route> 
          */}
        </Routes>
      </main>
    </HashRouter>
  );
};

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);
