import axios from "axios";
import { SERVER_URL } from "./CONSTANTE";
import { decryptData } from "../composant/PrivateRoute";
import { encryptData } from "../composant/Login";
// import { SERVER_URL } from "./CONSTANTE";

// Fonction pour récupérer le token depuis le localStorage
export const getAuthToken = () => {
  let token = window.localStorage.getItem("token");
  if (token) {
    // Déchiffrer le token avant de le retourner
    token = decryptData(token);
  }
  return token;

};
export const getTokenAccompagnateur = () => {
  return window.localStorage.getItem("tokenAccompagnateur");
};

// Fonction pour stocker le token dans le localStorage
export const setAuthHeader = (token) => {
  // encryptData(token);
  window.localStorage.setItem("token", encryptData(token));
};

export const setInfosUser = (user) => {
  window.localStorage.setItem("user", user);
};
export const getInfosUser = (user) => {
  window.localStorage.setItem("user", user);
};

// Fonction pour <i className="material-icons">delete</i> le token du localStorage
export const deleteToken = () => {
  window.localStorage.clear();
  // window.localStorage.removeItem("auth_token");
};

// Créer une instance Axios avec le jeton dans l'en-tête par défaut
export const usersApi = axios.create({
  //baseURL: "http://31.220.20.148:8083",
  // baseURL: SERVER_URL + ":8091",
  baseURL: SERVER_URL + ":8091/api/user/gestionCandidature",
  // baseURL: "http://localhost:8091",
  headers: {
    "Content-Type": "application/json",
  },
});

// Instance pour les requêtes protégées
export const protectedApi = axios.create({
  baseURL: SERVER_URL + ":8091/api/user/gestionCandidature",
  withCredentials: true, // Inclure les cookies dans les requêtes
  headers: {
    "Content-Type": "application/json",
  },
});
export const protectedApi2 = axios.create({
  baseURL: SERVER_URL + ":8091/api/user/gestionCandidature",
  withCredentials: true, // Inclure les cookies dans les requêtes
  headers: {
    "Content-Type": "application/json",
    // "Authorization": `Bearer eyJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJhcGktdXNlciIsImF1ZCI6InlhYXRvdXQtbWljcm9zZXJ2aWNlIiwic3ViIjoic21haEBnbWFpbC5jb20iLCJhdXRob3JpdGllcyI6WyJBRE1JTiJdLCJ1c2VySWQiOiJzbWFoQGdtYWlsLmNvbSIsInRva2VuVmVyc2lvbiI6IjAiLCJpYXQiOjE3MzU1OTUxODgsImV4cCI6MTczNTY4MTU4OH0.xdcfhFqMLfJZLnlYuWQ4uYhzeS_cLYi9nNgUSYuPrhTW7HeRmQyloTB1eM_2rwzxKBKsXFWWp5TJlHRkz5vBYDIZE7bwmsefTbmH-cGNazYhxWsNY8Y7mcq4sSEF1VtM5VrywnVxxsnt5ts0EZeSOkk4O8zyYjLLNpMNtwCiqxbx1yKs58KYNs7BHz4XeN8AQokV4ewpKgTcaFlY_DsawVu14FV6aPrZzkzQuZz_zMXTqwQtGqUoasPg-Hno0mYUP5I-w3Dmx-ZQOWaOX6i-79ujY7QyVcGBOY7XARQrHqveWcpYIMFznI1uICF9EdYz-Snh3MO6i25f2dxfzEWwoA`,

  },
});

// protectedApi.interceptors.request.use((config) => {
//   console.log("Request Config:", config);
//   return config;
// });

// protectedApi.interceptors.response.use(
//   (response) => {
//     console.log("Response Data:", response.data);
//     return response;
//   },
//   (error) => {
//     console.error("Error Response:", error.response);
//     return Promise.reject(error);
//   }
// );


// Ajouter le token uniquement aux requêtes protégées
// protectedApi.interceptors.request.use(
//   (config) => {
//     const token = decryptData(localStorage.getItem("authToken"));
//     const bearerToken = token ? `Bearer ${token}` : "";
//     if (token) {
//       // config.headers.Authorization = `Bearer ${token}`;
//       config.headers.Authorization = bearerToken;
//     } else {
//       console.warn("Aucun jeton trouvé pour une requête protégée.");
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// let refreshAttempts = 0;

