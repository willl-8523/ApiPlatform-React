import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Route, Routes } from 'react-router-dom';

import Navbar from './js/components/Navbar';
import CustomersPage from './js/pages/CustomersPage';
import HomePage from './js/pages/HomePage';
// import CustomerPageWithPaginationRequest from './js/pages/CustomerPageWithPaginationRequest';
import InvoicesPage from './js/pages/InvoicesPage';

import './styles/app.css';
import './bootstrap';

const App = () => {
  return (
    <HashRouter>
      <Navbar />

      <main className="container pt-5">
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/invoices" element={<InvoicesPage />} />
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
