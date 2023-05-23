import React from 'react';


const CustomersPage = () => {
    return (
      <>
        <h1>Liste des clients</h1>

        <table className="table table-hover">
          <thead>
            <tr>
              <th>Id</th>
              <th>Client</th>
              <th>Email</th>
              <th>Entreprise</th>
              <th className="text-center">Factures</th>
              <th className="text-center">Montant total</th>
              <th />
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>18</td>
              <td>
                <a href="#">Ari Boulogne</a>
              </td>
              <td>ari@example.com</td>
              <td>Ari Inc</td>
              <td className="text-center">
                <span class="badge badge-dark px-2 py-1">4</span>
              </td>
              <td className="text-center">2 400.00 €</td>
              <td>
                <button className="btn btn-sm btn-danger">Supprimer</button>
              </td>
            </tr>
          </tbody>
        </table>
      </>
    );
}
 
export default CustomersPage;