// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { FileText, Users, DollarSign, AlertCircle, MoreVertical } from "lucide-react";
// import "./Rapports.css";

// export default function Rapports() {
//   const [employes, setEmployes] = useState([]);
//   const [contrats, setContrats] = useState([]);
//   const [paies, setPaies] = useState([]);
//   const [contratsExpired, setContratsExpired] = useState([]);

//   const [globalFilter, setGlobalFilter] = useState("");
//   const [exportDropdown, setExportDropdown] = useState({ employes: false, contrats: false, paie: false });

//   const [showEmployes, setShowEmployes] = useState(false);
//   const [showContrats, setShowContrats] = useState(false);
//   const [showPaies, setShowPaies] = useState(false);

//   // ✅ Fonction pour afficher le mois/année
//   const formatMoisAnnee = (mois, annee) => {
//     const moisNames = [
//       "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
//       "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
//     ];
//     return mois && annee ? `${moisNames[mois - 1]} ${annee}` : "";
//   };

//   const fetchData = async () => {
//     try {
//       const [empRes, contRes, paieRes, contExpRes] = await Promise.all([
//         axios.get("http://127.0.0.1:8000/api/employes/"),
//         axios.get("http://127.0.0.1:8000/api/rapports/contrats"),
//         axios.get("http://127.0.0.1:8000/api/paies/"),
//         axios.get("http://127.0.0.1:8000/api/rapports/contrats/expirés"),
//       ]);

//       setEmployes(empRes.data || []);
//       setContrats(contRes.data?.contrats || []);
//       setPaies(paieRes.data || []); 
//       setContratsExpired(contExpRes.data?.contrats_expirés || []);
//     } catch (error) {
//       console.error("Erreur fetch rapports:", error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleDownload = async (endpoint, format) => {
//     try {
//       const res = await axios.get(`http://127.0.0.1:8000/api/rapports/${endpoint}`, {
//         responseType: "blob",
//         params: { export: format },
//       });
//       const url = window.URL.createObjectURL(new Blob([res.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", `rapport_${endpoint}.${format === "excel" ? "xlsx" : "pdf"}`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (error) {
//       console.error("Erreur téléchargement:", error);
//     }
//   };

//   const filteredEmployes = employes.filter((e) =>
//     [e.nom + " " + e.prenom, e.email, e.poste]
//       .some((v) => v?.toLowerCase().includes(globalFilter.toLowerCase()))
//   );

//   const filteredContrats = contrats.filter((c) =>
//     ["Employé", "Type"].some(
//       (key) => c[key]?.toLowerCase().includes(globalFilter.toLowerCase())
//     )
//   );

//   const filteredPaies = paies.filter((p) =>
//     ["employee"].some(
//       (key) => p.employee?.fullname?.toLowerCase().includes(globalFilter.toLowerCase())
//     )
//   );

//   const toggleDropdown = (key) => {
//     setExportDropdown({ ...exportDropdown, [key]: !exportDropdown[key] });
//   };

//   return (
//     <div className="rapports-container">

//       {/* Résumé */}
//       <div className="rapports-summary">
//         <div className="card blue">
//           <Users size={32} />
//           <div>
//             <p>Employés</p>
//             <h3>{employes.length}</h3>
//           </div>
//         </div>
//         <div className="card green">
//           <DollarSign size={32} />
//           <div>
//             <p>Paie</p>
//             <h3>{paies.length}</h3>
//           </div>
//         </div>
//         <div className="card red">
//           <AlertCircle size={32} />
//           <div>
//             <p>Contrats expirés</p>
//             <h3>{contratsExpired.length}</h3>
//           </div>
//         </div>
//         <div className="card yellow">
//           <FileText size={32} />
//           <div>
//             <p>Contrats actifs</p>
//             <h3>{contrats.length}</h3>
//           </div>
//         </div>
//       </div>

