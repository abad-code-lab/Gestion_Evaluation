import React, { useState, useEffect } from 'react';
import { X, BookOpen, Clock, Users, Award, Loader } from 'lucide-react';

const UEECPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedUE, setExpandedUE] = useState(null);
  const [ueData, setUeData] = useState([]);
  const [ecData, setEcData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Token manquant. Veuillez vous connecter.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        };

        console.log("Token envoyé :", token);

        const ueResponse = await fetch('http://localhost:8080/api/ues/external', { headers });
        if (!ueResponse.ok) {
          throw new Error(`Erreur lors de la récupération des UE: ${ueResponse.status} ${ueResponse.statusText}`);
        }
        const ueResult = await ueResponse.json();

        const ecResponse = await fetch('http://localhost:8080/api/ues/ec', { headers });
        if (!ecResponse.ok) {
          throw new Error(`Erreur lors de la récupération des EC: ${ecResponse.status} ${ecResponse.statusText}`);
        }
        const ecResult = await ecResponse.json();

        setUeData(ueResult);
        setEcData(ecResult);
      } catch (err) {
        setError(err.message);
        console.error('Erreur lors du chargement des données:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getECByUE = (ueId) => {
    return ecData.filter(ec => ec.ue && ec.ue.id === ueId);
  };

  const getDescriptionColor = (description) => {
    switch (description) {
      case 'Fondamentale':
        return 'bg-blue-100 text-blue-800';
      case 'Transversale':
        return 'bg-green-100 text-green-800';
      case 'Ouverture':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleUE = (ueId) => {
    setExpandedUE(expandedUE === ueId ? null : ueId);
  };

  const totalCredits = ueData.reduce((sum, ue) => sum + (ue.credit || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow p-8 flex items-center gap-4">
          <Loader className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-700">Chargement des données...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow p-8 max-w-md">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord Académique</h1>
            <p className="text-gray-600 mt-1">Master 1 Informatique - Gestion des UE et EC</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Semestre 1</span>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">M1</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left section */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Programme d'Études</h2>
          <p className="text-gray-600 mb-6">
            Consultez le détail des Unités d'Enseignement (UE) et des Éléments Constitutifs (EC) pour le premier semestre du Master 1 en Informatique.
          </p>
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Informations du Semestre</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700">Formation :</span>
                  <span className="ml-2 text-blue-900 font-medium">Master Informatique</span>
                </div>
                <div>
                  <span className="text-blue-700">Niveau :</span>
                  <span className="ml-2 text-blue-900 font-medium">M1</span>
                </div>
                <div>
                  <span className="text-blue-700">Semestre :</span>
                  <span className="ml-2 text-blue-900 font-medium">S1</span>
                </div>
                <div>
                  <span className="text-blue-700">Classe :</span>
                  <span className="ml-2 text-blue-900 font-medium">M1_INFO</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-200 flex items-center gap-2 w-full sm:w-auto"
            >
              <BookOpen className="w-5 h-5" />
              Consulter les UE et EC
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistiques</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total UE :</span>
                <span className="font-semibold text-blue-600">{ueData.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total EC :</span>
                <span className="font-semibold text-green-600">{ecData.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Crédits totaux :</span>
                <span className="font-semibold text-purple-600">{totalCredits}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Types d'Enseignement</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Fondamentale</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Transversale</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Ouverture</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Unités d'Enseignement (UE) et Éléments Constitutifs (EC)</h2>
                <p className="text-blue-100 mt-1">Master 1 Informatique - Semestre 1</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
                aria-label="Fermer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal content */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {ueData.map((ue) => {
                const ecList = getECByUE(ue.id);
                const isExpanded = expandedUE === ue.id;

                return (
                  <div key={ue.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div
                      className="bg-gray-50 p-4 cursor-pointer hover:bg-gray-100 transition-colors flex justify-between items-start"
                      onClick={() => toggleUE(ue.id)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="text-lg font-semibold text-gray-800">{ue.libelle}</h3>
                          <span className="text-sm bg-gray-200 text-gray-700 px-2 py-1 rounded">
                            {ue.code}
                          </span>
                          {ue.description && (
                            <span className={`text-xs px-2 py-1 rounded-full ${getDescriptionColor(ue.description)}`}>
                              {ue.description}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                          <div className="flex items-center gap-1">
                            <Award className="w-4 h-4" />
                            <span>{ue.credit || 0} crédits</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>Coeff: {ue.coefficient || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            <span>{ecList.length} EC</span>
                          </div>
                        </div>
                      </div>
                      <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="bg-white">
                        {ecList.length > 0 ? (
                          <div className="divide-y divide-gray-100">
                            {ecList.map((ec) => (
                              <div key={ec.id} className="p-4 hover:bg-gray-50">
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <h4 className="font-medium text-gray-800 mb-1">{ec.libelle}</h4>
                                    <span className="text-sm text-gray-500">{ec.code}</span>
                                  </div>
                                  <span className={`text-xs px-2 py-1 rounded-full ${getDescriptionColor(ec.description)}`}>
                                    {ec.description}
                                  </span>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4 text-blue-500" />
                                    <span className="text-gray-600">CM: {ec.cm || 0}h</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4 text-green-500" />
                                    <span className="text-gray-600">TD: {ec.td || 0}h</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4 text-orange-500" />
                                    <span className="text-gray-600">TP: {ec.tp || 0}h</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4 text-purple-500" />
                                    <span className="text-gray-600">TPE: {ec.tpe || 0}h</span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                                  <div className="flex items-center gap-1">
                                    <Award className="w-4 h-4" />
                                    <span>{ec.credit || 0} crédits</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    <span>Coeff: {ec.coefficient || 0}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 text-center text-gray-500">
                            Aucun élément constitutif trouvé pour cette UE
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Modal footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Total: {ueData.length} UE • {ecData.length} EC
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UEECPage;







// import React, { useState, useEffect } from 'react';
// import { X, BookOpen, Clock, Users, Award, Loader } from 'lucide-react';

// const UEECPage = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [expandedUE, setExpandedUE] = useState(null);
//   const [ueData, setUeData] = useState([]);
//   const [ecData, setEcData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fonction pour récupérer les données depuis les APIs
//   useEffect(() => {
//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       // Appel vers ton propre backend Spring Boot (proxy des données)
//       const ueResponse = await fetch('http://localhost:8080/api/ues/external');
//       if (!ueResponse.ok) {
//         throw new Error(`Erreur lors de la récupération des UE: ${ueResponse.status}`);
//       }
//       const ueResult = await ueResponse.json();

//       const ecResponse = await fetch('http://localhost:8080/api/ues/ec');
//       if (!ecResponse.ok) {
//         throw new Error(`Erreur lors de la récupération des EC: ${ecResponse.status}`);
//       }
//       const ecResult = await ecResponse.json();

//       setUeData(ueResult);
//       setEcData(ecResult);
//     } catch (err) {
//       setError(err.message);
//       console.error('Erreur lors du chargement des données:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchData();
// }, []);


//   // Fonction pour obtenir les EC d'une UE
//   const getECByUE = (ueId) => {
//     return ecData.filter(ec => ec.ue && ec.ue.id === ueId);
//   };

//   // Fonction pour obtenir la couleur selon le type de description
//   const getDescriptionColor = (description) => {
//     switch (description) {
//       case 'Fondamentale':
//         return 'bg-blue-100 text-blue-800';
//       case 'Transversale':
//         return 'bg-green-100 text-green-800';
//       case 'Ouverture':
//         return 'bg-purple-100 text-purple-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const toggleUE = (ueId) => {
//     setExpandedUE(expandedUE === ueId ? null : ueId);
//   };

//   // Calcul des statistiques
//   const totalCredits = ueData.reduce((sum, ue) => sum + (ue.credit || 0), 0);

//   // Affichage pendant le chargement
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <div className="bg-white rounded-lg shadow p-8 flex items-center gap-4">
//           <Loader className="w-6 h-6 animate-spin text-blue-600" />
//           <span className="text-gray-700">Chargement des données...</span>
//         </div>
//       </div>
//     );
//   }

//   // Affichage en cas d'erreur
//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <div className="bg-white rounded-lg shadow p-8 max-w-md">
//           <div className="text-center">
//             <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <X className="w-6 h-6 text-red-600" />
//             </div>
//             <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
//             <p className="text-gray-600 mb-4">{error}</p>
//             <button
//               onClick={() => window.location.reload()}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
//             >
//               Réessayer
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* Header de la page */}
//       <header className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord Académique</h1>
//               <p className="text-gray-600 mt-1">Master 1 Informatique - Gestion des UE et EC</p>
//             </div>
//             <div className="flex items-center gap-4">
//               <span className="text-sm text-gray-500">Semestre 1</span>
//               <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
//                 <span className="text-white text-sm font-medium">M1</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Contenu principal de la page */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Section principale */}
//           <div className="lg:col-span-2">
//             <div className="bg-white rounded-lg shadow p-6">
//               <h2 className="text-xl font-semibold text-gray-800 mb-4">Programme d'Études</h2>
//               <p className="text-gray-600 mb-6">
//                 Consultez le détail des Unités d'Enseignement (UE) et des Éléments Constitutifs (EC) 
//                 pour le premier semestre du Master 1 en Informatique.
//               </p>
              
//               <div className="space-y-4">
//                 <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//                   <h3 className="font-medium text-blue-900 mb-2">Informations du Semestre</h3>
//                   <div className="grid grid-cols-2 gap-4 text-sm">
//                     <div>
//                       <span className="text-blue-700">Formation :</span>
//                       <span className="ml-2 text-blue-900 font-medium">Master Informatique</span>
//                     </div>
//                     <div>
//                       <span className="text-blue-700">Niveau :</span>
//                       <span className="ml-2 text-blue-900 font-medium">M1</span>
//                     </div>
//                     <div>
//                       <span className="text-blue-700">Semestre :</span>
//                       <span className="ml-2 text-blue-900 font-medium">S1</span>
//                     </div>
//                     <div>
//                       <span className="text-blue-700">Classe :</span>
//                       <span className="ml-2 text-blue-900 font-medium">M1_INFO</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Bouton pour ouvrir le modal */}
//                 <button
//                   onClick={() => setIsModalOpen(true)}
//                   className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-200 flex items-center gap-2 w-full sm:w-auto"
//                 >
//                   <BookOpen className="w-5 h-5" />
//                   Consulter les UE et EC
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Sidebar */}
//           <div className="space-y-6">
//             {/* Statistiques rapides */}
//             <div className="bg-white rounded-lg shadow p-6">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">Statistiques</h3>
//               <div className="space-y-4">
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600">Total UE :</span>
//                   <span className="font-semibold text-blue-600">{ueData.length}</span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600">Total EC :</span>
//                   <span className="font-semibold text-green-600">{ecData.length}</span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600">Crédits totaux :</span>
//                   <span className="font-semibold text-purple-600">{totalCredits}</span>
//                 </div>
//               </div>
//             </div>

//             {/* Types d'enseignement */}
//             <div className="bg-white rounded-lg shadow p-6">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">Types d'Enseignement</h3>
//               <div className="space-y-3">
//                 <div className="flex items-center gap-2">
//                   <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
//                   <span className="text-sm text-gray-600">Fondamentale</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="w-3 h-3 bg-green-500 rounded-full"></div>
//                   <span className="text-sm text-gray-600">Transversale</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
//                   <span className="text-sm text-gray-600">Ouverture</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>

//       {/* Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
//             {/* Header du modal */}
//             <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex justify-between items-center">
//               <div>
//                 <h2 className="text-2xl font-bold">Unités d'Enseignement (UE) et Éléments Constitutifs (EC)</h2>
//                 <p className="text-blue-100 mt-1">Master 1 Informatique - Semestre 1</p>
//               </div>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
//               >
//                 <X className="w-6 h-6" />
//               </button>
//             </div>

//             {/* Contenu du modal */}
//             <div className="p-6 overflow-y-auto max-h-[70vh]">
//               <div className="space-y-4">
//                 {ueData.map((ue) => {
//                   const ecList = getECByUE(ue.id);
//                   const isExpanded = expandedUE === ue.id;
                  
//                   return (
//                     <div key={ue.id} className="border border-gray-200 rounded-lg overflow-hidden">
//                       {/* UE Header */}
//                       <div
//                         className="bg-gray-50 p-4 cursor-pointer hover:bg-gray-100 transition-colors"
//                         onClick={() => toggleUE(ue.id)}
//                       >
//                         <div className="flex justify-between items-start">
//                           <div className="flex-1">
//                             <div className="flex items-center gap-3 mb-2">
//                               <h3 className="text-lg font-semibold text-gray-800">{ue.libelle}</h3>
//                               <span className="text-sm bg-gray-200 text-gray-700 px-2 py-1 rounded">
//                                 {ue.code}
//                               </span>
//                               {ue.description && (
//                                 <span className={`text-xs px-2 py-1 rounded-full ${getDescriptionColor(ue.description)}`}>
//                                   {ue.description}
//                                 </span>
//                               )}
//                             </div>
//                             <div className="flex items-center gap-4 text-sm text-gray-600">
//                               <div className="flex items-center gap-1">
//                                 <Award className="w-4 h-4" />
//                                 <span>{ue.credit || 0} crédits</span>
//                               </div>
//                               <div className="flex items-center gap-1">
//                                 <Users className="w-4 h-4" />
//                                 <span>Coeff: {ue.coefficient || 0}</span>
//                               </div>
//                               <div className="flex items-center gap-1">
//                                 <BookOpen className="w-4 h-4" />
//                                 <span>{ecList.length} EC</span>
//                               </div>
//                             </div>
//                           </div>
//                           <div className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
//                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                             </svg>
//                           </div>
//                         </div>
//                       </div>

//                       {/* EC List */}
//                       {isExpanded && (
//                         <div className="bg-white">
//                           {ecList.length > 0 ? (
//                             <div className="divide-y divide-gray-100">
//                               {ecList.map((ec) => (
//                                 <div key={ec.id} className="p-4 hover:bg-gray-50">
//                                   <div className="flex justify-between items-start mb-3">
//                                     <div>
//                                       <h4 className="font-medium text-gray-800 mb-1">{ec.libelle}</h4>
//                                       <span className="text-sm text-gray-500">{ec.code}</span>
//                                     </div>
//                                     <span className={`text-xs px-2 py-1 rounded-full ${getDescriptionColor(ec.description)}`}>
//                                       {ec.description}
//                                     </span>
//                                   </div>
                                  
//                                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
//                                     <div className="flex items-center gap-1">
//                                       <Clock className="w-4 h-4 text-blue-500" />
//                                       <span className="text-gray-600">CM: {ec.cm || 0}h</span>
//                                     </div>
//                                     <div className="flex items-center gap-1">
//                                       <Clock className="w-4 h-4 text-green-500" />
//                                       <span className="text-gray-600">TD: {ec.td || 0}h</span>
//                                     </div>
//                                     <div className="flex items-center gap-1">
//                                       <Clock className="w-4 h-4 text-orange-500" />
//                                       <span className="text-gray-600">TP: {ec.tp || 0}h</span>
//                                     </div>
//                                     <div className="flex items-center gap-1">
//                                       <Clock className="w-4 h-4 text-purple-500" />
//                                       <span className="text-gray-600">TPE: {ec.tpe || 0}h</span>
//                                     </div>
//                                   </div>
                                  
//                                   <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
//                                     <div className="flex items-center gap-1">
//                                       <Award className="w-4 h-4" />
//                                       <span>{ec.credit || 0} crédits</span>
//                                     </div>
//                                     <div className="flex items-center gap-1">
//                                       <Users className="w-4 h-4" />
//                                       <span>Coeff: {ec.coefficient || 0}</span>
//                                     </div>
//                                   </div>
//                                 </div>
//                               ))}
//                             </div>
//                           ) : (
//                             <div className="p-4 text-center text-gray-500">
//                               Aucun élément constitutif trouvé pour cette UE
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* Footer du modal */}
//             <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
//               <div className="text-sm text-gray-600">
//                 Total: {ueData.length} UE • {ecData.length} EC
//               </div>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
//               >
//                 Fermer
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UEECPage;