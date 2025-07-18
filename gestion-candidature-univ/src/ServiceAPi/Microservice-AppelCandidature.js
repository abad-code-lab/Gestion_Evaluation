import axios from "axios";
import { SERVER_URL } from "./CONSTANTE";
import { getAuthToken } from "./Microservice-User";


// Configuration de base des API
export const candidatureApi = axios.create({
  baseURL: SERVER_URL + ":8092/api/startup",
  headers: {
    "Content-Type": "application/json",
  },
});

// Ajouter l'intercepteur pour les requêtes protégées
candidatureApi.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Méthodes API


export const createEnvoyerMailGroupe = (emailData) => {
  return candidatureApi.post("/candidats/envoyerMailGroupe", emailData);
};
// Créer un nouvel Appel à Candidature
export const createAppelCandidature = (appel) => {
  return candidatureApi.post("/appel-candidatures", appel);
};
export const getAllCandidature = () => {
  return candidatureApi.get("/candidats");
}
export const getAllCandidatureComplet = () => {
  return candidatureApi.get("/candidats/complet");
}
export const getAllCandidaturesTraite = () => {
  return candidatureApi.get("/candidats/traite");
}
export const getAllCandidatureInComplet = () => {
  return candidatureApi.get("/candidats/incomplet");
}

export const getAllCandidatureRuser = () => {
  return candidatureApi.get("/candidats/refuser");
}

export const getAllCandidatByAppelCandidature = (idAppelCandidature) => {
  return candidatureApi.get("/candidats/appel-candidature/" + idAppelCandidature);
};
export const createCandidature = (idAppelCandidature, appel) => {
  return candidatureApi.patch("/candidats/" + idAppelCandidature, appel, {
    headers: {
      'Content-Type': 'multipart/form-data', // Pour l'envoi de fichiers
      // 'Authorization': `Bearer ${token}`,   // Si tu utilises un token d'authentification
    }
  });
}

export const createCandidatureTemporaire = (appel) => {
  return candidatureApi.post("/candidats/temporaire", appel);
};


// Récupérer tous les Appels à Candidature
export const getAppelsCandidature = () => {
  return candidatureApi.get("/appel-candidatures");
};
export const getLastAppelCandidature = () => {
  return candidatureApi.get("/appel-candidatures/last");
};



// Récupérer un Appel à Candidature par ID
export const getCandidatById = (id) => {
  return candidatureApi.get(`/candidats/getById/${id}`);
};
export const fetchAllDocumentsCandidatById = (id) => {
  return candidatureApi.get(`/candidats/${id}/documents`, {
    responseType: "arraybuffer", // Important pour traiter les fichiers binaires
  });
}
export const downloadDocumentCandidatById = (chemin) => {
  return candidatureApi.post(`/candidats/document/display`, chemin,{
     responseType: "blob"  // Important pour traiter les fichiers binaires
  });
}


export const getCandidatByEmail = (email) => {
  return candidatureApi.get(`/candidats/getByEmail/${email}`);
};

export const deleteCandidat = (id) => {
  return candidatureApi.delete(`/candidats/${id}`);
};

export const rolleBackCandidat = (id) => {
  return candidatureApi.delete(`/candidats/rollback-traitement/${id}`);
};


export const validerPaiementCandidatureById = (id) => {
  return candidatureApi.patch(`/candidats/validerPaiementCandidat/${id}`);
};

// valider Paiement un Appel à Candidature
export const validerPaiementCandidature = (id, methodePaiement) => {
  return candidatureApi.patch(`/candidats/validerPaiementCandidat/${id}/methodePaiement/${methodePaiement}`);
};
export const uploadPreuvePaiement = (id,proof) => {
  return candidatureApi.patch(`/candidats/uploadPreuvePaiement/${id}`, proof, {
    headers: {
      'Content-Type': 'multipart/form-data', // Pour l'envoi de fichiers
      // 'Authorization': `Bearer ${token}`,   // Si tu utilises un token d'authentification
    }
  });
};





// valider Paiement un Appel à Candidature
export const validerSemestreCandidat = (id, semestre) => {
  return candidatureApi.patch(`/candidats/validerCandidat/${id}/Semestre/${semestre}`);
};// valider Paiement un Appel à Candidature
export const InvaliderSemestreCandidat = (id, semestre, data) => {
  return candidatureApi.patch(`/candidats/invaliderCandidat/${id}/Semestre/${semestre}`, data);
};
export const InvaliderCandidat = (id, data) => {
  return candidatureApi.patch(`/candidats/invaliderCandidat/${id}`, data);
}
export const annulerInvalidationCandidat = (id, data) => {
  return candidatureApi.patch(`/candidats/annulerInvalidationCandidat/${id}`, data);
};
// get Paiement un Appel à Candidature
export const getPaiementById = (id) => {
  return candidatureApi.get(`/candidats/getPaiement/${id}`);
};

export const incrementerEtape = (id) => {
  return candidatureApi.patch(`/candidats/incrementerEtape/${id}`);
}; export const fixerEtapeA1 = (id) => {
  return candidatureApi.patch(`/candidats/fixerEtapeA1/${id}`);
};

export const getEtatCandidature = () => {
  return candidatureApi.get(`/etat`);
};
export const getEtatCandidatureById = (id) => {
  return candidatureApi.get(`/etat/${id}`);
};


// Mettre à jour un Appel à Candidature
export const updateAppelCandidature = (id, updatedAppel) => {
  return candidatureApi.put(`/appel-candidatures/${id}`, updatedAppel);
};

export const statusAppelCandidaturePatcheur = (id) => {
  // Vérifier si le jeton existe et l'inclure dans l'en-tête Authorization
  return candidatureApi.patch(`/appel-candidatures/activer/` + id);
};


// <i className="material-icons">delete</i> un Appel à Candidature
export const deleteAppelCandidature = (id) => {
  return candidatureApi.delete(`/appel-candidatures/${id}`);
};

// Récupérer les candidatures d'un appel spécifique
export const getCandidaturesByAppelId = (appelId) => {
  return candidatureApi.get(`/appel-candidatures/${appelId}/candidatures`);
};

// Récupérer un Appel à Candidature par ID
export const getAppelCandidatureById = (id) => {
  return candidatureApi.get(`/appel-candidatures/${id}`);
};