// Imports de base
import AccueilGerant from "../composant/AccueilGerant";
import Page404 from "../composant/Page404";
import AppCalendar from "../composant/AppCalendar";

const EnseignantRoutes = [
  {
    path: "/",
    element: <AppCalendar />
  },
  {
    path: "/accueil-gerant",
    element: <AccueilGerant />
  },
  { path: "*", element: <Page404 /> }
];

export default EnseignantRoutes;
