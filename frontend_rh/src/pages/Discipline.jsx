// import { useState, useEffect } from "react";
// import axios from "axios";
// import "../styles/Discipline.css";

// export default function Discipline() {
//   const [cases, setCases] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [filteredEmployees, setFilteredEmployees] = useState([]);
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [showCreateForm, setShowCreateForm] = useState(false);
//   const [showVoirModal, setShowVoirModal] = useState(null);
//   const [showDecisionModal, setShowDecisionModal] = useState(null);
//   const [showConvocationModal, setShowConvocationModal] = useState(null);

//   const [newCase, setNewCase] = useState({
//     employee_id: "",
//     fault_type: "",
//     description: "",
//   });
//   const [files, setFiles] = useState([]);
//   const [decision, setDecision] = useState({
//     compte_rendu: "",
//     sanction: "",
//   });
//   const [message, setMessage] = useState([]);

//   const fetchCases = async () => {
//     try {
//       const res = await axios.get("http://127.0.0.1:8000/discipline/cases");
//       setCases(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const fetchEmployees = async () => {
//     try {
//       const res = await axios.get("http://127.0.0.1:8000/discipline/employees");
//       setEmployees(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchCases();
//     fetchEmployees();
//   }, []);

//   const handleEmployeeInput = (e) => {
//     const query = e.target.value.toLowerCase();
//     setFilteredEmployees(
//       employees.filter(
//         (emp) =>
//           emp.nom.toLowerCase().includes(query) ||
//           emp.prenom.toLowerCase().includes(query)
//       )
//     );
//   };

//   const handleSelectEmployee = (emp) => {
//     setSelectedEmployee(emp);
//     setNewCase({ ...newCase, employee_id: emp.id });
//     setFilteredEmployees([]);
//   };

//   const handleNewCaseChange = (e) =>
//     setNewCase({ ...newCase, [e.target.name]: e.target.value });

//   const handleFileChange = (e) => setFiles([...e.target.files]);

//   const handleCreateCase = async (e) => {
//     e.preventDefault();
//     if (!newCase.employee_id) return alert("Sélectionner un employé");
//     setMessage("⏳ Création du dossier...");
//     try {
//       const formData = new FormData();
//       formData.append("employee_id", newCase.employee_id);
//       formData.append("fault_type", newCase.fault_type);
//       formData.append("description", newCase.description);
//       files.forEach((file) => formData.append("files", file));

//       await axios.post("http://127.0.0.1:8000/discipline/cases", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       setMessage("✅ Dossier créé !");
//       setShowCreateForm(false);
//       setNewCase({ employee_id: "", fault_type: "", description: "" });
//       setFiles([]);
//       setSelectedEmployee(null);
//       fetchCases();
//     } catch (err) {
//       console.error(err);
//       setMessage("❌ Erreur lors de la création.");
//     }
//   };

//   const handleVoir = (c) => setShowVoirModal(c);

//   // --- EXPORT PDF DISCIPLINE ---
//   const exportDisciplinePDF = async (c, dateConv = "", heureConv = "") => {
//     try {
//       const res = await axios.post(
//         `http://127.0.0.1:8000/discipline/cases/${c.id}/convocation-discipline`,
//         { date_convocation: dateConv, heure_convocation: heureConv },
//         { responseType: "blob" }
//       );

//       const url = window.URL.createObjectURL(new Blob([res.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = `discipline_${c.id}.pdf`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } catch (err) {
//       console.error(err);
//       alert("Erreur : PDF non disponible");
//     }
//   };

//   // --- ENVOI MAIL DISCIPLINE ---
//   const sendDisciplineMail = async (c, dateConv = "", heureConv = "") => {
//     try {
//       await axios.post(
//         `http://127.0.0.1:8000/discipline/cases/${c.id}/send-convocation-discipline-mail`,
//         { date_convocation: dateConv, heure_convocation: heureConv }
//       );
//       alert("📧 Mail envoyé avec succès !");
//       setShowConvocationModal(null);
//     } catch (err) {
//       console.error(err);
//       alert("Erreur lors de l'envoi de l'email");
//     }
//   };

//   const handleDecision = (c) => {
//     setShowDecisionModal(c);
//     setDecision({ compte_rendu: "", sanction: "" });
//   };

//   const submitDecision = async (c) => {
//     if (!decision.sanction) return alert("Sélectionner une sanction");
//     try {
//       const payload = {
//         decision_type: decision.sanction,
//         decision_notes: decision.compte_rendu,
//       };
//       await axios.post(
//         `http://127.0.0.1:8000/discipline/cases/${c.id}/decision`,
//         payload
//       );
//       setShowDecisionModal(null);
//       fetchCases();
//       alert("✅ Décision enregistrée");
//     } catch (err) {
//       console.error(err);
//       alert("Erreur lors de la sauvegarde de la décision");
//     }
//   };

