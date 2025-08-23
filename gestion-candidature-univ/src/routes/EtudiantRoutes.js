import SuiviDossierDemo from "../composant/SuiviDossierDemo";
import Resultat from "../composant/Resultat";
import EmailCheckPage from "../composant/EmailCheckPage";
import UserResetpassword from "../composant/Accueil";
import FAQ from "../composant/Faq";
import UserEditForm2 from "../composant/UserEditForm2";
import Page404 from "../composant/Page404";
import AccueilCandidat from "../composant/AccueilEtudiant";
import AccueilEtudiant from "../composant/AccueilEtudiant";
import ImportCsv from '../composant/ImportCsv';
import EtudiantsListe from '../composant/EtudiantsListe';
import MaquetteEC from '../composant/MaquetteEC';
import InscriptionListe from '../composant/InscriptionListe';
import EvaluationsListe from '../composant/EvaluationsListe';
import UEECPage from '../composant/UEECPage';
import Dashboard from '../composant/Dashboard';
import EvaluationsPage from "../pages/EvaluationsPage";
import DashboardAdmin from '../composant/DashboardAdmin';
import DashboardEtudiant from '../composant/DashboardEtudiant';
import DashboardProfesseur from '../composant/DashboardProfesseur';
import ImportECStudents from '../composant/ImportECStudents';
import GestionEvaluation from '../composant/GestionEvaluation';

const EtudiantRoutes = [
  {
    path: "/import-export",
    element: <ImportECStudents />
  },
  { path: "/", element: <AccueilEtudiant /> },
  { path: "/accueil-candidat", element: <AccueilEtudiant /> },
  { path: "/candidature-resultat", element: <Resultat /> },
  { path: "/suivi-dossier", element: <SuiviDossierDemo /> },
  { path: "/reset-password", element: <UserResetpassword /> },
  { path: "/faq", element: <FAQ /> },
  { path: "/profils", element: <UserEditForm2 /> },
  { path: "*", element: <Page404 /> },
  {
    path: "/admin/dashboard",
    element: <DashboardAdmin />
  },
  {
    path: "/gest-evaluations",
    element: <GestionEvaluation />
  },

  {
    path: "/enseignant/dashboard",
    element: <DashboardProfesseur />
  },

  {
    path: "/etudiant/dashboard",
    element: <DashboardEtudiant />
  },
  {
    path: "/evaluations/modifier",
    element: <UEECPage />
  },
  {
    path: "/evaluations",
    element: <EvaluationsPage />,
  },
  {
    path: "/profil/details",
    element: <Dashboard />
  },
  {
    path: '/etudiants/import-csv',
    element: <ImportCsv />,
  },
  {
    path: '/etudiants/etudiant-inscrit',
    element: <InscriptionListe />,
  },
  {
    path: '/evaluations/ajouter',
    element: <EvaluationsListe />
  },
  {
  path: '/etudiants/MaquetteEC',
  element: <MaquetteEC />
 },
  {
    path: '/etudiants/liste',
    element: <EtudiantsListe />,
  }
];

export default EtudiantRoutes;