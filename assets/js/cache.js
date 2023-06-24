const cache = {};

/**
 *
 * @param {Nom de l'item qu'on souhaite mettre en cache} key
 * @param {donnée} data
 */
function set(key, data) {
  cache[key] = {
    data: data,
    cachedAt: new Date().getTime(),
  };
}

function get(key) {
  /**
   * cache[key] ? cache[key].data : null =>
   * Si cache[key] existe on retourne les donnée qui sont dans le cache
   */
  return new Promise((resolve) => {
    /**
     * Si cache[key] existe et si (cache[key].cachedAt + 15min > date actuelle) 
     */
    resolve(
      (cache[key] && (cache[key].cachedAt + 15 * 60 * 1000 > new Date().getTime()))
        ? cache[key].data
        : null
    );
  });
}

export default {
  set,
  get,
};