//   return (
//     <div className="discipline-page">
//       <h1>Gestion Disciplinaire</h1>
//       <button onClick={() => setShowCreateForm(!showCreateForm)}>
//         {showCreateForm ? "Annuler création" : "Créer un dossier disciplinaire"}
//       </button>

//       {message && <p className="status-message">{message}</p>}

//       {showCreateForm && (
//         <form onSubmit={handleCreateCase} className="create-discipline-form">
//           <label>Employé:</label>
//           <input
//             type="text"
//             placeholder="Sélectionner employé"
//             value={
//               selectedEmployee
//                 ? `${selectedEmployee.nom} ${selectedEmployee.prenom}`
//                 : ""
//             }
//             onChange={handleEmployeeInput}
//             required
//           />
//           {filteredEmployees.length > 0 && (
//             <ul className="autocomplete-list">
//               {filteredEmployees.map((emp) => (
//                 <li
//                   key={emp.id}
//                   onClick={() => handleSelectEmployee(emp)}
//                   className="autocomplete-item"
//                 >
//                   {emp.nom} {emp.prenom}
//                 </li>
//               ))}
//             </ul>
//           )}

//           <label>Type de faute:</label>
//           <input
//             type="text"
//             name="fault_type"
//             value={newCase.fault_type}
//             onChange={handleNewCaseChange}
//             placeholder="Ex: Vol, Retard..."
//             required
//           />

//           <label>Description:</label>
//           <textarea
//             name="description"
//             value={newCase.description}
//             onChange={handleNewCaseChange}
//             required
//           />
//           <label>Joindre fichiers:</label>
//           <input type="file" multiple onChange={handleFileChange} />
//           <button type="submit">💾 Créer le dossier</button>
//         </form>
//       )}

//       <h2>Cas en cours</h2>
//       <table>
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Employé</th>
//             <th>Type de faute</th>
//             <th>Status</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {cases.map((c) => (
//             <tr key={c.id}>
//               <td>{c.id}</td>
//               <td>{c.employee_name || "—"}</td>
//               <td>{c.fault_type || "—"}</td>
//               <td>{c.status || "En cours"}</td>
//               <td>
//                 <button onClick={() => handleVoir(c)}>Voir</button>
//                 <button onClick={() => setShowConvocationModal(c)}>
//                   Convocation
//                 </button>
//                 <button onClick={() => handleDecision(c)}>Décision</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {showVoirModal && (
//         <div className="modal">
//           <h3>Détails du dossier #{showVoirModal.id}</h3>
//           <p>Employé: {showVoirModal.employee_name || "—"}</p>
//           <p>Type de faute: {showVoirModal.fault_type || "—"}</p>
//           <p>Description: {showVoirModal.description}</p>
//           <p>Status: {showVoirModal.status || "En cours"}</p>
//           <p>Compte-rendu: {showVoirModal.compte_rendu || "—"}</p>
//           <p>Fichiers:</p>
//           <ul>
//             {showVoirModal.files?.map((f, i) => (
//               <li key={i}>
//                 <a href={f.filepath} target="_blank">
//                   {f.filename}
//                 </a>
//               </li>
//             ))}
//           </ul>
//           <button onClick={() => setShowVoirModal(null)}>Fermer</button>
//         </div>
//       )}

//       {showConvocationModal && (
//         <div className="modal">
//           <h3>Convocation dossier #{showConvocationModal.id}</h3>
//           <label>Date convocation:</label>
//           <input type="date" id="dateConv" />
//           <label>Heure convocation:</label>
//           <input type="time" id="heureConv" />

//           <button
//             onClick={() =>
//               exportDisciplinePDF(
//                 showConvocationModal,
//                 document.getElementById("dateConv").value,
//                 document.getElementById("heureConv").value
//               )
//             }
//             className="btn-pdf"
//           >
//             📄 Exporter PDF
//           </button>

//           <button
//             onClick={() =>
//               sendDisciplineMail(
//                 showConvocationModal,
//                 document.getElementById("dateConv").value,
//                 document.getElementById("heureConv").value
//               )
//             }
//             className="btn-mail"
//           >
//             📧 Envoyer par mail
//           </button>

//           <button onClick={() => setShowConvocationModal(null)}>
//             Fermer
//           </button>
//         </div>
//       )}

