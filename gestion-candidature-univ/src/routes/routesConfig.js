
import LayoutEnseignant from "../composant/LayoutEnseignant";
import LayoutCandidat from "../composant/LayoutEvaluation";

import CandidatRoutes from "./CandidatRoutes";
import EnseignantRoutes from "./EnseignantRoutes";
import EtudiantRoutes from "./EtudiantRoutes";
import PublicRoutes from "./PublicRoutes";

// Pas de layout spécifique pour les routes publiques
const routesConfig = {
  public: {
    layout: null,
    routes: PublicRoutes,
  },
  // SUPER_ADMIN: {
  //   layout: LayoutAdmin,
  //   routes: AdminRoutes,
  // },
  // ADMIN: {
  //   layout: LayoutAdmin,
  //   routes: AdminRoutes,
  // },

  // LAMBDA: {
  //   layout: LayoutAdmin,
  //   routes: AdminRoutes,
  // },

  Enseignant: {
    layout: LayoutEnseignant,
    routes: EnseignantRoutes,
  },


  candidat: {
    layout: LayoutCandidat,
    routes: CandidatRoutes,
  },
  Etudiant: {
    layout: LayoutCandidat,
    routes: EtudiantRoutes,
  },
  ResponsableClasse: {
    layout: LayoutCandidat,
    routes: CandidatRoutes,
  },
};
// Function to get combined routes based on user's role and type
export const getUserRoutes = (user) => {
  const role = user?.role;
  const type = "Etudiant";

  // Safely get routes, ensuring they are always an array
  const roleRoutes = Array.isArray(routesConfig[role]?.routes)
    ? routesConfig[role]?.routes
    : [];

  const typeRoutes = Array.isArray(routesConfig[type]?.routes)
    ? routesConfig[type]?.routes
    : [];

  // Merge routes, ensuring we're working with arrays
  const combinedRoutes = [
    ...(roleRoutes || []),
    ...(typeRoutes || [])
  ];

  // Determine the appropriate layout
  const layout =
    routesConfig[role]?.layout ||
    routesConfig[type]?.layout ||
    null;

  console.log('Resolved Role:', role);
  console.log('Resolved Type:', type);
  console.log('Role Routes:', routesConfig[role]?.routes);
  console.log('Type Routes:', routesConfig[type]?.routes);
  return {
    routes: combinedRoutes,
    layout: layout
  };
};
export default routesConfig;