// protectedApi.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config; // Garder une copie de la requête originale

//     if (error.response?.status === 401 || error.response?.status === 500) {
//       if (refreshAttempts >= 3) {
//         console.error('Nombre maximum de tentatives de rafraîchissement atteint.');
//         document.cookie.split(";").forEach((cookie) => {
//           document.cookie = cookie
//             .replace(/^ +/, "")
//             .replace(/=.*/, "=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/");
//         });

//         throw error;
//       }

//       try {
//         refreshAttempts++;
//         // alert(refreshAttempts);
//         await refreshAccessToken().then((response) => {
//           setAuthHeader(response.data.token);
        
//         })

//         // Important : <i className="material-icons">edit</i> l'en-tête d'autorisation de la requête originale
//         // originalRequest.headers.Authorization = `Bearer ${nouveauToken}`; // Assurez-vous d'obtenir le nouveau token

//         return protectedApi(originalRequest); // Réessayer la requête originale avec le nouveau token
//       } catch (refreshError) {
//         console.error('Erreur lors de la tentative de rafraîchissement :', refreshError);
//         // localStorage.clear();
//         // window.location.href = "/";

//         // Ne pas propager l'erreur de rafraîchissement pour éviter la boucle
//         return Promise.reject(refreshError); // Rejeter la promesse avec l'erreur de rafraîchissement
//       }
//     }

//     return Promise.reject(error); // Continuer la chaîne des erreurs pour les autres types d'erreurs
//   }
// );

let refreshAttempts = 0;
const MAX_REFRESH_ATTEMPTS = 3;

protectedApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Vérifier si c'est une erreur d'authentification
    if (error.response?.status === 401 || error.response?.status === 500) {
      
      // Vérifier le nombre maximum de tentatives
      if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
        console.error('Nombre maximum de tentatives de rafraîchissement atteint.');
        
        // Nettoyer tous les cookies
        document.cookie.split(";").forEach((cookie) => {
          document.cookie = cookie
            .replace(/^\s+/, "")
            .replace(/=.*/, "=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/");
        });
        
        // Rediriger vers la page de connexion
        localStorage.clear();
        window.location.href = "/";
        
        throw error;
      }

      try {
        refreshAttempts++;
        console.log(`Tentative de rafraîchissement ${refreshAttempts}/${MAX_REFRESH_ATTEMPTS}`);
        
        // Tenter de rafraîchir le token
        const response = await refreshAccessToken();
        
        // Vérifier si le rafraîchissement a réussi
        if (response && response.status === 200 && response.data?.token) {
          console.log('Token rafraîchi avec succès');
          
          // Mettre à jour l'en-tête d'autorisation
          setAuthHeader(response.data.token);
          
          // Mettre à jour l'en-tête de la requête originale
          originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
          
          // Réinitialiser le compteur de tentatives après succès
          refreshAttempts = 0;
          
          // Actualiser la page après un délai court pour permettre à la requête de se terminer
          setTimeout(() => {
            console.log('Actualisation de la page après rafraîchissement du token...');
            window.location.reload();
          }, 100);
          
          // Réessayer la requête originale avec le nouveau token
          return protectedApi(originalRequest);
          
        } else {
          // Si la réponse n'est pas 200 ou ne contient pas de token
          throw new Error('Réponse invalide du serveur lors du rafraîchissement');
        }
        
      } catch (refreshError) {
        console.error('Erreur lors de la tentative de rafraîchissement :', refreshError);
        
        // Si on a atteint le maximum de tentatives, nettoyer et rediriger
        if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
          localStorage.clear();
          document.cookie.split(";").forEach((cookie) => {
            document.cookie = cookie
              .replace(/^\s+/, "")
              .replace(/=.*/, "=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/");
          });
          window.location.href = "/";
        }
        
        return Promise.reject(refreshError);
      }
    }
    
    // Pour les autres types d'erreurs, les propager normalement
    return Promise.reject(error);
  }
);


// let refreshAttempts = 0;

// protectedApi.interceptors.response.use(
//   (response) => response, // Passer la réponse si tout va bien
//   async (error) => {
//     if (error.response?.status === 401 || error.response?.status === 500) {
//       // Limiter les tentatives de rafraîchissement à 3
//       if (refreshAttempts >= 3) {
//         console.error('Nombre maximum de tentatives de rafraîchissement atteint.');
//         throw error; // Propager l'erreur après 3 échecs
//       }

