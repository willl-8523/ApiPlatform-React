import React from 'react';

/* 
  Créer un context par defaut => Prend la forme des infos que l'on souhaite passer à nos composants
*/
export default React.createContext({
  isAuthenticated: false,
  setIsAuthenticated: (value) => {},
});
