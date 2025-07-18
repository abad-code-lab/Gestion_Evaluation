import React, { useEffect, useState, useRef } from "react";
import "./Resultat.css";

const Resultat = () => {
  const [candidat, setCandidat] = useState({});
  const [provisionalResult, setProvisionalResult] = useState(null);
  const [finalResult, setFinalResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const resultatCardRef = useRef(null);
  const [error, setError] = useState(null);


  useEffect(() => {
    // Récupération des données du candidat depuis le localStorage
    const candidatData = JSON.parse(localStorage.getItem("candidat"));
    setCandidat(candidatData);

    // Simuler une requête pour obtenir le résultat provisoire
    const fetchedProvisionalResult = {
      success: true,
      candidate: candidatData
        ? {
          name: `${candidatData.prenom} ${candidatData.nom}`,
          fileNumber: `${candidatData.id}`,
          email: `${candidatData.email}`,
        }
        : null,
      message: "Votre dossier est en cours d'examen. Voici les résultats provisoires.",
    };

    // Simuler une requête pour obtenir le résultat définitif
    const fetchedFinalResult = {
      success: true,
      candidate: candidatData
        ? {
          name: `${candidatData.prenom} ${candidatData.nom}`,
          fileNumber: `${candidatData.id}`,
          email: `${candidatData.email}`,
        }
        : null,
    };
    if (candidat && typeof candidat.etape === 'number') {
      if (candidat.etape === 4) {
        setProvisionalResult(fetchedProvisionalResult);
      } else if (candidat.etape === 5) {
        setFinalResult(fetchedFinalResult);
      } else {
        setError(`Les résultats ne sont pas encore disponibles. Étape actuelle : ${candidat.etape}/5`);
      }
    } else {
      setError("Impossible d'afficher les résultats : étape du candidat inconnue.");
    }
    setLoading(false);



    //   // Simuler des délais pour récupérer les résultats
    //   setTimeout(() => {
    //     setProvisionalResult(fetchedProvisionalResult);
    //     setLoading(false);
    //   }, 1000);
    //   setTimeout(() => setFinalResult(fetchedFinalResult), 3000);
  }, []);

  // Définir les messages en fonction de l'état du dossier
  const getStatusMessage = (result) => {
    if (result && result.success) {
      return "Félicitations! Votre dossier a été accepté.";
    } else if (result && !result.success) {
      return `Désolé, votre dossier n'a pas été accepté.`;
    } else {
      return "Les résultats ne sont pas encore disponibles.";
    }
  };

  // Fonction pour imprimer uniquement la carte de résultat
  const handlePrint = () => {
    const printContent = resultatCardRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');

    // Ajout du style pour l'impression
    printWindow.document.write(`
      <html>
        <head>
          <title>Résultat - Impression</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
            }
            .print-container {
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #ddd;
              border-radius: 8px;
            }
            .print-header {
              border-bottom: 2px solid #0d47a1;
              padding-bottom: 10px;
              margin-bottom: 20px;
            }
            .print-logo {
              text-align: center;
              margin-bottom: 15px;
              font-weight: bold;
              font-size: 20px;
              color: #0d47a1;
            }
            .badge-final {
              background-color: #4CAF50;
              color: white;
              padding: 5px 10px;
              border-radius: 4px;
              font-size: 14px;
            }
            .badge-provisional {
              background-color: #FF9800;
              color: white;
              padding: 5px 10px;
              border-radius: 4px;
              font-size: 14px;
            }
            .candidate-profile {
              display: flex;
              margin-bottom: 20px;
            }
            .candidate-details {
              margin-left: 15px;
            }
            .detail-item {
              margin-bottom: 5px;
            }
            .divider {
              height: 1px;
              background-color: #e0e0e0;
              margin: 15px 0;
            }
            .status-container {
              padding: 15px;
              border-radius: 4px;
              display: flex;
              margin-bottom: 20px;
            }
            .success-bg {
              background-color: #e8f5e9;
            }
            .error-bg {
              background-color: #ffebee;
            }
            .provisional-bg {
              background-color: #fff8e1;
            }
            .unavailable-bg {
              background-color: #f5f5f5;
            }
            .status-content {
              margin-left: 15px;
            }
            .print-footer {
              margin-top: 30px;
              border-top: 1px solid #ddd;
              padding-top: 15px;
              text-align: center;
              font-size: 12px;
            }
            .print-date {
              font-style: italic;
              margin-top: 10px;
            }
          </style>
        </head>
        <body onload="window.print(); setTimeout(function(){ window.close(); }, 500);">
          <div className="print-container">
            <div className="print-header">
              <div className="print-logo white-text">SYSTÈME DE CANDIDATURE</div>
              <h2>
                ${finalResult ? "Résultat définitif" : "Résultat provisoire"}
                <span className="${finalResult ? "badge-final" : "badge-provisional"}" style="float: right;">
                  ${finalResult ? "Résultat définitif" : "Résultat provisoire"}
                </span>
              </h2>
            </div>
            ${printContent.innerHTML}
            <div className="print-footer">
              <p>Pour toute question, veuillez contacter notre service d'assistance au +221 77 102 61 70 ou par email à support@gmail.com</p>
              <p className="print-date">Document imprimé le ${new Date().toLocaleDateString()} à ${new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="preloader-wrapper big active">
          <div className="spinner-layer spinner-blue">
            <div className="circle-clipper left">
              <div className="circle"></div>
            </div>
            <div className="gap-patch">
              <div className="circle"></div>
            </div>
            <div className="circle-clipper right">
              <div className="circle"></div>
            </div>
          </div>
        </div>
        <h4>Chargement des résultats...</h4>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="resultat-wrapper">
        <div className="resultat-header">
          <div className="resultat-badge">
            {finalResult ? (
              <span className="badge-final">Résultat définitif</span>
            ) : (
              <span className="badge-provisional">Résultat provisoire</span>
            )}
          </div>
          <h2 className="resultat-title white-text">
            {finalResult ? "Résultat définitif" : "Résultat provisoire"}
          </h2>
        </div>

        <div className="resultat-card" ref={resultatCardRef}>
          {finalResult ? (
            <>
              <div className="candidate-profile">
                <div className="profile-icon">
                  <i className="material-icons">account_circle</i>
                </div>
                <div className="candidate-details">
                  <h3>{finalResult.candidate?.name || "N/A"}</h3>
                  <div className="detail-item">
                    <i className="material-icons tiny">badge</i>
                    <span>Numéro de dossier: </span>
                    {finalResult.candidate?.fileNumber || "N/A"}
                  </div>
                  <div className="detail-item">
                    <i className="material-icons tiny">email</i>
                    <span>Email: </span>
                    {finalResult.candidate?.email || "N/A"}
                  </div>
                </div>
              </div>

              <div className="divider"></div>

              <div className={`status-container ${finalResult.success ? "success-bg" : "error-bg"}`}>
                <div className="status-icon">
                  <i className="material-icons">
                    {finalResult.success ? "check_circle" : "cancel"}
                  </i>
                </div>
                <div className="status-content">
                  <h3 className="status-title">{getStatusMessage(finalResult)}</h3>
                  <p className="status-description">
                    {finalResult.success
                      ? "Nous vous félicitons pour votre réussite! Vous pouvez maintenant accéder à votre espace personnel pour continuer le processus."
                      : "Nous vous encourageons à soumettre une nouvelle candidature pour la prochaine période. N'hésitez pas à nous contacter pour plus d'informations."}
                  </p>
                </div>
              </div>
            </>
          ) : provisionalResult ? (
            <>
              <div className="candidate-profile">
                <div className="profile-icon">
                  <i className="material-icons">account_circle</i>
                </div>
                <div className="candidate-details">
                  <h3>{provisionalResult.candidate?.name || "N/A"}</h3>
                  <div className="detail-item">
                    <i className="material-icons tiny">badge</i>
                    <span>Numéro de dossier: </span>
                    {provisionalResult.candidate?.fileNumber || "N/A"}
                  </div>
                  <div className="detail-item">
                    <i className="material-icons tiny">email</i>
                    <span>Email: </span>
                    {provisionalResult.candidate?.email || "N/A"}
                  </div>
                </div>
              </div>

              <div className="divider"></div>

              <div className="status-container provisional-bg">
                <div className="status-icon">
                  <i className="material-icons">hourglass_top</i>
                </div>
                <div className="status-content">
                  <h3 className="status-title">{provisionalResult.message}</h3>
                  <p className="status-description">
                    Nous vous tiendrons informé dès que le résultat définitif sera disponible.
                    Veuillez vérifier régulièrement votre email ou cette page pour toute mise à jour.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="status-container unavailable-bg">
              <div className="status-icon">
                <i className="material-icons">info</i>
              </div>
              <div className="status-content">
                <h3 className="status-title">{getStatusMessage(null)}</h3>
                <p className="status-description">
                  Veuillez vérifier ultérieurement pour consulter votre résultat.
                  Nous vous notifierons par email dès que les résultats seront disponibles.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="action-container">
          {finalResult ? (
            <>
              <button
                className="btn waves-effect waves-light green"
                onClick={() => alert("Accéder à votre espace personnel")}
              >
                Accéder à l'espace personnel
                <i className="material-icons right">arrow_forward</i>
              </button>
              <button
                className="btn waves-effect waves-light blue-grey lighten-1"
                onClick={handlePrint}
              >
                Imprimer les résultats
                <i className="material-icons right">print</i>
              </button>
            </>
          ) : provisionalResult ? (
            <>
              <button
                className="btn waves-effect waves-light blue"
                onClick={() => window.location.reload()}
              >
                Rafraîchir la page
                <i className="material-icons right">refresh</i>
              </button>
              <button
                className="btn waves-effect waves-light blue-grey lighten-1"
                onClick={handlePrint}
              >
                Imprimer les résultats
                <i className="material-icons right">print</i>
              </button>
            </>
          ) : null}
        </div>

        {/* <div className="resultat-footer">
          <p className="white-text">
            Pour toute question, veuillez contacter notre service d'assistance au
            <a href="tel:+221766378762">📞 +221 76 637 87 62</a> ou par email à
            <a href="mailto:master.informatique@univ-zig.sn">✉️ master.informatique@univ-zig.sn</a><br />
            Université Assane Seck de Ziguinchor (UASZ)<br />
            Département d'Informatique - Master Informatique
          </p>

        </div> */}
      </div>
    </div>
  );
};

export default Resultat;