import axios from 'axios';
// import customersAPI from './customersAPI';
import jwtDecode from 'jwt-decode';
import { LOGIN_API } from '../config';

/**
 * Déconnexion (suppression du token du localStorage et sur Axios)
 */
function logout() {
  // Supprimer le token dans le localStorage
  window.localStorage.removeItem('authToken');

  // Supprimer le header Authorization dans axios
  delete axios.defaults.headers['Authorization'];

  //   customersAPI.findAll().then(console.log);
  //   customersAPI.findAll().then((data) => console.log(data));
}

/**
 * Requête HTTP d'authentification et stockage du token dans le storage et sur
 * Axios
 * @param {object} credentials
 */
function authenticate(credentials) {
  // Si ça marche on stoke le token
  return axios
    .post(LOGIN_API, credentials)
    .then((response) => response.data.token)
    .then((token) => {
      // Stoker le token dans le localStorage
      window.localStorage.setItem('authToken', token);

      // On previent axios qu'on a maintenant un header par defaut sur toutes nos futures requêtes
      setAxiosToken(token);

      //   customersAPI.findAll().then(console.log);
      //   customersAPI.findAll().then(data => console.log(data));
    });
}

/**
 * Positionne le token JWT sur Axios
 * @param {string} token le token JWT 
 */
function setAxiosToken(token) {
  axios.defaults.headers['Authorization'] = 'Bearer ' + token;
}

/**
 * Mise en place lors du chargement de l'application
 */
function setup() {
  // 1. Voir si on a un token ?
  const token = window.localStorage.getItem('authToken'); // retourne null ou false

  // 2. Si le token est encore valide
  if (token) {
    //   const jwtData = jwtDecode(token);
    //   console.log('jwtData', jwtData);
    // { exp: expiration } => (exp = jwtData.exp) renomme exp en expiration
    const { exp: expiration } = jwtDecode(token);

    /**
     * jwtData.exp => en s
     * new Date().getTime() => en ms
     *
     * Le token est valide si la date d'expiration > Date.getTime()
     *
     * console.log(`jwtData.exp = ${jwtData.exp * 1000}, Date.getTime = ${new
     * Date().getTime()}`);
     *
     */
    if (expiration * 1000 > new Date().getTime()) {
      // 3. Donner le token au headers de axios
      setAxiosToken(token);
    }
  }
}

/**
 * Permet de savoir si on est authentifié ou pas
 * @returns boolean
 */
function beAuthenticated() {
  // 1. Voir si on a un token ?
  const token = window.localStorage.getItem('authToken');

  // 2. Si le token est encore valide
  if (token) {
    const { exp: expiration } = jwtDecode(token);

    if (expiration * 1000 > new Date().getTime()) {
      return true;
    }
    return false;
  }
  return false;
}

// Ce qui sera exporter lorsqu'on importera ce fichier
export default {
  authenticate, // authenticate: authenticate
  logout,
  setup,
  beAuthenticated,
};
