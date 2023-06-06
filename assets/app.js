import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Route, Routes } from 'react-router-dom';
import Navbar from './js/components/Navbar';
import AuthContext from './js/contexts/AuthContext';
import CustomersPage from './js/pages/CustomersPage';
import HomePage from './js/pages/HomePage';
import InvoicesPage from './js/pages/InvoicesPage';
import LoginPage from './js/pages/LoginPage';
import authAPI from './js/services/authAPI';
import PrivateRoute from './js/security/PrivateRoute';
// import CustomerPageWithPaginationRequest from './js/pages/CustomerPageWithPaginationRequest';

import './bootstrap';
require('bootstrap');

// On apporte le css personalisé
import './styles/app.css';
import CustomerPage from './js/pages/CustomerPage';
import InvoicePage from './js/pages/InvoicePage';
import RegisterPage from './js/pages/RegisterPage';

// Dès qu'on lance notre appilcation avant même de charger le composant, on execute:
authAPI.setup();

const App = () => {
  // Il faut par defaut qu'on demande à notre authAPI si on est connecté ou pas
  const [isAuthenticated, setIsAuthenticated] = useState(
    authAPI.beAuthenticated()
  );
  // console.log(isAuthenticated);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <HashRouter>
        <Navbar />

        <main className="container pt-5">
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route element={<PrivateRoute />}>
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/customers/:id" element={<CustomerPage />} />
              <Route path="/invoices" element={<InvoicesPage />} />
              <Route path="/invoices/:id" element={<InvoicePage />} />
            </Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* 
            <Route
              path="/customers"
              element={<CustomerPageWithPaginationRequest />}
            ></Route> 
          */}
          </Routes>
        </main>
      </HashRouter>
    </AuthContext.Provider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);
