import axios from 'axios';
import customersAPI from './customersAPI';

function logout() {
  // Supprimer le token dans le localStorage
  window.localStorage.removeItem('authToken');

  // Supprimer le header Authorization dans axios
  delete axios.defaults.headers['Authorization'];

  //   customersAPI.findAll().then(console.log);
  //   customersAPI.findAll().then((data) => console.log(data));
}

function authenticate(credentials) {
  // Si ça marche on stoke le token
  return axios
    .post('https://127.0.0.1:8000/api/login_check', credentials)
    .then((response) => response.data.token)
    .then((token) => {
      // Stoker le token dans le localStorage
      window.localStorage.setItem('authToken', token);

      // On previent axios qu'on a maintenant un header par defaut sur toutes nos futures requêtes
      axios.defaults.headers['Authorization'] = 'Bearer ' + token;

      //   customersAPI.findAll().then(console.log);
      //   customersAPI.findAll().then(data => console.log(data));
    });
}

// Ce qui sera exporter lorsqu'on importera ce fichier
export default {
  authenticate, // authenticate: authenticate
  logout,
};
