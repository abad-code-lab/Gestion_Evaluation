import React, { useEffect, useState } from "react";

export default function DashboardProfesseur() {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
  // const token = localStorage.getItem('token');
  const token = sessionStorage.getItem('token');
  if (!token) {
    setError("Utilisateur non authentifié.");
    setLoading(false);
    return;
  }

  fetch("http://localhost:8080/api/evaluations", {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  })
    .then(res => {
      if (!res.ok) throw new Error("Erreur lors du chargement des évaluations");
      return res.json();
    })
    .then(data => {
      setEvaluations(data);
      setLoading(false);
    })
    .catch(err => {
      setError(err.message);
      setLoading(false);
    });
}, []);


  // Ici, idéalement filtrer par prof. selon token (non illustré)
  useEffect(() => {
    fetch("http://localhost:8080/api/evaluations")
      .then(res => {
        if (!res.ok) throw new Error("Erreur lors du chargement des évaluations");
        return res.json();
      })
      .then(data => {
        setEvaluations(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h2>Tableau de bord Professeur</h2>
      {loading && <p>Chargement des évaluations...</p>}
      {error && <p style={{color: "red"}}>{error}</p>}
      {!loading && !error && (
        <ul>
          {evaluations.map(e => (
            <li key={e.id}>
              Étudiant: {e.inscription.etudiant.nom} {e.inscription.etudiant.prenom} - Note Contrôle: {e.note_controle} - Note Examen: {e.note_examen}
              {/* Ici vous pouvez ajouter un formulaire de mise à jour */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