//       {/* Recherche */}
//       <div className="search-wrapper">
//         <span className="search-icon">🔍</span>
//         <input
//           type="text"
//           placeholder="Rechercher..."
//           value={globalFilter}
//           onChange={(e) => setGlobalFilter(e.target.value)}
//         />
//       </div>

//       {/* Export */}
//       <div className="rapports-download">
//         {["employes", "contrats", "paie"].map((item) => (
//           <div key={item} className="export-wrapper">
//             <button onClick={() => toggleDropdown(item)}>
//               {item.charAt(0).toUpperCase() + item.slice(1)} <MoreVertical size={16} />
//             </button>
//             {exportDropdown[item] && (
//               <div className="export-dropdown">
//                 <div className="dropdown-item" onClick={() => handleDownload(item, "excel")}>Excel</div>
//                 <div className="dropdown-item" onClick={() => handleDownload(item, "pdf")}>PDF</div>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Tables */}
//       <div className="rapports-tables">

//         {/* EMPLOYES */}
//         <section>
//           <h2>
//             Employés
//             <button className="toggle-btn" onClick={() => setShowEmployes(!showEmployes)}>
//               {showEmployes ? "Cacher" : "Afficher"}
//             </button>
//           </h2>

//           {showEmployes && (
//             <div className="overflow-x-auto">
//               <table>
//                 <thead>
//                   <tr><th>ID</th><th>Nom complet</th><th>Email</th><th>Poste</th></tr>
//                 </thead>
//                 <tbody>
//                   {filteredEmployes.map((e) => (
//                     <tr key={e.id}>
//                       <td>{e.id}</td>
//                       <td>{e.nom} {e.prenom}</td>
//                       <td>{e.email}</td>
//                       <td>{e.poste}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </section>

//         {/* CONTRATS */}
//         <section>
//           <h2>
//             Contrats
//             <button className="toggle-btn" onClick={() => setShowContrats(!showContrats)}>
//               {showContrats ? "Cacher" : "Afficher"}
//             </button>
//           </h2>

//           {showContrats && (
//             <div className="overflow-x-auto">
//               <table>
//                 <thead>
//                   <tr>{["ID", "Employé", "Type", "Date début", "Date fin", "Salaire"].map((h) => <th key={h}>{h}</th>)}</tr>
//                 </thead>
//                 <tbody>
//                   {filteredContrats.map((c) => (
//                     <tr key={c.ID}>
//                       <td>{c.ID}</td>
//                       <td>{c.Employé}</td>
//                       <td>{c.Type}</td>
//                       <td>{c["Date début"]}</td>
//                       <td>{c["Date fin"]}</td>
//                       <td>{c.Salaire}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </section>

//         {/* PAIE */}
//         <section>
//           <h2>
//             Paie
//             <button className="toggle-btn" onClick={() => setShowPaies(!showPaies)}>
//               {showPaies ? "Cacher" : "Afficher"}
//             </button>
//           </h2>

//           {showPaies && (
//             <div className="overflow-x-auto">
//               <table>
//                 <thead>
//                   <tr>
//                     {["ID", "Employé", "Mois / Année", "Salaire de base", "Primes", "Déductions", "Salaire net"].map((h) => (
//                       <th key={h}>{h}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredPaies.map((p) => (
//                     <tr key={p.id}>
//                       <td>{p.id}</td>
//                       <td>{p.employee?.fullname}</td>
//                       <td>{p.mois} {p.annee}</td>
//                       <td>{p.salaire_base}</td>
//                       <td>{p.primes}</td>
//                       <td>{p.deductions}</td>
//                       <td>{p.salaire_net}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </section>

//       </div>
//     </div>
//   );
// }























import React, { useEffect, useState } from "react";
import axios from "axios";
import { FileText, Users, DollarSign, AlertCircle, MoreVertical } from "lucide-react";
import "./Rapports.css";

