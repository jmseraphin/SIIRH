// import React, { useEffect, useState } from "react";
// import { Outlet } from "react-router-dom";
// import Sidebar from "../components/Sidebar";
// import { FaRobot, FaBell } from "react-icons/fa"; // Icône robot + cloche
// import "./RHDashboardlayout.css";

// const DashboardLayout = () => {
//   const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
//   const [lang, setLang] = useState(localStorage.getItem("lang") || "fr");
//   const [notifications, setNotifications] = useState([]);
//   const [showNotif, setShowNotif] = useState(false);

//   // --- Fanampiana: state de candidats en attente ---
//   const [candidatsAttente, setCandidatsAttente] = useState(0);

//   useEffect(() => {
//     document.body.classList.toggle("dark-mode", darkMode);
//     localStorage.setItem("theme", darkMode ? "dark" : "light");
//   }, [darkMode]);

//   useEffect(() => {
//     localStorage.setItem("lang", lang);
//   }, [lang]);

//   // Fetch notifications (current)
//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
//         const res = await fetch("http://127.0.0.1:8000/rh/notifications");
//         if (res.ok) {
//           const data = await res.json();
//           setNotifications(data);
//         }
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchNotifications();
//   }, []);

//   // --- Fanampiana: Fetch candidats en attente ---
//   useEffect(() => {
//     const fetchCandidatsAttente = async () => {
//       try {
//         const res = await fetch("http://127.0.0.1:8000/rh/candidatures");
//         if (res.ok) {
//           const data = await res.json();
//           const enAttente = data.filter(c => c.statut === "En attente").length;
//           setCandidatsAttente(enAttente);
//         }
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchCandidatsAttente();
//   }, []);

//   const handleLangChange = (e) => setLang(e.target.value);
//   const handleThemeToggle = () => setDarkMode((prev) => !prev);
//   const toggleNotif = () => setShowNotif((prev) => !prev);

//   return (
//     <div className={`main-layout ${darkMode ? "dark" : ""}`}>
//       {/* Sidebar */}
//       <Sidebar />

//       <div className="dashboard-wrapper">
//         {/* Topbar */}
//         <div className="dashboard-topbar">
//           {/* Icône eo amin'ny sisiny havia */}
//           <FaRobot className="dashboard-icon" />

//           {/* Titre afovoany */}
//           <h1 className="dashboard-title">
//             Système d’Information Intelligent des <br /> Ressources Humaines
//           </h1>

//           {/* Boutons ankavanana */}
//           <div className="dashboard-controls">
//             {/* Cloche notification */}
//             <div className="notification-bell" onClick={toggleNotif}>
//               <FaBell size={20} />
//               {candidatsAttente > 0 && (
//                 <span className="notification-count">{candidatsAttente}</span>
//               )}
//             </div>

//             {showNotif && (
//               <div className="notification-dropdown">
//                 {candidatsAttente === 0 ? (
//                   <p>Aucune notification</p>
//                 ) : (
//                   <p>{candidatsAttente} candidat(s) en attente</p>
//                 )}
//               </div>
//             )}

//             <select value={lang} onChange={handleLangChange} className="lang-select">
//               <option value="fr">Français</option>
//               <option value="en">English</option>
//             </select>

//             <button
//               onClick={handleThemeToggle}
//               className="theme-toggle"
//               aria-label="Changer de mode"
//             >
//               {darkMode ? "🌙" : "☀️"}
//             </button>
//           </div>
//         </div>

//         {/* Contenu dynamique */}
//         <div className="dashboard-content">
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;







import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { FaRobot, FaBell } from "react-icons/fa"; // Icône robot + cloche
import "./RHDashboardlayout.css";

const DashboardLayout = () => {
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [lang, setLang] = useState(localStorage.getItem("lang") || "fr");
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const [enAttenteCount, setEnAttenteCount] = useState(0); // nouveau state

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  const handleLangChange = (e) => setLang(e.target.value);
  const handleThemeToggle = () => setDarkMode((prev) => !prev);
  const toggleNotif = () => setShowNotif((prev) => !prev);

  // --- Fetch notifications initial ---
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/rh/notifications");
        if (res.ok) {
          const data = await res.json();
          setNotifications(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotifications();
  }, []);

  // --- Polling automatique pour les candidats "En attente" ---
  useEffect(() => {
    const fetchEnAttente = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/rh/candidatures");
        if (res.ok) {
          const data = await res.json();
          const count = data.filter(c => c.statut === "En attente").length;
          setEnAttenteCount(count);
        }
      } catch (err) {
        console.error(err);
      }
    };

    // fetch initial
    fetchEnAttente();

    // fetch automatique toutes les 5 secondes
    const interval = setInterval(fetchEnAttente, 5000);

    return () => clearInterval(interval); // nettoyage
  }, []);

  return (
    <div className={`main-layout ${darkMode ? "dark" : ""}`}>
      {/* Sidebar */}
      <Sidebar />

      <div className="dashboard-wrapper">
        {/* Topbar */}
        <div className="dashboard-topbar">
          {/* Icône eo amin'ny sisiny havia */}
          <FaRobot className="dashboard-icon" />

          {/* Titre afovoany */}
          <h1 className="dashboard-title">
            Système d’Information Intelligent des <br /> Ressources Humaines
          </h1>

          {/* Boutons ankavanana */}
          <div className="dashboard-controls">
            {/* Cloche notification */}
            <div className="notification-bell" onClick={toggleNotif}>
              <FaBell size={20} />
              {enAttenteCount > 0 && (
                <span className="notification-count">{enAttenteCount}</span>
              )}
            </div>

            {showNotif && (
              <div className="notification-dropdown">
                {notifications.length === 0 ? (
                  <p>Aucune notification</p>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="notification-item">
                      {n.message}
                    </div>
                  ))
                )}
              </div>
            )}

            <select value={lang} onChange={handleLangChange} className="lang-select">
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>

            <button
              onClick={handleThemeToggle}
              className="theme-toggle"
              aria-label="Changer de mode"
            >
              {darkMode ? "🌙" : "☀️"}
            </button>
          </div>
        </div>

        {/* Contenu dynamique */}
        <div className="dashboard-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
