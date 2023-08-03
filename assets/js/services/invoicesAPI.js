import axios from 'axios';
import { INVOICES_API } from '../config';

function findAll() {
  return axios
    .get(INVOICES_API)
    .then((response) => response.data['hydra:member']);
}

function deleteInvoice(id) {
  return axios.delete(INVOICES_API + '/' + id);
}

function findInvoice(id) {
  return axios.get(INVOICES_API + '/' + id).then((response) => response.data);
}

function updateInvoice(id, invoice) {
  return axios.put(INVOICES_API + '/' + id, {
    ...invoice,
    customer: `/api/customers/${invoice.customer}`,
  });
}

function createInvoice(invoice) {
  return axios.post(INVOICES_API, {
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
