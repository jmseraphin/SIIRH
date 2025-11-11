// import { useEffect, useState } from "react";
// import axios from "axios";

// export default function Contrats() {
//   const [contrats, setContrats] = useState([]);

//   useEffect(() => {
//     const fetchContrats = async () => {
//       try {
//         const res = await axios.get("http://localhost:8000/api/contrats/");
//         setContrats(res.data);
//       } catch (error) {
//         console.error("Erreur lors du chargement des contrats :", error);
//       }
//     };
//     fetchContrats();
//   }, []);

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold text-gray-800 mb-6">Gestion des Contrats</h1>
//       <table className="w-full bg-white shadow rounded-lg">
//         <thead>
//           <tr className="bg-gray-100 text-left text-gray-700">
//             <th className="p-3">Employé</th>
//             <th className="p-3">Type</th>
//             <th className="p-3">Date Début</th>
//             <th className="p-3">Date Fin</th>
//           </tr>
//         </thead>
//         <tbody>
//           {contrats.length > 0 ? (
//             contrats.map((c) => (
//               <tr key={c.id} className="border-t hover:bg-gray-50">
//                 <td className="p-3">{c.employe_nom}</td>
//                 <td className="p-3">{c.type}</td>
//                 <td className="p-3">{c.date_debut}</td>
//                 <td className="p-3">{c.date_fin}</td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="4" className="p-3 text-center text-gray-500">
//                 Aucun contrat trouvé.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }























import { useEffect, useState } from "react";
import axios from "axios";

export default function Contrats() {
  const [contrats, setContrats] = useState([]);
  const [showForm, setShowForm] = useState(false); // hanaovana popup
  const [formData, setFormData] = useState({
    employee_id: "",
    type_contrat: "CDI",
    date_debut: "",
    date_fin: ""
  });
  const [employees, setEmployees] = useState([]); // lisitry ny employés

  // Fetch contrats
  useEffect(() => {
    const fetchContrats = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/contrats/");
        setContrats(res.data);
      } catch (error) {
        console.error("Erreur lors du chargement des contrats :", error);
      }
    };
    fetchContrats();
  }, []);

  // Fetch employees ho an'ny select
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/employees/");
        setEmployees(res.data);
      } catch (error) {
        console.error("Erreur lors du chargement des employés :", error);
      }
    };
    fetchEmployees();
  }, []);

  // Handle form change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/api/contrats/", formData);
      setContrats([...contrats, res.data]); // ajoute contrat vao tabilao
      setShowForm(false);
      setFormData({ employee_id: "", type_contrat: "CDI", date_debut: "", date_fin: "" });
    } catch (error) {
      console.error("Erreur création contrat :", error);
      alert("Erreur lors de la création du contrat");
    }
  };

  return (
    <div className="p-6">
      {/* Titre + bouton création */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestion des Contrats</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Créer Contrat
        </button>
      </div>

      {/* Formulaire modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Créer un Contrat</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block mb-1">Employé</label>
                <select
                  name="employee_id"
                  value={formData.employee_id}
                  onChange={handleChange}
                  required
                  className="w-full border px-2 py-1 rounded"
                >
                  <option value="">-- Choisir --</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.nom}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1">Type de contrat</label>
                <select
                  name="type_contrat"
                  value={formData.type_contrat}
                  onChange={handleChange}
                  className="w-full border px-2 py-1 rounded"
                >
                  <option value="CDI">CDI</option>
                  <option value="CDD">CDD</option>
                  <option value="Stage">Stage</option>
                  <option value="Alternance">Alternance</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">Date début</label>
                <input
                  type="date"
                  name="date_debut"
                  value={formData.date_debut}
                  onChange={handleChange}
                  required
                  className="w-full border px-2 py-1 rounded"
                />
              </div>

              <div>
                <label className="block mb-1">Date fin</label>
                <input
                  type="date"
                  name="date_fin"
                  value={formData.date_fin}
                  onChange={handleChange}
                  className="w-full border px-2 py-1 rounded"
                />
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-3 py-1 border rounded hover:bg-gray-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table contrats */}
      <table className="w-full bg-white shadow rounded-lg">
        <thead>
          <tr className="bg-gray-100 text-left text-gray-700">
            <th className="p-3">Employé</th>
            <th className="p-3">Type</th>
            <th className="p-3">Date Début</th>
            <th className="p-3">Date Fin</th>
          </tr>
        </thead>
        <tbody>
          {contrats.length > 0 ? (
            contrats.map((c) => (
              <tr key={c.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{c.employee?.nom || "N/A"}</td>
                <td className="p-3">{c.type_contrat}</td>
                <td className="p-3">{c.date_debut}</td>
                <td className="p-3">{c.date_fin}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="p-3 text-center text-gray-500">
                Aucun contrat trouvé.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
