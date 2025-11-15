// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { FileText } from "lucide-react";
// import "./Contrats.css";

// const Contrats = () => {
//   const [contrats, setContrats] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showForm, setShowForm] = useState(false);
//   const [formData, setFormData] = useState({
//     employee_id: "",
//     searchEmployee: "",
//     filteredEmployees: [],
//     type_contrat: "CDI",
//     date_debut: "",
//     date_fin: "",
//     salaire: ""
//   });

//   // ------------------ FETCH ------------------
//   const fetchContrats = async () => {
//     try {
//       const res = await axios.get("http://127.0.0.1:8000/api/contrats/");
//       // ⬇️ Ajouter nom_complet pour chaque contrat existant
//       const contratsWithNom = res.data.map(c => {
//         const emp = employees.find(e => e.id === c.employee_id);
//         return { ...c, nom_complet: emp ? emp.nom + " " + emp.prenom : "—" };
//       });
//       setContrats(contratsWithNom);
//     } catch (err) {
//       console.error("Erreur fetch contrats:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchEmployees = async () => {
//     try {
//       const res = await axios.get("http://127.0.0.1:8000/api/employes/");
//       setEmployees(res.data);
//     } catch (err) {
//       console.error("Erreur fetch employés:", err);
//     }
//   };

//   useEffect(() => {
//     fetchEmployees();
//   }, []);

//   useEffect(() => {
//     if (employees.length) fetchContrats();
//   }, [employees]);

//   // ------------------ FORM HANDLERS ------------------
//   const handleFormChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleEmployeeSearch = (e) => {
//     const term = e.target.value.toLowerCase();
//     setFormData({
//       ...formData,
//       searchEmployee: e.target.value,
//       filteredEmployees: employees.filter(emp =>
//         emp.nom.toLowerCase().includes(term) ||
//         emp.prenom.toLowerCase().includes(term)
//       )
//     });
//   };

//   const handleSelectEmployee = (emp) => {
//     setFormData({
//       ...formData,
//       employee_id: emp.id,
//       searchEmployee: emp.nom + " " + emp.prenom,
//       filteredEmployees: []
//     });
//   };

//   const handleFormSubmit = async (e) => {
//     e.preventDefault();
//     if (!formData.employee_id) return alert("Veuillez sélectionner un employé.");

//     try {
//       const payload = {
//         employee_id: formData.employee_id,
//         type_contrat: formData.type_contrat,
//         date_debut: formData.date_debut,
//         date_fin: formData.date_fin || null,
//         salaire: formData.salaire ? parseFloat(formData.salaire) : 0
//       };

//       const res = await axios.post("http://127.0.0.1:8000/api/contrats/", payload);

//       // ⬇️ Ajouter nom_complet avy hatrany
//       const employee = employees.find(emp => emp.id === formData.employee_id);
//       const newContrat = {
//         ...res.data,
//         nom_complet: employee ? employee.nom + " " + employee.prenom : "—"
//       };

//       setContrats([...contrats, newContrat]);
//       setShowForm(false);
//       setFormData({
//         employee_id: "",
//         searchEmployee: "",
//         filteredEmployees: [],
//         type_contrat: "CDI",
//         date_debut: "",
//         date_fin: "",
//         salaire: ""
//       });
//     } catch (err) {
//       console.error("Erreur création contrat:", err);
//       alert("Erreur lors de la création du contrat");
//     }
//   };

//   // ------------------ SEARCH ------------------
//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value.toLowerCase());
//   };

//   const filteredContrats = contrats.filter(c => {
//     const nom = c.nom_complet?.toLowerCase() || "";
//     const type = c.type_contrat?.toLowerCase() || "";
//     return nom.includes(searchTerm) || type.includes(searchTerm);
//   });

//   // ------------------ RENDER ------------------
//   return (
//     <div className="contrats-wrapper">
//       <div className="contrats-header">
//         <h1 className="contrats-title">
//           <FileText className="contrats-title-icon" />
//           Gestion des Contrats
//         </h1>
//         <div className="contrats-search">
//          <div className="input-wrapper"></div>
//           <input
//             type="text"
//             placeholder="Rechercher par nom ou type de contrat..."
//             value={searchTerm}
//             onChange={handleSearch}
//           />
//           <button onClick={() => setShowForm(true)} className="btn-add">
//             + Créer Contrat
//           </button>
//         </div>
//       </div>

