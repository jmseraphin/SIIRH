// import React, { useEffect, useState } from "react";
// import { Users, CheckCircle, Clock, Home } from "lucide-react";
// import { ClipboardList } from "lucide-react";
// import "./RHDashboard.css";

// const RHDashboard = () => {
//   const [candidatures, setCandidatures] = useState([]);
//   const [entretiens, setEntretiens] = useState([]);
//   const [filtered, setFiltered] = useState([]);
//   const [view, setView] = useState("overview");
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [posteSearch, setPosteSearch] = useState("");
//   const [rangeInput, setRangeInput] = useState("");

//   // ------------------ FETCH CANDIDATURES ------------------
//   const fetchCandidatures = async () => {
//     try {
//       const res = await fetch("http://127.0.0.1:8000/rh/candidatures");
//       if (!res.ok) throw new Error("Erreur de chargement");
//       const data = await res.json();
//       const sorted = data.sort((a, b) => b.score_total - a.score_total);
//       setCandidatures(sorted);
//       setFiltered(sorted);
//       setLoading(false);
//     } catch (err) {
//       console.error("Erreur:", err);
//       setLoading(false);
//     }
//   };

//   // ------------------ FETCH ENTRETIENS ------------------
//   const fetchEntretiens = async () => {
//     try {
//       const res = await fetch("http://127.0.0.1:8000/api/entretiens");
//       if (!res.ok) throw new Error("Erreur chargement entretiens");
//       const data = await res.json();
//       setEntretiens(data);
//     } catch (err) {
//       console.error("Erreur fetch entretiens:", err);
//     }
//   };

//   useEffect(() => {
//     fetchCandidatures();
//     fetchEntretiens();
//   }, []);

//   // ------------------ UTILITAIRES ------------------
//   const updateStatutLocal = (id, newStatut, dateConvocation = null, heureConvocation = null) => {
//     setCandidatures((prev) =>
//       prev.map((c) =>
//         c.id === id
//           ? { ...c, statut: newStatut, date_convocation: dateConvocation || c.date_convocation, heure_convocation: heureConvocation || c.heure_convocation }
//           : c
//       )
//     );
//     setFiltered((prev) =>
//       prev.map((c) =>
//         c.id === id
//           ? { ...c, statut: newStatut, date_convocation: dateConvocation || c.date_convocation, heure_convocation: heureConvocation || c.heure_convocation }
//           : c
//       )
//     );
//   };