//       try {
//         refreshAttempts++; // Incrémenter le compteur
//         alert(refreshAttempts);
//         await refreshAccessToken(); // Tentative de rafraîchissement
//         return protectedApi(error.config); // Réessayer la requête initiale après rafraîchissement
//       } catch (refreshError) {
//         console.error('Erreur lors de la tentative de rafraîchissement :', refreshError);

//         throw refreshError; // Propager l'erreur si le rafraîchissement échoue

//       }
//     }
//     throw error; // Propager l'erreur si elle n'est pas liée au token
//   }
// );

// Réinitialiser le compteur après un rafraîchissement réussi
protectedApi.interceptors.request.use(
  (config) => {

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const refreshAccessToken = async () => {
  try {
    const response = await protectedApi.post('/auth/refresh-token'); // Votre endpoint de refresh
    // refreshAttempts++;
    return response.data; // Si le backend retourne quelque chose
  } catch (error) {
    throw error;
  }
};

export const createUsers = (user) => {
  // let headers = {};
  // if (getAuthToken() !== null && getAuthToken() !== "null") {
  //     headers = {'Authorization': `Bearer ${getAuthToken()}`};
  // }
  return usersApi.post("/auth/register", user);
};
export const getUserConnected = () => {
  return protectedApi.get(`/auth/whoami`);
};
export const getUsers = () => {
  return protectedApi.get(`/utilisateurs`);
};
export const getEtudiant = () => {
  return protectedApi.get(`/utilisateurs/etudiants`);
};

export const getVacataires = () => {
  return protectedApi.get(`/utilisateurs/vacataires`);
};

export const getEnseignants = () => {
  return protectedApi.get(`/utilisateurs/enseignants`);
};
export const getEnseignantsEtVacataires = () => {
  return protectedApi.get(`/utilisateurs/enseignantsEtVacataires`);
};
export const getEtatUser = () => {
  return protectedApi.get(`/etat`);
};

export const statusUserPatcheur = (id) => {
  // Vérifier si le jeton existe et l'inclure dans l'en-tête Authorization
  return protectedApi.patch(`/utilisateurs/activer/` + id);
};

export const updatePassword = (candidatId, passwords) => {
  return protectedApi.patch(`/utilisateurs/${candidatId}/update-password`, passwords);
}; export const updatePassword_v2 = (passwords) => {
  return protectedApi.patch(`/utilisateurs/update-password-v2`, passwords);
};
export const forgotPasswordByEmail = (email) => {
  return usersApi.patch(`/auth/${email}/forgot-password`,);
}

export const updateProfil = (candidatId, data) => {
  return protectedApi.patch(`/utilisateurs/${candidatId}/update-profil`, data);
};

export const deleteUser = (id) => {
  return protectedApi.delete("/utilisateurs/" + id);
};

export const updateUser = (user) => {
  return protectedApi.patch("/users/update", user);
};



export const getUserById = (idUser) => {
  return usersApi.get(`/users/getUserById/${idUser}`);
};
export const getUserByEmail = (email) => {
  return usersApi.get(`/users/getUserByEmail/${email}`);
};
export const getUserByToken = (token) => {
  return usersApi.get(`/users/getUserByToken/${token}`);
};
export const getConnexion = (login) => {
  //  getDeconnexion(); // Supprime les cookies côté serveur
  // return protectedApi.post("/auth/logout"); // Supprime les cookies côté serveur
  return protectedApi.post("/auth/signin", login);
  // return protectedApi.post("/auth/signin", login);
};


export const getDeconnexion = () => {
  return protectedApi.post("/auth/logout");
};

export const updateEtatActiverDesactiver = (user) => {
  return usersApi.patch("/users/updateEtat", user);
};

export const addRole = (role) => {
  return usersApi.post("/role/addRole", role);
};

export const getAllRoles = () => {
  return usersApi.get(`/role/getAllRoles`);
};

export const deleteRole = (id) => {
  return usersApi.delete(`/role/deleteRole/${id}`);
};

export const updateRole = (role) => {
  return usersApi.put("/role/updateRole", role);
};

export const getRoleByUser = (userId) => {
  return usersApi.get(`/role/getRoleByUser/${userId}`);
};

export const getRoleById = (roleId) => {
  return usersApi.get(`/role/getRoleById/${roleId}`);
};