//       {showForm && (
//         <div className="contrat-form-overlay">
//           <div className="contrat-form">
//             <h2>Créer un Contrat</h2>
//             <form onSubmit={handleFormSubmit}>
//               <div className="form-group">
//                 <label>Employé</label>
//                 <input
//                   type="text"
//                   placeholder="Rechercher un employé..."
//                   value={formData.searchEmployee}
//                   onChange={handleEmployeeSearch}
//                 />
//                 {formData.filteredEmployees.length > 0 && (
//                   <div className="autocomplete-list">
//                     {formData.filteredEmployees.map(emp => (
//                       <div
//                         key={emp.id}
//                         className="autocomplete-item"
//                         onClick={() => handleSelectEmployee(emp)}
//                       >
//                         {emp.nom} {emp.prenom}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               <div className="form-group">
//                 <label>Type de contrat</label>
//                 <select
//                   name="type_contrat"
//                   value={formData.type_contrat}
//                   onChange={handleFormChange}
//                 >
//                   <option value="CDI">CDI</option>
//                   <option value="CDD">CDD</option>
//                   <option value="Stage">Stage</option>
//                   <option value="Alternance">Alternance</option>
//                 </select>
//               </div>

//               <div className="form-group">
//                 <label>Date début</label>
//                 <input
//                   type="date"
//                   name="date_debut"
//                   value={formData.date_debut}
//                   onChange={handleFormChange}
//                   required
//                 />
//               </div>

//               <div className="form-group">
//                 <label>Date fin</label>
//                 <input
//                   type="date"
//                   name="date_fin"
//                   value={formData.date_fin}
//                   onChange={handleFormChange}
//                 />
//               </div>

//               <div className="form-group">
//                 <label>Salaire</label>
//                 <input
//                   type="number"
//                   name="salaire"
//                   value={formData.salaire}
//                   onChange={handleFormChange}
//                 />
//               </div>