//   const handleSelect = async (id) => {
//     try {
//       const res = await fetch(`http://127.0.0.1:8000/rh/candidatures/${id}/select`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//       });
//       if (res.ok) updateStatutLocal(id, "Sélectionné");
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleDeselectRange = () => {
//     let [start, end] = rangeInput.split("-").map((n) => parseInt(n.trim(), 10));
//     if (!end) end = start;
//     if (!start || !end || start > end) return alert("Format invalide (ex: 1-100 ou 7)");

//     const selectionnes = filtered.filter(c => c.statut === "Sélectionné");
//     const toDeselect = selectionnes.slice(start - 1, end);

//     for (const c of toDeselect) updateStatutLocal(c.id, "Désélectionné");
//     alert(`Les candidats du rang ${start} à ${end} ont été désélectionnés.`);
//   };

//   const handleSendConvocation = async (id) => {
//     try {
//       const res = await fetch(
//         `http://127.0.0.1:8000/rh/candidatures/${id}/send-invitation`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//         }
//       );
//       if (res.ok) {
//         const data = await res.json();
//         updateStatutLocal(id, "Convoqué", data.date_entretien, data.heure_entretien);
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // ------------------ NOUVEAU : Ajouter Employee ------------------
//   const handleAddEmployee = async (id) => {
//     try {
//       const res = await fetch(
//         `http://127.0.0.1:8000/api/employes/from-candidature/${id}`, // ✅ URL mifanaraka amin'ny backend
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//         }
//       );
//       if (res.ok) {
//         alert("Candidat ajouté comme Employee !");
//         updateStatutLocal(id, "Employé");
//       } else {
//         alert("Erreur lors de l'ajout comme Employee.");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Erreur réseau lors de l'ajout comme Employee.");
//     }
//   };
//   // --------------------------------------------------------------

//   // ------------------ FILTRAGE ------------------
//   const handleFilter = (type) => {
//     setView(type);
//     if (type === "total") setFiltered(candidatures);
//     else if (type === "selectionnee")
//       setFiltered(candidatures.filter(c => c.statut === "Sélectionné" && c.statut !== "Convoqué"));
//     else if (type === "attente")
//       setFiltered(candidatures.filter((c) => c.statut === "En attente"));
//     else if (type === "convoque")
//       setFiltered(candidatures.filter((c) => c.statut === "Convoqué"));
//     else if (type === "fait_entretien") {
//       const merged = candidatures.map(c => {
//         const e = entretiens.find(en => parseInt(en.cand_id) === c.id);
//         if (e) {
//           const totalScore = Math.round(
//             (e.tech_score + e.soft_score + e.cult_score + e.lang_score + e.disp_score + e.sal_score) / 6
//           );
//           return {
//             ...c,
//             decision: e.decision,
//             score_total: totalScore,
//             raw_scores: `${e.tech_score}/${5} ${e.soft_score}/${5} ${e.cult_score}/${5} ${e.lang_score}/${5} ${e.disp_score}/${5} ${e.sal_score}/${5}`,
//             statut: "Entretien terminé",
//           };
//         }
//         return null;
//       }).filter(Boolean);

//       merged.sort((a, b) => b.score_total - a.score_total);
//       setFiltered(merged);
//     }
//   };

//   const handleSearch = (e) => {
//     const term = e.target.value.toLowerCase();
//     setSearchTerm(term);
//     if (!term.trim()) handleFilter(view);
//     else
//       setFiltered((prev) =>
//         prev.filter(
//           (c) =>
//             c.nom?.toLowerCase().includes(term) ||
//             c.prenom?.toLowerCase().includes(term) ||
//             c.poste?.toLowerCase().includes(term)
//         )
//       );
//   };

//   const handlePosteSearch = (e) => {
//     const term = e.target.value.toLowerCase();
//     setPosteSearch(term);
//     if (!term.trim()) handleFilter(view);
//     else
//       setFiltered((prev) =>
//         prev.filter((c) => c.poste?.toLowerCase().includes(term))
//       );
//   };

//   const handleAutoSelectRange = async () => {
//     let [start, end] = rangeInput.split("-").map((n) => parseInt(n.trim(), 10));
//     if (!end) end = start;
//     if (!start || !end || start > end) return alert("Format invalide (ex: 1-100 ou 7)");

//     const selectionnes = filtered.filter(c => c.statut === "Sélectionné");
//     const toSelect = selectionnes.slice(start - 1, end);

//     for (const c of toSelect) await handleSelect(c.id);
//     alert(`Les candidats du rang ${start} à ${end} ont été sélectionnés.`);
//   };

//   const titreTableau = {
//     total: "Toutes les candidatures",
//     selectionnee: "Candidats sélectionnés",
//     attente: "Candidats en attente",
//     convoque: "Candidats convoqués",
//     fait_entretien: "Candidats ayant terminé l’entretien",
//   };

//   const countEntretienTermine = candidatures.filter(c => {
//     const e = entretiens.find(en => parseInt(en.cand_id) === c.id);
//     return !!e;
//   }).length;

//   // ------------------ RENDER ------------------
//   return (
//     <div className="dashboard-wrapper">
//       <div className="dashboard-header">
//         <h1 className="dashboard-title">
//           <Home className="dashboard-title-icon" />
//           Tableau de bord RH
//         </h1>
//         <div className="dashboard-search">
//           <input
//             type="text"
//             value={searchTerm}
//             onChange={handleSearch}
//             placeholder="Rechercher un candidat ou un poste..."
//           />
//         </div>
//       </div>

//       {view === "overview" && (
//         <div className="dashboard-cards">
//           {[
//             { id: "total", icon: <Users size={28} color="#1E90FF" />, label: "Candidatures totales", value: candidatures.length, color: "#1E90FF" },
//             { id: "selectionnee", icon: <CheckCircle size={28} color="#28a745" />, label: "Sélectionnées", value: candidatures.filter((c) => c.statut === "Sélectionné").length, color: "#28a745" },
//             { id: "convoque", icon: <Clock size={28} color="#17a2b8" />, label: "Candidats convoqués", value: candidatures.filter((c) => c.statut === "Convoqué").length, color: "#17a2b8" },
//             { id: "attente", icon: <Clock size={28} color="#ffc107" />, label: "En attente", value: candidatures.filter((c) => c.statut === "En attente").length, color: "#ffc107" },
//             { id: "fait_entretien", icon: <ClipboardList size={28} color="#6f42c1" />, label: "Listes des entretiens", value: countEntretienTermine, color: "#6f42c1" },
//           ].map((item) => (
//             <div key={item.id} className="dashboard-card" onClick={() => handleFilter(item.id)} style={{ borderTop: `4px solid ${item.color}` }}>
//               <div className="card-icon" style={{ backgroundColor: `${item.color}20` }}>{item.icon}</div>
//               <div className="card-value">{item.value}</div>
//               <div className="card-label">{item.label}</div>
//             </div>
//           ))}
//         </div>
//       )}

//       {view !== "overview" && (
//         <div className="mt-10">
//           <button onClick={() => setView("overview")} className="back-btn mb-5">
//             ⬅️ Retour à la Vue d’ensemble
//           </button>

//           <h2 className="text-xl font-bold text-green-700 mb-4">{titreTableau[view]}</h2>

//           {(view === "selectionnee" || view === "fait_entretien") && (
//             <div style={{ marginBottom: "10px" }}>
//               <input
//                 type="text"
//                 value={posteSearch}
//                 onChange={handlePosteSearch}
//                 placeholder="Filtrer par poste"
//                 style={{
//                   padding: "5px 8px",
//                   borderRadius: "6px",
//                   border: "1px solid #ccc",
//                   width: "180px",
//                   fontSize: "13px",
//                 }}
//               />
//             </div>
//           )}

//           {loading ? (
//             <p className="text-center text-gray-600">Chargement...</p>
//           ) : (
//             <div className="liste-entretien-container">
//               <table className="entretien-table">
//                 <thead>
//                   <tr>
//                     {view === "convoque" && <th></th>}
//                     <th>ID</th>
//                     <th>Rang</th>
//                     <th>Nom</th>
//                     <th>Prénom</th>
//                     <th>Poste</th>
//                     <th>Date / Heure</th>
//                     <th>Score</th>
//                     <th>Décision</th>
//                     {(view === "total" || view === "selectionnee") && <th>Action</th>}
//                     {view === "fait_entretien" && <th>Action</th>}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filtered.map((c, index) => (
//                     <tr key={c.id}>
//                       {view === "convoque" && <td><input type="checkbox" /></td>}
//                       <td>{c.id}</td>
//                       <td>{index + 1}</td>
//                       <td>{c.nom}</td>
//                       <td>{c.prenom}</td>
//                       <td>{c.poste}</td>
//                       <td>{c.date ? new Date(c.date).toLocaleDateString() : "—"}</td>
//                       <td>{view === "fait_entretien" ? `${c.score_total}/5` : c.score_total}</td>
//                       <td className={`decision ${c.statut === "Sélectionné" ? "go" : c.statut === "Convoqué" ? "blue" : c.statut === "Désélectionné" ? "danger" : "hold"}`}>
//                         {c.decision || c.statut}
//                       </td>

//                       {(view === "total" || view === "selectionnee") && (
//                         <td>
//                           {view === "selectionnee" ? (
//                             <button onClick={() => handleSendConvocation(c.id)} className="mini-btn blue">
//                               Envoyer convocation
//                             </button>
//                           ) : (
//                             <div>
//                               {index === 0 ? (
//                                 <input type="text" placeholder="Filtrer par poste" value={posteSearch} onChange={handlePosteSearch} className="mini-input" />
//                               ) : index === 1 ? (
//                                 <input type="text" placeholder="1-100" value={rangeInput} onChange={(e)=>setRangeInput(e.target.value)} className="mini-input" />
//                               ) : index === 2 ? (
//                                 <button onClick={handleAutoSelectRange} className="mini-btn success">Sélectionner par rang</button>
//                               ) : index === 3 ? (
//                                 <button onClick={handleDeselectRange} className="mini-btn danger" style={{width:"160px"}}>Désélectionner</button>
//                               ) : "-"}
//                             </div>
//                           )}
//                         </td>
//                       )}

//                       {view === "fait_entretien" && (
//                         <td>
//                           <button
//                             onClick={() => handleAddEmployee(c.id)}
//                             className="mini-btn employee"
//                             style={{ backgroundColor:"#1E90FF", color:"#fff" }}
//                           >
//                             Employee
//                           </button>
//                         </td>
//                       )}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default RHDashboard;













// import React, { useEffect, useState } from "react";
// import { Users, CheckCircle, Clock, Home } from "lucide-react";
// import { ClipboardList } from "lucide-react";
// import "./RHDashboard.css";

// const RHDashboard = () => {
//   const [candidatures, setCandidatures] = useState([]);
//   const [entretiens, setEntretiens] = useState([]);
//   const [filtered, setFiltered] = useState([]);
//   const [view, setView] = useState("overview");
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [posteSearch, setPosteSearch] = useState("");
//   const [rangeInput, setRangeInput] = useState("");
//   const [employees, setEmployees] = useState([]);

//   // ------------------ FETCH ------------------
//   const fetchCandidatures = async () => {
//     try {
//       const res = await fetch("http://127.0.0.1:8000/rh/candidatures");
//       if (!res.ok) throw new Error("Erreur de chargement");
//       const data = await res.json();
//       const sorted = data.sort((a, b) => b.score_total - a.score_total);
//       setCandidatures(sorted);
//       setFiltered(sorted);
//       setLoading(false);
//     } catch (err) {
//       console.error("Erreur:", err);
//       setLoading(false);
//     }
//   };

//   const fetchEntretiens = async () => {
//     try {
//       const res = await fetch("http://127.0.0.1:8000/api/entretiens");
//       if (!res.ok) throw new Error("Erreur chargement entretiens");
//       const data = await res.json();
//       setEntretiens(data);
//     } catch (err) {
//       console.error("Erreur fetch entretiens:", err);
//     }
//   };

//   const fetchEmployees = async () => {
//     try {
//       const res = await fetch("http://127.0.0.1:8000/api/employes/");
//       if (!res.ok) throw new Error("Erreur chargement employés");
//       const data = await res.json();
//       setEmployees(data);
//     } catch (err) {
//       console.error("Erreur fetch employés:", err);
//     }
//   };

//   useEffect(() => {
//     fetchCandidatures();
//     fetchEntretiens();
//     fetchEmployees();
//   }, []);

//   // ------------------ UTILITAIRES ------------------
//   const updateStatutLocal = (id, newStatut, dateConvocation = null, heureConvocation = null) => {
//     setCandidatures((prev) =>
//       prev.map((c) =>
//         c.id === id
//           ? { ...c, statut: newStatut, date_convocation: dateConvocation || c.date_convocation, heure_convocation: heureConvocation || c.heure_convocation }
//           : c
//       )
//     );
//     setFiltered((prev) =>
//       prev.map((c) =>
//         c.id === id
//           ? { ...c, statut: newStatut, date_convocation: dateConvocation || c.date_convocation, heure_convocation: heureConvocation || c.heure_convocation }
//           : c
//       )
//     );
//   };

//   const handleSelect = async (id) => {
//     try {
//       const res = await fetch(`http://127.0.0.1:8000/rh/candidatures/${id}/select`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//       });
//       if (res.ok) updateStatutLocal(id, "Sélectionné");
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleDeselectRange = () => {
//     let [start, end] = rangeInput.split("-").map((n) => parseInt(n.trim(), 10));
//     if (!end) end = start;
//     if (!start || !end || start > end) return alert("Format invalide (ex: 1-100 ou 7)");
//     const selectionnes = filtered.filter(c => c.statut === "Sélectionné");
//     const toDeselect = selectionnes.slice(start - 1, end);
//     for (const c of toDeselect) updateStatutLocal(c.id, "Désélectionné");
//     alert(`Les candidats du rang ${start} à ${end} ont été désélectionnés.`);
//   };

//   const handleSendConvocation = async (id) => {
//     try {
//       const res = await fetch(`http://127.0.0.1:8000/rh/candidatures/${id}/send-invitation`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//       });
//       if (res.ok) {
//         const data = await res.json();
//         updateStatutLocal(id, "Convoqué", data.date_entretien, data.heure_entretien);
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleAddEmployee = async (id) => {
//     try {
//       const res = await fetch(`http://127.0.0.1:8000/api/employes/from-candidature/${id}`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//       });
//       if (res.ok) {
//         updateStatutLocal(id, "Employé");
//         fetchEmployees();
//         alert("Candidat ajouté comme Employee !");
//       } else alert("Erreur lors de l'ajout comme Employee.");
//     } catch (err) {
//       console.error(err);
//       alert("Erreur réseau lors de l'ajout comme Employee.");
//     }
//   };

//   // ------------------ FILTRAGE ------------------
//   const handleFilter = (type) => {
//     setView(type);
//     if (type === "total") setFiltered(candidatures);
//     else if (type === "selectionnee") setFiltered(candidatures.filter(c => c.statut === "Sélectionné" && c.statut !== "Convoqué"));
//     else if (type === "attente") setFiltered(candidatures.filter(c => c.statut === "En attente"));
//     else if (type === "convoque") setFiltered(candidatures.filter(c => c.statut === "Convoqué"));
//     else if (type === "fait_entretien") {
//       const merged = candidatures.map(c => {
//         const e = entretiens.find(en => parseInt(en.cand_id) === c.id);
//         if (e) {
//           const totalScore = Math.round((e.tech_score + e.soft_score + e.cult_score + e.lang_score + e.disp_score + e.sal_score)/6);
//           return { ...c, decision: e.decision, score_total: totalScore, raw_scores: `${e.tech_score}/${5} ${e.soft_score}/${5} ${e.cult_score}/${5} ${e.lang_score}/${5} ${e.disp_score}/${5} ${e.sal_score}/${5}`, statut:"Entretien terminé"};
//         }
//         return null;
//       }).filter(Boolean);
//       merged.sort((a,b)=>b.score_total - a.score_total);
//       setFiltered(merged);
//     } else if (type === "employees") {
//       setFiltered(employees);
//     }
//   };

//   const handleSearch = (e) => {
//     const term = e.target.value.toLowerCase();
//     setSearchTerm(term);
//     if (!term.trim()) handleFilter(view);
//     else setFiltered(prev => prev.filter(c => c.nom?.toLowerCase().includes(term) || c.prenom?.toLowerCase().includes(term) || c.poste?.toLowerCase().includes(term)));
//   };

//   const handlePosteSearch = (e) => {
//     const term = e.target.value.toLowerCase();
//     setPosteSearch(term);
//     if (!term.trim()) handleFilter(view);
//     else setFiltered(prev => prev.filter(c => c.poste?.toLowerCase().includes(term)));
//   };

//   const handleAutoSelectRange = async () => {
//     let [start, end] = rangeInput.split("-").map(n => parseInt(n.trim(), 10));
//     if (!end) end = start;
//     if (!start || !end || start > end) return alert("Format invalide (ex: 1-100 ou 7)");
//     const selectionnes = filtered.filter(c => c.statut === "Sélectionné");
//     const toSelect = selectionnes.slice(start-1,end);
//     for(const c of toSelect) await handleSelect(c.id);
//     alert(`Les candidats du rang ${start} à ${end} ont été sélectionnés.`);
//   };

//   const titreTableau = {
//     total: "Toutes les candidatures",
//     selectionnee: "Candidats sélectionnés",
//     attente: "Candidats en attente",
//     convoque: "Candidats convoqués",
//     fait_entretien: "Candidats ayant terminé l’entretien",
//     employees: "Liste des Employés",
//   };

//   const countEntretienTermine = candidatures.filter(c => entretiens.find(en => parseInt(en.cand_id) === c.id)).length;

//   // ------------------ RENDER ------------------
//   return (
//     <div className="dashboard-wrapper">
//       <div className="dashboard-header">
//         <h1 className="dashboard-title">
//           <Home className="dashboard-title-icon" />
//           Tableau de bord RH
//         </h1>
//         <div className="dashboard-search">
//           <input type="text" value={searchTerm} onChange={handleSearch} placeholder="Rechercher un candidat ou un poste..." />
//         </div>
//       </div>

//       {view==="overview" && (
//         <div className="dashboard-cards">
//           {[
//             { id:"total", icon:<Users size={28} color="#1E90FF"/>, label:"Candidatures totales", value:candidatures.length, color:"#1E90FF" },
//             { id:"selectionnee", icon:<CheckCircle size={28} color="#28a745"/>, label:"Sélectionnées", value:candidatures.filter(c=>c.statut==="Sélectionné").length, color:"#28a745" },
//             { id:"convoque", icon:<Clock size={28} color="#17a2b8"/>, label:"Candidats convoqués", value:candidatures.filter(c=>c.statut==="Convoqué").length, color:"#17a2b8" },
//             { id:"attente", icon:<Clock size={28} color="#ffc107"/>, label:"En attente", value:candidatures.filter(c=>c.statut==="En attente").length, color:"#ffc107" },
//             { id:"fait_entretien", icon:<ClipboardList size={28} color="#6f42c1"/>, label:"Listes des entretiens", value:countEntretienTermine, color:"#6f42c1" },
//             { id:"employees", icon:<Users size={28} color="#FF4500"/>, label:"Employés", value:employees.length, color:"#FF4500" }
//           ].map(item=>(
//             <div key={item.id} className="dashboard-card" onClick={()=>handleFilter(item.id)} style={{borderTop:`4px solid ${item.color}`}}>
//               <div className="card-icon" style={{backgroundColor:`${item.color}20`}}>{item.icon}</div>
//               <div className="card-value">{item.value}</div>
//               <div className="card-label">{item.label}</div>
//             </div>
//           ))}
//         </div>
//       )}

//       {view!=="overview" && (
//         <div className="mt-10">
//           <button onClick={()=>setView("overview")} className="back-btn mb-5">⬅️ Retour à la Vue d’ensemble</button>
//           <h2 className="text-xl font-bold text-green-700 mb-4">{titreTableau[view]}</h2>

//           {(view==="selectionnee" || view==="fait_entretien" || view==="employees") && (
//             <div style={{marginBottom:"10px"}}>
//               <input type="text" value={posteSearch} onChange={handlePosteSearch} placeholder="Filtrer par poste" style={{padding:"5px 8px", borderRadius:"6px", border:"1px solid #ccc", width:"180px", fontSize:"13px"}} />
//             </div>
//           )}

//           {loading ? <p className="text-center text-gray-600">Chargement...</p> :
//             <div className="liste-entretien-container">
//               <table className="entretien-table">
//                 <thead>
//                   <tr>
//                     {view==="convoque" && <th></th>}
//                     <th>ID</th>
//                     <th>Rang</th>
//                     <th>Nom</th>
//                     <th>Prénom</th>
//                     <th>Poste</th>
//                     {view==="employees" && <><th>Email</th><th>Tél</th></>}
//                     {view!=="employees" && <th>Date / Heure</th>}
//                     {view!=="employees" && <th>Score</th>}
//                     {view!=="employees" && <th>Décision</th>}
//                     {(view==="total" || view==="selectionnee") && <th>Action</th>}
//                     {view==="fait_entretien" && <th>Action</th>}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {(view==="employees" ? employees : filtered).map((c,index)=>(
//                     <tr key={c.id}>
//                       {view==="convoque" && <td><input type="checkbox" /></td>}
//                       <td>{c.id}</td>
//                       <td>{index+1}</td>
//                       <td>{c.nom}</td>
//                       <td>{c.prenom}</td>
//                       <td>{c.poste}</td>
//                       {view==="employees" && <><td>{c.email||"—"}</td><td>{c.tel||"—"}</td></>}
//                       {view!=="employees" && <td>{c.date ? new Date(c.date).toLocaleDateString() : "—"}</td>}
//                       {view!=="employees" && <td>{view==="fait_entretien" ? `${c.score_total}/5` : c.score_total}</td>}
//                       {view!=="employees" && <td className={`decision ${c.statut==="Sélectionné"?"go":c.statut==="Convoqué"?"blue":c.statut==="Désélectionné"?"danger":"hold"}`}>{c.decision||c.statut}</td>}

//                       {(view==="total" || view==="selectionnee") && (
//                         <td>
//                           {view==="selectionnee" ? (
//                             <button onClick={()=>handleSendConvocation(c.id)} className="mini-btn blue">Envoyer convocation</button>
//                           ) : (
//                             <div>
//                               {index===0 ? (<input type="text" placeholder="Filtrer par poste" value={posteSearch} onChange={handlePosteSearch} className="mini-input" />) :
//                                index===1 ? (<input type="text" placeholder="1-100" value={rangeInput} onChange={(e)=>setRangeInput(e.target.value)} className="mini-input" />) :
//                                index===2 ? (<button onClick={handleAutoSelectRange} className="mini-btn success">Sélectionner par rang</button>) :
//                                index===3 ? (<button onClick={handleDeselectRange} className="mini-btn danger" style={{width:"160px"}}>Désélectionner</button>) :
//                                "-"}
//                             </div>
//                           )}
//                         </td>
//                       )}

//                       {view==="fait_entretien" && (
//                         <td>
//                           <button onClick={()=>handleAddEmployee(c.id)} className="mini-btn employee" style={{backgroundColor:"#1E90FF", color:"#fff"}}>Employee</button>
//                         </td>
//                       )}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           }
//         </div>
//       )}
//     </div>
//   );
// };

// export default RHDashboard;

























import React, { useEffect, useState } from "react";
import { Users, CheckCircle, Clock, Home } from "lucide-react";
import { ClipboardList } from "lucide-react";
import "./RHDashboard.css";

const RHDashboard = () => {
  const [candidatures, setCandidatures] = useState([]);
  const [entretiens, setEntretiens] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [view, setView] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [posteSearch, setPosteSearch] = useState("");
  const [rangeInput, setRangeInput] = useState("");
  const [employees, setEmployees] = useState([]);
  const [employeeStatus, setEmployeeStatus] = useState({}); // <-- vaovao: tracking status

  // ------------------ FETCH ------------------
  const fetchCandidatures = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/rh/candidatures");
      if (!res.ok) throw new Error("Erreur de chargement");
      const data = await res.json();
      const sorted = data.sort((a, b) => b.score_total - a.score_total);
      setCandidatures(sorted);
      setFiltered(sorted);
      setLoading(false);
    } catch (err) {
      console.error("Erreur:", err);
      setLoading(false);
    }
  };

  const fetchEntretiens = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/entretiens");
      if (!res.ok) throw new Error("Erreur chargement entretiens");
      const data = await res.json();
      setEntretiens(data);
    } catch (err) {
      console.error("Erreur fetch entretiens:", err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/employes/");
      if (!res.ok) throw new Error("Erreur chargement employés");
      const data = await res.json();
      setEmployees(data);

      // mise à jour employeeStatus pour boutons
      const statusMap = {};
      data.forEach(emp => {
        if (emp.candidature_id) statusMap[emp.candidature_id] = true;
      });
      setEmployeeStatus(statusMap);
    } catch (err) {
      console.error("Erreur fetch employés:", err);
    }
  };

  useEffect(() => {
    fetchCandidatures();
    fetchEntretiens();
    fetchEmployees();
  }, []);

  // ------------------ UTILITAIRES ------------------
  const updateStatutLocal = (id, newStatut, dateConvocation = null, heureConvocation = null) => {
    setCandidatures((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, statut: newStatut, date_convocation: dateConvocation || c.date_convocation, heure_convocation: heureConvocation || c.heure_convocation }
          : c
      )
    );
    setFiltered((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, statut: newStatut, date_convocation: dateConvocation || c.date_convocation, heure_convocation: heureConvocation || c.heure_convocation }
          : c
      )
    );
  };

  const handleSelect = async (id) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/rh/candidatures/${id}/select`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) updateStatutLocal(id, "Sélectionné");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeselectRange = () => {
    let [start, end] = rangeInput.split("-").map((n) => parseInt(n.trim(), 10));
    if (!end) end = start;
    if (!start || !end || start > end) return alert("Format invalide (ex: 1-100 ou 7)");
    const selectionnes = filtered.filter(c => c.statut === "Sélectionné");
    const toDeselect = selectionnes.slice(start - 1, end);
    for (const c of toDeselect) updateStatutLocal(c.id, "Désélectionné");
    alert(`Les candidats du rang ${start} à ${end} ont été désélectionnés.`);
  };

  const handleSendConvocation = async (id) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/rh/candidatures/${id}/send-invitation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        updateStatutLocal(id, "Convoqué", data.date_entretien, data.heure_entretien);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddEmployee = async (id) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/employes/from-candidature/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        updateStatutLocal(id, "Employé");
        setEmployeeStatus(prev => ({ ...prev, [id]: true })); // <-- mise à jour bouton
        fetchEmployees();
      } else alert("Erreur lors de l'ajout comme Employee.");
    } catch (err) {
      console.error(err);
      alert("Erreur réseau lors de l'ajout comme Employee.");
    }
  };

  // ------------------ FILTRAGE ------------------
  const handleFilter = (type) => {
    setView(type);
    if (type === "total") setFiltered(candidatures);
    else if (type === "selectionnee") setFiltered(candidatures.filter(c => c.statut === "Sélectionné" && c.statut !== "Convoqué"));
    else if (type === "attente") setFiltered(candidatures.filter(c => c.statut === "En attente"));
    else if (type === "convoque") setFiltered(candidatures.filter(c => c.statut === "Convoqué"));
    else if (type === "fait_entretien") {
      const merged = candidatures.map(c => {
        const e = entretiens.find(en => parseInt(en.cand_id) === c.id);
        if (e) {
          const totalScore = Math.round((e.tech_score + e.soft_score + e.cult_score + e.lang_score + e.disp_score + e.sal_score)/6);
          return { ...c, decision: e.decision, score_total: totalScore, raw_scores: `${e.tech_score}/${5} ${e.soft_score}/${5} ${e.cult_score}/${5} ${e.lang_score}/${5} ${e.disp_score}/${5} ${e.sal_score}/${5}`, statut:"Entretien terminé"};
        }
        return null;
      }).filter(Boolean);
      merged.sort((a,b)=>b.score_total - a.score_total);
      setFiltered(merged);
    } else if (type === "employees") {
      setFiltered(employees);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    if (!term.trim()) handleFilter(view);
    else setFiltered(prev => prev.filter(c => c.nom?.toLowerCase().includes(term) || c.prenom?.toLowerCase().includes(term) || c.poste?.toLowerCase().includes(term)));
  };

  const handlePosteSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setPosteSearch(term);
    if (!term.trim()) handleFilter(view);
    else setFiltered(prev => prev.filter(c => c.poste?.toLowerCase().includes(term)));
  };

  const handleAutoSelectRange = async () => {
    let [start, end] = rangeInput.split("-").map(n => parseInt(n.trim(), 10));
    if (!end) end = start;
    if (!start || !end || start > end) return alert("Format invalide (ex: 1-100 ou 7)");
    const selectionnes = filtered.filter(c => c.statut === "Sélectionné");
    const toSelect = selectionnes.slice(start-1,end);
    for(const c of toSelect) await handleSelect(c.id);
    alert(`Les candidats du rang ${start} à ${end} ont été sélectionnés.`);
  };

  const titreTableau = {
    total: "Toutes les candidatures",
    selectionnee: "Candidats sélectionnés",
    attente: "Candidats en attente",
    convoque: "Candidats convoqués",
    fait_entretien: "Candidats ayant terminé l’entretien",
    employees: "Liste des Employés",
  };

  const countEntretienTermine = candidatures.filter(c => entretiens.find(en => parseInt(en.cand_id) === c.id)).length;

  // ------------------ RENDER ------------------
  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          <Home className="dashboard-title-icon" />
          Tableau de bord RH
        </h1>
        <div className="dashboard-search">
          <input type="text" value={searchTerm} onChange={handleSearch} placeholder="Rechercher un candidat ou un poste..." />
        </div>
      </div>

      {view==="overview" && (
        <div className="dashboard-cards">
          {[
            { id:"total", icon:<Users size={28} color="#1E90FF"/>, label:"Candidatures totales", value:candidatures.length, color:"#1E90FF" },
            { id:"selectionnee", icon:<CheckCircle size={28} color="#28a745"/>, label:"Sélectionnées", value:candidatures.filter(c=>c.statut==="Sélectionné").length, color:"#28a745" },
            { id:"convoque", icon:<Clock size={28} color="#17a2b8"/>, label:"Candidats convoqués", value:candidatures.filter(c=>c.statut==="Convoqué").length, color:"#17a2b8" },
            { id:"attente", icon:<Clock size={28} color="#ffc107"/>, label:"En attente", value:candidatures.filter(c=>c.statut==="En attente").length, color:"#ffc107" },
            { id:"fait_entretien", icon:<ClipboardList size={28} color="#6f42c1"/>, label:"Listes des entretiens", value:countEntretienTermine, color:"#6f42c1" },
            { id:"employees", icon:<Users size={28} color="#FF4500"/>, label:"Employés", value:employees.length, color:"#FF4500" }
          ].map(item=>(
            <div key={item.id} className="dashboard-card" onClick={()=>handleFilter(item.id)} style={{borderTop:`4px solid ${item.color}`}}>
              <div className="card-icon" style={{backgroundColor:`${item.color}20`}}>{item.icon}</div>
              <div className="card-value">{item.value}</div>
              <div className="card-label">{item.label}</div>
            </div>
          ))}
        </div>
      )}

      {view!=="overview" && (
        <div className="mt-10">
          <button onClick={()=>setView("overview")} className="back-btn mb-5">⬅️ Retour à la Vue d’ensemble</button>
          <h2 className="text-xl font-bold text-green-700 mb-4">{titreTableau[view]}</h2>

          {(view==="selectionnee" || view==="fait_entretien" || view==="employees") && (
            <div style={{marginBottom:"10px"}}>
              <input type="text" value={posteSearch} onChange={handlePosteSearch} placeholder="Filtrer par poste" style={{padding:"5px 8px", borderRadius:"6px", border:"1px solid #ccc", width:"180px", fontSize:"13px"}} />
            </div>
          )}

          {loading ? <p className="text-center text-gray-600">Chargement...</p> :
            <div className="liste-entretien-container">
              <table className="entretien-table">
                <thead>
                  <tr>
                    {view==="convoque" && <th></th>}
                    <th>ID</th>
                    <th>Rang</th>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Poste</th>
                    {view==="employees" && <><th>Email</th><th>Tél</th></>}
                    {view!=="employees" && <th>Date / Heure</th>}
                    {view!=="employees" && <th>Score</th>}
                    {view!=="employees" && <th>Décision</th>}
                    {(view==="total" || view==="selectionnee") && <th>Action</th>}
                    {view==="fait_entretien" && <th>Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {(view==="employees" ? employees : filtered).map((c,index)=>(
                    <tr key={c.id}>
                      {view==="convoque" && <td><input type="checkbox" /></td>}
                      <td>{c.id}</td>
                      <td>{index+1}</td>
                      <td>{c.nom}</td>
                      <td>{c.prenom}</td>
                      <td>{c.poste}</td>
                      {view==="employees" && <><td>{c.email||"—"}</td><td>{c.tel||"—"}</td></>}
                      {view!=="employees" && <td>{c.date ? new Date(c.date).toLocaleDateString() : "—"}</td>}
                      {view!=="employees" && <td>{view==="fait_entretien" ? `${c.score_total}/5` : c.score_total}</td>}
                      {view!=="employees" && <td className={`decision ${c.statut==="Sélectionné"?"go":c.statut==="Convoqué"?"blue":c.statut==="Désélectionné"?"danger":"hold"}`}>{c.decision||c.statut}</td>}

                      {(view==="total" || view==="selectionnee") && (
                        <td>
                          {view==="selectionnee" ? (
                            <button onClick={()=>handleSendConvocation(c.id)} className="mini-btn blue">Envoyer convocation</button>
                          ) : (
                            <div>
                              {index===0 ? (<input type="text" placeholder="Filtrer par poste" value={posteSearch} onChange={handlePosteSearch} className="mini-input" />) :
                               index===1 ? (<input type="text" placeholder="1-100" value={rangeInput} onChange={(e)=>setRangeInput(e.target.value)} className="mini-input" />) :
                               index===2 ? (<button onClick={handleAutoSelectRange} className="mini-btn success">Sélectionner par rang</button>) :
                               index===3 ? (<button onClick={handleDeselectRange} className="mini-btn danger" style={{width:"160px"}}>Désélectionner</button>) :
                               "-"}
                            </div>
                          )}
                        </td>
                      )}

                      {view==="fait_entretien" && (
                        <td>
                          <button 
                            onClick={()=>handleAddEmployee(c.id)} 
                            className="mini-btn employee" 
                            style={{
                              backgroundColor: employeeStatus[c.id] ? "#28a745" : "#1E90FF",
                              color:"#fff",
                              cursor: employeeStatus[c.id] ? "not-allowed" : "pointer"
                            }}
                            disabled={employeeStatus[c.id]}
                          >
                            {employeeStatus[c.id] ? "Déjà employé" : "Employee"}
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          }
        </div>
      )}
    </div>
  );
};

export default RHDashboard;
