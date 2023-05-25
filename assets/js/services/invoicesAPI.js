import axios from 'axios';

function findAll() {
  return axios
    .get('https://localhost:8000/api/invoices')
    .then((response) => response.data['hydra:member']);
}

function deleteInvoices(id) {
  return axios.delete('https://localhost:8000/api/invoice/' + id);
}

// Ce qui sera exporter lorsqu'on importera ce fichier
export default {
  findAll, // findAll: findAll
  delete: deleteInvoices,
};
