// import React from "react";
// import ConvocationForm from "../components/ConvocationForm";

// function ConvocationPage() {
//   // ohatra fotsiny: 11 = ID du candidat
//   const candidatId = 11;

//   return (
//     <div style={{ marginTop: "50px" }}>
//       <ConvocationForm candidatId={candidatId} />
//     </div>
//   );
// }

// export default ConvocationPage;



import React from "react";
import ConvocationForm from "../components/ConvocationForm";

function ConvocationPage() {
  // 🔹 Pas de sélection de candidat, on laisse le formulaire tel quel
  const candidatId = 11; // ou n'importe quel id fixe si nécessaire

  return (
    <div>
      <ConvocationForm candidatId={candidatId} />
    </div>
  );
}

export default ConvocationPage;