//       {showDecisionModal && (
//         <div className="modal decision-form">
//           <h3>Décision pour dossier #{showDecisionModal.id}</h3>
//           <label>Compte-rendu:</label>
//           <textarea
//             value={decision.compte_rendu}
//             onChange={(e) =>
//               setDecision({ ...decision, compte_rendu: e.target.value })
//             }
//           />
//           <label>Sanction:</label>
//           <select
//             value={decision.sanction}
//             onChange={(e) =>
//               setDecision({ ...decision, sanction: e.target.value })
//             }
//           >
//             <option value="">Sélectionner sanction</option>
//             <option value="Avertissement">Avertissement</option>
//             <option value="Mise à pied">Mise à pied</option>
//             <option value="Licenciement">Licenciement</option>
//           </select>
//           <button onClick={() => submitDecision(showDecisionModal)}>
//             💾 Enregistrer
//           </button>
//           <button onClick={() => setShowDecisionModal(null)}>Annuler</button>
//         </div>
//       )}
//     </div>
//   );
// }













import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Discipline.css";

export default function Discipline() {
  const [cases, setCases] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showVoirModal, setShowVoirModal] = useState(null);
  const [showDecisionModal, setShowDecisionModal] = useState(null);
  const [showConvocationModal, setShowConvocationModal] = useState(null);

  const [newCase, setNewCase] = useState({
    employee_id: "",
    fault_type: "",
    description: "",
  });
  const [files, setFiles] = useState([]);
  const [decision, setDecision] = useState({
    compte_rendu: "",
    sanction: "",
  });
  const [message, setMessage] = useState([]);

  // --- FETCH CASES ET EMPLOYES ---
  const fetchCases = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/discipline/cases");
      setCases(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/discipline/employees");
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCases();
    fetchEmployees();
  }, []);

  // --- AUTOCOMPLETE EMPLOYE ---
  const handleEmployeeInput = (e) => {
    const query = e.target.value.toLowerCase();
    setFilteredEmployees(
      employees.filter(
        (emp) =>
          emp.nom.toLowerCase().includes(query) ||
          emp.prenom.toLowerCase().includes(query)
      )
    );
  };

  const handleSelectEmployee = (emp) => {
    setSelectedEmployee(emp);
    setNewCase({ ...newCase, employee_id: emp.id });
    setFilteredEmployees([]);
  };

  const handleNewCaseChange = (e) =>
    setNewCase({ ...newCase, [e.target.name]: e.target.value });

  const handleFileChange = (e) => setFiles([...e.target.files]);

  // --- CREATE CASE ---
  const handleCreateCase = async (e) => {
    e.preventDefault();
    if (!newCase.employee_id) return alert("Sélectionner un employé");
    setMessage("⏳ Création du dossier...");
    try {
      const formData = new FormData();
      formData.append("employee_id", newCase.employee_id);
      formData.append("fault_type", newCase.fault_type);
      formData.append("description", newCase.description);
      files.forEach((file) => formData.append("files", file));

      await axios.post("http://127.0.0.1:8000/discipline/cases", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("✅ Dossier créé !");
      setShowCreateForm(false);
      setNewCase({ employee_id: "", fault_type: "", description: "" });
      setFiles([]);
      setSelectedEmployee(null);
      fetchCases();
    } catch (err) {
      console.error(err);
      setMessage("❌ Erreur lors de la création.");
    }
  };

  // --- HANDLE VOIR AVEC FETCH DETAILED CASE ---
  const handleVoir = async (c) => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/discipline/cases/${c.id}`
      );
      setShowVoirModal(res.data); // Ity miverina miaraka amin'ny compte_rendu
    } catch (err) {
      console.error(err);
      alert("Erreur lors du chargement du dossier");
    }
  };

  // --- EXPORT PDF DISCIPLINE ---
  const exportDisciplinePDF = async (c, dateConv = "", heureConv = "") => {
    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/discipline/cases/${c.id}/convocation-discipline`,
        { date_convocation: dateConv, heure_convocation: heureConv },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `discipline_${c.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      alert("Erreur : PDF non disponible");
    }
  };

  // --- ENVOI MAIL DISCIPLINE ---
  const sendDisciplineMail = async (c, dateConv = "", heureConv = "") => {
    try {
      await axios.post(
        `http://127.0.0.1:8000/discipline/cases/${c.id}/send-convocation-discipline-mail`,
        { date_convocation: dateConv, heure_convocation: heureConv }
      );
      alert("📧 Mail envoyé avec succès !");
      setShowConvocationModal(null);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'envoi de l'email");
    }
  };

  // --- DECISION ---
  const handleDecision = (c) => {
    setShowDecisionModal(c);
    setDecision({ compte_rendu: "", sanction: "" });
  };

  const submitDecision = async (c) => {
    if (!decision.sanction) return alert("Sélectionner une sanction");
    try {
      const payload = {
        decision_type: decision.sanction,
        decision_notes: decision.compte_rendu,
      };
      await axios.post(
        `http://127.0.0.1:8000/discipline/cases/${c.id}/decision`,
        payload
      );
      setShowDecisionModal(null);
      fetchCases();
      alert("✅ Décision enregistrée");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la sauvegarde de la décision");
    }
  };

  return (
    <div className="discipline-page">
      <h1>Gestion Disciplinaire</h1>

      <button onClick={() => setShowCreateForm(!showCreateForm)}>
        {showCreateForm ? "Annuler création" : "Créer un dossier disciplinaire"}
      </button>

      {message && <p className="status-message">{message}</p>}

      {showCreateForm && (
        <form onSubmit={handleCreateCase} className="create-discipline-form">
          <label>Employé:</label>
          <input
            type="text"
            placeholder="Sélectionner employé"
            value={
              selectedEmployee
                ? `${selectedEmployee.nom} ${selectedEmployee.prenom}`
                : ""
            }
            onChange={handleEmployeeInput}
            required
          />
          {filteredEmployees.length > 0 && (
            <ul className="autocomplete-list">
              {filteredEmployees.map((emp) => (
                <li
                  key={emp.id}
                  onClick={() => handleSelectEmployee(emp)}
                  className="autocomplete-item"
                >
                  {emp.nom} {emp.prenom}
                </li>
              ))}
            </ul>
          )}

          <label>Type de faute:</label>
          <input
            type="text"
            name="fault_type"
            value={newCase.fault_type}
            onChange={handleNewCaseChange}
            placeholder="Ex: Vol, Retard..."
            required
          />

          <label>Description:</label>
          <textarea
            name="description"
            value={newCase.description}
            onChange={handleNewCaseChange}
            required
          />
          <label>Joindre fichiers:</label>
          <input type="file" multiple onChange={handleFileChange} />
          <button type="submit">💾 Créer le dossier</button>
        </form>
      )}

      <h2>Cas en cours</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Employé</th>
            <th>Type de faute</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cases.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.employee_name || "—"}</td>
              <td>{c.fault_type || "—"}</td>
              <td>{c.status || "En cours"}</td>
              <td>
                <button onClick={() => handleVoir(c)}>Voir</button>
                <button onClick={() => setShowConvocationModal(c)}>
                  Convocation
                </button>
                <button onClick={() => handleDecision(c)}>Décision</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showVoirModal && (
        <div className="modal">
          <h3>Détails du dossier #{showVoirModal.id}</h3>
          <p>Employé: {showVoirModal.employee_name || "—"}</p>
          <p>Type de faute: {showVoirModal.fault_type || "—"}</p>
          <p>Description: {showVoirModal.description}</p>
          <p>Status: {showVoirModal.status || "En cours"}</p>
          <p>Compte-rendu: {showVoirModal.compte_rendu || "—"}</p>
          <p>Fichiers:</p>
          <ul>
            {showVoirModal.files?.map((f, i) => (
              <li key={i}>
                <a href={f.filepath} target="_blank">
                  {f.filename}
                </a>
              </li>
            ))}
          </ul>
          <button onClick={() => setShowVoirModal(null)}>Fermer</button>
        </div>
      )}

      {showConvocationModal && (
        <div className="modal">
          <h3>Convocation dossier #{showConvocationModal.id}</h3>
          <label>Date convocation:</label>
          <input type="date" id="dateConv" />
          <label>Heure convocation:</label>
          <input type="time" id="heureConv" />

          <button
            onClick={() =>
              exportDisciplinePDF(
                showConvocationModal,
                document.getElementById("dateConv").value,
                document.getElementById("heureConv").value
              )
            }
            className="btn-pdf"
          >
            📄 Exporter PDF
          </button>

          <button
            onClick={() =>
              sendDisciplineMail(
                showConvocationModal,
                document.getElementById("dateConv").value,
                document.getElementById("heureConv").value
              )
            }
            className="btn-mail"
          >
            📧 Envoyer par mail
          </button>

          <button onClick={() => setShowConvocationModal(null)}>
            Fermer
          </button>
        </div>
      )}

      {showDecisionModal && (
        <div className="modal decision-form">
          <h3>Décision pour dossier #{showDecisionModal.id}</h3>
          <label>Compte-rendu:</label>
          <textarea
            value={decision.compte_rendu}
            onChange={(e) =>
              setDecision({ ...decision, compte_rendu: e.target.value })
            }
          />
          <label>Sanction:</label>
          <select
            value={decision.sanction}
            onChange={(e) =>
              setDecision({ ...decision, sanction: e.target.value })
            }
          >
            <option value="">Sélectionner sanction</option>
            <option value="Avertissement">Avertissement</option>
            <option value="Mise à pied">Mise à pied</option>
            <option value="Licenciement">Licenciement</option>
          </select>
          <button onClick={() => submitDecision(showDecisionModal)}>
            💾 Enregistrer
          </button>
          <button onClick={() => setShowDecisionModal(null)}>Annuler</button>
        </div>
      )}
    </div>
  );
}








