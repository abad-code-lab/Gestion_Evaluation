import axios from "axios";
import { SERVER_URL } from "./CONSTANTE";
import { getAuthToken } from "./Microservice-User";
// Créer une instance Axios avec le jeton dans l'en-tête par défaut
export const maquetteApi = axios.create({
  //baseURL: "http://31.220.20.148:8083",
  // baseURL: SERVER_URL + ":8091",
  baseURL: SERVER_URL + ":8090/MAQUETTE-SERVICE/maquette",
  // baseURL: "http://localhost:8091",
  headers: {
    "Content-Type": "application/json",
  },
});

// Réinitialiser le compteur après un rafraîchissement réussi
// maquetteApi.interceptors.request.use(
//   (config) => {

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// Ajouter l'intercepteur pour les requêtes protégées
maquetteApi.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const addFormationApi = (formationSave) => {
  return maquetteApi.post("/formation", formationSave);
};
export const deleteFormation = (id) => {
  return maquetteApi.delete(`/formation/${id}`);
};
export const updateFormationApi = (formationId, formationModifier) => {
  return maquetteApi.put(`/formation/${formationId}`, formationModifier);
};
export const getFormationById = (id) => {
  return maquetteApi.get(`/formation/${id}`);
}
export const getFormationDetailsClasse = (id) => {
  return maquetteApi.get(`/formationDetailsClasse/${id}`);
}
export const addSemestreApi = (semestreSave) => {
  return maquetteApi.post("/semestre", semestreSave);
};
export const updateSemestreApi = (semestreId, semestreModifier) => {
  return maquetteApi.put(`/semestre/${semestreId}`, semestreModifier);
}
export const deleteSemestre = (id) => {
  return maquetteApi.delete(`/semestre/${id}`);
}
export const getSemestreById = (id) => {
  return maquetteApi.get(`/semestre/${id}`);
}
export const getSemestreDetailsClasse = (id) => {
  return maquetteApi.get(`/semestreDetailsClasse/${id}`);
}



export const getAllSemestres = () => {
  return maquetteApi.get("/semestre");
};

export const getAllClasses = () => {
  return maquetteApi.get("/classe");
};
export const deleteClasse = (id) => {
  return maquetteApi.delete("/classe/" + id);

};

export const addClasseApi = (classeSave) => {
  return maquetteApi.post("/classe", classeSave);
}; export const updateClasseApi = (classeModifier, classeId) => {
  return maquetteApi.post("/classe/" + classeId, classeModifier);
};

export const getAllFormation = () => {
  return maquetteApi.get("/formation");
};

export const getAllNiveaux = () => {
  return maquetteApi.get("/niveau");
};

export const getAllEnseignements = () => {
  return maquetteApi.get("/enseignement");
};
export const getAllGroupe = () => {
  return maquetteApi.get("/groupe");
}
export const deleteGroupe = (id) => {
  return maquetteApi.delete("/groupe/" + id);
}
export const updateGroupeApi = (groupeId, groupeModifier) => {
  return maquetteApi.put(`/groupe/${groupeId}`, groupeModifier);
};

export const getAllMaquettes = () => {
  return maquetteApi.get("/maquette");
};


export const createMaquette = () => {
  return maquetteApi.post("/maquette");
};

export const deleteMaquette = (id) => {
  return maquetteApi.delete(`/maquette/${id}`);
};
export const updateMaquetteAPI = (maquetteId, maquetteModifier) => {
  return maquetteApi.put(`/maquette/${maquetteId}`, maquetteModifier);
};

export const getAllCycles = () => {
  return maquetteApi.get(`/cycle`);
};
export const getCycleById = (id) => {
  return maquetteApi.get(`/cycle/${id}`);
}
export const getCycleDetailsGroupe = (id) => {
  return maquetteApi.get(`/cycleDetailsGroupe/${id}`);
}
export const createCycle = (cycleSave) => {
  return maquetteApi.post(`/cycle`, cycleSave);
}
export const updateCycleApi = (cycleId, cycleModifier) => {
  return maquetteApi.put(`/cycle/${cycleId}`, cycleModifier);
}
export const deleteCycle = (id) => {
  return maquetteApi.delete(`/cycle/${id}`);
}



export const createNiveau = (niveauSave) => {
  return maquetteApi.post(`/niveau`, niveauSave);
}
export const updateNiveau = (niveauId, niveauModifier) => {
  return maquetteApi.put(`/niveau/${niveauId}`, niveauModifier);
}
export const deleteNiveau = (id) => {
  return maquetteApi.delete(`/niveau/${id}`);
}


export const getNiveauById = (id) => {
  return maquetteApi.get(`/niveau/${id}`);
}


export const createGroupe = (groupeSave) => {
  return maquetteApi.post(`/groupe`, groupeSave);
};

export const getEnseignementById = (id) => {
  return maquetteApi.get(`/enseignement/${id}`);
};
export const getGroupeDetailsEnseignementById = (id) => {
  return maquetteApi.get(`/groupeDetailsEnseignement/${id}`);
};

export const deleteEnseignement = (id) => {
  return maquetteApi.delete(`/enseignement/${id}`);
};



export const getClasseById = (id) => {
  return maquetteApi.get(`/classe/${id}`);
};

export const getClasseDetailsGroupe = (id) => {
  return maquetteApi.get(`/classeDetailsGroupe/${id}`);
};

export const getClasseDetailsEnseignement = (id) => {
  return maquetteApi.get(`/classeDetailsEnseignement/${id}`);
};


export const getAllFilieres = () => {
  return maquetteApi.get(`/filiere`);
};
export const getUeByClasseAndSemestre = (idClasse, idSemestre) => {
  return maquetteApi.get(`/ue/classe/${idClasse}/semestre/${idSemestre}`);
};

export const deleteUe = (id) => {
  return maquetteApi.delete(`/ue/${id}`);
};
export const addUeApi = (ueSave) => {
  return maquetteApi.post("/ue", ueSave);
}
export const updateUeApi = (ueId, ueModifier) => {
  return maquetteApi.put(`/ue/${ueId}`, ueModifier);
}
export const getAllUe = () => {
  return maquetteApi.get("/ue");
}


export const getUeById = (id) => {
  return maquetteApi.get(`/ue/${id}`);
}

export const getAllEC = () => {
  return maquetteApi.get("/ec");
};



export const getAllECByUE = (id) => {
  return maquetteApi.get("/ue/" + id +"/ec");
}

export const deleteEC = (id) => {
  return maquetteApi.delete("/ec/" + id);
}
export const createEC = (ecSave) => {
  return maquetteApi.post("/ec", ecSave);
}
export const updateECAPI = (ecId, ecModifier) => {
  return maquetteApi.put(`/ec/${ecId}`, ecModifier);
}
export const getECById = (id) => {
  return maquetteApi.get(`/ec/${id}`);
}
export const annulerRepartition = (classeId, semestreId) => {
  return maquetteApi.delete(`/annuler-repartition/classe/${classeId}/semestre/${semestreId}`);
};

export const repartirUe = (classeId, semestreId, groupes) => {
  return maquetteApi.post(`/repartir/classe/${classeId}/semestre/${semestreId}/groupe/${groupes}`);
};

export const getEnseignementsByClasseAndSemestre = (classeId, semestreId) => {
  return maquetteApi.get(`/classe/${classeId}/semestre/${semestreId}/enseignements`);
};
