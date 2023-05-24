import React from 'react';

const Pagination = ({currentPage, itemsPerPage, length, onPageChanged}) => {
  // Determiner le nombre de customer par page (arrondi superieur)
  const pagesCount = Math.ceil(length / itemsPerPage);
  // console.log(pagesCount);

  // Construire un tableau qui contiendra les pages
  const pages = [];
  for (let i = 1; i <= pagesCount; i++) {
    pages.push(i);
  }
  // console.log(pages);

  return (
    <div className="d-flex justify-content-center">
      <ul className="pagination pagination-lg">
        <li className={'page-item ' + (currentPage === 1 && 'disabled')}>
          <button
            className="page-link"
            onClick={() => onPageChanged(currentPage - 1)}
          >
            &laquo;
          </button>
        </li>

        {pages.map((page) => (
          <li
            key={page}
            className={'page-item ' + (currentPage === page && 'active')}
          >
            <button className="page-link" onClick={() => onPageChanged(page)}>
              {page}
            </button>
          </li>
        ))}

        <li
          className={'page-item ' + (currentPage === pagesCount && 'disabled')}
        >
          <button
            className="page-link"
            onClick={() => onPageChanged(currentPage + 1)}
          >
            &raquo;
          </button>
        </li>
      </ul>
    </div>
  );
};

/*
    Pagination etant une function (propriete, methode), nous pouvons lui ajouter une methode
*/
Pagination.getData = (items, currentPage, itemsPerPage) => {
  /*
    -> Afficher les customers correspondant à la page où on est
      (d'où on part (start) et pendant combien (itemsPerPage))
      page = 1 => start = 0 et itemsPerPage = 10 => de 0 à 9; 
      page = 2 => start = 10 et itemsPerPage = 10 => de 10 à 19; ...
  */
  const start = currentPage * itemsPerPage - itemsPerPage;
  return items.slice(start, start + itemsPerPage);
}
 
export default Pagination;