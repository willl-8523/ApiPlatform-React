import axios from 'axios';
import Cache from './cache';

async function findAll() {
  const cachedCustomers = await Cache.get('customers');

  if (cachedCustomers) {
    return cachedCustomers;
  }
  return axios.get('https://localhost:8000/api/customers').then((response) => {
    const customers = response.data['hydra:member'];
    Cache.set('customers', customers);
    return customers;
  });
}

async function findOne(id) {
  const cachedCustomer = await Cache.get('customers.' + id);

  if (cachedCustomer) {
    return cachedCustomer;
  }

  return axios
    .get('https://localhost:8000/api/customers/' + id)
    .then((response) => {
      const customer = response.data;

      Cache.set('customers.' + id, customer);

      return customer;
    });
}

function deleteCustomer(id) {
  return axios
    .delete('https://localhost:8000/api/customers/' + id)
    .then(async (response) => {
      const cachedCustomers = await Cache.get('customers');

      if (cachedCustomers) {
        Cache.set(
          'customers',
          cachedCustomers.filter((item) => item.id !== id)
        );
      }

      return response;
    });
}

function updateCustomer(id, customer) {
  return axios
    .put('https://localhost:8000/api/customers/' + id, customer)
    .then(async (response) => {
      const cachedCustomers = await Cache.get('customers');
      const cachedCustomer = await Cache.get('customers.' + id);

      if (cachedCustomer) {
        Cache.set('customers.' + id, response.data);
      }

      if (cachedCustomers) {
        /**
         * findIndex() => fonction js
         * Nous permet d'avoir l'index du customer qui est dans le cache
         */
        const index = cachedCustomers.findIndex((item) => item.id === +id);
        const newCachedCustomer = response.data;

        const newTabCachedCustomers = [...cachedCustomers];
        newTabCachedCustomers[index] = newCachedCustomer;

        Cache.set('customers', [...newTabCachedCustomers, newCachedCustomer]);
      }

      return response;
    });
}

function createCustomer(customer) {
  return axios
    .post('https://localhost:8000/api/customers', customer)
    .then(async (response) => {
      const cachedCustomers = await Cache.get('customers');

      if (cachedCustomers) {
        Cache.set('customers', [...cachedCustomers, response.data]);
      }

      return response;
    });
}

// Ce qui sera exporter lorsqu'on importera ce fichier
export default {
  createCustomer,
  findAll, // findAll: findAll
  findOne,
  updateCustomer,
  delete: deleteCustomer,
};
