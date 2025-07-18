import React from 'react';

function Accueil() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4 text-center text-teal-600">
        Bienvenue sur le système d’évaluation des étudiants de l’UASZ
      </h1>

      <p className="text-lg text-center mb-8 text-gray-700">
        Ce portail permet la gestion des notes, des EC, des étudiants et des unités d’enseignement (UE).
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg">
          <h2 className="text-xl font-semibold text-indigo-600">👨‍🎓 Étudiants</h2>
          <p className="text-gray-600 mt-2">Voir et gérer les fiches des étudiants inscrits.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg">
          <h2 className="text-xl font-semibold text-green-600">📘 Évaluations</h2>
          <p className="text-gray-600 mt-2">Consulter les évaluations enregistrées ou en ajouter de nouvelles.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg">
          <h2 className="text-xl font-semibold text-purple-600">📚 EC / UE</h2>
          <p className="text-gray-600 mt-2">Explorer les enseignements proposés par l’université.</p>
        </div>
      </div>
    </div>
  );
}

export default Accueil;
