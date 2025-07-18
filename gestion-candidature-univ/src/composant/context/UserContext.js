import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDeconnexion, getUserConnected } from '../../ServiceAPi/Microservice-User';
import { encryptData } from '../Login';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Données utilisateur
  const [roleAnAuth, setRoleAndAuth] = useState(null); // Rôle + authentification

  const login = (userData) => {
    setUser(userData);
    if (userData?.role && userData?.email) {
      localStorage.setItem("userRole", encryptData(userData.role));
      localStorage.setItem("email", encryptData(userData.email));
    }
  };

  useEffect(() => {
    getUserConnected()
      .then((response) => {
        const userData = response.data;
        setUser(userData);
        localStorage.setItem("userRole", encryptData(userData.role));
        localStorage.setItem("email", encryptData(userData.email));
        setRoleAndAuth({
          role: userData.role,
          auth: !!userData.role
        });
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération de l'utilisateur connecté :", error);
        // Optionnel : rediriger ou nettoyer localStorage
      });
  }, []);

  const logout = () => {
    localStorage.clear();
    getDeconnexion()
      .then(() => {
        setUser(null);
        window.location.href = "/";
      })
      .catch((error) => {
        console.error("Erreur lors de la déconnexion :", error);
      });
  };

  return (
    <UserContext.Provider value={{ user, roleAnAuth, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
