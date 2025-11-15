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

//   const fetchData = async () => {
//     try {
//       const [empRes, contRes, paieRes, contExpRes] = await Promise.all([
//         axios.get("http://127.0.0.1:8000/api/rapports/employes"),
//         axios.get("http://127.0.0.1:8000/api/rapports/contrats"),
//         axios.get("http://127.0.0.1:8000/api/paies/"),
//         axios.get("http://127.0.0.1:8000/api/rapports/contrats/expirés"),
//       ]);

//       setEmployes(empRes.data?.employes || []);
//       setContrats(contRes.data?.contrats || []);
//       setPaies(paieRes.data?.paie || []);
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

//   const filteredEmployes = employes.filter((e) =>
//     ["fullname", "email", "poste"].some(
//       (key) => e[key]?.toLowerCase().includes(globalFilter.toLowerCase())
//     )
//   );

//   const filteredContrats = contrats.filter((c) =>
//     ["Employé", "Type"].some((key) => c[key]?.toLowerCase().includes(globalFilter.toLowerCase()))
//   );

//   const filteredPaies = paies.filter((p) =>
//     ["Employé"].some((key) => p[key]?.toLowerCase().includes(globalFilter.toLowerCase()))
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

//       {/* Barre de recherche globale */}
//       <div className="rapports-filters">
//         <input
//           type="text"
//           placeholder="Rechercher..."
//           value={globalFilter}
//           onChange={(e) => setGlobalFilter(e.target.value)}
//         />
//       </div>

//       {/* Export buttons */}
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
//         <section>
//           <h2>Employés</h2>
//           <div className="overflow-x-auto">
//             <table>
//               <thead>
//                 <tr>
//                   {["ID", "Nom complet", "Email", "Poste"].map((h) => <th key={h}>{h}</th>)}
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredEmployes.map((e) => (
//                   <tr key={e.id}>
//                     <td>{e.id}</td>
//                     <td>{e.fullname}</td>
//                     <td>{e.email}</td>
//                     <td>{e.poste}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </section>

//         <section>
//           <h2>Contrats</h2>
//           <div className="overflow-x-auto">
//             <table>
//               <thead>
//                 <tr>
//                   {["ID", "Employé", "Type", "Date début", "Date fin", "Salaire"].map((h) => <th key={h}>{h}</th>)}
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredContrats.map((c) => (
//                   <tr key={c.ID}>
//                     <td>{c.ID}</td>
//                     <td>{c.Employé}</td>
//                     <td>{c.Type}</td>
//                     <td>{c["Date début"]}</td>
//                     <td>{c["Date fin"]}</td>
//                     <td>{c.Salaire}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </section>

//         <section>
//           <h2>Paie</h2>
//           <div className="overflow-x-auto">
//             <table>
//               <thead>
//                 <tr>
//                   {["ID", "Employé", "Date de paie", "Salaire de base", "Primes", "Déduction", "Salaire net"].map(
//                     (h) => <th key={h}>{h}</th>
//                   )}
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredPaies.map((p) => (
//                   <tr key={p.ID}>
//                     <td>{p.ID}</td>
//                     <td>{p.Employé}</td>
//                     <td>{p["Date de paie"]}</td>
//                     <td>{p["Salaire de base"]}</td>
//                     <td>{p.Primes}</td>
//                     <td>{p.Déduction}</td>
//                     <td>{p["Salaire net"]}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
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
  const [exportDropdown, setExportDropdown] = useState({ employes: false, contrats: false, paie: false });

  // NEW : states pour cacher/afficher tableaux
  const [showEmployes, setShowEmployes] = useState(false);
  const [showContrats, setShowContrats] = useState(false);
  const [showPaies, setShowPaies] = useState(false);

  const fetchData = async () => {
    try {
      const [empRes, contRes, paieRes, contExpRes] = await Promise.all([
        axios.get("http://127.0.0.1:8000/api/rapports/employes"),
        axios.get("http://127.0.0.1:8000/api/rapports/contrats"),
        axios.get("http://127.0.0.1:8000/api/paies/"),
        axios.get("http://127.0.0.1:8000/api/rapports/contrats/expirés"),
      ]);

      setEmployes(empRes.data?.employes || []);
      setContrats(contRes.data?.contrats || []);
      setPaies(paieRes.data?.paie || []);
      setContratsExpired(contExpRes.data?.contrats_expirés || []);
    } catch (error) {
      console.error("Erreur fetch rapports:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDownload = async (endpoint, format) => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/rapports/${endpoint}`, {
        responseType: "blob",
        params: { export: format },
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `rapport_${endpoint}.${format === "excel" ? "xlsx" : "pdf"}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Erreur téléchargement:", error);
    }
  };

  const filteredEmployes = employes.filter((e) =>
    ["fullname", "email", "poste"].some(
      (key) => e[key]?.toLowerCase().includes(globalFilter.toLowerCase())
    )
  );

  const filteredContrats = contrats.filter((c) =>
    ["Employé", "Type"].some((key) => c[key]?.toLowerCase().includes(globalFilter.toLowerCase()))
  );

  const filteredPaies = paies.filter((p) =>
    ["Employé"].some((key) => p[key]?.toLowerCase().includes(globalFilter.toLowerCase()))
  );

  const toggleDropdown = (key) => {
    setExportDropdown({ ...exportDropdown, [key]: !exportDropdown[key] });
  };

  return (
    <div className="rapports-container">

      {/* Résumé */}
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

      {/* Barre de recherche */}
      <div className="search-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Rechercher..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
      </div>

      {/* Export buttons */}
      <div className="rapports-download">
        {["employes", "contrats", "paie"].map((item) => (
          <div key={item} className="export-wrapper">
            <button onClick={() => toggleDropdown(item)}>
              {item.charAt(0).toUpperCase() + item.slice(1)} <MoreVertical size={16} />
            </button>
            {exportDropdown[item] && (
              <div className="export-dropdown">
                <div className="dropdown-item" onClick={() => handleDownload(item, "excel")}>Excel</div>
                <div className="dropdown-item" onClick={() => handleDownload(item, "pdf")}>PDF</div>
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
            Employés
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
                  <tr>{["ID", "Nom complet", "Email", "Poste"].map((h) => <th key={h}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {filteredEmployes.map((e) => (
                    <tr key={e.id}>
                      <td>{e.id}</td>
                      <td>{e.fullname}</td>
                      <td>{e.email}</td>
                      <td>{e.poste}</td>
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
            Contrats
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
                  <tr>{["ID", "Employé", "Type", "Date début", "Date fin", "Salaire"].map((h) => <th key={h}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {filteredContrats.map((c) => (
                    <tr key={c.ID}>
                      <td>{c.ID}</td>
                      <td>{c.Employé}</td>
                      <td>{c.Type}</td>
                      <td>{c["Date début"]}</td>
                      <td>{c["Date fin"]}</td>
                      <td>{c.Salaire}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* PAIE */}
        <section>
          <h2>
            Paie
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
                    {["ID", "Employé", "Date de paie", "Salaire de base", "Primes", "Déduction", "Salaire net"].map(
                      (h) => <th key={h}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {filteredPaies.map((p) => (
                    <tr key={p.ID}>
                      <td>{p.ID}</td>
                      <td>{p.Employé}</td>
                      <td>{p["Date de paie"]}</td>
                      <td>{p["Salaire de base"]}</td>
                      <td>{p.Primes}</td>
                      <td>{p.Déduction}</td>
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
