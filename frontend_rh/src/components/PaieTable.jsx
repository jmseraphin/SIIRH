// import { deletePaie } from "../api/paieApi";

// export default function PaieTable({ paies, onDeleted }) {
//   const handleDelete = async (id) => {
//     await deletePaie(id);
//     onDeleted();
//   };

//   return (
//     <table className="paie-table">
//       <thead>
//         <tr>
//           <th>Employé</th>
//           <th>Salaire Base</th>
//           <th>Primes</th>
//           <th>Heures Supp</th>
//           <th>Déductions</th>
//           <th>Mois</th>
//           <th>Actions</th>
//         </tr>
//       </thead>

//       <tbody>
//         {paies.map((p) => (
//           <tr key={p.id}>
//             <td>{p.employee?.fullname}</td>
//             <td>{p.salaire_base}</td>
//             <td>{p.primes}</td>
//             <td>{p.heures_supp}</td>
//             <td>{p.deductions}</td>
//             <td>{p.mois}/{p.annee}</td>
//             <td>
//               <button
//                 className="paie-delete-btn"
//                 onClick={() => handleDelete(p.id)}
//               >
//                 Supprimer
//               </button>
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// }




export default function PaieTable({ paies, onDeleted }) {
  const handleDelete = async (id) => {
    if (confirm("Voulez-vous vraiment supprimer cette paie ?")) {
      try {
        await deletePaie(id);
        onDeleted();
      } catch (error) {
        console.error("Erreur suppression paie:", error);
      }
    }
  };

  return (
    <table className="paie-table">
      <thead>
        <tr>
          <th>Employé</th>
          <th>Mois</th>
          <th>Année</th>
          <th>Primes</th>
          <th>Heures Suppl.</th>
          <th>Déductions</th>
          <th>Salaire Net</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {paies.map((p) => (
          <tr key={p.id}>
            <td>{p.employee_name}</td>
            <td>{p.mois}</td>
            <td>{p.annee}</td>
            <td>{p.primes}</td>
            <td>{p.heures_supp}</td>
            <td>{p.deductions}</td>
            <td>{p.salaire_net}</td>
            <td>
              <button
                className="paie-delete-btn"
                onClick={() => handleDelete(p.id)}
              >
                Supprimer
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
