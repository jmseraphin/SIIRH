import React, { useEffect, useState } from "react";
import { Users, CheckCircle, Clock, Home, FileText } from "lucide-react";
import { ClipboardList } from "lucide-react";
import "./RHDashboard.css";
import axios from "axios";

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
  const [employeeStatus, setEmployeeStatus] = useState({}); 
  const [contrats, setContrats] = useState([]);
  const [showContratForm, setShowContratForm] = useState(false);
  const [contratFormData, setContratFormData] = useState({
    employee_id: "",
    searchEmployee: "",
    filteredEmployees: [],
    type_contrat: "CDI",
    date_debut: "",
    date_fin: "",
    salaire: ""
  });

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

      const statusMap = {};
      data.forEach(emp => {
        if (emp.candidature_id) statusMap[emp.candidature_id] = true;
      });
      setEmployeeStatus(statusMap);
    } catch (err) {
      console.error("Erreur fetch employés:", err);
    }
  };

  const fetchContrats = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/contrats/");
      setContrats(res.data);
    } catch (err) {
      console.error("Erreur fetch contrats:", err);
    }
  };

  useEffect(() => {
    fetchCandidatures();
    fetchEntretiens();
    fetchEmployees();
    fetchContrats();
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
        setEmployeeStatus(prev => ({ ...prev, [id]: true }));
        fetchEmployees();
      } else alert("Erreur lors de l'ajout comme Employee.");
    } catch (err) {
      console.error(err);
      alert("Erreur réseau lors de l'ajout comme Employee.");
    }
  };

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
    } else if (type === "contrats") {
      setFiltered(contrats);
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
    else if(view==="contrats") {
      setFiltered(prev => prev.filter(c => c.poste?.toLowerCase().includes(term)));
    } else {
      setFiltered(prev => prev.filter(c => c.nom?.toLowerCase().includes(term) || c.prenom?.toLowerCase().includes(term) || c.poste?.toLowerCase().includes(term)));
    }
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
    contrats: "Gestion des Contrats",
  };

  const countEntretienTermine = candidatures.filter(c => entretiens.find(en => parseInt(en.cand_id) === c.id)).length;

  // ------------------ Contrat Form Handlers ------------------
  const handleContratFormChange = (e) => {
    setContratFormData({ ...contratFormData, [e.target.name]: e.target.value });
  };

  const handleContratFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/contrats/", contratFormData);
      setContrats([...contrats, res.data]);
      setShowContratForm(false);
      setContratFormData({ employee_id: "", searchEmployee: "", filteredEmployees: [], type_contrat: "CDI", date_debut: "", date_fin: "", salaire: "" });
      setFiltered([...contrats, res.data]);
    } catch (err) {
      console.error("Erreur création contrat:", err);
      alert("Erreur lors de la création du contrat");
    }
  };

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
            { id:"employees", icon:<Users size={28} color="#FF4500"/>, label:"Employés", value:employees.length, color:"#FF4500" },
            { id:"contrats", icon:<FileText size={28} color="#1abc9c"/>, label:"Contrats", value:contrats.length, color:"#1abc9c" }
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

          {(view==="selectionnee" || view==="fait_entretien" || view==="employees" || view==="contrats") && (
            <div style={{marginBottom:"10px"}}>
              <input type="text" value={posteSearch} onChange={handlePosteSearch} placeholder="Filtrer par poste" style={{padding:"5px 8px", borderRadius:"6px", border:"1px solid #6693f3ff", width:"180px", fontSize:"13px"}} />
            </div>
          )}

          {view==="contrats" && (
            <div className="mb-5 flex justify-end">
              <button
                onClick={()=>setShowContratForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                + Créer Contrat
              </button>
            </div>
          )}

          {showContratForm && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
              <div className="bg-white p-6 rounded shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Créer un Contrat</h2>
                <form onSubmit={handleContratFormSubmit} className="space-y-3">
                  <div>
                    <label className="block mb-1">Employé</label>
                    <input
                      type="text"
                      placeholder="Rechercher un employé..."
                      value={contratFormData.searchEmployee}
                      onChange={(e) => {
                        const term = e.target.value.toLowerCase();
                        setContratFormData({
                          ...contratFormData,
                          searchEmployee: e.target.value,
                          filteredEmployees: employees.filter(emp => emp.nom.toLowerCase().includes(term) || emp.prenom.toLowerCase().includes(term))
                        });
                      }}
                      className="w-full border px-2 py-1 rounded mb-1"
                    />
                    <div className="border rounded max-h-32 overflow-y-auto">
                      {(contratFormData.filteredEmployees || employees).map(emp => (
                        <div
                          key={emp.id}
                          className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                          onClick={() => setContratFormData({
                            ...contratFormData,
                            employee_id: emp.id,
                            searchEmployee: emp.nom + " " + emp.prenom,
                            filteredEmployees: []
                          })}
                        >
                          {emp.nom} {emp.prenom}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1">Type de contrat</label>
                    <select
                      name="type_contrat"
                      value={contratFormData.type_contrat}
                      onChange={handleContratFormChange}
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
                      value={contratFormData.date_debut}
                      onChange={handleContratFormChange}
                      required
                      className="w-full border px-2 py-1 rounded"
                    />
                  </div>

                  <div>
                    <label className="block mb-1">Date fin</label>
                    <input
                      type="date"
                      name="date_fin"
                      value={contratFormData.date_fin}
                      onChange={handleContratFormChange}
                      className="w-full border px-2 py-1 rounded"
                    />
                  </div>

                  <div>
                    <label className="block mb-1">Salaire</label>
                    <input
                      type="text"
                      name="salaire"
                      value={contratFormData.salaire}
                      onChange={handleContratFormChange}
                      className="w-full border px-2 py-1 rounded"
                    />
                  </div>

                  <div className="flex justify-end space-x-2 mt-4">
                    <button
                      type="button"
                      onClick={()=>setShowContratForm(false)}
                      className="btn-cancel"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="btn-save"
                    >
                      Enregistrer
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {!loading && (
            <div className="liste-entretien-container">
              <table className="entretien-table">
                <thead>
                  <tr>
                    {view==="contrats" ? (
                      <>
                        <th>ID Contrat</th>
                        <th>Employé (ID)</th>
                        <th>Nom complet</th>
                        <th>Poste</th>
                        <th>Type</th>
                        <th>Date Début</th>
                        <th>Date Fin</th>
                        <th>Salaire</th>
                      </>
                    ) : (
                      <>
                        {view==="convoque" && <th></th>}
                        <th>ID</th>
                        <th>Rang</th>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Poste</th>
                        {view==="employees" && <><th>Email</th><th>Tél</th></>}
                        {view!=="employees" && view!=="contrats" && <><th>Date / Heure</th><th>Score</th><th>Décision</th></>}
                        {(view==="total" || view==="selectionnee") && <th>Action</th>}
                        {view==="fait_entretien" && <th>Action</th>}
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {(view==="contrats" ? contrats.filter(c => posteSearch ? c.poste?.toLowerCase().includes(posteSearch) : true) : view==="employees" ? employees : filtered).map((c,index)=>(
                    <tr key={c.id}>
                      {view==="contrats" ? (
                        <>
                          <td>{c.id}</td>
                          <td>{c.employee_id}</td>
                          <td>{c.nom_complet}</td>
                          <td>{c.poste || "—"}</td>
                          <td>{c.type_contrat}</td>
                          <td>{c.date_debut}</td>
                          <td>{c.date_fin}</td>
                          <td>{c.salaire || "—"}</td>
                        </>
                      ) : (
                        <>
                          {view==="convoque" && <td><input type="checkbox" /></td>}
                          <td>{c.id}</td>
                          <td>{index+1}</td>
                          <td>{c.nom}</td>
                          <td>{c.prenom}</td>
                          <td>{c.poste}</td>
                          {view==="employees" && <><td>{c.email||"—"}</td><td>{c.tel||"—"}</td></>}
                          {view!=="employees" && view!=="contrats" && <td>{c.date ? new Date(c.date).toLocaleDateString() : "—"}</td>}
                          {view!=="employees" && view!=="contrats" && <td>{view==="fait_entretien" ? `${c.score_total}/5` : c.score_total}</td>}
                          {view!=="employees" && view!=="contrats" && <td className={`decision ${c.statut==="Sélectionné"?"go":c.statut==="Convoqué"?"blue":c.statut==="Désélectionné"?"danger":"hold"}`}>{c.decision||c.statut}</td>}

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
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RHDashboard;
