import React, { useEffect, useState } from "react";
import SuiviDossier from "./SuiviDossier";

const SuiviDossierDemo = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [candidat, setCandidat] = useState(JSON.parse(localStorage.getItem("candidat")));

  const nextStep = () => {
    console.log("currentStep", currentStep);
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };
  useEffect(() => {
    // setCandidat();
    setCurrentStep(candidat?.etape);
    console.log("candidat?.etape", candidat?.etape);
  }, []);
  return (
    <div>
    
      {candidat && (<SuiviDossier candidate={{
        name: `${candidat.prenom} ${candidat.nom}`,
        fileNumber: `${candidat.id}`,
        email: `${candidat.email}`,
        appel: `${candidat.appelCandidature?.titre}- ${candidat.appelCandidature?.anneeAcademique}`,
      }} currentStep={currentStep-1} />)}

      {/* <button
        onClick={nextStep}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          background: "#4caf50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Étape Suivante
      </button> */}
    </div>
  );
};

export default SuiviDossierDemo;
