import axios from 'axios';
// import customersAPI from './customersAPI';
import jwtDecode from "jwt-decode";

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
      setAxiosToken(token);

      //   customersAPI.findAll().then(console.log);
      //   customersAPI.findAll().then(data => console.log(data));
    });
}

function setAxiosToken(token) {
    axios.defaults.headers['Authorization'] = 'Bearer ' + token;
}
function setup() {
   // 1. Voir si on a un token ?
   const token = window.localStorage.getItem("authToken"); // retourne null ou false

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
        // On dit à axios qu'on a un header par defaut
        setAxiosToken(token);
      }
    }
   // 3. Donner le token au headers de axios
}

// Ce qui sera exporter lorsqu'on importera ce fichier
export default {
  authenticate, // authenticate: authenticate
  logout,
  setup,
};
