import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import CryptoJS from "crypto-js";
import { useUser } from './context/UserContext';

// Fonction de déchiffrement
export function decryptData(data) {
    const key = "O7+t1sh3o0XiFz3XJKpPLmyHoP6AXlZqm8l/Am78KmY=";// Utilisez la même clé que pour le chiffrement
  const bytes = CryptoJS.AES.decrypt(data, key);
  return bytes.toString(CryptoJS.enc.Utf8);
}

const PrivateRoute = () => {
  const { user } = useUser();
  const encryptedToken = localStorage.getItem("userRole");
  
  // const isAuthenticated = !;
  // return user ? <Outlet /> : <Navigate to="/connexion" />;
  return !!encryptedToken ? <Outlet /> : <Navigate to="/connexion" />;
};

export default PrivateRoute;