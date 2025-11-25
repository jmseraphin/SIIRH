import React, { useEffect, useState } from "react";
import api, { API_BASE } from "../api";
import Absences from "../components/Absences";
import Pointages from "../components/Pointages";
import Conges from "../components/Conges";
import Soldes from "../components/Soldes";
import ExportPaie from "../components/ExportPaie";
import "../styles/TempsAbsences.css";


export default function TempsAbsences({ navigateToDashboard }) {
const [tab, setTab] = useState("absences");
const [employees, setEmployees] = useState([]);


// fetch employees once and provide datalist for child components
const fetchEmployees = async () => {
try {
const res = await api.get(`/employes/`);
setEmployees(res.data || []);
} catch (err) {
console.error("Erreur récupération employés :", err);
}
};


useEffect(() => { fetchEmployees(); }, []);


return (
<div className="temps-absences-page">
<div className="header">
<h2>Module Temps & Absences</h2>
<div className="tabs">
<button className={tab === "absences" ? "active" : ""} onClick={() => setTab("absences")}>Absences</button>
<button className={tab === "pointages" ? "active" : ""} onClick={() => setTab("pointages")}>Pointages</button>
<button className={tab === "conges" ? "active" : ""} onClick={() => setTab("conges")}>Congés</button>
<button className={tab === "soldes" ? "active" : ""} onClick={() => setTab("soldes")}>Soldes</button>
<button className={tab === "export" ? "active" : ""} onClick={() => setTab("export")}>Export Paie</button>
</div>
</div>


{/* Shared datalist for employee selection used by child components */}
<datalist id="employees-list">
{employees.map(emp => (
<option key={emp.id} value={emp.id}>{emp.nom} {emp.prenom}</option>
))}
</datalist>


<div className="tab-wrapper">
{tab === "absences" && <Absences employees={employees} />}
{tab === "pointages" && <Pointages employees={employees} />}
{tab === "conges" && <Conges employees={employees} />}
{tab === "soldes" && <Soldes employees={employees} />}
{tab === "export" && <ExportPaie employees={employees} />}
</div>
</div>
);
}

