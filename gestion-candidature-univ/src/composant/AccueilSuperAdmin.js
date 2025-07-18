import React, { useEffect, useState } from "react";
// import { getCandidatsCount, getEtudiantsCount, getEnseignantsCount, getAppelsCandidatureCount } from "../ServiceAPi/Microservice-Dashboard";
import Footer from "./Footer";
import SideBar from "./SideBar";
import Header from "./Header";

const AccueilSuperAdmin = () => {
  const [candidatsCount, setCandidatsCount] = useState(0);
  const [etudiantsCount, setEtudiantsCount] = useState(0);
  const [enseignantsCount, setEnseignantsCount] = useState(0);
  const [appelsCandidatureCount, setAppelsCandidatureCount] = useState(0);

  // Fonction pour récupérer les informations du dashboard
  // const fetchDashboardData = () => {
  //   Promise.all([
  //     getCandidatsCount(),
  //     getEtudiantsCount(),
  //     getEnseignantsCount(),
  //     getAppelsCandidatureCount(),
  //   ])
  //     .then(([candidats, etudiants, enseignants, appels]) => {
  //       setCandidatsCount(candidats.data.count);
  //       setEtudiantsCount(etudiants.data.count);
  //       setEnseignantsCount(enseignants.data.count);
  //       setAppelsCandidatureCount(appels.data.count);
  //     })
  //     .catch((err) => {
  //       console.error("Erreur lors de la récupération des données du dashboard :", err);
  //     });
  // };

  useEffect(() => {
    // fetchDashboardData();
  }, []);

  return (

    <div >
      <h5>Dashboard</h5>

      <div className="row">
        {/* Carte pour le nombre de candidats */}
        <div className="col s12 m6 l3">
          <div className="card blue-grey darken-1">
            <div className="card-content white-text">
              <span className="card-title">Candidats</span>
              <p>{candidatsCount}</p>
            </div>
          </div>
        </div>

        {/* Carte pour le nombre d'étudiants */}
        <div className="col s12 m6 l3">
          <div className="card green darken-1">
            <div className="card-content white-text">
              <span className="card-title">Étudiants</span>
              <p>{etudiantsCount}</p>
            </div>
          </div>
        </div>

        {/* Carte pour le nombre d'enseignants */}
        <div className="col s12 m6 l3">
          <div className="card red darken-1">
            <div className="card-content white-text">
              <span className="card-title">Enseignants</span>
              <p>{enseignantsCount}</p>
            </div>
          </div>
        </div>

        {/* Carte pour le nombre d'appels de candidatures */}
        <div className="col s12 m6 l3">
          <div className="card orange darken-1">
            <div className="card-content white-text">
              <span className="card-title">Appels de Candidature</span>
              <p>{appelsCandidatureCount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>




  );
};

export default AccueilSuperAdmin;
