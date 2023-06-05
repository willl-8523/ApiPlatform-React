import axios from 'axios';

function findAll() {
  return axios
    .get('https://localhost:8000/api/invoices')
    .then((response) => response.data['hydra:member']);
}

function deleteInvoice(id) {
  return axios.delete('https://localhost:8000/api/invoice/' + id);
}

function findInvoice(id) {
  return axios
    .get('https://localhost:8000/api/invoices/' + id)
    .then((response) => response.data);
}

function updateInvoice(id, invoice) {
  return axios.put('https://localhost:8000/api/invoices/' + id, {
    ...invoice,
    customer: `/api/customers/${invoice.customer}`,
  });
}

function createInvoice(invoice) {
  return axios.post('https://localhost:8000/api/invoices', {
    ...invoice,
    customer: `/api/customers/${invoice.customer}`,
  });
}

// Ce qui sera exporter lorsqu'on importera ce fichier
export default {
  findAll, // findAll: findAll
  findInvoice,
  createInvoice,
  updateInvoice,
  delete: deleteInvoice,
};