export default function Rapports() {
  const [employes, setEmployes] = useState([]);
  const [contrats, setContrats] = useState([]);
  const [paies, setPaies] = useState([]);
  const [contratsExpired, setContratsExpired] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [exportDropdown, setExportDropdown] = useState({ employes: false, contrats: false, paies: false });
  const [showEmployes, setShowEmployes] = useState(false);
  const [showContrats, setShowContrats] = useState(false);
  const [showPaies, setShowPaies] = useState(false);

  // ------------------ Fetch data ------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, contRes, paieRes, contExpRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/rapports/employes"),
          axios.get("http://127.0.0.1:8000/api/rapports/contrats"),
          axios.get("http://127.0.0.1:8000/api/rapports/paies"),
          axios.get("http://127.0.0.1:8000/api/rapports/contrats/expirés"),
        ]);

        setEmployes(empRes.data.employes || []);
        setContrats(contRes.data.contrats || []);
        setPaies(paieRes.data.paies || []);
        setContratsExpired(contExpRes.data.contrats_expirés || []);
      } catch (error) {
        console.error("Erreur fetch rapports:", error);
      }
    };
    fetchData();
  }, []);

  // ------------------ Download export ------------------
  const handleDownload = async (endpoint, format) => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/rapports/${endpoint}`, {
        responseType: "blob",
        params: { export: format },
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `rapport_${endpoint}.${format === "excel" ? "xlsx" : "pdf"}`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Erreur téléchargement:", error);
    }
  };

  const toggleDropdown = (key) => {
    setExportDropdown({ ...exportDropdown, [key]: !exportDropdown[key] });
  };

  // ------------------ Filtered data ------------------
  const filteredEmployes = employes.filter(
    (e) =>
      (e["Nom complet"] || "").toLowerCase().includes(globalFilter.toLowerCase()) ||
      (e["Email"] || "").toLowerCase().includes(globalFilter.toLowerCase()) ||
      (e["Poste"] || "").toLowerCase().includes(globalFilter.toLowerCase())
  );

  const filteredContrats = contrats.filter(
    (c) =>
      (c.Employé || "").toLowerCase().includes(globalFilter.toLowerCase()) ||
      (c.Type || "").toLowerCase().includes(globalFilter.toLowerCase()) ||
      (c.Poste || "").toLowerCase().includes(globalFilter.toLowerCase())
  );

  const filteredPaies = paies.filter((p) =>
    (p.Employé || "").toLowerCase().includes(globalFilter.toLowerCase())
  );

  // ------------------ Render ------------------
  return (
    <div className="rapports-container">
      {/* Résumé cards */}
      <div className="rapports-summary">
        <div className="card blue">
          <Users size={32} />
          <div>
            <p>Employés</p>
            <h3>{employes.length}</h3>
          </div>
        </div>
        <div className="card green">
          <DollarSign size={32} />
          <div>
            <p>Paie</p>
            <h3>{paies.length}</h3>
          </div>
        </div>
        <div className="card red">
          <AlertCircle size={32} />
          <div>
            <p>Contrats expirés</p>
            <h3>{contratsExpired.length}</h3>
          </div>
        </div>
        <div className="card yellow">
          <FileText size={32} />
          <div>
            <p>Contrats actifs</p>
            <h3>{contrats.length}</h3>
          </div>
        </div>
      </div>

      {/* Recherche */}
      <div className="search-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Rechercher..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
      </div>

      {/* Export */}
      <div className="rapports-download">
        {["employes", "contrats", "paies"].map((item) => (
          <div key={item} className="export-wrapper">
            <button onClick={() => toggleDropdown(item)}>
              {item.charAt(0).toUpperCase() + item.slice(1)}{" "}
              <MoreVertical size={16} />
            </button>
            {exportDropdown[item] && (
              <div className="export-dropdown">
                <div
                  className="dropdown-item"
                  onClick={() => handleDownload(item, "excel")}
                >
                  Excel
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => handleDownload(item, "pdf")}
                >
                  PDF
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Tables */}
      <div className="rapports-tables">
        {/* EMPLOYES */}
        <section>
          <h2>
            Employés{" "}
            <button
              className="toggle-btn"
              onClick={() => setShowEmployes(!showEmployes)}
            >
              {showEmployes ? "Cacher" : "Afficher"}
            </button>
          </h2>
          {showEmployes && (
            <div className="overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    {[
                      "ID",
                      "Nom complet",
                      "Email",
                      "Poste",
                      "Solde congés",
                      "Date solde update",
                    ].map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployes.map((e) => (
                    <tr key={e.ID}>
                      <td>{e.ID}</td>
                      <td>{e["Nom complet"]}</td>
                      <td>{e["Email"]}</td>
                      <td>{e["Poste"]}</td>
                      <td>{e["Solde congés"]}</td>
                      <td>{e["Date solde update"]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* CONTRATS */}
        <section>
          <h2>
            Contrats{" "}
            <button
              className="toggle-btn"
              onClick={() => setShowContrats(!showContrats)}
            >
              {showContrats ? "Cacher" : "Afficher"}
            </button>
          </h2>
          {showContrats && (
            <div className="overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    {[
                      "ID",
                      "Employé",
                      "Type",
                      "Date début",
                      "Date fin",
                      "Salaire",
                      "Poste",
                      "Période",
                      "Avantages",
                      "Clauses",
                      "Type travail",
                      "Préavis",
                      "Indemnités",
                    ].map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredContrats.map((c) => (
                    <tr key={c.ID}>
                      <td>{c.ID}</td>
                      <td>{c.Employé || (c.employee?.fullname || "—")}</td>
                      <td>{c.Type}</td>
                      <td>{c["Date début"]}</td>
                      <td>{c["Date fin"]}</td>
                      <td>{c.Salaire}</td>
                      <td>{c.Poste}</td>
                      <td>{c.Période}</td>
                      <td>{c.Avantages}</td>
                      <td>{c.Clauses}</td>
                      <td>{c["Type travail"]}</td>
                      <td>{c.Préavis}</td>
                      <td>{c.Indemnités}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* PAIES */}
        <section>
          <h2>
            Paies{" "}
            <button
              className="toggle-btn"
              onClick={() => setShowPaies(!showPaies)}
            >
              {showPaies ? "Cacher" : "Afficher"}
            </button>
          </h2>
          {showPaies && (
            <div className="overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    {[
                      "ID",
                      "Employé",
                      "Mois / Année",
                      "Salaire de base",
                      "Primes",
                      "Déductions",
                      "Salaire net",
                    ].map((h) => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredPaies.map((p) => (
                    <tr key={p.ID}>
                      <td>{p.ID}</td>
                      <td>{p.Employé}</td>
                      <td>{p["Mois / Année"]}</td>
                      <td>{p["Salaire de base"]}</td>
                      <td>{p.Primes}</td>
                      <td>{p.Déductions}</td>
                      <td>{p["Salaire net"]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}




















// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { FileText, Users, DollarSign, AlertCircle, MoreVertical } from "lucide-react";
// import "./Rapports.css";

// export default function Rapports() {
//   const [employes, setEmployes] = useState([]);
//   const [contrats, setContrats] = useState([]);
//   const [paies, setPaies] = useState([]);
//   const [contratsExpired, setContratsExpired] = useState([]);
//   const [globalFilter, setGlobalFilter] = useState("");
//   const [exportDropdown, setExportDropdown] = useState({ employes: false, contrats: false, paies: false });
//   const [showEmployes, setShowEmployes] = useState(false);
//   const [showContrats, setShowContrats] = useState(false);
//   const [showPaies, setShowPaies] = useState(false);

//   // ------------------ Fetch data ------------------
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [empRes, contRes, paieRes, contExpRes] = await Promise.all([
//           axios.get("http://127.0.0.1:8000/api/rapports/employes"),
//           axios.get("http://127.0.0.1:8000/api/rapports/contrats"),
//           axios.get("http://127.0.0.1:8000/api/rapports/paies"),
//           axios.get("http://127.0.0.1:8000/api/rapports/contrats/expirés"),
//         ]);

//         setEmployes(empRes.data.employes || []);
//         setContrats(contRes.data.contrats || []);
//         setPaies(paieRes.data.paies || []);
//         setContratsExpired(contExpRes.data.contrats_expirés || []);
//       } catch (error) {
//         console.error("Erreur fetch rapports:", error);
//       }
//     };
//     fetchData();
//   }, []);

//   // ------------------ Download export ------------------
//   const handleDownload = async (endpoint, format) => {
//     try {
//       const res = await axios.get(`http://127.0.0.1:8000/api/rapports/${endpoint}`, {
//         responseType: "blob",
//         params: { export: format },
//       });
//       const url = window.URL.createObjectURL(new Blob([res.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute(
//         "download",
//         `rapport_${endpoint}.${format === "excel" ? "xlsx" : "pdf"}`
//       );
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (error) {
//       console.error("Erreur téléchargement:", error);
//     }
//   };

//   const toggleDropdown = (key) => {
//     setExportDropdown({ ...exportDropdown, [key]: !exportDropdown[key] });
//   };

//   // ------------------ Filtered data ------------------
//   const filteredEmployes = employes.filter(
//     (e) =>
//       (e["Nom complet"] || "").toLowerCase().includes(globalFilter.toLowerCase()) ||
//       (e["Email"] || "").toLowerCase().includes(globalFilter.toLowerCase()) ||
//       (e["Poste"] || "").toLowerCase().includes(globalFilter.toLowerCase())
//   );

//   const filteredContrats = contrats.filter(
//     (c) =>
//       (c.Employé || "").toLowerCase().includes(globalFilter.toLowerCase()) ||
//       (c.Type || "").toLowerCase().includes(globalFilter.toLowerCase()) ||
//       (c.Poste || "").toLowerCase().includes(globalFilter.toLowerCase())
//   );

//   const filteredPaies = paies.filter((p) =>
//     (p.Employé || "").toLowerCase().includes(globalFilter.toLowerCase())
//   );

//   // ------------------ Render ------------------
//   return (
//     <div className="rapports-container">

//       {/* Résumé cards */}
//       <div className="rapports-summary">
//         <div className="card blue">
//           <Users size={32} />
//           <div>
//             <p>Employés</p>
//             <h3>{employes.length}</h3>
//           </div>
//         </div>
//         <div className="card green">
//           <DollarSign size={32} />
//           <div>
//             <p>Paie</p>
//             <h3>{paies.length}</h3>
//           </div>
//         </div>
//         <div className="card red">
//           <AlertCircle size={32} />
//           <div>
//             <p>Contrats expirés</p>
//             <h3>{contratsExpired.length}</h3>
//           </div>
//         </div>
//         <div className="card yellow">
//           <FileText size={32} />
//           <div>
//             <p>Contrats actifs</p>
//             <h3>{contrats.length}</h3>
//           </div>
//         </div>
//       </div>

//       {/* Recherche */}
//       <div className="search-wrapper">
//         <span className="search-icon">🔍</span>
//         <input
//           type="text"
//           placeholder="Rechercher..."
//           value={globalFilter}
//           onChange={(e) => setGlobalFilter(e.target.value)}
//         />
//       </div>

//       {/* Header horizontal avec boutons + Export */}
//       <div className="sections-header">
//         {[
//           { key: "employes", label: "Employés", icon: <Users size={24} /> },
//           { key: "contrats", label: "Contrats", icon: <FileText size={24} /> },
//           { key: "paies", label: "Paies", icon: <DollarSign size={24} /> },
//         ].map((section) => {
//           const showState = section.key === "employes" ? showEmployes :
//                             section.key === "contrats" ? showContrats : showPaies;
//           return (
//             <div key={section.key} className="section-header-container">
//               <div className="section-header" onClick={() => {
//                 if (section.key === "employes") setShowEmployes(!showEmployes);
//                 if (section.key === "contrats") setShowContrats(!showContrats);
//                 if (section.key === "paies") setShowPaies(!showPaies);
//               }}>
//                 {section.icon}
//                 <span>{section.label}</span>
//                 <button className="toggle-btn">{showState ? "Cacher" : "Afficher"}</button>
//               </div>

//               {/* Export button */}
//               <div className="export-wrapper">
//                 <button onClick={() => toggleDropdown(section.key)}>
//                   Export <MoreVertical size={16} />
//                 </button>
//                 {exportDropdown[section.key] && (
//                   <div className="export-dropdown">
//                     <div className="dropdown-item" onClick={() => handleDownload(section.key, "excel")}>Excel</div>
//                     <div className="dropdown-item" onClick={() => handleDownload(section.key, "pdf")}>PDF</div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* EMPLOYES */}
//       {showEmployes && (
//         <section className="section-table">
//           <h3 className="table-title">Liste des rapports Employés</h3>
//           <div className="overflow-x-auto">
//             <table>
//               <thead>
//                 <tr>
//                   {["ID","Nom complet","Email","Poste","Solde congés","Date solde update"].map(h=><th key={h}>{h}</th>)}
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredEmployes.map(e => (
//                   <tr key={e.ID}>
//                     <td>{e.ID}</td>
//                     <td>{e["Nom complet"]}</td>
//                     <td>{e["Email"]}</td>
//                     <td>{e["Poste"]}</td>
//                     <td>{e["Solde congés"]}</td>
//                     <td>{e["Date solde update"]}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </section>
//       )}

//       {/* CONTRATS */}
//       {showContrats && (
//         <section className="section-table">
//           <h3 className="table-title">Liste des rapports Contrats</h3>
//           <div className="overflow-x-auto">
//             <table>
//               <thead>
//                 <tr>
//                   {["ID","Employé","Type","Date début","Date fin","Salaire","Poste","Période","Avantages","Clauses","Type travail","Préavis","Indemnités"].map(h=><th key={h}>{h}</th>)}
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredContrats.map(c=>(
//                   <tr key={c.ID}>
//                     <td>{c.ID}</td>
//                     <td>{c.Employé || "—"}</td>
//                     <td>{c.Type}</td>
//                     <td>{c["Date début"]}</td>
//                     <td>{c["Date fin"]}</td>
//                     <td>{c.Salaire}</td>
//                     <td>{c.Poste}</td>
//                     <td>{c.Période}</td>
//                     <td>{c.Avantages}</td>
//                     <td>{c.Clauses}</td>
//                     <td>{c["Type travail"]}</td>
//                     <td>{c.Préavis}</td>
//                     <td>{c.Indemnités}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </section>
//       )}

//       {/* PAIES */}
//       {showPaies && (
//         <section className="section-table">
//           <h3 className="table-title">Liste des rapports Paies</h3>
//           <div className="overflow-x-auto">
//             <table>
//               <thead>
//                 <tr>{["ID","Employé","Mois / Année","Salaire de base","Primes","Déductions","Salaire net"].map(h=><th key={h}>{h}</th>)}</tr>
//               </thead>
//               <tbody>
//                 {filteredPaies.map(p=>(
//                   <tr key={p.ID}>
//                     <td>{p.ID}</td>
//                     <td>{p.Employé}</td>
//                     <td>{p["Mois / Année"]}</td>
//                     <td>{p["Salaire de base"]}</td>
//                     <td>{p.Primes}</td>
//                     <td>{p.Déductions}</td>
//                     <td>{p["Salaire net"]}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </section>
//       )}

//     </div>
//   );
// }




