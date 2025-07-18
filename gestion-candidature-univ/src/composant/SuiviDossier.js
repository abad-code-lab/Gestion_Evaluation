import React from "react";
import "./SuiviDossier.css";
import { Button } from "antd";

const SuiviDossier = ({ currentStep, candidate }) => {
  // Étapes du processus avec des titres et icônes associés
  const steps = [
    { title: "Candidature", icon: "send", colorClass: "soumission" },
    // { title: "Paiement", icon: "payment", colorClass: "paiement" },
    { title: "Dossier complet", icon: "payment", colorClass: "definitif" },
    { title: "Traitement", icon: "autorenew", colorClass: "traitement" },
    { title: "Provisoire", icon: "check_circle", colorClass: "provisoire" },
    { title: "Définitif", icon: "check_circle", colorClass: "definitif" },
  ];

  const statusMessages = [
    "Votre dossier a été ouvert avec succès !",
    "Votre dossier est maintenant complet !",
    // "Veuillez effectuer le paiement.",
    // "Verification du paiement en cours.",
    "Votre dossier est en cours de traitement.",
    "Le résultat provisoire est disponible.",
    "Le résultat définitif est disponible.",
  ];

  const getStepClass = (stepIndex) => {
    if (stepIndex < currentStep) return "completed";
    if (stepIndex === currentStep) return "current";
    return "pending";
  };

  return (
    <div className="suivi-dossier-container">
      <h3>Suivi du Dossier</h3>

      {/* Informations du candidat */}
      <div className="candidate-info">
        <h5>
          <strong>{candidate.appel}</strong>
        </h5>
        <p><strong>Nom : </strong>{candidate.name}</p>
        <p><strong>Numéro de dossier : </strong>{candidate.fileNumber.split("-")[0]}</p>
        <p><strong>Email : </strong>{candidate.email}</p>
      </div>

      {/* Suivi des étapes */}
      <div className="progress-container">
        {steps.map((step, index) => (
          <div key={index} className="step-container">
            <div className={`step-icon ${getStepClass(index)} ${step.colorClass}`}>
              <i className="material-icons">{step.icon}</i>
            </div>
            <div className={`step-title ${getStepClass(index)} ${step.colorClass}`}>
              {step.title}
            </div>
            {index < steps.length - 1 && (
              <div className={`progress-bar ${currentStep > index ? "completed" : ""}`}></div>
            )}
          </div>
        ))}
      </div>


      {/* Message de statut */}
      <div className="status-message">{statusMessages[currentStep]}
        {/* {currentStep === 1 && (
          <div className="result-message" style={{ textAlign: 'center', marginTop: '20px' }}>
            <Button
            href="/paiement"
              className="result-button flashing-button"
              style={{
                backgroundColor: '#FFD700',
                color: '#000',
                fontWeight: 'bold',
                fontSize: '20px',
                padding: '16px 32px',
                borderRadius: '12px',
                cursor: 'pointer',
                textTransform: 'uppercase',
                transition: 'transform 0.2s ease-in-out',
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              💳 Payer par ici
            </Button>
          </div>
        )} */}



      </div>
    </div>
  );
};

export default SuiviDossier;
