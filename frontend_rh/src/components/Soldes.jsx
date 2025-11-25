// import React, { useEffect, useState } from "react";
// import api from "../api"; 

// export default function Soldes({ employees }) {
//   const [soldes, setSoldes] = useState([]);

//   const fetchSoldes = async () => {
//     try {
//       const res = await api.get("/api/soldes/");
//       console.log("Soldes API:", res.data);
//       setSoldes(res.data || []);
//     } catch (err) {
//       console.error("Erreur fetch soldes :", err);
//       setSoldes([]);
//     }
//   };

//   useEffect(() => {
//     fetchSoldes();
//   }, []);

//   const getEmployeeLabel = (id) => {
//     const emp = employees?.find((e) => e.id === id);
//     return emp ? `${emp.nom ?? ""} ${emp.prenom ?? ""}` : "—";
//   };

//   return (
//     <div className="tab-content">
//       <h3>Soldes des employés</h3>

//       <table className="data-table">
//         <thead>
//           <tr>
//             <th>Employé</th>
//             <th>Congés pris</th>
//             <th>Absences non payées</th>
//             <th>Solde Congés</th>
//           </tr>
//         </thead>

//         <tbody>
//           {soldes.length === 0 ? (
//             <tr>
//               <td colSpan="4" style={{ textAlign: "center" }}>
//                 Aucune donnée disponible
//               </td>
//             </tr>
//           ) : (
//             soldes.map((s) => (
//               <tr key={s.employee_id}>
//                 <td>{getEmployeeLabel(s.employee_id)}</td>
//                 <td>{s.conges_pris}</td>
//                 <td>{s.absences_non_payees}</td>
//                 <td>{s.solde_conges}</td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }















import React, { useEffect, useState } from "react";
import api from "../api"; 
import "./Soldes.css"; // Ataovy antoka fa import-nao

export default function Soldes() {
  const [soldes, setSoldes] = useState([]);

  const fetchSoldes = async () => {
    try {
      const res = await api.get("/api/soldes/");
      console.log("Soldes API:", res.data);
      setSoldes(res.data || []);
    } catch (err) {
      console.error("Erreur fetch soldes :", err);
      setSoldes([]);
    }
  };

  useEffect(() => {
    fetchSoldes();
  }, []);

  return (
    <div className="tab-content">
      <h3>Soldes des employés</h3>

      <div style={{ overflowX: "auto" }}> {/* Mba hisian'ny scroll raha kely ny écran */}
        <table className="data-table">
          <thead>
            <tr>
              <th>Employé</th>
              <th>Congés pris</th>
              <th>Absences non payées</th>
              <th>Solde Congés</th>
            </tr>
          </thead>
          <tbody>
            {soldes.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  Aucune donnée disponible
                </td>
              </tr>
            ) : (
              soldes.map((s) => (
                <tr key={s.employee_id}>
                  <td>{s.nom} {s.prenom}</td>
                  <td>{s.conges_pris}</td>
                  <td>{s.absences_non_payees}</td>
                  <td>{s.solde_conges}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
