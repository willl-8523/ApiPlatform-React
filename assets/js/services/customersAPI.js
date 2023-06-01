import axios from 'axios';

function findAll() {
  return axios
    .get('https://localhost:8000/api/customers')
    .then((response) => response.data['hydra:member']);
}

function findOne(id) {
  return axios
    .get('https://localhost:8000/api/customers/' + id)
    .then((response) => response.data);
}

function deleteCustomer(id) {
  return axios.delete('https://localhost:8000/api/customers/' + id);
}

function updateCustomer(id, customer) {
  return axios.put('https://localhost:8000/api/customers/' + id, customer);
}

function createCustomer(customer) {
  return axios.post('https://localhost:8000/api/customers', customer);
}

// Ce qui sera exporter lorsqu'on importera ce fichier
export default {
  createCustomer,
  findAll, // findAll: findAll
  findOne,
  updateCustomer,
  delete: deleteCustomer,
};
