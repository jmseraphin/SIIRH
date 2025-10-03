import React, { useState } from "react";
import CandidatureForm from "./components/CandidatureForm";
import CandidatureList from "./components/CandidatureList";
import RHDashboard from "./components/RHDashboard";

const App = () => {
  const [view, setView] = useState("form"); // "form" | "list" | "rh"

  const renderView = () => {
    switch (view) {
      case "form":
        return <CandidatureForm />;
      case "list":
        return <CandidatureList />;
      case "rh":
        return <RHDashboard />;
      default:
        return <CandidatureForm />;
    }
  };

  return (
    <div>
      <header>
        <button onClick={() => setView("form")}>Candidature Form</button>
        <button onClick={() => setView("list")}>Candidature List</button>
        <button onClick={() => setView("rh")}>RH Dashboard</button>
      </header>
      <main>{renderView()}</main>
    </div>
  );
};

export default App;
