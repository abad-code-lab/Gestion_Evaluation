import AccueilCandidat from "../composant/AccueilEtudiant";
// import DossierCandidature from "../composant/DossierCandidature";
// import Paiement from "../composant/Paiement";
import Page404 from "../composant/Page404";
import SuiviDossierDemo from "../composant/SuiviDossierDemo";
import Resultat from "../composant/Resultat";
import UserResetpassword from "../composant/Accueil";
import FAQ from "../composant/Faq";
import UserEditForm2 from "../composant/UserEditForm2";
import AccueilEtudiant from "../composant/AccueilEtudiant";
import Home from  "../pages/Home";
import EvaluationService from "../ServiceAPi/EvaluationService";


// const EtudiantRoutes = [
//   {
//     path: '/evaluations/ajouter',
//     element: <AjouterEvaluation />
//   },
//   // autres routes...
// ];

// export default EtudiantRoutes;


const CandidatRoutes = [
  
      
      
      
      { path: '/', element: <Home /> },
      { path: "/accueil-candidat", element: <AccueilEtudiant /> },
      // { path: "/dossier-candidature", element: <DossierCandidature /> },
      // { path: "/paiement", element: <Paiement /> },
      { path: "/candidature-resultat", element: <Resultat /> },
      { path: "/suivi-dossier", element: <SuiviDossierDemo /> },
      { path: "/reset-password", element: <UserResetpassword /> },
      { path: "/faq", element: <FAQ /> },
      {
        path: "/profils",
        element: <UserEditForm2 />
      },
      { path: "*", element: <Page404 /> }

];

export default CandidatRoutes;