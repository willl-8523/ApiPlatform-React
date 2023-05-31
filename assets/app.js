import React, { useContext, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Navbar from './js/components/Navbar';
import AuthContext from './js/contexts/AuthContext';
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

// Autorisation des routes 
const PrivateRoute = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return isAuthenticated ? <Outlet /> : <Navigate to='/login' replace />;
};

const App = () => {
  // Il faut par defaut qu'on demande à notre authAPI si on est connecté ou pas
  const [isAuthenticated, setIsAuthenticated] = useState(
    authAPI.beAuthenticated()
  );
  console.log(isAuthenticated);

  const contextValue = { isAuthenticated, setIsAuthenticated };

  return (
    <AuthContext.Provider value={contextValue}>
      <HashRouter>
        <Navbar />

        <main className="container pt-5">
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route element={<PrivateRoute />}>
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/invoices" element={<InvoicesPage />} />
            </Route>
            <Route
              path="/login"
              element={<LoginPage />}
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
    </AuthContext.Provider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);
