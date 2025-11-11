// import React, { useState, useEffect } from "react";
// import "./Parametres.css";

// export default function Parametres() {
//   const [darkMode, setDarkMode] = useState(
//     document.body.classList.contains("dark-mode")
//   );
//   const [lang, setLang] = useState(localStorage.getItem("lang") || "fr");

//   // ✅ Appliquer le dark mode
//   useEffect(() => {
//     if (darkMode) {
//       document.body.classList.add("dark-mode");
//     } else {
//       document.body.classList.remove("dark-mode");
//     }
//   }, [darkMode]);

//   // ✅ Sauvegarder la langue
//   useEffect(() => {
//     localStorage.setItem("lang", lang);
//   }, [lang]);

//   const toggleDarkMode = () => setDarkMode((prev) => !prev);
//   const handleLangChange = (e) => setLang(e.target.value);

//   return (
//     <div className="param-wrapper">
//       {/* === Contenu principal === */}
//       <div className="param-container">
//         <div className="param-card">
//           <h2>{lang === "fr" ? "Paramètres du système" : "System Settings"}</h2>

//           <div className="param-item">
//             <span className="param-label">
//               {lang === "fr" ? "Mode sombre :" : "Dark Mode:"}
//             </span>
//             <button
//               className={`param-btn ${darkMode ? "active" : ""}`}
//               onClick={toggleDarkMode}
//             >
//               {darkMode
//                 ? lang === "fr"
//                   ? "Activé"
//                   : "Enabled"
//                 : lang === "fr"
//                 ? "Désactivé"
//                 : "Disabled"}
//             </button>
//           </div>

//           <div className="param-item">
//             <span className="param-label">
//               {lang === "fr" ? "Langue :" : "Language:"}
//             </span>
//             <select
//               className="param-select"
//               value={lang}
//               onChange={handleLangChange}
//             >
//               <option value="fr">Français</option>
//               <option value="en">English</option>
//             </select>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }





import React, { useState, useEffect } from "react";
import "./Parametres.css";

export default function Parametres() {
  const [darkMode, setDarkMode] = useState(
    document.body.classList.contains("dark-mode")
  );
  const [lang, setLang] = useState(localStorage.getItem("lang") || "fr");

  // Profil
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);

  // Création utilisateur par admin
  const [showNewUser, setShowNewUser] = useState(false);
  const [newUser, setNewUser] = useState({ email: "", password: "" });

  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "admin",
    role: "Administrateur",
    photo: localStorage.getItem("photo") || "https://via.placeholder.com/40",
    email: "admin@exemple.com",
  };

  // Dark mode
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  // Langue
  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);
  const handleLangChange = (e) => setLang(e.target.value);

  // Profil
  const handleProfileClick = () => setIsProfileOpen(!isProfileOpen);
  const handleAccountChange = (e) => {
    e.preventDefault();
    const updatedUser = { ...user, email, password };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    alert("Profil mis à jour !");
    setEmail("");
    setPassword("");
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        localStorage.setItem("photo", reader.result);
        window.location.reload();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  // Création utilisateur
  const handleNewUserSubmit = (e) => {
    e.preventDefault();
    console.log("Nouvel utilisateur :", newUser);
    alert("Compte créé !");
    setNewUser({ email: "", password: "" });
    setShowNewUser(false);
  };

  return (
    <div className="param-wrapper">
      <div className="param-container">
        <div className="param-card">
          <h2>{lang === "fr" ? "Paramètres du système" : "System Settings"}</h2>

          {/* Mode sombre */}
          <div className="param-item">
            <span className="param-label">
              {lang === "fr" ? "Mode sombre :" : "Dark Mode:"}
            </span>
            <button
              className={`param-btn ${darkMode ? "active" : ""}`}
              onClick={toggleDarkMode}
            >
              {darkMode
                ? lang === "fr"
                  ? "Activé"
                  : "Enabled"
                : lang === "fr"
                ? "Désactivé"
                : "Disabled"}
            </button>
          </div>

          {/* Langue */}
          <div className="param-item">
            <span className="param-label">
              {lang === "fr" ? "Langue :" : "Language:"}
            </span>
            <select
              className="param-select"
              value={lang}
              onChange={handleLangChange}
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </div>

          {/* Menu profil (teboka telo) */}
          <div className="param-item">
            <span className="param-label">{lang === "fr" ? "Profil :" : "Profile:"}</span>
            <button className="param-btn" onClick={handleProfileClick}>
              ...
            </button>
          </div>

          {isProfileOpen && (
            <div className="profile-menu">
              <form onSubmit={handleAccountChange}>
                <div className="photo-upload">
                  <label htmlFor="photo-upload">
                    {lang === "fr" ? "Changer la photo" : "Change photo"}
                  </label>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                  />
                </div>

                <div className="input-group">
                  <input
                    type="email"
                    placeholder={lang === "fr" ? "Nouvel e-mail" : "New email"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder={lang === "fr" ? "Nouveau mot de passe" : "New password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                  >
                    {showPassword ? "👁️" : "🙈"} {/* Eto sary maso */}
                  </button>
                </div>

                <button type="submit" className="param-btn">
                  {lang === "fr" ? "Mettre à jour" : "Update"}
                </button>

                <button
                  type="button"
                  className="param-btn"
                  onClick={() => setForgotPassword(!forgotPassword)}
                >
                  {lang === "fr" ? "Mot de passe oublié ?" : "Forgot password?"}
                </button>

                {forgotPassword && (
                  <div className="input-group" style={{ marginTop: "10px" }}>
                    <input
                      type="email"
                      placeholder={lang === "fr" ? "Email pour réinitialiser" : "Email to reset"}
                    />
                    <button type="button" className="param-btn">
                      {lang === "fr" ? "Envoyer" : "Send"}
                    </button>
                  </div>
                )}

                {/* Création compte admin */}
                <button
                  type="button"
                  className="param-btn"
                  onClick={() => setShowNewUser(!showNewUser)}
                >
                  {lang === "fr" ? "Créer nouvel utilisateur" : "Create new user"}
                </button>

                {showNewUser && (
                  <form onSubmit={handleNewUserSubmit} style={{ marginTop: "10px" }}>
                    <input
                      type="email"
                      placeholder={lang === "fr" ? "Email" : "Email"}
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      required
                    />
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder={lang === "fr" ? "Mot de passe" : "Password"}
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                      >
                        {showPassword ? "👁️" : "🙈"}
                      </button>
                    </div>

                    <button type="submit" className="param-btn">
                      {lang === "fr" ? "Créer compte" : "Create account"}
                    </button>
                    <button
                      type="button"
                      className="param-btn"
                      onClick={() => setShowNewUser(false)}
                    >
                      {lang === "fr" ? "Annuler" : "Cancel"}
                    </button>
                  </form>
                )}

                <button onClick={handleLogout} className="param-btn">
                  {lang === "fr" ? "Se déconnecter" : "Logout"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
