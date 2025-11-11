// import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
// import DashboardLayout from "./pages/RHDashboardLayout";
// import Employes from "./pages/Employes";
// import Contrats from "./pages/Contrats";
// import Paie from "./pages/Paie";
// import Rapports from "./pages/Rapports";
// import Login from "./pages/Login";
// import RHDashboard from "./pages/RHDashboard";
// import CandidatDashboard from "./pages/CandidatDashboard";
// import ConvocationPage from "./pages/ConvocationPage";
// import EntretienForm from "./pages/EntretienForm";
// import ListeEntretiens from "./pages/ListeEntretiens";
// import OffreForm from "./pages/OffreForm";
// import Parametres from "./pages/Parametres";
// import { SystemProvider } from "./context/SystemContext"; // ⬅️ ajouté
// import "./App.css";

// function ProtectedRoute({ children }) {
//   const token = localStorage.getItem("token");
//   if (!token) return <Navigate to="/login" replace />;
//   return children;
// }

// function LayoutWrapper({ children }) {
//   const location = useLocation();
//   const isRhRoute = location.pathname.startsWith("/rh");
//   return isRhRoute ? <DashboardLayout>{children}</DashboardLayout> : children;
// }

// function App() {
//   const token = localStorage.getItem("token");

//   return (
//     <SystemProvider> {/* ⬅️ Enveloppe globale */}
//       <Router>
//         <ProtectedRoute>
//           <LayoutWrapper>
//             <Routes>
//               <Route path="/login" element={<Login />} />
//               <Route path="/rh/dashboard" element={<RHDashboard />} />
//               <Route path="/rh/employes" element={<Employes />} />
//               <Route path="/rh/contrats" element={<Contrats />} />
//               <Route path="/rh/paie" element={<Paie />} />
//               <Route path="/rh/rapports" element={<Rapports />} />
//               <Route path="/rh/entretien" element={<EntretienForm />} />
//               <Route path="/rh/liste-entretiens" element={<ListeEntretiens />} />
//               <Route path="/rh/convocation" element={<ConvocationPage />} />
//               <Route path="/rh/offre" element={<OffreForm />} />
//               <Route path="/rh/Parametres" element={<Parametres />} />
//               <Route path="/candidat/*" element={<CandidatDashboard />} />
//               <Route
//                 path="*"
//                 element={<Navigate to={token ? "/rh/dashboard" : "/login"} replace />}
//               />
//             </Routes>
//           </LayoutWrapper>
//         </ProtectedRoute>
//       </Router>
//     </SystemProvider>
//   );
// }

// export default App;




// import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
// import DashboardLayout from "./pages/RHDashboardLayout";
// import Employes from "./pages/Employes";
// import Contrats from "./pages/Contrats";
// import Paie from "./pages/Paie";
// import Rapports from "./pages/Rapports";
// import Login from "./pages/Login";
// import RHDashboard from "./pages/RHDashboard";
// import CandidatDashboard from "./pages/CandidatDashboard";
// import ConvocationPage from "./pages/ConvocationPage";
// import EntretienForm from "./pages/EntretienForm";
// import ListeEntretiens from "./pages/ListeEntretiens";
// import OffreForm from "./pages/OffreForm";
// import Parametres from "./pages/Parametres";
// import { SystemProvider } from "./context/SystemContext";
// import "./App.css";

// // ✅ ProtectedRoute: miaro fotsiny ireo routes mila token
// function ProtectedRoute({ children }) {
//   const token = localStorage.getItem("token");
//   if (!token) return <Navigate to="/login" replace />;
//   return children;
// }

// // ✅ LayoutWrapper: manampy DashboardLayout ho an'ny /rh/*
// function LayoutWrapper({ children }) {
//   const location = useLocation();
//   const isRhRoute = location.pathname.startsWith("/rh");
//   return isRhRoute ? <DashboardLayout>{children}</DashboardLayout> : children;
// }

// function App() {
//   const token = localStorage.getItem("token");

//   return (
//     <SystemProvider>
//       <Router>
//         <Routes>
//           {/* === Route login tsy ao anatin'ny ProtectedRoute === */}
//           <Route path="/login" element={<Login />} />

//           {/* === Routes RH (protected) === */}
//           <Route
//             path="/rh/*"
//             element={
//               <ProtectedRoute>
//                 <LayoutWrapper>
//                   <Routes>
//                     <Route path="dashboard" element={<RHDashboard />} />
//                     <Route path="employes" element={<Employes />} />
//                     <Route path="contrats" element={<Contrats />} />
//                     <Route path="paie" element={<Paie />} />
//                     <Route path="rapports" element={<Rapports />} />
//                     <Route path="entretien" element={<EntretienForm />} />
//                     <Route path="liste-entretiens" element={<ListeEntretiens />} />
//                     <Route path="convocation" element={<ConvocationPage />} />
//                     <Route path="offre" element={<OffreForm />} />
//                     <Route path="Parametres" element={<Parametres />} />
                    
//                   </Routes>
//                 </LayoutWrapper>
//               </ProtectedRoute>
//             }
//           />

//           {/* === Routes Candidat (protected) === */}
//           <Route
//             path="/candidat/*"
//             element={
//               <ProtectedRoute>
//                 <CandidatDashboard />
//               </ProtectedRoute>
//             }
//           />

//           {/* === Catch-all: redirect mifanaraka amin'ny token === */}
//           <Route
//             path="*"
//             element={<Navigate to={token ? "/rh/dashboard" : "/login"} replace />}
//           />
//         </Routes>
//       </Router>
//     </SystemProvider>
//   );
// }

// export default App;






import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { SystemProvider } from "./context/SystemContext";

import DashboardLayout from "./pages/RHDashboardLayout";
import RHDashboard from "./pages/RHDashboard";
import Employes from "./pages/Employes";
import Contrats from "./pages/Contrats";
import Paie from "./pages/Paie";
import Rapports from "./pages/Rapports";
import EntretienForm from "./pages/EntretienForm";
import ListeEntretiens from "./pages/ListeEntretiens";
import ConvocationPage from "./pages/ConvocationPage";
import OffreForm from "./pages/OffreForm";
import Parametres from "./pages/Parametres";

import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import CandidatDashboard from "./pages/CandidatDashboard";

// ✅ ProtectedRoute: miaro fotsiny ireo routes mila token
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function App() {
  const token = localStorage.getItem("token");

  return (
    <SystemProvider>
      <Router>
        <Routes>
          {/* === Auth / ResetPassword === */}
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* === Routes RH (protected + DashboardLayout) === */}
          <Route
            path="/rh/*"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<RHDashboard />} />
            <Route path="employes" element={<Employes />} />
            <Route path="contrats" element={<Contrats />} />
            <Route path="paie" element={<Paie />} />
            <Route path="rapports" element={<Rapports />} />
            <Route path="entretien" element={<EntretienForm />} />
            <Route path="liste-entretiens" element={<ListeEntretiens />} />
            <Route path="convocation" element={<ConvocationPage />} />
            <Route path="offre" element={<OffreForm />} />
            <Route path="parametres" element={<Parametres />} />
          </Route>

          {/* === Routes Candidat (protected) === */}
          <Route
            path="/candidat/*"
            element={
              <ProtectedRoute>
                <CandidatDashboard />
              </ProtectedRoute>
            }
          />

          {/* === Catch-all: redirect mifanaraka amin'ny token === */}
          <Route
            path="*"
            element={<Navigate to={token ? "/rh/dashboard" : "/login"} replace />}
          />
        </Routes>
      </Router>
    </SystemProvider>
  );
}

export default App;
