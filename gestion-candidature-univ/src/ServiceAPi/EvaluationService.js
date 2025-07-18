// ServiceAPi/EvaluationService.js
import axios from 'axios';

export const getEvaluationsCount = async () => {
  const response = await axios.get('/evaluations');
  return response.data.length; // suppose que l’API retourne la liste complète
};

export const getStudentsCount = async () => {
  // Si tu as une API pour les étudiants ou sinon gérer côté frontend
  const response = await axios.get('/etudiants'); 
  return response.data.length;
};
