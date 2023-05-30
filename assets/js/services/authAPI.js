import axios from 'axios';

export default function authenticate(credentials) {
  // Si ça marche on stoke le token
  return axios
    .post('https://127.0.0.1:8000/api/login_check', credentials)
    .then((response) => response.data.token)
    .then((token) => {
      // Stoker le token dans le localStorage
      window.localStorage.setItem('authToken', token);

      // On previent axios qu'on a maintenant un header par defaut sur toutes nos futures requêtes
      axios.defaults.headers['Authorization'] = 'Bearer ' + token;
    });
}
