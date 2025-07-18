import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AjouterEvaluation = () => {
  const [etudiants, setEtudiants] = useState([]);
  const [ueSelectionnee, setUeSelectionnee] = useState('');
  const [ecSelectionne, setEcSelectionne] = useState('');
  const [inscriptionId, setInscriptionId] = useState('');
  const [noteControle, setNoteControle] = useState('');
  const [noteExamen, setNoteExamen] = useState('');

  // Appel API pour charger les étudiants
  useEffect(() => {
    axios.get('http://localhost:8091/api/v1/inscriptions')
      .then(response => {
        setEtudiants(response.data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des inscriptions :', error);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      noteControle: parseFloat(noteControle),
      noteExamen: parseFloat(noteExamen),
      inscriptionId: parseInt(inscriptionId)
    };

    try {
      const response = await axios.post('http://localhost:8091/api/v1/evaluations', payload);
      alert('Évaluation ajoutée avec succès');
      // Optionnel : reset
      setNoteControle('');
      setNoteExamen('');
      setInscriptionId('');
    } catch (error) {
      console.error('Erreur lors de l’ajout :', error.response?.data || error);
      alert('Erreur : vérifie les données saisies.');
    }
  };

  return (
    <div className="container">
      <h2>Ajouter une évaluation</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Inscription :</label>
          <select
            value={inscriptionId}
            onChange={(e) => setInscriptionId(e.target.value)}
            required
          >
            <option value="">-- Sélectionner une inscription --</option>
            {etudiants.map((etudiant) => (
              <option key={etudiant.id} value={etudiant.id}>
                {etudiant.etudiant.nom} {etudiant.etudiant.prenom}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Note de contrôle :</label>
          <input
            type="number"
            min="0"
            max="20"
            step="0.01"
            value={noteControle}
            onChange={(e) => setNoteControle(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Note d'examen :</label>
          <input
            type="number"
            min="0"
            max="20"
            step="0.01"
            value={noteExamen}
            onChange={(e) => setNoteExamen(e.target.value)}
            required
          />
        </div>

        <button type="submit">Ajouter</button>
      </form>
    </div>
  );
};

export default AjouterEvaluation;




















// import React, { useState } from 'react';
// import uesData from '../data/ues.json';

// const AjouterEvaluation = ({ etudiant }) => {
//   const [selectedUE, setSelectedUE] = useState(null);
//   const [selectedEC, setSelectedEC] = useState(null);
//   const [noteControle, setNoteControle] = useState('');
//   const [noteExamen, setNoteExamen] = useState('');

//   const handleCreateEvaluation = async () => {
//     const evaluation = {
//       note_controle: parseFloat(noteControle),
//       note_examen: parseFloat(noteExamen),
//       inscription: {
//         id: Date.now(), // ou un identifiant d'inscription généré
//         annee_inscription: new Date().getFullYear(),
//         etudiant: {
//           id: etudiant.id || 1, // valeur simulée si absente
//           nom: etudiant.nom,
//           prenom: etudiant.prenom,
//           matricule: etudiant.ine,
//           email: etudiant.email || 'email@exemple.com'
//         },
//         ec: {
//           id: selectedEC.id,
//           codeEC: selectedEC.codeEC,
//           intitule: selectedEC.intitule,
//           ue: {
//             id: selectedUE.id,
//             codeUE: selectedUE.codeUE,
//             intitule: selectedUE.intitule
//           }
//         }
//       }
//     };

//     try {
//       const response = await fetch('http://localhost:8080/api/evaluations', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(evaluation)
//       });

//       if (response.ok) {
//         alert('Évaluation enregistrée avec succès.');
//       } else {
//         alert('Erreur lors de l’enregistrement.');
//       }
//     } catch (error) {
//       console.error('Erreur :', error);
//     }
//   };

//   return (
//     <div>
//       <h2>Ajouter une évaluation</h2>
//       <p>Étudiant : {etudiant.nom} {etudiant.prenom} ({etudiant.ine})</p>

//       <label>UE : </label>
//       <select onChange={(e) => {
//         const ue = uesData.find(u => u.id === parseInt(e.target.value));
//         setSelectedUE(ue);
//         setSelectedEC(null);
//       }}>
//         <option>Choisir une UE</option>
//         {uesData.map(ue => (
//           <option key={ue.id} value={ue.id}>{ue.intitule}</option>
//         ))}
//       </select>

//       {selectedUE && (
//         <>
//           <label>EC : </label>
//           <select onChange={(e) => {
//             const ec = selectedUE.ecs.find(ec => ec.id === parseInt(e.target.value));
//             setSelectedEC(ec);
//           }}>
//             <option>Choisir un EC</option>
//             {selectedUE.ecs.map(ec => (
//               <option key={ec.id} value={ec.id}>{ec.intitule}</option>
//             ))}
//           </select>
//         </>
//       )}

//       <div>
//         <label>Note contrôle :</label>
//         <input type="number" value={noteControle} onChange={(e) => setNoteControle(e.target.value)} />
//       </div>

//       <div>
//         <label>Note examen :</label>
//         <input type="number" value={noteExamen} onChange={(e) => setNoteExamen(e.target.value)} />
//       </div>

//       <button onClick={handleCreateEvaluation}>Créer Évaluation</button>
//     </div>
//   );
// };

// export default AjouterEvaluation;
