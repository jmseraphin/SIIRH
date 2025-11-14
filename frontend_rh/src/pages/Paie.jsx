// import { useEffect, useState } from "react";
// import { getPaies } from "../api/paieApi";
// import PaieForm from "../components/PaieForm";
// import PaieTable from "../components/PaieTable";
// import "../styles/paie.css";

// export default function Paie() {
//   const [paies, setPaies] = useState([]);

//   const loadPaies = () => {
//     getPaies().then((res) => setPaies(res.data));
//   };

//   useEffect(() => {
//     loadPaies();
//   }, []);

//   return (
//     <div className="paie-container">
//       <h1 className="paie-title">Gestion de la Paie</h1>

//       <div className="paie-card">
//         <h2 className="paie-section-title">Ajouter une Paie</h2>
//         <PaieForm onSaved={loadPaies} />
//       </div>

//       <div className="paie-card">
//         <h2 className="paie-section-title">Liste des Paiements</h2>
//         <PaieTable paies={paies} onDeleted={loadPaies} />
//       </div>
//     </div>
//   );
// }





import { useEffect, useState } from "react";
import { getPaies } from "../api/paieApi";
import PaieForm from "../components/PaieForm";
import PaieTable from "../components/PaieTable";
import "../styles/paie.css";

export default function Paie() {
  const [paies, setPaies] = useState([]);

  const loadPaies = () => {
    getPaies().then((res) => setPaies(res.data));
  };

  useEffect(() => {
    loadPaies();
  }, []);

  return (
    <div className="paie-container">
      <h1 className="paie-title">Gestion de la Paie</h1>

      <div className="paie-card">
        <h2 className="paie-section-title">Ajouter une Paie</h2>
        <PaieForm onSaved={loadPaies} />
      </div>

      <div className="paie-card">
        <h2 className="paie-section-title">Liste des Paiements</h2>
        <PaieTable paies={paies} onDeleted={loadPaies} />
      </div>
    </div>
  );
}