//               <div className="form-actions">
//                 <button type="button" onClick={() => setShowForm(false)} className="btn-cancel">
//                   Annuler
//                 </button>
//                 <button type="submit" className="btn-submit">
//                   Enregistrer
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {!loading ? (
//         <div className="contrats-table-container">
//           <table className="contrats-table">
//             <thead>
//               <tr>
//                 <th>ID</th>
//                 <th>Nom complet</th>
//                 <th>Type</th>
//                 <th>Date début</th>
//                 <th>Date fin</th>
//                 <th>Salaire</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredContrats.map(c => (
//                 <tr key={c.id}>
//                   <td>{c.id}</td>
//                   <td>{c.nom_complet || "—"}</td>
//                   <td>{c.type_contrat}</td>
//                   <td>{c.date_debut ? new Date(c.date_debut).toLocaleDateString() : "—"}</td>
//                   <td>{c.date_fin ? new Date(c.date_fin).toLocaleDateString() : "—"}</td>
//                   <td>{c.salaire || "—"}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <div className="contrats-loading">Chargement des contrats...</div>
//       )}
//     </div>
//   );
// };

// export default Contrats;
















import React, { useEffect, useState } from "react";
import axios from "axios";
import { FileText, Search } from "lucide-react";
import "./Contrats.css";

const Contrats = () => {
  const [contrats, setContrats] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    employee_id: "",
    searchEmployee: "",
    filteredEmployees: [],
    type_contrat: "CDI",
    date_debut: "",
    date_fin: "",
    salaire: ""
  });

  // ------------------ FETCH ------------------
  const fetchContrats = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/contrats/");
      // Ajouter nom_complet pour chaque contrat existant
      const contratsWithNom = res.data.map(c => {
        const emp = employees.find(e => e.id === c.employee_id);
        return { ...c, nom_complet: emp ? emp.nom + " " + emp.prenom : "—" };
      });
      setContrats(contratsWithNom);
    } catch (err) {
      console.error("Erreur fetch contrats:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/employes/");
      setEmployees(res.data);
    } catch (err) {
      console.error("Erreur fetch employés:", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (employees.length) fetchContrats();
  }, [employees]);

  // ------------------ FORM HANDLERS ------------------
  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEmployeeSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setFormData({
      ...formData,
      searchEmployee: e.target.value,
      filteredEmployees: employees.filter(emp =>
        emp.nom.toLowerCase().includes(term) ||
        emp.prenom.toLowerCase().includes(term)
      )
    });
  };

  const handleSelectEmployee = (emp) => {
    setFormData({
      ...formData,
      employee_id: emp.id,
      searchEmployee: emp.nom + " " + emp.prenom,
      filteredEmployees: []
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.employee_id) return alert("Veuillez sélectionner un employé.");

    try {
      const payload = {
        employee_id: formData.employee_id,
        type_contrat: formData.type_contrat,
        date_debut: formData.date_debut,
        date_fin: formData.date_fin || null,
        salaire: formData.salaire ? parseFloat(formData.salaire) : 0
      };

      const res = await axios.post("http://127.0.0.1:8000/api/contrats/", payload);

      // Ajouter nom_complet avy hatrany
      const employee = employees.find(emp => emp.id === formData.employee_id);
      const newContrat = {
        ...res.data,
        nom_complet: employee ? employee.nom + " " + employee.prenom : "—"
      };

      setContrats([...contrats, newContrat]);
      setShowForm(false);
      setFormData({
        employee_id: "",
        searchEmployee: "",
        filteredEmployees: [],
        type_contrat: "CDI",
        date_debut: "",
        date_fin: "",
        salaire: ""
      });
    } catch (err) {
      console.error("Erreur création contrat:", err);
      alert("Erreur lors de la création du contrat");
    }
  };

  // ------------------ SEARCH ------------------
  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredContrats = contrats.filter(c => {
    const nom = c.nom_complet?.toLowerCase() || "";
    const type = c.type_contrat?.toLowerCase() || "";
    return nom.includes(searchTerm) || type.includes(searchTerm);
  });

  // ------------------ RENDER ------------------
  return (
    <div className="contrats-wrapper">
      <div className="contrats-header">
        <h1 className="contrats-title">
          <FileText className="contrats-title-icon" />
          Gestion des Contrats
        </h1>

        <div className="contrats-search-container">
          <div className="search-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher par nom ou type de contrat..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          <button onClick={() => setShowForm(true)} className="btn-add">
            + Créer Contrat
          </button>
        </div>
      </div>

      {showForm && (
        <div className="contrat-form-overlay">
          <div className="contrat-form">
            <h2>Créer un Contrat</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label>Employé</label>
                <input
                  type="text"
                  placeholder="Rechercher un employé..."
                  value={formData.searchEmployee}
                  onChange={handleEmployeeSearch}
                />
                {formData.filteredEmployees.length > 0 && (
                  <div className="autocomplete-list">
                    {formData.filteredEmployees.map(emp => (
                      <div
                        key={emp.id}
                        className="autocomplete-item"
                        onClick={() => handleSelectEmployee(emp)}
                      >
                        {emp.nom} {emp.prenom}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Type de contrat</label>
                <select
                  name="type_contrat"
                  value={formData.type_contrat}
                  onChange={handleFormChange}
                >
                  <option value="CDI">CDI</option>
                  <option value="CDD">CDD</option>
                  <option value="Stage">Stage</option>
                  <option value="Alternance">Alternance</option>
                </select>
              </div>

              <div className="form-group">
                <label>Date début</label>
                <input
                  type="date"
                  name="date_debut"
                  value={formData.date_debut}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Date fin</label>
                <input
                  type="date"
                  name="date_fin"
                  value={formData.date_fin}
                  onChange={handleFormChange}
                />
              </div>

              <div className="form-group">
                <label>Salaire</label>
                <input
                  type="number"
                  name="salaire"
                  value={formData.salaire}
                  onChange={handleFormChange}
                />
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setShowForm(false)} className="btn-cancel">
                  Annuler
                </button>
                <button type="submit" className="btn-submit">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {!loading ? (
        <div className="contrats-table-container">
          <table className="contrats-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom complet</th>
                <th>Type</th>
                <th>Date début</th>
                <th>Date fin</th>
                <th>Salaire</th>
              </tr>
            </thead>
            <tbody>
              {filteredContrats.map(c => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.nom_complet || "—"}</td>
                  <td>{c.type_contrat}</td>
                  <td>{c.date_debut ? new Date(c.date_debut).toLocaleDateString() : "—"}</td>
                  <td>{c.date_fin ? new Date(c.date_fin).toLocaleDateString() : "—"}</td>
                  <td>{c.salaire || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="contrats-loading">Chargement des contrats...</div>
      )}
    </div>
  );
};

export default Contrats;















