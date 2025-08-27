import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_EVALUATIONS_URL = "http://localhost:8080/api/evaluations";
const API_INSCRIPTIONS_URL = "http://localhost:8080/api/inscriptions";

const GestionEvaluation = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [filteredEvaluations, setFilteredEvaluations] = useState([]);
  const [searchIne, setSearchIne] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(null);

  const [inscriptions, setInscriptions] = useState([]);
  const [filteredInscriptions, setFilteredInscriptions] = useState([]);
  const [inscriptionSearch, setInscriptionSearch] = useState("");

  // Pour gérer les notes saisies inline pour chaque inscription (création)
  // Clé : inscription id, valeur : { noteControle, noteExamen }
  const [newNotes, setNewNotes] = useState({});

  // Pour gérer la modification inline d'une évaluation existante
  const [editNotes, setEditNotes] = useState({ noteControle: "", noteExamen: "" });
  const [editIndex, setEditIndex] = useState(null);

  // Pour contrôler l'affichage de la table création évaluations
  const [showCreationTable, setShowCreationTable] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();

  // Charger toutes les évaluations
  const fetchEvaluations = async () => {
    try {
      const res = await fetch(API_EVALUATIONS_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
      const data = await res.json();
      setEvaluations(data);
      setFilteredEvaluations(data);
    } catch (error) {
      console.error("Erreur fetchEvaluations:", error);
      setEvaluations([]);
      setFilteredEvaluations([]);
    }
  };

  // Charger les inscriptions
  const fetchInscriptions = async () => {
    try {
      const res = await fetch(API_INSCRIPTIONS_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
      const data = await res.json();
      setInscriptions(data);
      setFilteredInscriptions(data);
      setShowCreationTable(true); // Réaffiche la liste au nouvel import
    } catch (error) {
      console.error("Erreur chargement inscriptions:", error);
      setInscriptions([]);
      setFilteredInscriptions([]);
    }
  };

  useEffect(() => {
    fetchEvaluations();
    fetchInscriptions();
  }, [token]);

  // Filtrer évaluations selon INE recherché
  useEffect(() => {
    if (!searchIne.trim()) {
      setFilteredEvaluations(evaluations);
    } else {
      const searchLower = searchIne.toLowerCase();
      setFilteredEvaluations(
        evaluations.filter((ev) =>
          ev.inscription?.etudiant?.matricule?.toLowerCase().includes(searchLower)
        )
      );
    }
  }, [searchIne, evaluations]);

  // Filtrer inscriptions selon recherche
  useEffect(() => {
    if (!inscriptionSearch.trim()) {
      setFilteredInscriptions(inscriptions);
    } else {
      const lower = inscriptionSearch.toLowerCase();
      setFilteredInscriptions(
        inscriptions.filter((insc) => {
          const etu = insc.etudiant || {};
          const ec = insc.ec || {};
          const ue = ec.ue || {};
          return (
            etu.matricule?.toLowerCase().includes(lower) ||
            etu.nom?.toLowerCase().includes(lower) ||
            etu.prenom?.toLowerCase().includes(lower) ||
            ec.intitule?.toLowerCase().includes(lower) ||
            ue.intitule?.toLowerCase().includes(lower) ||
            insc.anneeInscription?.toString().includes(lower)
          );
        })
      );
    }
  }, [inscriptionSearch, inscriptions]);

  // Calcul automatique moyenne EC = noteControle * 0.3 + noteExamen * 0.7 si valides
  const calcMoyenne = (noteControle, noteExamen) => {
    const nc = parseFloat(noteControle);
    const ne = parseFloat(noteExamen);
    if (
      isNaN(nc) ||
      isNaN(ne) ||
      nc < 0 ||
      nc > 20 ||
      ne < 0 ||
      ne > 20
    )
      return "—";
    return (nc * 0.3 + ne * 0.7).toFixed(2);
  };

  // Sauvegarder les évaluations créées depuis les nouvelles notes
  const saveNewEvaluations = async () => {
    const evaluationsToCreate = Object.entries(newNotes)
      .map(([inscriptionId, notes]) => {
        const idNum = parseInt(inscriptionId, 10);
        const noteControleNum = parseFloat(notes.noteControle);
        const noteExamenNum = parseFloat(notes.noteExamen);
        if (
          isNaN(noteControleNum) ||
          noteControleNum < 0 ||
          noteControleNum > 20 ||
          isNaN(noteExamenNum) ||
          noteExamenNum < 0 ||
          noteExamenNum > 20
        ) {
          return null;
        }
        return {
          noteControle: noteControleNum,
          noteExamen: noteExamenNum,
          inscription: { id: idNum },
        };
      })
      .filter((ev) => ev !== null);

    if (evaluationsToCreate.length === 0) {
      alert("Veuillez saisir au moins une évaluation valide.");
      return;
    }

    setIsSubmitting(true);
    try {
      for (const evaluation of evaluationsToCreate) {
        const res = await fetch(API_EVALUATIONS_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(evaluation),
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || `Erreur HTTP ${res.status}`);
        }
      }
      await fetchEvaluations();
      setNewNotes({});
      setShowCreationTable(false); // masque la liste des inscriptions
      alert("Évaluations créées avec succès !");
    } catch (error) {
      alert("Erreur lors de la sauvegarde : " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Supprimer une évaluation existante
  const deleteEvaluation = async (id) => {
    if (!window.confirm("Confirmer la suppression ?")) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_EVALUATIONS_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
      await fetchEvaluations();
      setSelectedIndex(null);
      alert("Évaluation supprimée avec succès !");
    } catch (err) {
      alert("Erreur lors de la suppression : " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Démarrer la modification inline d'une évaluation sélectionnée
  const startEditEvaluation = (index) => {
    const ev = filteredEvaluations[index];
    setEditNotes({
      noteControle: ev.noteControle != null ? ev.noteControle.toString() : "",
      noteExamen: ev.noteExamen != null ? ev.noteExamen.toString() : "",
    });
    setEditIndex(index);
    setSelectedIndex(index);
  };

  // Annuler la modification inline d'une évaluation
  const cancelEdit = () => {
    setEditIndex(null);
    setEditNotes({ noteControle: "", noteExamen: "" });
  };

  // Valider et sauvegarder la modification inline
  const saveEditEvaluation = async () => {
    const idToUpdate = filteredEvaluations[editIndex].id;
    const noteControleNum = parseFloat(editNotes.noteControle);
    const noteExamenNum = parseFloat(editNotes.noteExamen);

    if (
      isNaN(noteControleNum) ||
      noteControleNum < 0 ||
      noteControleNum > 20 ||
      isNaN(noteExamenNum) ||
      noteExamenNum < 0 ||
      noteExamenNum > 20
    ) {
      alert("Les notes doivent être comprises entre 0 et 20.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_EVALUATIONS_URL}/${idToUpdate}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          noteControle: noteControleNum,
          noteExamen: noteExamenNum,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Erreur HTTP ${res.status}`);
      }
      await fetchEvaluations();
      alert("Évaluation modifiée avec succès !");
      cancelEdit();
    } catch (err) {
      alert("Erreur lors de la modification : " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Gérer la saisie inline des notes (création)
  const handleNoteChange = (inscriptionId, field, value) => {
    setNewNotes((prev) => ({
      ...prev,
      [inscriptionId]: {
        ...prev[inscriptionId],
        [field]: value,
      },
    }));
  };

  // Gérer la saisie inline lors de la modification d'une évaluation
  const handleEditNoteChange = (field, value) => {
    setEditNotes((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const tdStyle = { padding: 8, borderBottom: "1px solid #e5e7eb" };

  return (
    <div
      style={{
        maxWidth: 1100,
        margin: "40px auto",
        padding: 20,
        background: "white",
        borderRadius: 8,
        boxShadow: "0 2px 16px #e0e0e0",
        position: "relative",
      }}
    >
      {/* Bouton de navigation vers DashboardAdmin en haut à gauche */}
      <button
        onClick={() => navigate("/admin/dashboard")}
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          padding: "8px 16px",
          backgroundColor: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
          fontWeight: "600",
          fontSize: 14,
          boxShadow: "0 2px 8px rgba(37, 99, 235, 0.6)",
          transition: "background-color 0.3s ease",
          zIndex: 10,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1e40af")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
        aria-label="Aller au tableau de bord administrateur"
      >
        ← Dashboard Admin
      </button>

      <h2 style={{ textAlign: "center", marginBottom: 30 }}>Liste des évaluations</h2>

      <div style={{ marginBottom: 15, textAlign: "center" }}>
        <input
          type="text"
          placeholder="Rechercher par Matricule"
          value={searchIne}
          onChange={(e) => setSearchIne(e.target.value)}
          disabled={isSubmitting}
          style={{ padding: 8, fontSize: 16, width: 280, borderRadius: 6, border: "1px solid #ccc" }}
          aria-label="Recherche par matricule"
        />
      </div>

      {filteredEvaluations.length === 0 ? (
        <p style={{ textAlign: "center", padding: 20, color: "#888" }}>
          Aucune évaluation créée pour le moment.
        </p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f1f5f9" }}>
              <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Matricule</th>
              <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Nom</th>
              <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Prénom</th>
              <th style={tdStyle}>Code UE</th>
              <th style={tdStyle}>Code EC</th>
              <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Année</th>
              <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Note contrôle</th>
              <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Note examen</th>
              <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Moyenne EC</th>
              <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvaluations.map((ev, index) => (
              <tr
                key={ev.id}
                style={{
                  backgroundColor:
                    selectedIndex === index ? "#e0f2fe" : index % 2 === 0 ? "#f8fafc" : "white",
                }}
                tabIndex={0}
                aria-selected={selectedIndex === index}
                role="row"
              >
                <td style={tdStyle}>{ev.inscription?.etudiant?.matricule || "—"}</td>
                <td style={tdStyle}>{ev.inscription?.etudiant?.nom || "—"}</td>
                <td style={tdStyle}>{ev.inscription?.etudiant?.prenom || "—"}</td>
                <td style={tdStyle}>{ev.inscription?.ec?.ue?.codeUE || "—"}</td>
                <td style={tdStyle}>{ev.inscription?.ec?.codeEC || "—"}</td>
                <td style={tdStyle}>{ev.inscription?.anneeInscription || "—"}</td>

                {editIndex === index ? (
                  <>
                    <td style={tdStyle}>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        step="0.01"
                        value={editNotes.noteControle}
                        onChange={(e) => handleEditNoteChange("noteControle", e.target.value)}
                        disabled={isSubmitting}
                        style={{ width: 80, padding: 4, fontSize: 14, borderRadius: 4 }}
                        aria-label="Modifier note contrôle"
                      />
                    </td>
                    <td style={tdStyle}>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        step="0.01"
                        value={editNotes.noteExamen}
                        onChange={(e) => handleEditNoteChange("noteExamen", e.target.value)}
                        disabled={isSubmitting}
                        style={{ width: 80, padding: 4, fontSize: 14, borderRadius: 4 }}
                        aria-label="Modifier note examen"
                      />
                    </td>
                    <td style={tdStyle}>{calcMoyenne(editNotes.noteControle, editNotes.noteExamen)}</td>
                    <td style={tdStyle}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "start" }}>
                        <button
                          onClick={saveEditEvaluation}
                          disabled={isSubmitting}
                          style={{
                            padding: "8px 20px",
                            backgroundColor: "#10b981",
                            color: "white",
                            border: "none",
                            borderRadius: 8,
                            cursor: "pointer",
                            fontWeight: "600",
                            fontSize: 14,
                            width: "100%",
                          }}
                          aria-label="Enregistrer la modification"
                        >
                          Enregistrer
                        </button>
                        <button
                          onClick={cancelEdit}
                          disabled={isSubmitting}
                          style={{
                            padding: "8px 20px",
                            backgroundColor: "#ef4444",
                            color: "white",
                            border: "none",
                            borderRadius: 8,
                            cursor: "pointer",
                            fontWeight: "600",
                            fontSize: 14,
                            width: "100%",
                          }}
                          aria-label="Annuler la modification"
                        >
                          Annuler
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td style={tdStyle}>{ev.noteControle != null ? ev.noteControle : "—"}</td>
                    <td style={tdStyle}>{ev.noteExamen != null ? ev.noteExamen : "—"}</td>
                    <td style={tdStyle}>{calcMoyenne(ev.noteControle, ev.noteExamen)}</td>
                    <td style={tdStyle}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "start" }}>
                        <button
                          onClick={() => startEditEvaluation(index)}
                          disabled={isSubmitting}
                          style={{
                            padding: "8px 20px",
                            backgroundColor: "#10b981",
                            color: "white",
                            border: "none",
                            borderRadius: 8,
                            cursor: "pointer",
                            fontWeight: "600",
                            fontSize: 14,
                            width: "100%",
                          }}
                          aria-label="Modifier cette évaluation"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => deleteEvaluation(ev.id)}
                          disabled={isSubmitting}
                          style={{
                            padding: "8px 20px",
                            backgroundColor: "#ef4444",
                            color: "white",
                            border: "none",
                            borderRadius: 8,
                            cursor: "pointer",
                            fontWeight: "600",
                            fontSize: 14,
                            width: "100%",
                          }}
                          aria-label="Supprimer cette évaluation"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showCreationTable && (
        <>
          <h2 style={{ textAlign: "center", margin: "40px 0 20px" }}>
            Création d'évaluations - Liste des inscriptions
          </h2>

          <div style={{ marginBottom: 15, textAlign: "center" }}>
            <input
              type="text"
              placeholder="Filtrer les inscriptions (INE, nom, UE, EC...)"
              value={inscriptionSearch}
              onChange={(e) => setInscriptionSearch(e.target.value)}
              disabled={isSubmitting}
              style={{ padding: 8, fontSize: 16, width: 400, borderRadius: 6, border: "1px solid #ccc" }}
              aria-label="Filtrer les inscriptions"
            />
          </div>

          {filteredInscriptions.length === 0 ? (
            <p style={{ textAlign: "center", padding: 20, color: "#888" }}>
              Aucune inscription trouvée.
            </p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f1f5f9" }}>
                  <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Matricule</th>
                  <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Nom</th>
                  <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Prénom</th>
                  <th style={tdStyle}>Code UE</th>
                  <th style={tdStyle}>Code EC</th>
                  <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Année</th>
                  <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Note contrôle</th>
                  <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Note examen</th>
                  <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Moyenne EC</th>
                </tr>
              </thead>
              <tbody>
                {filteredInscriptions.map((insc) => {
                  const notes = newNotes[insc.id] || { noteControle: "", noteExamen: "" };
                  return (
                    <tr key={insc.id}>
                      <td style={tdStyle}>{insc.etudiant?.matricule || "—"}</td>
                      <td style={tdStyle}>{insc.etudiant?.nom || "—"}</td>
                      <td style={tdStyle}>{insc.etudiant?.prenom || "—"}</td>
                      <td style={tdStyle}>{insc.ec?.ue?.codeUE || "—"}</td>
                      <td style={tdStyle}>{insc.ec?.codeEC || "—"}</td>
                      <td style={tdStyle}>{insc.anneeInscription || "—"}</td>

                      <td style={tdStyle}>
                        <input
                          type="number"
                          min="0"
                          max="20"
                          step="0.01"
                          placeholder="0-20"
                          value={notes.noteControle}
                          onChange={(e) => handleNoteChange(insc.id, "noteControle", e.target.value)}
                          disabled={isSubmitting}
                          style={{ width: "80px", padding: 4, fontSize: 14, borderRadius: 4 }}
                          aria-label={`Note contrôle pour ${insc.etudiant?.matricule}`}
                        />
                      </td>
                      <td style={tdStyle}>
                        <input
                          type="number"
                          min="0"
                          max="20"
                          step="0.01"
                          placeholder="0-20"
                          value={notes.noteExamen}
                          onChange={(e) => handleNoteChange(insc.id, "noteExamen", e.target.value)}
                          disabled={isSubmitting}
                          style={{ width: "80px", padding: 4, fontSize: 14, borderRadius: 4 }}
                          aria-label={`Note examen pour ${insc.etudiant?.matricule}`}
                        />
                      </td>
                      <td style={tdStyle}>{calcMoyenne(notes.noteControle, notes.noteExamen)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          <div style={{ marginTop: 20, textAlign: "right" }}>
            <button
              onClick={saveNewEvaluations}
              disabled={isSubmitting}
              style={{
                padding: "10px 25px",
                backgroundColor: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
              }}
              aria-label="Enregistrer les nouvelles évaluations"
            >
              {isSubmitting ? "En cours..." : "Enregistrer les évaluations"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default GestionEvaluation;