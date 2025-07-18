import React, { useEffect, useState } from "react";
// import { getCandidatsCount, getEtudiantsCount, getEnseignantsCount, getAppelsCandidatureCount } from "../ServiceAPi/Microservice-Dashboard";
import Footer from "./Footer";
import SideBar from "./SideBar";
import Header from "./Header";
import { getEtatCandidature } from "../ServiceAPi/Microservice-AppelCandidature";
import { getEtatUser } from "../ServiceAPi/Microservice-User";
import { getAllFormation } from "../ServiceAPi/Microservice-Maquette";

const AccueilGerant = () => {
  const [candidatsCount, setCandidatsCount] = useState(0);
  const [candidatsCountComplet, setCandidatsCountComplet] = useState(0);
  const [etudiantsCount, setEtudiantsCount] = useState(0);
  const [enseignantsCount, setEnseignantsCount] = useState(0);
  const [vacatairesCount, setVacatairesCount] = useState(0);
  const [formationCount, setFormationCount] = useState(-1);
  const [appelsCandidatureCount, setAppelsCandidatureCount] = useState(0);
  const [appelsCandidatureCountActif, setAppelsCandidatureCountActif] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fonction pour récupérer les informations du dashboard
  const fetchDashboardData = async () => {
    setIsLoading(true);
  
    try {
      const [userRes, etudiantsRes, formationRes] = await Promise.allSettled([
        getEtatUser(),
        getEtatCandidature(),
        getAllFormation()
      ]);
  
      // Vérifie si chaque promesse a réussi (status: "fulfilled")
      if (userRes.status === "fulfilled") {
        const data = userRes.value?.data ?? {};
        setEtudiantsCount(data.nbEtudiants || 0);
        setEnseignantsCount(data.nbEnseignants || 0);
        setVacatairesCount(data.nbVacataires || 0);
      }
  
      if (etudiantsRes.status === "fulfilled") {
        const data = etudiantsRes.value?.data ?? {};
        setCandidatsCount(data.nbCandidats || 0);
        setCandidatsCountComplet(data.nbCandidatComplet || 0);
        setAppelsCandidatureCount(data.nbAppelsCandidature || 0);
        setAppelsCandidatureCountActif(data.nbAppelsCandidatureActifs || 0);
      }
  
      if (formationRes.status === "fulfilled") {
        const data = formationRes.value?.data ?? [];
        setFormationCount(data.length || 0);
      }
  
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    fetchDashboardData();

    // Pour démonstration seulement - à remplacer par fetchDashboardData()
    // setTimeout(() => {
    //   setCandidatsCount(245);
    //   setEtudiantsCount(182);
    //   setEnseignantsCount(37);
    //   setAppelsCandidatureCount(12);
    //   setIsLoading(false);
    // }, 1000);
  }, []);

  return (
    <div className="dashboard-container">

      <main className="col s12 m9 l10">
        <div className="container">
          <div className="section">
            <h4 className="white-text">Dashboard</h4>
            <p className="white-text">Bienvenue sur le tableau de bord administrateur</p>
          </div>

          {isLoading ? (
            <div className="center-align" style={{ padding: "40px 0" }}>
              <div className="preloader-wrapper big active">
                <div className="spinner-layer spinner-blue-only">
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
            </div>
          ) : (
            <div className="row">
              {/* Carte pour le nombre de candidats */}
              <div className="col s12 m6 l3">
                <div className="card hoverable">
                  <div className="card-content">
                    <div className="row valign-wrapper" style={{ marginBottom: "0" }}>
                      <div className="col s3">
                        <div className="center-align blue lighten-4" style={{ padding: "12px", borderRadius: "50%" }}>
                          <i className="material-icons blue-text">perm_identity</i>
                        </div>
                      </div>
                      <div className="col s9">
                        <span className="card-title" style={{ fontSize: "1.2rem", marginTop: "0" }}>Candidatures</span>
                      </div>
                    </div>
                    <div className="row" style={{ marginBottom: "0", marginTop: "20px" }}>
                      <div className="col s6">
                        <h3 className="black-text" style={{ margin: "0" }}>{candidatsCount}</h3>
                      </div>
                      <div className="col s6 right-align">
                        <span className="new badge green" data-badge-caption="">Incomplete</span>
                      </div>
                    </div>
                  </div>
                  <div className="card-action blue lighten-5">
                    <a href="/dossier-etudiant" className="blue-text">Voir détails
                      <i className="material-icons tiny" style={{ verticalAlign: "middle", marginLeft: "5px" }}>arrow_forward</i>
                    </a>
                  </div>
                </div>
              </div>






              <div className="col s12 m6 l3">
                <div className="card hoverable">
                  <div className="card-content">
                    <div className="row valign-wrapper" style={{ marginBottom: "0" }}>
                      <div className="col s3">
                        <div className="center-align blue lighten-4" style={{ padding: "12px", borderRadius: "50%" }}>
                          <i className="material-icons blue-text">perm_identity</i>
                        </div>
                      </div>
                      <div className="col s9">
                        <span className="card-title" style={{ fontSize: "1.2rem", marginTop: "0" }}>Candidatures</span>
                      </div>
                    </div>
                    <div className="row" style={{ marginBottom: "0", marginTop: "20px" }}>
                      <div className="col s6">
                        <h3 className="black-text" style={{ margin: "0" }}>{candidatsCountComplet}</h3>
                      </div>
                      <div className="col s6 right-align">
                        <span className="new badge green" data-badge-caption="">Complete</span>
                      </div>
                    </div>
                  </div>
                  <div className="card-action blue lighten-5">
                    <a href="/traitement" className="blue-text">Voir détails
                      <i className="material-icons tiny" style={{ verticalAlign: "middle", marginLeft: "5px" }}>arrow_forward</i>
                    </a>
                  </div>
                </div>
              </div>


              {/* Carte pour le nombre d'étudiants */}
              <div className="col s12 m6 l3">
                <div className="card hoverable">
                  <div className="card-content">
                    <div className="row valign-wrapper" style={{ marginBottom: "0" }}>
                      <div className="col s3">
                        <div className="center-align green lighten-4" style={{ padding: "12px", borderRadius: "50%" }}>
                          <i className="material-icons green-text">perm_identity</i>
                        </div>
                      </div>
                      <div className="col s9">
                        <span className="card-title" style={{ fontSize: "1.2rem", marginTop: "0" }}>Étudiants</span>
                      </div>
                    </div>
                    <div className="row" style={{ marginBottom: "0", marginTop: "20px" }}>
                      <div className="col s6">
                        <h3 className="black-text" style={{ margin: "0" }}>{etudiantsCount}</h3>
                      </div>
                      <div className="col s6 right-align">
                        <span className="new badge green" data-badge-caption="">+3% ce mois</span>
                      </div>
                    </div>
                  </div>
                  <div className="card-action green lighten-5">
                    <a href="/etudiants" className="green-text">Voir détails
                      <i className="material-icons tiny" style={{ verticalAlign: "middle", marginLeft: "5px" }}>arrow_forward</i>
                    </a>
                  </div>
                </div>
              </div>

              {/* Carte pour le nombre d'enseignants */}
              <div className="col s12 m6 l3">
                <div className="card hoverable">
                  <div className="card-content">
                    <div className="row valign-wrapper" style={{ marginBottom: "0" }}>
                      <div className="col s3">
                        <div className="center-align purple lighten-4" style={{ padding: "12px", borderRadius: "50%" }}>
                          <i className="material-icons purple-text">perm_identity</i>
                        </div>
                      </div>
                      <div className="col s9">
                        <span className="card-title" style={{ fontSize: "1.2rem", marginTop: "0" }}>Enseignants</span>
                      </div>
                    </div>
                    <div className="row" style={{ marginBottom: "0", marginTop: "20px" }}>
                      <div className="col s6">
                        <h3 className="black-text" style={{ margin: "0" }}>{enseignantsCount}</h3>
                      </div>
                      <div className="col s6 right-align">
                        <span className="new badge green" data-badge-caption="">Actifs</span>
                      </div>
                    </div>
                  </div>
                  <div className="card-action purple lighten-5">
                    <a href="/enseignants" className="purple-text">Voir détails
                      <i className="material-icons tiny" style={{ verticalAlign: "middle", marginLeft: "5px" }}>arrow_forward</i>
                    </a>
                  </div>
                </div>
              </div>

              {/* Carte pour le nombre d'appels de candidatures */}
              <div className="col s12 m6 l3">
                <div className="card hoverable">
                  <div className="card-content">
                    <div className="row valign-wrapper" style={{ marginBottom: "0" }}>
                      <div className="col s3">
                        <div className="center-align amber lighten-4" style={{ padding: "12px", borderRadius: "50%" }}>
                          <i className="material-icons amber-text">timeline</i>
                        </div>
                      </div>
                      <div className="col s9">
                        <span className="card-title" style={{ fontSize: "1.2rem", marginTop: "0" }}>Appels de Candidature</span>
                      </div>
                    </div>
                    <div className="row" style={{ marginBottom: "0", marginTop: "20px" }}>
                      <div className="col s6">
                        <h3 className="black-text" style={{ margin: "0" }}>{appelsCandidatureCount}</h3>
                      </div>
                      {/* <div className="col s6 right-align">
                        <span className="new badge amber" data-badge-caption="">{appelsCandidatureCountActif || '0'} actifs</span>
                      </div> */}
                    </div>
                  </div>
                  <div className="card-action amber lighten-5">
                    <a href="/appel-candidature" className="amber-text">Voir détails
                      <i className="material-icons tiny" style={{ verticalAlign: "middle", marginLeft: "5px" }}>arrow_forward</i>
                    </a>
                  </div>
                </div>
              </div>


              {/* Carte pour le nombre de formations */}
              <div className="col s12 m6 l3">
                <div className="card hoverable">
                  <div className="card-content">
                    <div className="row valign-wrapper" style={{ marginBottom: "0" }}>
                      <div className="col s3">
                        <div className="center-align teal lighten-4" style={{ padding: "12px", borderRadius: "50%" }}>
                          <i className="material-icons teal-text">school</i>
                        </div>
                      </div>
                      <div className="col s9">
                        <span className="card-title" style={{ fontSize: "1.2rem", marginTop: "0" }}>Formation</span>
                      </div>
                    </div>
                    <div className="row" style={{ marginBottom: "0", marginTop: "20px" }}>
                      <div className="col s6">
                        <h3 className="black-text" style={{ margin: "0" }}>{formationCount}</h3>
                      </div>
                      {/* <div className="col s6 right-align">
                        <span className="new badge teal" data-badge-caption="">actifs</span>
                      </div> */}
                    </div>
                  </div>
                  <div className="card-action teal lighten-5">
                    <a href="/maquette/formation/Formation" className="teal-text">Voir détails
                      <i className="material-icons tiny" style={{ verticalAlign: "middle", marginLeft: "5px" }}>arrow_forward</i>
                    </a>
                  </div>
                </div>
              </div>

              {/* Carte pour le nombre de vacataires */}
              <div className="col s12 m6 l3">
                <div className="card hoverable">
                  <div className="card-content">
                    <div className="row valign-wrapper" style={{ marginBottom: "0" }}>
                      <div className="col s3">
                        <div className="center-align deep-orange lighten-4" style={{ padding: "12px", borderRadius: "50%" }}>
                          <i className="material-icons deep-orange-text">person_outline</i>
                        </div>
                      </div>
                      <div className="col s9">
                        <span className="card-title" style={{ fontSize: "1.2rem", marginTop: "0" }}>Vacataires</span>
                      </div>
                    </div>
                    <div className="row" style={{ marginBottom: "0", marginTop: "20px" }}>
                      <div className="col s6">
                        <h3 className="black-text" style={{ margin: "0" }}>{vacatairesCount}</h3>
                      </div>
                      <div className="col s6 right-align">
                        <span className="new badge green" data-badge-caption="">Actifs</span>
                      </div>
                    </div>
                  </div>
                  <div className="card-action deep-orange lighten-5">
                    <a href="/vacataires" className="deep-orange-text">Voir détails
                      <i className="material-icons tiny" style={{ verticalAlign: "middle", marginLeft: "5px" }}>arrow_forward</i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

    </div>
  );
};

export default AccueilGerant;