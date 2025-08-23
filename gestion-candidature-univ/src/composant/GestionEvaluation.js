import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_EVALUATIONS_URL = "http://localhost:8080/api/evaluations";
const API_INSCRIPTIONS_URL = "http://localhost:8080/api/inscriptions";

const GestionEvaluation = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [filteredEvaluations, setFilteredEvaluations] = useState([]);
  const [searchIne, setSearchIne] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' or 'edit'
  const [form, setForm] = useState({
    noteControle: "",
    noteExamen: "",
    inscriptionId: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [inscriptions, setInscriptions] = useState([]);
  const [inscriptionSearch, setInscriptionSearch] = useState("");
  const [filteredInscriptions, setFilteredInscriptions] = useState([]);

  const token = sessionStorage.getItem("token");
  const navigate = useNavigate(); // Hook de navigation

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

  // Charger les inscriptions depuis l'API
  const fetchInscriptions = async () => {
    try {
      const res = await fetch(API_INSCRIPTIONS_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
      const data = await res.json();
      setInscriptions(data);
      setFilteredInscriptions(data);
    } catch (error) {
      console.error("Erreur chargement inscriptions:", error);
      setInscriptions([]);
      setFilteredInscriptions([]);
    }
  };

  useEffect(() => {
    fetchEvaluations();
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

  // Charger inscriptions quand modal création s'ouvre
  useEffect(() => {
    if (showModal && modalMode === "create") {
      fetchInscriptions();
      setInscriptionSearch("");
      setForm((f) => ({ ...f, inscriptionId: "" }));
    }
  }, [showModal, modalMode]);

  // Filtrer inscriptions selon recherche dans modal
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

  // Enregistrer évaluation (création/modification)
  const saveEvaluation = async (evaluation, idToUpdate = null) => {
    setIsSubmitting(true);
    try {
      const url = idToUpdate ? `${API_EVALUATIONS_URL}/${idToUpdate}` : API_EVALUATIONS_URL;
      const method = idToUpdate ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
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
      const data = await res.json();

      if (!idToUpdate) {
        // Ajouter en tête
        setEvaluations((prev) => [data, ...prev]);
        setFilteredEvaluations((prev) => [data, ...prev]);
      } else {
        await fetchEvaluations();
      }
      setShowModal(false);
      setSelectedIndex(null);
    } catch (err) {
      alert("Erreur lors de la sauvegarde : " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Supprimer évaluation
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
    } catch (err) {
      alert("Erreur lors de la suppression : " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Gestion soumission formulaire modal
  const handleModalSubmit = (e) => {
    e.preventDefault();
    const inscriptionIdNum = parseInt(form.inscriptionId, 10);
    if (isNaN(inscriptionIdNum) || inscriptionIdNum <= 0) {
      alert("L'ID d'inscription doit être un nombre entier positif.");
      return;
    }
    const noteControleNum = parseFloat(form.noteControle);
    const noteExamenNum = parseFloat(form.noteExamen);
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
    const evaluationToSend = {
      noteControle: noteControleNum,
      noteExamen: noteExamenNum,
      inscription: { id: inscriptionIdNum },
    };
    if (modalMode === "create") saveEvaluation(evaluationToSend);
    else if (modalMode === "edit") {
      const idToUpdate = filteredEvaluations[selectedIndex].id;
      saveEvaluation(evaluationToSend, idToUpdate);
    }
  };

  const handleCreate = () => {
    setModalMode("create");
    setForm({ noteControle: "", noteExamen: "", inscriptionId: "" });
    setShowModal(true);
  };

  const handleEdit = () => {
    if (selectedIndex === null) return;
    setModalMode("edit");
    const ev = filteredEvaluations[selectedIndex];
    setForm({
      noteControle: ev.noteControle?.toString() || "",
      noteExamen: ev.noteExamen?.toString() || "",
      inscriptionId: ev.inscription.id,
    });
    setShowModal(true);
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
        position: "relative", // pour bouton navigation
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

      <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 15 }}>
        <button
          onClick={handleCreate}
          disabled={isSubmitting}
          style={{
            padding: "10px 20px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
          aria-label="Créer une nouvelle évaluation"
        >
          {isSubmitting && modalMode === "create" ? "En cours..." : "Créer évaluation"}
        </button>
        <button
          onClick={handleEdit}
          disabled={selectedIndex === null || isSubmitting}
          style={{
            padding: "10px 20px",
            backgroundColor: "#10b981",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: selectedIndex === null ? "not-allowed" : "pointer",
          }}
          aria-label="Modifier l'évaluation sélectionnée"
        >
          Modifier évaluation
        </button>
        <button
          onClick={() => selectedIndex !== null && deleteEvaluation(filteredEvaluations[selectedIndex].id)}
          disabled={selectedIndex === null || isSubmitting}
          style={{
            padding: "10px 20px",
            backgroundColor: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: 6,
            cursor: selectedIndex === null ? "not-allowed" : "pointer",
          }}
          aria-label="Supprimer l'évaluation sélectionnée"
        >
          Supprimer évaluation
        </button>
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
            </tr>
          </thead>
          <tbody>
            {filteredEvaluations.map((ev, index) => (
              <tr
                key={ev.id}
                onClick={() => setSelectedIndex(index)}
                style={{
                  backgroundColor: selectedIndex === index ? "#e0f2fe" : index % 2 === 0 ? "#f8fafc" : "white",
                  cursor: "pointer",
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
                <td style={tdStyle}>{ev.noteControle != null ? ev.noteControle : "—"}</td>
                <td style={tdStyle}>{ev.noteExamen != null ? ev.noteExamen : "—"}</td>
                <td style={tdStyle}>
                  {ev.inscription?.moyenne != null ? Number(ev.inscription.moyenne).toFixed(2) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal création/modification évaluation */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modalTitle"
        >
          <div
            style={{
              backgroundColor: "white",
              padding: 30,
              borderRadius: 10,
              width: 400,
              boxShadow: "0 2px 15px rgba(0,0,0,0.2)",
            }}
          >
            <h3 id="modalTitle">{modalMode === "create" ? "Créer une évaluation" : "Modifier une évaluation"}</h3>
            <form onSubmit={handleModalSubmit}>
              {modalMode === "create" && (
                <>
                  <label htmlFor="searchInscription">Rechercher une inscription</label>
                  <input
                    id="searchInscription"
                    type="text"
                    placeholder="Recherche par INE, nom, UE, EC"
                    value={inscriptionSearch}
                    onChange={(e) => setInscriptionSearch(e.target.value)}
                    disabled={isSubmitting}
                    style={{ width: "100%", marginBottom: 10, padding: 8 }}
                    autoFocus
                  />
                  <div
                    style={{
                      maxHeight: 150,
                      overflowY: "auto",
                      border: "1px solid #ccc",
                      marginBottom: 15,
                    }}
                  >
                    {filteredInscriptions.length === 0 ? (
                      <p style={{ padding: 8, color: "#888" }}>Aucune inscription trouvée.</p>
                    ) : (
                      filteredInscriptions.map((insc) => (
                        <div
                          key={insc.id}
                          onClick={() => !isSubmitting && setForm((f) => ({ ...f, inscriptionId: insc.id }))}
                          style={{
                            padding: "8px 12px",
                            cursor: isSubmitting ? "default" : "pointer",
                            backgroundColor: form.inscriptionId === insc.id ? "#d1fae5" : "transparent",
                            userSelect: "none",
                          }}
                          tabIndex={0}
                          role="button"
                          aria-pressed={form.inscriptionId === insc.id}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              !isSubmitting && setForm((f) => ({ ...f, inscriptionId: insc.id }));
                            }
                          }}
                        >
                          <strong>{insc.etudiant?.matricule}</strong> - {insc.etudiant?.nom} {insc.etudiant?.prenom} | UE:{" "}
                          {insc.ec?.ue?.codeUE || "—"} | EC: {insc.ec?.codeEC || "—"} | Année: {insc.anneeInscription}
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}

              <label htmlFor="noteControle">Note contrôle</label>
              <input
                id="noteControle"
                type="number"
                step="0.01"
                min="0"
                max="20"
                required
                value={form.noteControle}
                onChange={(e) => setForm((f) => ({ ...f, noteControle: e.target.value }))}
                disabled={isSubmitting}
                autoFocus={modalMode === "edit"}
                style={{ width: "100%", marginBottom: 15, padding: 8 }}
              />

              <label htmlFor="noteExamen">Note examen</label>
              <input
                id="noteExamen"
                type="number"
                step="0.01"
                min="0"
                max="20"
                required
                value={form.noteExamen}
                onChange={(e) => setForm((f) => ({ ...f, noteExamen: e.target.value }))}
                disabled={isSubmitting}
                style={{ width: "100%", marginBottom: 15, padding: 8 }}
              />

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={isSubmitting}
                  style={{ padding: "8px 16px" }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ padding: "8px 16px", backgroundColor: "#10b981", color: "white" }}
                >
                  {isSubmitting ? "En cours..." : modalMode === "create" ? "Créer" : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionEvaluation;



























// import React, { useState, useEffect } from "react";

// const API_EVALUATIONS_URL = "http://localhost:8080/api/evaluations";
// const API_INSCRIPTIONS_URL = "http://localhost:8080/api/inscriptions";

// const GestionEvaluation = () => {
//   const [evaluations, setEvaluations] = useState([]);
//   const [filteredEvaluations, setFilteredEvaluations] = useState([]);
//   const [searchIne, setSearchIne] = useState("");
//   const [selectedIndex, setSelectedIndex] = useState(null);

//   const [showModal, setShowModal] = useState(false);
//   const [modalMode, setModalMode] = useState("create"); // 'create' or 'edit'
//   const [form, setForm] = useState({
//     noteControle: "",
//     noteExamen: "",
//     inscriptionId: "",
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const [inscriptions, setInscriptions] = useState([]);
//   const [inscriptionSearch, setInscriptionSearch] = useState("");
//   const [filteredInscriptions, setFilteredInscriptions] = useState([]);

//   const token = sessionStorage.getItem("token");

//   // Charger toutes les évaluations
//   const fetchEvaluations = async () => {
//     try {
//       const res = await fetch(API_EVALUATIONS_URL, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error(`Erreur ${res.status}`);
//       const data = await res.json();
//       setEvaluations(data);
//     } catch (error) {
//       console.error("Erreur fetchEvaluations:", error);
//       setEvaluations([]);
//     }
//   };

//   // Charger les inscriptions depuis l'API
//   const fetchInscriptions = async () => {
//     try {
//       const res = await fetch(API_INSCRIPTIONS_URL, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error(`Erreur ${res.status}`);
//       const data = await res.json();
//       setInscriptions(data);
//       setFilteredInscriptions(data);
//     } catch (error) {
//       console.error("Erreur chargement inscriptions:", error);
//       setInscriptions([]);
//       setFilteredInscriptions([]);
//     }
//   };

//   useEffect(() => {
//     fetchEvaluations();
//   }, []);

//   // Filtrer évaluations selon INE recherché
//   useEffect(() => {
//     if (!searchIne) {
//       setFilteredEvaluations(evaluations);
//     } else {
//       const searchLower = searchIne.toLowerCase();
//       setFilteredEvaluations(
//         evaluations.filter(
//           (ev) =>
//             ev.inscription?.etudiant?.matricule
//               ?.toLowerCase()
//               .includes(searchLower)
//         )
//       );
//     }
//   }, [searchIne, evaluations]);

//   // Charger inscriptions à l'ouverture modal création
//   useEffect(() => {
//     if (showModal && modalMode === "create") {
//       fetchInscriptions();
//       setInscriptionSearch("");
//       setForm((f) => ({ ...f, inscriptionId: "" }));
//     }
//   }, [showModal, modalMode]);

//   // Filtrer inscriptions selon recherche
//   useEffect(() => {
//     if (!inscriptionSearch) {
//       setFilteredInscriptions(inscriptions);
//     } else {
//       const lower = inscriptionSearch.toLowerCase();
//       setFilteredInscriptions(
//         inscriptions.filter((insc) => {
//           const etu = insc.etudiant || {};
//           const ec = insc.ec || {};
//           const ue = ec.ue || {};
//           return (
//             etu.matricule?.toLowerCase().includes(lower) ||
//             etu.nom?.toLowerCase().includes(lower) ||
//             etu.prenom?.toLowerCase().includes(lower) ||
//             ec.intitule?.toLowerCase().includes(lower) ||
//             ue.intitule?.toLowerCase().includes(lower) ||
//             insc.anneeInscription?.toString().includes(lower)
//           );
//         })
//       );
//     }
//   }, [inscriptionSearch, inscriptions]);

//   // Enregistrer évaluation (création/modification)
//   const saveEvaluation = async (evaluation, idToUpdate = null) => {
//     setIsSubmitting(true);
//     try {
//       const url = idToUpdate ? `${API_EVALUATIONS_URL}/${idToUpdate}` : API_EVALUATIONS_URL;
//       const method = idToUpdate ? "PUT" : "POST";
//       const res = await fetch(url, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(evaluation),
//       });
//       if (!res.ok) {
//         const errorData = await res.json().catch(() => ({}));
//         const message = errorData.message || `Erreur ${res.status}`;
//         throw new Error(message);
//       }
//       const data = await res.json(); // récupération de la nouvelle évaluation créée ou mise à jour

//       if (!idToUpdate) {
//         // Création : insérer la nouvelle évaluation en tête des listes locales
//         setEvaluations((prev) => [data, ...prev]);
//         setFilteredEvaluations((prev) => [data, ...prev]);
//       } else {
//         // Modification : rafraîchir toute la liste
//         await fetchEvaluations();
//       }

//       setShowModal(false);
//       setSelectedIndex(null);
//     } catch (err) {
//       alert("Erreur lors de la sauvegarde : " + err.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Supprimer une évaluation
//   const deleteEvaluation = async (id) => {
//     if (!window.confirm("Confirmer la suppression ?")) return;
//     setIsSubmitting(true);
//     try {
//       const res = await fetch(`${API_EVALUATIONS_URL}/${id}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error(`Erreur ${res.status}`);
//       await fetchEvaluations();
//       setSelectedIndex(null);
//     } catch (err) {
//       alert("Erreur lors de la suppression : " + err.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Soumission du formulaire modal
//   const handleModalSubmit = (e) => {
//     e.preventDefault();
//     const inscriptionIdNum = parseInt(form.inscriptionId, 10);
//     if (isNaN(inscriptionIdNum) || inscriptionIdNum <= 0) {
//       alert("L'ID d'inscription doit être un nombre entier positif.");
//       return;
//     }
//     const noteControleNum = parseFloat(form.noteControle);
//     const noteExamenNum = parseFloat(form.noteExamen);
//     if (
//       isNaN(noteControleNum) ||
//       noteControleNum < 0 ||
//       noteControleNum > 20 ||
//       isNaN(noteExamenNum) ||
//       noteExamenNum < 0 ||
//       noteExamenNum > 20
//     ) {
//       alert("Les notes doivent être comprises entre 0 et 20.");
//       return;
//     }
//     const evaluationToSend = {
//       noteControle: noteControleNum,
//       noteExamen: noteExamenNum,
//       inscription: { id: inscriptionIdNum },
//     };
//     if (modalMode === "create") saveEvaluation(evaluationToSend);
//     else if (modalMode === "edit") {
//       const idToUpdate = filteredEvaluations[selectedIndex].id;
//       saveEvaluation(evaluationToSend, idToUpdate);
//     }
//   };

//   // Ouvrir modal création
//   const handleCreate = () => {
//     setModalMode("create");
//     setForm({ noteControle: "", noteExamen: "", inscriptionId: "" });
//     setShowModal(true);
//   };

//   // Ouvrir modal modification
//   const handleEdit = () => {
//     if (selectedIndex === null) return;
//     setModalMode("edit");
//     const ev = filteredEvaluations[selectedIndex];
//     setForm({
//       noteControle: ev.noteControle?.toString() || "",
//       noteExamen: ev.noteExamen?.toString() || "",
//       inscriptionId: ev.inscription.id,
//     });
//     setShowModal(true);
//   };

//   const tdStyle = { padding: 8, borderBottom: "1px solid #e5e7eb" };

//   return (
//     <div
//       style={{
//         maxWidth: 1100,
//         margin: "40px auto",
//         padding: 20,
//         background: "white",
//         borderRadius: 8,
//         boxShadow: "0 2px 16px #e0e0e0",
//       }}
//     >
//       <h2 style={{ textAlign: "center", marginBottom: 30 }}>Liste des évaluations</h2>

//       <div style={{ marginBottom: 15, textAlign: "center" }}>
//         <input
//           type="text"
//           placeholder="Rechercher par Matricule"
//           value={searchIne}
//           onChange={(e) => setSearchIne(e.target.value)}
//           disabled={isSubmitting}
//           style={{ padding: 8, fontSize: 16, width: 280, borderRadius: 6, border: "1px solid #ccc" }}
//         />
//       </div>

//       <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 15 }}>
//         <button
//           onClick={handleCreate}
//           disabled={isSubmitting}
//           style={{
//             padding: "10px 20px",
//             backgroundColor: "#2563eb",
//             color: "white",
//             border: "none",
//             borderRadius: 6,
//             cursor: "pointer",
//           }}
//         >
//           {isSubmitting && modalMode === "create" ? "En cours..." : "Créer évaluation"}
//         </button>
//         <button
//           onClick={handleEdit}
//           disabled={selectedIndex === null || isSubmitting}
//           style={{
//             padding: "10px 20px",
//             backgroundColor: "#10b981",
//             color: "white",
//             border: "none",
//             borderRadius: 6,
//             cursor: selectedIndex === null ? "not-allowed" : "pointer",
//           }}
//         >
//           Modifier évaluation
//         </button>
//         <button
//           onClick={() => selectedIndex !== null && deleteEvaluation(filteredEvaluations[selectedIndex].id)}
//           disabled={selectedIndex === null || isSubmitting}
//           style={{
//             padding: "10px 20px",
//             backgroundColor: "#ef4444",
//             color: "white",
//             border: "none",
//             borderRadius: 6,
//             cursor: selectedIndex === null ? "not-allowed" : "pointer",
//           }}
//         >
//           Supprimer évaluation
//         </button>
//       </div>

//       {filteredEvaluations.length === 0 ? (
//         <p style={{ textAlign: "center", padding: 20, color: "#888" }}>
//           Aucune évaluation créée pour le moment.
//         </p>
//       ) : (
//         <table style={{ width: "100%", borderCollapse: "collapse" }}>
//           <thead>
//             <tr style={{ backgroundColor: "#f1f5f9" }}>
//               <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Matricule</th>
//               <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Nom</th>
//               <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Prénom</th>
//               <th style={tdStyle}>Code UE</th>
//               <th style={tdStyle}>Code EC</th>
//               <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Année</th>
//               <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Note contrôle</th>
//               <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Note examen</th>
//               <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Moyenne EC</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredEvaluations.map((ev, index) => (
//               <tr
//                 key={ev.id}
//                 onClick={() => setSelectedIndex(index)}
//                 style={{
//                   backgroundColor: selectedIndex === index ? "#e0f2fe" : index % 2 === 0 ? "#f8fafc" : "white",
//                   cursor: "pointer",
//                 }}
//               >
//                 <td style={tdStyle}>{ev.inscription?.etudiant?.matricule || "—"}</td>
//                 <td style={tdStyle}>{ev.inscription?.etudiant?.nom || "—"}</td>
//                 <td style={tdStyle}>{ev.inscription?.etudiant?.prenom || "—"}</td>
//                 <td style={tdStyle}>{ev.inscription?.ec?.ue?.codeUE || "—"}</td>
//                 <td style={tdStyle}>{ev.inscription?.ec?.codeEC || "—"}</td>
//                 <td style={tdStyle}>{ev.inscription?.anneeInscription || "—"}</td>
//                 <td style={tdStyle}>{ev.noteControle != null ? ev.noteControle : "—"}</td>
//                 <td style={tdStyle}>{ev.noteExamen != null ? ev.noteExamen : "—"}</td>
//                 <td style={tdStyle}>
//                   {ev.inscription?.moyenne != null ? Number(ev.inscription.moyenne).toFixed(2) : "—"}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       {showModal && (
//         <div
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             width: "100vw",
//             height: "100vh",
//             backgroundColor: "rgba(0,0,0,0.3)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             zIndex: 100,
//           }}
//         >
//           <div
//             style={{
//               backgroundColor: "white",
//               padding: 30,
//               borderRadius: 10,
//               width: 400,
//               boxShadow: "0 2px 15px rgba(0,0,0,0.2)",
//             }}
//           >
//             <h3>{modalMode === "create" ? "Créer une évaluation" : "Modifier une évaluation"}</h3>
//             <form onSubmit={handleModalSubmit}>
//               {modalMode === "create" && (
//                 <>
//                   <label>Rechercher une inscription</label>
//                   <input
//                     type="text"
//                     placeholder="Recherche par INE, nom, UE, EC"
//                     value={inscriptionSearch}
//                     onChange={(e) => setInscriptionSearch(e.target.value)}
//                     disabled={isSubmitting}
//                     style={{ width: "100%", marginBottom: 10, padding: 8 }}
//                     autoFocus
//                   />
//                   <div style={{ maxHeight: 150, overflowY: "auto", border: "1px solid #ccc", marginBottom: 15 }}>
//                     {filteredInscriptions.length === 0 ? (
//                       <p style={{ padding: 8, color: "#888" }}>Aucune inscription trouvée.</p>
//                     ) : (
//                       filteredInscriptions.map((insc) => (
//                         <div
//                           key={insc.id}
//                           onClick={() => !isSubmitting && setForm((f) => ({ ...f, inscriptionId: insc.id }))}
//                           style={{
//                             padding: "8px 12px",
//                             cursor: isSubmitting ? "default" : "pointer",
//                             backgroundColor: form.inscriptionId === insc.id ? "#d1fae5" : "transparent",
//                             userSelect: "none",
//                           }}
//                         >
//                           <strong>{insc.etudiant?.matricule}</strong> - {insc.etudiant?.nom} {insc.etudiant?.prenom} | UE:{" "}
//                           {insc.ec?.ue?.codeUE || "—"} | EC: {insc.ec?.codeEC || "—"} | Année: {insc.anneeInscription}
//                         </div>
//                       ))
//                     )}
//                   </div>
//                 </>
//               )}

//               <label>Note contrôle</label>
//               <input
//                 type="number"
//                 step="0.01"
//                 min="0"
//                 max="20"
//                 required
//                 value={form.noteControle}
//                 onChange={(e) => setForm((f) => ({ ...f, noteControle: e.target.value }))}
//                 disabled={isSubmitting}
//                 autoFocus={modalMode === "edit"}
//                 style={{ width: "100%", marginBottom: 15, padding: 8 }}
//               />

//               <label>Note examen</label>
//               <input
//                 type="number"
//                 step="0.01"
//                 min="0"
//                 max="20"
//                 required
//                 value={form.noteExamen}
//                 onChange={(e) => setForm((f) => ({ ...f, noteExamen: e.target.value }))}
//                 disabled={isSubmitting}
//                 style={{ width: "100%", marginBottom: 15, padding: 8 }}
//               />

//               <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
//                 <button
//                   type="button"
//                   onClick={() => setShowModal(false)}
//                   disabled={isSubmitting}
//                   style={{ padding: "8px 16px" }}
//                 >
//                   Annuler
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   style={{ padding: "8px 16px", backgroundColor: "#10b981", color: "white" }}
//                 >
//                   {isSubmitting ? "En cours..." : modalMode === "create" ? "Créer" : "Enregistrer"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default GestionEvaluation;



















// import React, { useState, useEffect } from "react";

// const API_EVALUATIONS_URL = "http://localhost:8080/api/evaluations";
// const API_INSCRIPTIONS_URL = "http://localhost:8080/api/inscriptions";

// const GestionEvaluation = () => {
//   const [evaluations, setEvaluations] = useState([]);
//   const [filteredEvaluations, setFilteredEvaluations] = useState([]);
//   const [searchIne, setSearchIne] = useState("");
//   const [selectedIndex, setSelectedIndex] = useState(null);

//   const [showModal, setShowModal] = useState(false);
//   const [modalMode, setModalMode] = useState("create"); // 'create' or 'edit'
//   const [form, setForm] = useState({
//     noteControle: "",
//     noteExamen: "",
//     inscriptionId: "",
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const [inscriptions, setInscriptions] = useState([]);
//   const [inscriptionSearch, setInscriptionSearch] = useState("");
//   const [filteredInscriptions, setFilteredInscriptions] = useState([]);

//   const token = sessionStorage.getItem("token");

//   // Charger toutes les évaluations
//   const fetchEvaluations = async () => {
//     try {
//       const res = await fetch(API_EVALUATIONS_URL, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error(`Erreur ${res.status}`);
//       const data = await res.json();
//       setEvaluations(data);
//     } catch (error) {
//       console.error("Erreur fetchEvaluations:", error);
//       setEvaluations([]);
//     }
//   };

//   // Charger les inscriptions depuis l'API
//   const fetchInscriptions = async () => {
//     try {
//       const res = await fetch(API_INSCRIPTIONS_URL, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error(`Erreur ${res.status}`);
//       const data = await res.json();
//       setInscriptions(data);
//       setFilteredInscriptions(data);
//     } catch (error) {
//       console.error("Erreur chargement inscriptions:", error);
//       setInscriptions([]);
//       setFilteredInscriptions([]);
//     }
//   };

//   useEffect(() => {
//     fetchEvaluations();
//   }, []);

//   // Filtrer évaluations selon INE recherché
//   useEffect(() => {
//     if (!searchIne) {
//       setFilteredEvaluations(evaluations);
//     } else {
//       const searchLower = searchIne.toLowerCase();
//       setFilteredEvaluations(
//         evaluations.filter(
//           (ev) =>
//             ev.inscription?.etudiant?.matricule
//               ?.toLowerCase()
//               .includes(searchLower)
//         )
//       );
//     }
//   }, [searchIne, evaluations]);

//   // Charger inscriptions à l'ouverture modal création
//   useEffect(() => {
//     if (showModal && modalMode === "create") {
//       fetchInscriptions();
//       setInscriptionSearch("");
//       setForm((f) => ({ ...f, inscriptionId: "" }));
//     }
//   }, [showModal, modalMode]);

//   // Filtrer inscriptions selon recherche
//   useEffect(() => {
//     if (!inscriptionSearch) {
//       setFilteredInscriptions(inscriptions);
//     } else {
//       const lower = inscriptionSearch.toLowerCase();
//       setFilteredInscriptions(
//         inscriptions.filter((insc) => {
//           const etu = insc.etudiant || {};
//           const ec = insc.ec || {};
//           const ue = ec.ue || {};
//           return (
//             etu.matricule?.toLowerCase().includes(lower) ||
//             etu.nom?.toLowerCase().includes(lower) ||
//             etu.prenom?.toLowerCase().includes(lower) ||
//             ec.intitule?.toLowerCase().includes(lower) ||
//             ue.intitule?.toLowerCase().includes(lower) ||
//             insc.anneeInscription?.toString().includes(lower)
//           );
//         })
//       );
//     }
//   }, [inscriptionSearch, inscriptions]);

//   // Enregistrer évaluation (création/modification)
//   const saveEvaluation = async (evaluation, idToUpdate = null) => {
//     setIsSubmitting(true);
//     try {
//       const url = idToUpdate ? `${API_EVALUATIONS_URL}/${idToUpdate}` : API_EVALUATIONS_URL;
//       const method = idToUpdate ? "PUT" : "POST";
//       const res = await fetch(url, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(evaluation),
//       });
//       if (!res.ok) {
//         const errorData = await res.json().catch(() => ({}));
//         const message = errorData.message || `Erreur ${res.status}`;
//         throw new Error(message);
//       }
//       await new Promise((r) => setTimeout(r, 300));
//       await fetchEvaluations();
//       setShowModal(false);
//       setSelectedIndex(null);
//     } catch (err) {
//       alert("Erreur lors de la sauvegarde : " + err.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Supprimer une évaluation
//   const deleteEvaluation = async (id) => {
//     if (!window.confirm("Confirmer la suppression ?")) return;
//     setIsSubmitting(true);
//     try {
//       const res = await fetch(`${API_EVALUATIONS_URL}/${id}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error(`Erreur ${res.status}`);
//       await fetchEvaluations();
//       setSelectedIndex(null);
//     } catch (err) {
//       alert("Erreur lors de la suppression : " + err.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Soumission du formulaire modal
//   const handleModalSubmit = (e) => {
//     e.preventDefault();
//     const inscriptionIdNum = parseInt(form.inscriptionId, 10);
//     if (isNaN(inscriptionIdNum) || inscriptionIdNum <= 0) {
//       alert("L'ID d'inscription doit être un nombre entier positif.");
//       return;
//     }
//     const noteControleNum = parseFloat(form.noteControle);
//     const noteExamenNum = parseFloat(form.noteExamen);
//     if (
//       isNaN(noteControleNum) ||
//       noteControleNum < 0 ||
//       noteControleNum > 20 ||
//       isNaN(noteExamenNum) ||
//       noteExamenNum < 0 ||
//       noteExamenNum > 20
//     ) {
//       alert("Les notes doivent être comprises entre 0 et 20.");
//       return;
//     }
//     const evaluationToSend = {
//       noteControle: noteControleNum,
//       noteExamen: noteExamenNum,
//       inscription: { id: inscriptionIdNum },
//     };
//     if (modalMode === "create") saveEvaluation(evaluationToSend);
//     else if (modalMode === "edit") {
//       const idToUpdate = filteredEvaluations[selectedIndex].id;
//       saveEvaluation(evaluationToSend, idToUpdate);
//     }
//   };

//   // Ouvrir modal création
//   const handleCreate = () => {
//     setModalMode("create");
//     setForm({ noteControle: "", noteExamen: "", inscriptionId: "" });
//     setShowModal(true);
//   };

//   // Ouvrir modal modification
//   const handleEdit = () => {
//     if (selectedIndex === null) return;
//     setModalMode("edit");
//     const ev = filteredEvaluations[selectedIndex];
//     setForm({
//       noteControle: ev.noteControle?.toString() || "",
//       noteExamen: ev.noteExamen?.toString() || "",
//       inscriptionId: ev.inscription.id,
//     });
//     setShowModal(true);
//   };

//   const tdStyle = { padding: 8, borderBottom: "1px solid #e5e7eb" };

//   return (
//     <div
//       style={{
//         maxWidth: 1100,
//         margin: "40px auto",
//         padding: 20,
//         background: "white",
//         borderRadius: 8,
//         boxShadow: "0 2px 16px #e0e0e0",
//       }}
//     >
//       <h2 style={{ textAlign: "center", marginBottom: 30 }}>Liste des évaluations</h2>

//       <div style={{ marginBottom: 15, textAlign: "center" }}>
//         <input
//           type="text"
//           placeholder="Rechercher par Matricule"
//           value={searchIne}
//           onChange={(e) => setSearchIne(e.target.value)}
//           disabled={isSubmitting}
//           style={{ padding: 8, fontSize: 16, width: 280, borderRadius: 6, border: "1px solid #ccc" }}
//         />
//       </div>

//       <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 15 }}>
//         <button
//           onClick={handleCreate}
//           disabled={isSubmitting}
//           style={{
//             padding: "10px 20px",
//             backgroundColor: "#2563eb",
//             color: "white",
//             border: "none",
//             borderRadius: 6,
//             cursor: "pointer",
//           }}
//         >
//           {isSubmitting && modalMode === "create" ? "En cours..." : "Créer évaluation"}
//         </button>
//         <button
//           onClick={handleEdit}
//           disabled={selectedIndex === null || isSubmitting}
//           style={{
//             padding: "10px 20px",
//             backgroundColor: "#10b981",
//             color: "white",
//             border: "none",
//             borderRadius: 6,
//             cursor: selectedIndex === null ? "not-allowed" : "pointer",
//           }}
//         >
//           Modifier évaluation
//         </button>
//         <button
//           onClick={() => selectedIndex !== null && deleteEvaluation(filteredEvaluations[selectedIndex].id)}
//           disabled={selectedIndex === null || isSubmitting}
//           style={{
//             padding: "10px 20px",
//             backgroundColor: "#ef4444",
//             color: "white",
//             border: "none",
//             borderRadius: 6,
//             cursor: selectedIndex === null ? "not-allowed" : "pointer",
//           }}
//         >
//           Supprimer évaluation
//         </button>
//       </div>

//       {filteredEvaluations.length === 0 ? (
//         <p style={{ textAlign: "center", padding: 20, color: "#888" }}>
//           Aucune évaluation créée pour le moment.
//         </p>
//       ) : (
//         <table style={{ width: "100%", borderCollapse: "collapse" }}>
//           <thead>
//             <tr style={{ backgroundColor: "#f1f5f9" }}>
//               <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Matricule</th>
//               <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Nom</th>
//               <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Prénom</th>
//               <th style={tdStyle}>Code UE</th>
//               <th style={tdStyle}>Code EC</th>
//               <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Année</th>
//               <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Note contrôle</th>
//               <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Note examen</th>
//               {/* Nouvelle colonne Moyenne EC */}
//               <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Moyenne EC</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredEvaluations.map((ev, index) => (
//               <tr
//                 key={ev.id}
//                 onClick={() => setSelectedIndex(index)}
//                 style={{
//                   backgroundColor: selectedIndex === index ? "#e0f2fe" : index % 2 === 0 ? "#f8fafc" : "white",
//                   cursor: "pointer",
//                 }}
//               >
//                 <td style={tdStyle}>{ev.inscription?.etudiant?.matricule || "—"}</td>
//                 <td style={tdStyle}>{ev.inscription?.etudiant?.nom || "—"}</td>
//                 <td style={tdStyle}>{ev.inscription?.etudiant?.prenom || "—"}</td>
//                 <td style={tdStyle}>{ev.inscription?.ec?.ue?.codeUE || "—"}</td>
//                 <td style={tdStyle}>{ev.inscription?.ec?.codeEC || "—"}</td>
//                 <td style={tdStyle}>{ev.inscription?.anneeInscription || "—"}</td>
//                 <td style={tdStyle}>{ev.noteControle != null ? ev.noteControle : "—"}</td>
//                 <td style={tdStyle}>{ev.noteExamen != null ? ev.noteExamen : "—"}</td>
//                 <td style={tdStyle}>
//                   {/* Affiche la moyenne pour cet EC, arrondie à 2 décimales si disponible */}
//                   {ev.inscription?.moyenne != null
//                     ? Number(ev.inscription.moyenne).toFixed(2)
//                     : "—"}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       {showModal && (
//         <div
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             width: "100vw",
//             height: "100vh",
//             backgroundColor: "rgba(0,0,0,0.3)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             zIndex: 100,
//           }}
//         >
//           <div
//             style={{
//               backgroundColor: "white",
//               padding: 30,
//               borderRadius: 10,
//               width: 400,
//               boxShadow: "0 2px 15px rgba(0,0,0,0.2)",
//             }}
//           >
//             <h3>{modalMode === "create" ? "Créer une évaluation" : "Modifier une évaluation"}</h3>
//             <form onSubmit={handleModalSubmit}>
//               {modalMode === "create" && (
//                 <>
//                   <label>Rechercher une inscription</label>
//                   <input
//                     type="text"
//                     placeholder="Recherche par INE, nom, UE, EC"
//                     value={inscriptionSearch}
//                     onChange={(e) => setInscriptionSearch(e.target.value)}
//                     disabled={isSubmitting}
//                     style={{ width: "100%", marginBottom: 10, padding: 8 }}
//                     autoFocus
//                   />
//                   <div style={{ maxHeight: 150, overflowY: "auto", border: "1px solid #ccc", marginBottom: 15 }}>
//                     {filteredInscriptions.length === 0 ? (
//                       <p style={{ padding: 8, color: "#888" }}>Aucune inscription trouvée.</p>
//                     ) : (
//                       filteredInscriptions.map((insc) => (
//                         <div
//                           key={insc.id}
//                           onClick={() => !isSubmitting && setForm((f) => ({ ...f, inscriptionId: insc.id }))}
//                           style={{
//                             padding: "8px 12px",
//                             cursor: isSubmitting ? "default" : "pointer",
//                             backgroundColor: form.inscriptionId === insc.id ? "#d1fae5" : "transparent",
//                             userSelect: "none",
//                           }}
//                         >
//                           <strong>{insc.etudiant?.matricule}</strong> - {insc.etudiant?.nom} {insc.etudiant?.prenom} | UE:{" "}
//                           {insc.ec?.ue?.codeUE || "—"} | EC: {insc.ec?.codeEC || "—"} | Année: {insc.anneeInscription}
//                         </div>
//                       ))
//                     )}
//                   </div>
//                 </>
//               )}

//               <label>Note contrôle</label>
//               <input
//                 type="number"
//                 step="0.01"
//                 min="0"
//                 max="20"
//                 required
//                 value={form.noteControle}
//                 onChange={(e) => setForm((f) => ({ ...f, noteControle: e.target.value }))}
//                 disabled={isSubmitting}
//                 autoFocus={modalMode === "edit"}
//                 style={{ width: "100%", marginBottom: 15, padding: 8 }}
//               />

//               <label>Note examen</label>
//               <input
//                 type="number"
//                 step="0.01"
//                 min="0"
//                 max="20"
//                 required
//                 value={form.noteExamen}
//                 onChange={(e) => setForm((f) => ({ ...f, noteExamen: e.target.value }))}
//                 disabled={isSubmitting}
//                 style={{ width: "100%", marginBottom: 15, padding: 8 }}
//               />

//               <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
//                 <button
//                   type="button"
//                   onClick={() => setShowModal(false)}
//                   disabled={isSubmitting}
//                   style={{ padding: "8px 16px" }}
//                 >
//                   Annuler
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   style={{ padding: "8px 16px", backgroundColor: "#10b981", color: "white" }}
//                 >
//                   {isSubmitting ? "En cours..." : modalMode === "create" ? "Créer" : "Enregistrer"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default GestionEvaluation;




















// import React, { useState, useEffect } from "react";

// const API_EVALUATIONS_URL = "http://localhost:8080/api/evaluations";
// const API_INSCRIPTIONS_URL = "http://localhost:8080/api/inscriptions";

// const GestionEvaluation = () => {
//   const [evaluations, setEvaluations] = useState([]);
//   const [filteredEvaluations, setFilteredEvaluations] = useState([]);
//   const [searchIne, setSearchIne] = useState("");
//   const [selectedIndex, setSelectedIndex] = useState(null);

//   const [showModal, setShowModal] = useState(false);
//   const [modalMode, setModalMode] = useState("create"); // 'create' or 'edit'
//   const [form, setForm] = useState({
//     noteControle: "",
//     noteExamen: "",
//     inscriptionId: "",
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const [inscriptions, setInscriptions] = useState([]);
//   const [inscriptionSearch, setInscriptionSearch] = useState("");
//   const [filteredInscriptions, setFilteredInscriptions] = useState([]);

//   const token = sessionStorage.getItem("token");

//   // Charger toutes les évaluations
//   const fetchEvaluations = async () => {
//     try {
//       const res = await fetch(API_EVALUATIONS_URL, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error(`Erreur ${res.status}`);
//       const data = await res.json();
//       setEvaluations(data);
//     } catch (error) {
//       console.error("Erreur fetchEvaluations:", error);
//       setEvaluations([]);
//     }
//   };

//   // Charger les inscriptions depuis l'API
//   const fetchInscriptions = async () => {
//     try {
//       const res = await fetch(API_INSCRIPTIONS_URL, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error(`Erreur ${res.status}`);
//       const data = await res.json();
//       setInscriptions(data);
//       setFilteredInscriptions(data);
//     } catch (error) {
//       console.error("Erreur chargement inscriptions:", error);
//       setInscriptions([]);
//       setFilteredInscriptions([]);
//     }
//   };

//   useEffect(() => {
//     fetchEvaluations();
//   }, []);

//   // Filtrer évaluations selon INE recherché
//   useEffect(() => {
//     if (!searchIne) {
//       setFilteredEvaluations(evaluations);
//     } else {
//       const searchLower = searchIne.toLowerCase();
//       setFilteredEvaluations(
//         evaluations.filter(
//           (ev) =>
//             ev.inscription?.etudiant?.matricule
//               ?.toLowerCase()
//               .includes(searchLower)
//         )
//       );
//     }
//   }, [searchIne, evaluations]);

//   // Charger inscriptions à l'ouverture modal création
//   useEffect(() => {
//     if (showModal && modalMode === "create") {
//       fetchInscriptions();
//       setInscriptionSearch("");
//       setForm((f) => ({ ...f, inscriptionId: "" }));
//     }
//   }, [showModal, modalMode]);

//   // Filtrer inscriptions selon recherche
//   useEffect(() => {
//     if (!inscriptionSearch) {
//       setFilteredInscriptions(inscriptions);
//     } else {
//       const lower = inscriptionSearch.toLowerCase();
//       setFilteredInscriptions(
//         inscriptions.filter((insc) => {
//           const etu = insc.etudiant || {};
//           const ec = insc.ec || {};
//           const ue = ec.ue || {};
//           return (
//             etu.matricule?.toLowerCase().includes(lower) ||
//             etu.nom?.toLowerCase().includes(lower) ||
//             etu.prenom?.toLowerCase().includes(lower) ||
//             ec.intitule?.toLowerCase().includes(lower) ||
//             ue.intitule?.toLowerCase().includes(lower) ||
//             insc.anneeInscription?.toString().includes(lower)
//           );
//         })
//       );
//     }
//   }, [inscriptionSearch, inscriptions]);

//   // Enregistrer évaluation (création/modification)
//   const saveEvaluation = async (evaluation, idToUpdate = null) => {
//     setIsSubmitting(true);
//     try {
//       const url = idToUpdate ? `${API_EVALUATIONS_URL}/${idToUpdate}` : API_EVALUATIONS_URL;
//       const method = idToUpdate ? "PUT" : "POST";
//       const res = await fetch(url, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(evaluation),
//       });
//       if (!res.ok) {
//         const errorData = await res.json().catch(() => ({}));
//         const message = errorData.message || `Erreur ${res.status}`;
//         throw new Error(message);
//       }
//       await new Promise((r) => setTimeout(r, 300));
//       await fetchEvaluations();
//       setShowModal(false);
//       setSelectedIndex(null);
//     } catch (err) {
//       alert("Erreur lors de la sauvegarde : " + err.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Supprimer une évaluation
//   const deleteEvaluation = async (id) => {
//     if (!window.confirm("Confirmer la suppression ?")) return;
//     setIsSubmitting(true);
//     try {
//       const res = await fetch(`${API_EVALUATIONS_URL}/${id}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error(`Erreur ${res.status}`);
//       await fetchEvaluations();
//       setSelectedIndex(null);
//     } catch (err) {
//       alert("Erreur lors de la suppression : " + err.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Soumission du formulaire modal
//   const handleModalSubmit = (e) => {
//     e.preventDefault();
//     const inscriptionIdNum = parseInt(form.inscriptionId, 10);
//     if (isNaN(inscriptionIdNum) || inscriptionIdNum <= 0) {
//       alert("L'ID d'inscription doit être un nombre entier positif.");
//       return;
//     }
//     const noteControleNum = parseFloat(form.noteControle);
//     const noteExamenNum = parseFloat(form.noteExamen);
//     if (
//       isNaN(noteControleNum) ||
//       noteControleNum < 0 ||
//       noteControleNum > 20 ||
//       isNaN(noteExamenNum) ||
//       noteExamenNum < 0 ||
//       noteExamenNum > 20
//     ) {
//       alert("Les notes doivent être comprises entre 0 et 20.");
//       return;
//     }
//     const evaluationToSend = {
//       noteControle: noteControleNum,
//       noteExamen: noteExamenNum,
//       inscription: { id: inscriptionIdNum },
//     };
//     if (modalMode === "create") saveEvaluation(evaluationToSend);
//     else if (modalMode === "edit") {
//       const idToUpdate = filteredEvaluations[selectedIndex].id;
//       saveEvaluation(evaluationToSend, idToUpdate);
//     }
//   };

//   // Ouvrir modal création
//   const handleCreate = () => {
//     setModalMode("create");
//     setForm({ noteControle: "", noteExamen: "", inscriptionId: "" });
//     setShowModal(true);
//   };

//   // Ouvrir modal modification
//   const handleEdit = () => {
//     if (selectedIndex === null) return;
//     setModalMode("edit");
//     const ev = filteredEvaluations[selectedIndex];
//     setForm({
//       noteControle: ev.noteControle?.toString() || "",
//       noteExamen: ev.noteExamen?.toString() || "",
//       inscriptionId: ev.inscription.id,
//     });
//     setShowModal(true);
//   };

//   const tdStyle = { padding: 8, borderBottom: "1px solid #e5e7eb" };

//   return (
//     <div
//       style={{
//         maxWidth: 1100,
//         margin: "40px auto",
//         padding: 20,
//         background: "white",
//         borderRadius: 8,
//         boxShadow: "0 2px 16px #e0e0e0",
//       }}
//     >
//       <h2 style={{ textAlign: "center", marginBottom: 30 }}>Liste des évaluations</h2>

//       <div style={{ marginBottom: 15, textAlign: "center" }}>
//         <input
//           type="text"
//           placeholder="Rechercher par Matricule"
//           value={searchIne}
//           onChange={(e) => setSearchIne(e.target.value)}
//           disabled={isSubmitting}
//           style={{ padding: 8, fontSize: 16, width: 280, borderRadius: 6, border: "1px solid #ccc" }}
//         />
//       </div>

//       <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 15 }}>
//         <button
//           onClick={handleCreate}
//           disabled={isSubmitting}
//           style={{
//             padding: "10px 20px",
//             backgroundColor: "#2563eb",
//             color: "white",
//             border: "none",
//             borderRadius: 6,
//             cursor: "pointer",
//           }}
//         >
//           {isSubmitting && modalMode === "create" ? "En cours..." : "Créer évaluation"}
//         </button>
//         <button
//           onClick={handleEdit}
//           disabled={selectedIndex === null || isSubmitting}
//           style={{
//             padding: "10px 20px",
//             backgroundColor: "#10b981",
//             color: "white",
//             border: "none",
//             borderRadius: 6,
//             cursor: selectedIndex === null ? "not-allowed" : "pointer",
//           }}
//         >
//           Modifier évaluation
//         </button>
//         <button
//           onClick={() => selectedIndex !== null && deleteEvaluation(filteredEvaluations[selectedIndex].id)}
//           disabled={selectedIndex === null || isSubmitting}
//           style={{
//             padding: "10px 20px",
//             backgroundColor: "#ef4444",
//             color: "white",
//             border: "none",
//             borderRadius: 6,
//             cursor: selectedIndex === null ? "not-allowed" : "pointer",
//           }}
//         >
//           Supprimer évaluation
//         </button>
//       </div>

//       {filteredEvaluations.length === 0 ? (
//         <p style={{ textAlign: "center", padding: 20, color: "#888" }}>
//           Aucune évaluation créée pour le moment.
//         </p>
//       ) : (
//         <table style={{ width: "100%", borderCollapse: "collapse" }}>
//           <thead>
//             <tr style={{ backgroundColor: "#f1f5f9" }}>
//               <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Matricule</th>
//               <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Nom</th>
//               <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Prénom</th>
//               <th style={tdStyle}>Code UE</th>
//               <th style={tdStyle}>Code EC</th>
//               <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Année</th>
//               <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Note contrôle</th>
//               <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Note examen</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredEvaluations.map((ev, index) => (
//               <tr
//                 key={ev.id}
//                 onClick={() => setSelectedIndex(index)}
//                 style={{
//                   backgroundColor: selectedIndex === index ? "#e0f2fe" : index % 2 === 0 ? "#f8fafc" : "white",
//                   cursor: "pointer",
//                 }}
//               >
//                 <td style={tdStyle}>{ev.inscription?.etudiant?.matricule || "—"}</td>
//                 <td style={tdStyle}>{ev.inscription?.etudiant?.nom || "—"}</td>
//                 <td style={tdStyle}>{ev.inscription?.etudiant?.prenom || "—"}</td>
//                 <td style={tdStyle}>{ev.inscription?.ec?.ue?.codeUE || "—"}</td>
//                 <td style={tdStyle}>{ev.inscription?.ec?.codeEC || "—"}</td>
//                 <td style={tdStyle}>{ev.inscription?.anneeInscription || "—"}</td>
//                 <td style={tdStyle}>{ev.noteControle != null ? ev.noteControle : "—"}</td>
//                 <td style={tdStyle}>{ev.noteExamen != null ? ev.noteExamen : "—"}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       {showModal && (
//         <div
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             width: "100vw",
//             height: "100vh",
//             backgroundColor: "rgba(0,0,0,0.3)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             zIndex: 100,
//           }}
//         >
//           <div
//             style={{
//               backgroundColor: "white",
//               padding: 30,
//               borderRadius: 10,
//               width: 400,
//               boxShadow: "0 2px 15px rgba(0,0,0,0.2)",
//             }}
//           >
//             <h3>{modalMode === "create" ? "Créer une évaluation" : "Modifier une évaluation"}</h3>
//             <form onSubmit={handleModalSubmit}>
//               {modalMode === "create" && (
//                 <>
//                   <label>Rechercher une inscription</label>
//                   <input
//                     type="text"
//                     placeholder="Recherche par INE, nom, UE, EC"
//                     value={inscriptionSearch}
//                     onChange={(e) => setInscriptionSearch(e.target.value)}
//                     disabled={isSubmitting}
//                     style={{ width: "100%", marginBottom: 10, padding: 8 }}
//                     autoFocus
//                   />
//                   <div style={{ maxHeight: 150, overflowY: "auto", border: "1px solid #ccc", marginBottom: 15 }}>
//                     {filteredInscriptions.length === 0 ? (
//                       <p style={{ padding: 8, color: "#888" }}>Aucune inscription trouvée.</p>
//                     ) : (
//                       filteredInscriptions.map((insc) => (
//                         <div
//                           key={insc.id}
//                           onClick={() => !isSubmitting && setForm((f) => ({ ...f, inscriptionId: insc.id }))}
//                           style={{
//                             padding: "8px 12px",
//                             cursor: isSubmitting ? "default" : "pointer",
//                             backgroundColor: form.inscriptionId === insc.id ? "#d1fae5" : "transparent",
//                             userSelect: "none",
//                           }}
//                         >
//                           <strong>{insc.etudiant?.matricule}</strong> - {insc.etudiant?.nom} {insc.etudiant?.prenom} | UE:{" "}
//                           {insc.ec?.ue?.codeUE || "—"} | EC: {insc.ec?.codeEC || "—"} | Année: {insc.anneeInscription}
//                         </div>
//                       ))
//                     )}
//                   </div>
//                 </>
//               )}

//               <label>Note contrôle</label>
//               <input
//                 type="number"
//                 step="0.01"
//                 min="0"
//                 max="20"
//                 required
//                 value={form.noteControle}
//                 onChange={(e) => setForm((f) => ({ ...f, noteControle: e.target.value }))}
//                 disabled={isSubmitting}
//                 autoFocus={modalMode === "edit"}
//                 style={{ width: "100%", marginBottom: 15, padding: 8 }}
//               />

//               <label>Note examen</label>
//               <input
//                 type="number"
//                 step="0.01"
//                 min="0"
//                 max="20"
//                 required
//                 value={form.noteExamen}
//                 onChange={(e) => setForm((f) => ({ ...f, noteExamen: e.target.value }))}
//                 disabled={isSubmitting}
//                 style={{ width: "100%", marginBottom: 15, padding: 8 }}
//               />

//               <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
//                 <button
//                   type="button"
//                   onClick={() => setShowModal(false)}
//                   disabled={isSubmitting}
//                   style={{ padding: "8px 16px" }}
//                 >
//                   Annuler
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   style={{ padding: "8px 16px", backgroundColor: "#10b981", color: "white" }}
//                 >
//                   {isSubmitting ? "En cours..." : modalMode === "create" ? "Créer" : "Enregistrer"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default GestionEvaluation;
















// import React, { useState, useEffect } from "react";

// const API_EVALUATIONS_URL = "http://localhost:8080/api/evaluations";
// const API_INSCRIPTIONS_URL = "http://localhost:8080/api/inscriptions";

// const GestionEvaluation = () => {
//   const [evaluations, setEvaluations] = useState([]);
//   const [filteredEvaluations, setFilteredEvaluations] = useState([]);
//   const [searchIne, setSearchIne] = useState("");
//   const [selectedIndex, setSelectedIndex] = useState(null);

//   const [showModal, setShowModal] = useState(false);
//   const [modalMode, setModalMode] = useState("create"); // 'create' or 'edit'
//   const [form, setForm] = useState({
//     noteControle: "",
//     noteExamen: "",
//     inscriptionId: "",
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const [inscriptions, setInscriptions] = useState([]);
//   const [inscriptionSearch, setInscriptionSearch] = useState("");
//   const [filteredInscriptions, setFilteredInscriptions] = useState([]);

//   const token = sessionStorage.getItem("token");

//   // Charger toutes les évaluations
//   const fetchEvaluations = async () => {
//     try {
//       const res = await fetch(API_EVALUATIONS_URL, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error(`Erreur ${res.status}`);
//       const data = await res.json();
//       setEvaluations(data);
//     } catch (error) {
//       console.error("Erreur fetchEvaluations:", error);
//       setEvaluations([]);
//     }
//   };

//   // Charger les inscriptions depuis l'API
//   const fetchInscriptions = async () => {
//     try {
//       const res = await fetch(API_INSCRIPTIONS_URL, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error(`Erreur ${res.status}`);
//       const data = await res.json();
//       setInscriptions(data);
//       setFilteredInscriptions(data);
//     } catch (error) {
//       console.error("Erreur chargement inscriptions:", error);
//       setInscriptions([]);
//       setFilteredInscriptions([]);
//     }
//   };

//   useEffect(() => {
//     fetchEvaluations();
//   }, []);

//   // Filtrer évaluations selon INE recherché
//   useEffect(() => {
//     if (!searchIne) {
//       setFilteredEvaluations(evaluations);
//     } else {
//       const searchLower = searchIne.toLowerCase();
//       setFilteredEvaluations(
//         evaluations.filter(
//           (ev) =>
//             ev.inscription?.etudiant?.matricule
//               ?.toLowerCase()
//               .includes(searchLower)
//         )
//       );
//     }
//   }, [searchIne, evaluations]);

//   // Charger inscriptions à l'ouverture modal création
//   useEffect(() => {
//     if (showModal && modalMode === "create") {
//       fetchInscriptions();
//       setInscriptionSearch("");
//       setForm((f) => ({ ...f, inscriptionId: "" }));
//     }
//   }, [showModal, modalMode]);

//   // Filtrer inscriptions selon recherche
//   useEffect(() => {
//     if (!inscriptionSearch) {
//       setFilteredInscriptions(inscriptions);
//     } else {
//       const lower = inscriptionSearch.toLowerCase();
//       setFilteredInscriptions(
//         inscriptions.filter((insc) => {
//           const etu = insc.etudiant || {};
//           const ec = insc.ec || {};
//           const ue = ec.ue || {};
//           return (
//             etu.matricule?.toLowerCase().includes(lower) ||
//             etu.nom?.toLowerCase().includes(lower) ||
//             etu.prenom?.toLowerCase().includes(lower) ||
//             ec.intitule?.toLowerCase().includes(lower) ||
//             ue.intitule?.toLowerCase().includes(lower) ||
//             insc.anneeInscription?.toString().includes(lower)
//           );
//         })
//       );
//     }
//   }, [inscriptionSearch, inscriptions]);

//   // Enregistrer évaluation (création/modification)
//   const saveEvaluation = async (evaluation, idToUpdate = null) => {
//     setIsSubmitting(true);
//     try {
//       const url = idToUpdate ? `${API_EVALUATIONS_URL}/${idToUpdate}` : API_EVALUATIONS_URL;
//       const method = idToUpdate ? "PUT" : "POST";
//       const res = await fetch(url, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(evaluation),
//       });
//       if (!res.ok) {
//         const errorData = await res.json().catch(() => ({}));
//         const message = errorData.message || `Erreur ${res.status}`;
//         throw new Error(message);
//       }
//       // Optionnel: petit délai avant rafraîchissement
//       await new Promise((r) => setTimeout(r, 300));
//       await fetchEvaluations();
//       setShowModal(false);
//       setSelectedIndex(null);
//     } catch (err) {
//       alert("Erreur lors de la sauvegarde : " + err.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Supprimer une évaluation
//   const deleteEvaluation = async (id) => {
//     if (!window.confirm("Confirmer la suppression ?")) return;
//     setIsSubmitting(true);
//     try {
//       const res = await fetch(`${API_EVALUATIONS_URL}/${id}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error(`Erreur ${res.status}`);
//       await fetchEvaluations();
//       setSelectedIndex(null);
//     } catch (err) {
//       alert("Erreur lors de la suppression : " + err.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Soumission du formulaire modal
//   const handleModalSubmit = (e) => {
//     e.preventDefault();
//     const inscriptionIdNum = parseInt(form.inscriptionId, 10);
//     if (isNaN(inscriptionIdNum) || inscriptionIdNum <= 0) {
//       alert("L'ID d'inscription doit être un nombre entier positif.");
//       return;
//     }
//     const noteControleNum = parseFloat(form.noteControle);
//     const noteExamenNum = parseFloat(form.noteExamen);
//     if (
//       isNaN(noteControleNum) ||
//       noteControleNum < 0 ||
//       noteControleNum > 20 ||
//       isNaN(noteExamenNum) ||
//       noteExamenNum < 0 ||
//       noteExamenNum > 20
//     ) {
//       alert("Les notes doivent être comprises entre 0 et 20.");
//       return;
//     }
//     const evaluationToSend = {
//       noteControle: noteControleNum,
//       noteExamen: noteExamenNum,
//       inscription: { id: inscriptionIdNum },
//     };
//     if (modalMode === "create") saveEvaluation(evaluationToSend);
//     else if (modalMode === "edit") {
//       const idToUpdate = filteredEvaluations[selectedIndex].id;
//       saveEvaluation(evaluationToSend, idToUpdate);
//     }
//   };

//   // Ouvrir modal création
//   const handleCreate = () => {
//     setModalMode("create");
//     setForm({ noteControle: "", noteExamen: "", inscriptionId: "" });
//     setShowModal(true);
//   };

//   // Ouvrir modal modification
//   const handleEdit = () => {
//     if (selectedIndex === null) return;
//     setModalMode("edit");
//     const ev = filteredEvaluations[selectedIndex];
//     setForm({
//       noteControle: ev.noteControle?.toString() || "",
//       noteExamen: ev.noteExamen?.toString() || "",
//       inscriptionId: ev.inscription.id,
//     });
//     setShowModal(true);
//   };

//   const tdStyle = { padding: 8, borderBottom: "1px solid #e5e7eb" };

//   return (
//     <div
//       style={{
//         maxWidth: 1100,
//         margin: "40px auto",
//         padding: 20,
//         background: "white",
//         borderRadius: 8,
//         boxShadow: "0 2px 16px #e0e0e0",
//       }}
//     >
//       <h2 style={{ textAlign: "center", marginBottom: 30 }}>Liste des évaluations</h2>

//       <div style={{ marginBottom: 15, textAlign: "center" }}>
//         <input
//           type="text"
//           placeholder="Rechercher par Matricule"
//           value={searchIne}
//           onChange={(e) => setSearchIne(e.target.value)}
//           disabled={isSubmitting}
//           style={{ padding: 8, fontSize: 16, width: 280, borderRadius: 6, border: "1px solid #ccc" }}
//         />
//       </div>

//       <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 15 }}>
//         <button
//           onClick={handleCreate}
//           disabled={isSubmitting}
//           style={{
//             padding: "10px 20px",
//             backgroundColor: "#2563eb",
//             color: "white",
//             border: "none",
//             borderRadius: 6,
//             cursor: "pointer",
//           }}
//         >
//           {isSubmitting && modalMode === "create" ? "En cours..." : "Créer évaluation"}
//         </button>
//         <button
//           onClick={handleEdit}
//           disabled={selectedIndex === null || isSubmitting}
//           style={{
//             padding: "10px 20px",
//             backgroundColor: "#10b981",
//             color: "white",
//             border: "none",
//             borderRadius: 6,
//             cursor: selectedIndex === null ? "not-allowed" : "pointer",
//           }}
//         >
//           Modifier évaluation
//         </button>
//         <button
//           onClick={() => selectedIndex !== null && deleteEvaluation(filteredEvaluations[selectedIndex].id)}
//           disabled={selectedIndex === null || isSubmitting}
//           style={{
//             padding: "10px 20px",
//             backgroundColor: "#ef4444",
//             color: "white",
//             border: "none",
//             borderRadius: 6,
//             cursor: selectedIndex === null ? "not-allowed" : "pointer",
//           }}
//         >
//           Supprimer évaluation
//         </button>
//       </div>

//       {filteredEvaluations.length === 0 ? (
//         <p style={{ textAlign: "center", padding: 20, color: "#888" }}>
//           Aucune évaluation créée pour le moment.
//         </p>
//       ) : (
//         <table style={{ width: "100%", borderCollapse: "collapse" }}>
//           <thead>
//             <tr style={{ backgroundColor: "#f1f5f9" }}>
//               <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Matricule</th>
//               <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Nom</th>
//               <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Prénom</th>
//               <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Code UE</th>
//               <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Code EC</th>
//               <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Année</th>
//               <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Note contrôle</th>
//               <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Note examen</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredEvaluations.map((ev, index) => (
//               <tr
//                 key={ev.id}
//                 onClick={() => setSelectedIndex(index)}
//                 style={{
//                   backgroundColor: selectedIndex === index ? "#e0f2fe" : index % 2 === 0 ? "#f8fafc" : "white",
//                   cursor: "pointer",
//                 }}
//               >
//                 <td style={tdStyle}>{ev.inscription?.etudiant?.matricule}</td>
//                 <td style={tdStyle}>{ev.inscription?.etudiant?.nom}</td>
//                 <td style={tdStyle}>{ev.inscription?.etudiant?.prenom}</td>
//                 <td style={tdStyle}>{ev.inscription?.ec?.ue?.intitule}</td>
//                 <td style={tdStyle}>{ev.inscription?.ec?.intitule}</td>
//                 <td style={tdStyle}>{ev.inscription?.anneeInscription}</td>
//                 <td style={tdStyle}>{ev.noteControle}</td>
//                 <td style={tdStyle}>{ev.noteExamen}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       {showModal && (
//         <div
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             width: "100vw",
//             height: "100vh",
//             backgroundColor: "rgba(0,0,0,0.3)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             zIndex: 100,
//           }}
//         >
//           <div
//             style={{
//               backgroundColor: "white",
//               padding: 30,
//               borderRadius: 10,
//               width: 400,
//               boxShadow: "0 2px 15px rgba(0,0,0,0.2)",
//             }}
//           >
//             <h3>{modalMode === "create" ? "Créer une évaluation" : "Modifier une évaluation"}</h3>
//             <form onSubmit={handleModalSubmit}>
//               {modalMode === "create" && (
//                 <>
//                   <label>Rechercher une inscription</label>
//                   <input
//                     type="text"
//                     placeholder="Recherche par INE, nom, UE, EC"
//                     value={inscriptionSearch}
//                     onChange={(e) => setInscriptionSearch(e.target.value)}
//                     disabled={isSubmitting}
//                     style={{ width: "100%", marginBottom: 10, padding: 8 }}
//                     autoFocus
//                   />
//                   <div style={{ maxHeight: 150, overflowY: "auto", border: "1px solid #ccc", marginBottom: 15 }}>
//                     {filteredInscriptions.length === 0 ? (
//                       <p style={{ padding: 8, color: "#888" }}>Aucune inscription trouvée.</p>
//                     ) : (
//                       filteredInscriptions.map((insc) => (
//                         <div
//                           key={insc.id}
//                           onClick={() => !isSubmitting && setForm((f) => ({ ...f, inscriptionId: insc.id }))}
//                           style={{
//                             padding: "8px 12px",
//                             cursor: isSubmitting ? "default" : "pointer",
//                             backgroundColor: form.inscriptionId === insc.id ? "#d1fae5" : "transparent",
//                             userSelect: "none",
//                           }}
//                         >
//                           <strong>{insc.etudiant?.matricule}</strong> - {insc.etudiant?.nom} {insc.etudiant?.prenom} | UE:{" "}
//                           {insc.ec?.ue?.intitule} | EC: {insc.ec?.intitule} | Année: {insc.anneeInscription}
//                         </div>
//                       ))
//                     )}
//                   </div>
//                 </>
//               )}

//               <label>Note contrôle</label>
//               <input
//                 type="number"
//                 step="0.01"
//                 min="0"
//                 max="20"
//                 required
//                 value={form.noteControle}
//                 onChange={(e) => setForm((f) => ({ ...f, noteControle: e.target.value }))}
//                 disabled={isSubmitting}
//                 autoFocus={modalMode === "edit"}
//                 style={{ width: "100%", marginBottom: 15, padding: 8 }}
//               />

//               <label>Note examen</label>
//               <input
//                 type="number"
//                 step="0.01"
//                 min="0"
//                 max="20"
//                 required
//                 value={form.noteExamen}
//                 onChange={(e) => setForm((f) => ({ ...f, noteExamen: e.target.value }))}
//                 disabled={isSubmitting}
//                 style={{ width: "100%", marginBottom: 15, padding: 8 }}
//               />

//               <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
//                 <button
//                   type="button"
//                   onClick={() => setShowModal(false)}
//                   disabled={isSubmitting}
//                   style={{ padding: "8px 16px" }}
//                 >
//                   Annuler
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   style={{ padding: "8px 16px", backgroundColor: "#10b981", color: "white" }}
//                 >
//                   {isSubmitting ? "En cours..." : modalMode === "create" ? "Créer" : "Enregistrer"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default GestionEvaluation;
















// import React, { useState, useEffect } from "react";

// const API_EVALUATIONS_URL = "http://localhost:8080/api/evaluations";
// const API_INSCRIPTIONS_URL = "http://localhost:8080/api/inscriptions";

// const GestionEvaluation = () => {
//   const [evaluations, setEvaluations] = useState([]);
//   const [filteredEvaluations, setFilteredEvaluations] = useState([]);
//   const [searchIne, setSearchIne] = useState("");
//   const [selectedIndex, setSelectedIndex] = useState(null);

//   const [showModal, setShowModal] = useState(false);
//   const [modalMode, setModalMode] = useState("create"); // 'create' ou 'edit'
//   const [form, setForm] = useState({
//     noteControle: "",
//     noteExamen: "",
//     inscriptionId: "",
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const [inscriptions, setInscriptions] = useState([]);
//   const [inscriptionSearch, setInscriptionSearch] = useState("");
//   const [filteredInscriptions, setFilteredInscriptions] = useState([]);

//   const token = sessionStorage.getItem("token");

//   // Charger toutes les évaluations
//   const fetchEvaluations = async () => {
//     try {
//       const res = await fetch(API_EVALUATIONS_URL, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error(`Erreur ${res.status}`);
//       const data = await res.json();
//       setEvaluations(data);
//     } catch (error) {
//       console.error("Erreur fetchEvaluations:", error);
//       setEvaluations([]);
//     }
//   };

//   // Charger les inscriptions depuis l'API
//   const fetchInscriptions = async () => {
//     try {
//       const res = await fetch(API_INSCRIPTIONS_URL, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error(`Erreur ${res.status}`);
//       const data = await res.json();
//       setInscriptions(data);
//       setFilteredInscriptions(data);
//     } catch (error) {
//       console.error("Erreur chargement inscriptions:", error);
//       setInscriptions([]);
//       setFilteredInscriptions([]);
//     }
//   };

//   useEffect(() => {
//     fetchEvaluations();
//   }, []);

//   // Filtrer évaluations selon INE recherché
//   useEffect(() => {
//     if (!searchIne) {
//       setFilteredEvaluations(evaluations);
//     } else {
//       const searchLower = searchIne.toLowerCase();
//       setFilteredEvaluations(
//         evaluations.filter(
//           (ev) =>
//             ev.inscription?.etudiant?.matricule?.toLowerCase().includes(searchLower)
//         )
//       );
//     }
//   }, [searchIne, evaluations]);

//   // Charger inscriptions à l'ouverture modal création
//   useEffect(() => {
//     if (showModal && modalMode === "create") {
//       fetchInscriptions();
//       setInscriptionSearch("");
//       setForm((f) => ({ ...f, inscriptionId: "" }));
//     }
//   }, [showModal, modalMode]);

//   // Filtrer inscriptions selon recherche
//   useEffect(() => {
//     if (!inscriptionSearch) {
//       setFilteredInscriptions(inscriptions);
//     } else {
//       const lower = inscriptionSearch.toLowerCase();
//       setFilteredInscriptions(
//         inscriptions.filter((insc) => {
//           const etu = insc.etudiant || {};
//           const ec = insc.ec || {};
//           const ue = ec.ue || {};
//           return (
//             etu.matricule?.toLowerCase().includes(lower) ||
//             etu.nom?.toLowerCase().includes(lower) ||
//             etu.prenom?.toLowerCase().includes(lower) ||
//             ec.intitule?.toLowerCase().includes(lower) ||
//             ue.intitule?.toLowerCase().includes(lower) ||
//             insc.annee_inscription?.toString().includes(lower)
//           );
//         })
//       );
//     }
//   }, [inscriptionSearch, inscriptions]);

//   // Enregistrer évaluation (création/modification)
//   const saveEvaluation = async (evaluation, idToUpdate = null) => {
//     setIsSubmitting(true);
//     try {
//       const url = idToUpdate ? `${API_EVALUATIONS_URL}/${idToUpdate}` : API_EVALUATIONS_URL;
//       const method = idToUpdate ? "PUT" : "POST";
//       const res = await fetch(url, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(evaluation),
//       });
//       if (!res.ok) {
//         const errorData = await res.json().catch(() => ({}));
//         const message = errorData.message || `Erreur ${res.status}`;
//         throw new Error(message);
//       }
//       // Optionnel: attendre un court délai pour que backend sauvegarde correctement
//       await new Promise((r) => setTimeout(r, 300));
//       await fetchEvaluations();
//       setShowModal(false);
//       setSelectedIndex(null);
//     } catch (err) {
//       alert("Erreur lors de la sauvegarde : " + err.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Supprimer une évaluation
//   const deleteEvaluation = async (id) => {
//     if (!window.confirm("Confirmer la suppression ?")) return;
//     setIsSubmitting(true);
//     try {
//       const res = await fetch(`${API_EVALUATIONS_URL}/${id}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error(`Erreur ${res.status}`);
//       await fetchEvaluations();
//       setSelectedIndex(null);
//     } catch (err) {
//       alert("Erreur lors de la suppression : " + err.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Soumission du formulaire modal
//   const handleModalSubmit = (e) => {
//     e.preventDefault();
//     const inscriptionIdNum = parseInt(form.inscriptionId, 10);
//     if (isNaN(inscriptionIdNum) || inscriptionIdNum <= 0) {
//       alert("L'ID d'inscription doit être un nombre entier positif.");
//       return;
//     }
//     const noteControleNum = parseFloat(form.noteControle);
//     const noteExamenNum = parseFloat(form.noteExamen);
//     if (
//       isNaN(noteControleNum) ||
//       noteControleNum < 0 ||
//       noteControleNum > 20 ||
//       isNaN(noteExamenNum) ||
//       noteExamenNum < 0 ||
//       noteExamenNum > 20
//     ) {
//       alert("Les notes doivent être comprises entre 0 et 20.");
//       return;
//     }
//     const evaluationToSend = {
//       noteControle: noteControleNum,
//       noteExamen: noteExamenNum,
//       inscription: { id: inscriptionIdNum },
//     };
//     if (modalMode === "create") saveEvaluation(evaluationToSend);
//     else if (modalMode === "edit") {
//       const idToUpdate = filteredEvaluations[selectedIndex].id;
//       saveEvaluation(evaluationToSend, idToUpdate);
//     }
//   };

//   // Ouvrir modal création
//   const handleCreate = () => {
//     setModalMode("create");
//     setForm({ noteControle: "", noteExamen: "", inscriptionId: "" });
//     setShowModal(true);
//   };

//   // Ouvrir modal modification
//   const handleEdit = () => {
//     if (selectedIndex === null) return;
//     setModalMode("edit");
//     const ev = filteredEvaluations[selectedIndex];
//     setForm({
//       noteControle: ev.note_controle?.toString() || "",
//       noteExamen: ev.note_examen?.toString() || "",
//       inscriptionId: ev.inscription.id,
//     });
//     setShowModal(true);
//   };

//   return (
//     <div
//       style={{
//         maxWidth: 1100,
//         margin: "40px auto",
//         padding: 20,
//         background: "white",
//         borderRadius: 8,
//         boxShadow: "0 2px 16px #e0e0e0",
//       }}
//     >
//       <h2 style={{ textAlign: "center", marginBottom: 30 }}>Liste des évaluations</h2>

//       <div style={{ marginBottom: 15, textAlign: "center" }}>
//         <input
//           type="text"
//           placeholder="Rechercher par INE"
//           value={searchIne}
//           onChange={(e) => setSearchIne(e.target.value)}
//           disabled={isSubmitting}
//           style={{ padding: 8, fontSize: 16, width: 280, borderRadius: 6, border: "1px solid #ccc" }}
//         />
//       </div>

//       <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 15 }}>
//         <button
//           onClick={handleCreate}
//           disabled={isSubmitting}
//           style={{
//             padding: "10px 20px",
//             backgroundColor: "#2563eb",
//             color: "white",
//             border: "none",
//             borderRadius: 6,
//             cursor: "pointer",
//           }}
//         >
//           {isSubmitting && modalMode === "create" ? "En cours..." : "Créer évaluation"}
//         </button>
//         <button
//           onClick={handleEdit}
//           disabled={selectedIndex === null || isSubmitting}
//           style={{
//             padding: "10px 20px",
//             backgroundColor: "#10b981",
//             color: "white",
//             border: "none",
//             borderRadius: 6,
//             cursor: selectedIndex === null ? "not-allowed" : "pointer",
//           }}
//         >
//           Modifier évaluation
//         </button>
//         <button
//           onClick={() => selectedIndex !== null && deleteEvaluation(filteredEvaluations[selectedIndex].id)}
//           disabled={selectedIndex === null || isSubmitting}
//           style={{
//             padding: "10px 20px",
//             backgroundColor: "#ef4444",
//             color: "white",
//             border: "none",
//             borderRadius: 6,
//             cursor: selectedIndex === null ? "not-allowed" : "pointer",
//           }}
//         >
//           Supprimer évaluation
//         </button>
//       </div>

//       {filteredEvaluations.length === 0 ? (
//         <p style={{ textAlign: "center", padding: 20, color: "#888" }}>
//           Aucune évaluation créée pour le moment.
//         </p>
//       ) : (
//         <table style={{ width: "100%", borderCollapse: "collapse" }}>
//           <thead>
//             <tr style={{ backgroundColor: "#f1f5f9" }}>
//               <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>INE</th>
//               <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Nom</th>
//               <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Prénom</th>
//               <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>UE</th>
//               <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>EC</th>
//               <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Année</th>
//               <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Note contrôle</th>
//               <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Note examen</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredEvaluations.map((ev, index) => (
//               <tr
//                 key={ev.id}
//                 onClick={() => setSelectedIndex(index)}
//                 style={{
//                   backgroundColor: selectedIndex === index ? "#e0f2fe" : index % 2 === 0 ? "#f8fafc" : "white",
//                   cursor: "pointer",
//                 }}
//               >
//                 <td style={{ padding: 8, borderBottom: "1px solid #e5e7eb" }}>{ev.inscription?.etudiant?.matricule}</td>
//                 <td style={{ padding: 8, borderBottom: "1px solid #e5e7eb" }}>{ev.inscription?.etudiant?.nom}</td>
//                 <td style={{ padding: 8, borderBottom: "1px solid #e5e7eb" }}>{ev.inscription?.etudiant?.prenom}</td>
//                 <td style={{ padding: 8, borderBottom: "1px solid #e5e7eb" }}>{ev.inscription?.ec?.ue?.intitule}</td>
//                 <td style={{ padding: 8, borderBottom: "1px solid #e5e7eb" }}>{ev.inscription?.ec?.intitule}</td>
//                 <td style={{ padding: 8, borderBottom: "1px solid #e5e7eb" }}>{ev.inscription?.annee_inscription}</td>
//                 <td style={{ padding: 8, borderBottom: "1px solid #e5e7eb" }}>{ev.note_controle}</td>
//                 <td style={{ padding: 8, borderBottom: "1px solid #e5e7eb" }}>{ev.note_examen}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       {showModal && (
//         <div
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             width: "100vw",
//             height: "100vh",
//             backgroundColor: "rgba(0,0,0,0.3)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             zIndex: 100,
//           }}
//         >
//           <div
//             style={{
//               backgroundColor: "white",
//               padding: 30,
//               borderRadius: 10,
//               width: 400,
//               boxShadow: "0 2px 15px rgba(0,0,0,0.2)",
//             }}
//           >
//             <h3>{modalMode === "create" ? "Créer une évaluation" : "Modifier une évaluation"}</h3>
//             <form onSubmit={handleModalSubmit}>
//               {modalMode === "create" && (
//                 <>
//                   <label>Rechercher une inscription</label>
//                   <input
//                     type="text"
//                     placeholder="Recherche par INE, nom, UE, EC"
//                     value={inscriptionSearch}
//                     onChange={(e) => setInscriptionSearch(e.target.value)}
//                     disabled={isSubmitting}
//                     style={{ width: "100%", marginBottom: 10, padding: 8 }}
//                     autoFocus
//                   />
//                   <div style={{ maxHeight: 150, overflowY: "auto", border: "1px solid #ccc", marginBottom: 15 }}>
//                     {filteredInscriptions.length === 0 ? (
//                       <p style={{ padding: 8, color: "#888" }}>Aucune inscription trouvée.</p>
//                     ) : (
//                       filteredInscriptions.map((insc) => (
//                         <div
//                           key={insc.id}
//                           onClick={() => !isSubmitting && setForm((f) => ({ ...f, inscriptionId: insc.id }))}
//                           style={{
//                             padding: "8px 12px",
//                             cursor: isSubmitting ? "default" : "pointer",
//                             backgroundColor: form.inscriptionId === insc.id ? "#d1fae5" : "transparent",
//                             userSelect: "none",
//                           }}
//                         >
//                           <strong>{insc.etudiant?.matricule}</strong> - {insc.etudiant?.nom} {insc.etudiant?.prenom} | UE:{" "}
//                           {insc.ec?.ue?.intitule} | EC: {insc.ec?.intitule} | Année: {insc.annee_inscription}
//                         </div>
//                       ))
//                     )}
//                   </div>
//                 </>
//               )}

//               <label>Note contrôle</label>
//               <input
//                 type="number"
//                 step="0.01"
//                 min="0"
//                 max="20"
//                 required
//                 value={form.noteControle}
//                 onChange={(e) => setForm((f) => ({ ...f, noteControle: e.target.value }))}
//                 disabled={isSubmitting}
//                 autoFocus={modalMode === "edit"}
//                 style={{ width: "100%", marginBottom: 15, padding: 8 }}
//               />

//               <label>Note examen</label>
//               <input
//                 type="number"
//                 step="0.01"
//                 min="0"
//                 max="20"
//                 required
//                 value={form.noteExamen}
//                 onChange={(e) => setForm((f) => ({ ...f, noteExamen: e.target.value }))}
//                 disabled={isSubmitting}
//                 style={{ width: "100%", marginBottom: 15, padding: 8 }}
//               />

//               <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
//                 <button
//                   type="button"
//                   onClick={() => setShowModal(false)}
//                   disabled={isSubmitting}
//                   style={{ padding: "8px 16px" }}
//                 >
//                   Annuler
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   style={{ padding: "8px 16px", backgroundColor: "#10b981", color: "white" }}
//                 >
//                   {isSubmitting ? "En cours..." : modalMode === "create" ? "Créer" : "Enregistrer"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default GestionEvaluation;





























// import React, { useState, useEffect } from "react";

// const API_EVALUATIONS_URL = "http://localhost:8080/api/evaluations";

// const GestionEvaluation = () => {
//   const [evaluations, setEvaluations] = useState([]);
//   const [filteredEvaluations, setFilteredEvaluations] = useState([]);
//   const [searchIne, setSearchIne] = useState("");
//   const [selectedIndex, setSelectedIndex] = useState(null);

//   const [showModal, setShowModal] = useState(false);
//   const [modalMode, setModalMode] = useState("create"); // 'create' or 'edit'
//   const [form, setForm] = useState({
//     noteControle: "",
//     noteExamen: "",
//     inscriptionId: "",
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const [inscriptions, setInscriptions] = useState([]);
//   const [inscriptionSearch, setInscriptionSearch] = useState("");
//   const [filteredInscriptions, setFilteredInscriptions] = useState([]);

//   // Récupère le token d'authentification dans sessionStorage
//   const token = sessionStorage.getItem("token");

//   // Charger toutes les évaluations depuis le backend
//   const fetchEvaluations = async () => {
//     try {
//       const res = await fetch(API_EVALUATIONS_URL, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error(`Erreur ${res.status}`);
//       const data = await res.json();
//       setEvaluations(data);
//     } catch {
//       setEvaluations([]);
//     }
//   };

//   // Charger les inscriptions depuis localStorage (utilisé dans modal création)
//   const loadInscriptionsFromLocalStorage = () => {
//     try {
//       const stored = localStorage.getItem("inscriptions");
//       return stored ? JSON.parse(stored) : [];
//     } catch {
//       return [];
//     }
//   };

//   // Au montage, chargement des évaluations
//   useEffect(() => {
//     fetchEvaluations();
//   }, []);

//   // Filtrer les évaluations selon recherche INE
//   useEffect(() => {
//     if (!searchIne) {
//       setFilteredEvaluations(evaluations);
//     } else {
//       const searchLower = searchIne.toLowerCase();
//       setFilteredEvaluations(
//         evaluations.filter(
//           (ev) =>
//             ev.inscription?.etudiant?.matricule?.toLowerCase().includes(searchLower)
//         )
//       );
//     }
//   }, [searchIne, evaluations]);

//   // Initialiser et filtrer les inscriptions lors de l'ouverture du modal création
//   useEffect(() => {
//     if (showModal && modalMode === "create") {
//       const insc = loadInscriptionsFromLocalStorage();
//       setInscriptions(insc);
//       setFilteredInscriptions(insc);
//       setInscriptionSearch("");
//     }
//   }, [showModal, modalMode]);

//   // Filtrer inscriptions lors de la recherche dans le modal
//   useEffect(() => {
//     if (!inscriptionSearch) {
//       setFilteredInscriptions(inscriptions);
//     } else {
//       const lower = inscriptionSearch.toLowerCase();
//       setFilteredInscriptions(
//         inscriptions.filter((insc) => {
//           const etu = insc.etudiant || {};
//           const ec = insc.ec || {};
//           const ue = ec.ue || {};
//           return (
//             etu.matricule?.toLowerCase().includes(lower) ||
//             etu.nom?.toLowerCase().includes(lower) ||
//             etu.prenom?.toLowerCase().includes(lower) ||
//             ec.intitule?.toLowerCase().includes(lower) ||
//             ue.intitule?.toLowerCase().includes(lower) ||
//             insc.annee_inscription?.toString().includes(lower)
//           );
//         })
//       );
//     }
//   }, [inscriptionSearch, inscriptions]);

//   // Créer ou modifier une évaluation via l'API
//   const saveEvaluation = async (evaluation, idToUpdate = null) => {
//     setIsSubmitting(true);
//     const url = idToUpdate ? `${API_EVALUATIONS_URL}/${idToUpdate}` : API_EVALUATIONS_URL;
//     const method = idToUpdate ? "PUT" : "POST";
//     try {
//       const res = await fetch(url, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(evaluation),
//       });
//       if (!res.ok) {
//         const errorData = await res.json().catch(() => ({}));
//         const message = errorData.message || `Erreur ${res.status}`;
//         throw new Error(message);
//       }
//       await fetchEvaluations();
//       setShowModal(false);
//       setSelectedIndex(null);
//     } catch (err) {
//       alert("Erreur : " + err.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Supprimer une évaluation via l'API
//   const deleteEvaluation = async (id) => {
//     if (!window.confirm("Confirmer la suppression ?")) return;
//     try {
//       const res = await fetch(`${API_EVALUATIONS_URL}/${id}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error(`Erreur ${res.status}`);
//       await fetchEvaluations();
//       setSelectedIndex(null);
//     } catch (err) {
//       alert("Erreur suppression : " + err.message);
//     }
//   };

//   // Soumission du formulaire dans le modal
//   const handleModalSubmit = (e) => {
//     e.preventDefault();

//     const inscriptionIdNum = parseInt(form.inscriptionId, 10);
//     if (isNaN(inscriptionIdNum) || inscriptionIdNum <= 0) {
//       alert("ID inscription invalide");
//       return;
//     }
//     const noteControleNum = parseFloat(form.noteControle);
//     const noteExamenNum = parseFloat(form.noteExamen);

//     if (
//       isNaN(noteControleNum) ||
//       noteControleNum < 0 ||
//       noteControleNum > 20 ||
//       isNaN(noteExamenNum) ||
//       noteExamenNum < 0 ||
//       noteExamenNum > 20
//     ) {
//       alert("Les notes doivent être comprises entre 0 et 20.");
//       return;
//     }

//     const evaluationToSend = {
//       noteControle: noteControleNum,
//       noteExamen: noteExamenNum,
//       inscription: { id: inscriptionIdNum },
//     };

//     if (modalMode === "create") saveEvaluation(evaluationToSend);
//     else if (modalMode === "edit") {
//       const idToUpdate = filteredEvaluations[selectedIndex].id;
//       saveEvaluation(evaluationToSend, idToUpdate);
//     }
//   };

//   // Ouvrir le modal création
//   const handleCreate = () => {
//     setModalMode("create");
//     setForm({ noteControle: "", noteExamen: "", inscriptionId: "" });
//     setShowModal(true);
//   };

//   // Ouvrir le modal modification
//   const handleEdit = () => {
//     if (selectedIndex === null) return;
//     setModalMode("edit");
//     const ev = filteredEvaluations[selectedIndex];
//     setForm({
//       noteControle: ev.note_controle?.toString() || "",
//       noteExamen: ev.note_examen?.toString() || "",
//       inscriptionId: ev.inscription.id,
//     });
//     setShowModal(true);
//   };

//   return (
//     <div
//       style={{
//         maxWidth: 1100,
//         margin: "40px auto",
//         padding: 20,
//         background: "white",
//         borderRadius: 8,
//         boxShadow: "0 2px 16px #e0e0e0",
//       }}
//     >
//       <h2 style={{ textAlign: "center", marginBottom: 30 }}>Liste des évaluations</h2>

//       <div style={{ marginBottom: 15, textAlign: "center" }}>
//         <input
//           type="text"
//           placeholder="Rechercher par INE"
//           value={searchIne}
//           onChange={(e) => setSearchIne(e.target.value)}
//           disabled={isSubmitting}
//           style={{ padding: 8, fontSize: 16, width: 280, borderRadius: 6, border: "1px solid #ccc" }}
//         />
//       </div>

//       <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 15 }}>
//         <button
//           onClick={handleCreate}
//           disabled={isSubmitting}
//           style={{
//             padding: "10px 20px",
//             backgroundColor: "#2563eb",
//             color: "white",
//             border: "none",
//             borderRadius: 6,
//             cursor: "pointer",
//           }}
//         >
//           {isSubmitting && modalMode === "create" ? "En cours..." : "Créer évaluation"}
//         </button>
//         <button
//           onClick={handleEdit}
//           disabled={selectedIndex === null || isSubmitting}
//           style={{
//             padding: "10px 20px",
//             backgroundColor: "#10b981",
//             color: "white",
//             border: "none",
//             borderRadius: 6,
//             cursor: selectedIndex === null ? "not-allowed" : "pointer",
//           }}
//         >
//           Modifier évaluation
//         </button>
//         <button
//           onClick={() => selectedIndex !== null && deleteEvaluation(filteredEvaluations[selectedIndex].id)}
//           disabled={selectedIndex === null || isSubmitting}
//           style={{
//             padding: "10px 20px",
//             backgroundColor: "#ef4444",
//             color: "white",
//             border: "none",
//             borderRadius: 6,
//             cursor: selectedIndex === null ? "not-allowed" : "pointer",
//           }}
//         >
//           Supprimer évaluation
//         </button>
//       </div>

//       {filteredEvaluations.length === 0 ? (
//         <p style={{ textAlign: "center", padding: 20, color: "#888" }}>
//           Aucune évaluation créée pour le moment.
//         </p>
//       ) : (
//         <table style={{ width: "100%", borderCollapse: "collapse" }}>
//           <thead>
//             <tr style={{ backgroundColor: "#f1f5f9" }}>
//               <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>INE</th>
//               <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Nom</th>
//               <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Prénom</th>
//               <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>UE</th>
//               <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>EC</th>
//               <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Année</th>
//               <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Note contrôle</th>
//               <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Note examen</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredEvaluations.map((ev, index) => (
//               <tr
//                 key={ev.id}
//                 onClick={() => setSelectedIndex(index)}
//                 style={{
//                   backgroundColor: selectedIndex === index ? "#e0f2fe" : index % 2 === 0 ? "#f8fafc" : "white",
//                   cursor: "pointer",
//                 }}
//               >
//                 <td style={{ padding: 8, borderBottom: "1px solid #e5e7eb" }}>{ev.inscription?.etudiant?.matricule}</td>
//                 <td style={{ padding: 8, borderBottom: "1px solid #e5e7eb" }}>{ev.inscription?.etudiant?.nom}</td>
//                 <td style={{ padding: 8, borderBottom: "1px solid #e5e7eb" }}>{ev.inscription?.etudiant?.prenom}</td>
//                 <td style={{ padding: 8, borderBottom: "1px solid #e5e7eb" }}>{ev.inscription?.ec?.ue?.intitule}</td>
//                 <td style={{ padding: 8, borderBottom: "1px solid #e5e7eb" }}>{ev.inscription?.ec?.intitule}</td>
//                 <td style={{ padding: 8, borderBottom: "1px solid #e5e7eb" }}>{ev.inscription?.annee_inscription}</td>
//                 <td style={{ padding: 8, borderBottom: "1px solid #e5e7eb" }}>{ev.note_controle}</td>
//                 <td style={{ padding: 8, borderBottom: "1px solid #e5e7eb" }}>{ev.note_examen}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       {showModal && (
//         <div
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             width: "100vw",
//             height: "100vh",
//             backgroundColor: "rgba(0,0,0,0.3)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             zIndex: 100,
//           }}
//         >
//           <div
//             style={{
//               backgroundColor: "white",
//               padding: 30,
//               borderRadius: 10,
//               width: 400,
//               boxShadow: "0 2px 15px rgba(0,0,0,0.2)",
//             }}
//           >
//             <h3>{modalMode === "create" ? "Créer une évaluation" : "Modifier une évaluation"}</h3>
//             <form onSubmit={handleModalSubmit}>
//               {modalMode === "create" && (
//                 <>
//                   <label>Rechercher une inscription</label>
//                   <input
//                     type="text"
//                     placeholder="Recherche par INE, nom, UE, EC"
//                     value={inscriptionSearch}
//                     onChange={(e) => setInscriptionSearch(e.target.value)}
//                     disabled={isSubmitting}
//                     style={{ width: "100%", marginBottom: 10, padding: 8 }}
//                     autoFocus
//                   />
//                   <div style={{ maxHeight: 150, overflowY: "auto", border: "1px solid #ccc", marginBottom: 15 }}>
//                     {filteredInscriptions.length === 0 ? (
//                       <p style={{ padding: 8, color: "#888" }}>Aucune inscription trouvée.</p>
//                     ) : (
//                       filteredInscriptions.map((insc) => (
//                         <div
//                           key={insc.id}
//                           onClick={() => !isSubmitting && setForm((f) => ({ ...f, inscriptionId: insc.id }))}
//                           style={{
//                             padding: "8px 12px",
//                             cursor: isSubmitting ? "default" : "pointer",
//                             backgroundColor: form.inscriptionId === insc.id ? "#d1fae5" : "transparent",
//                             userSelect: "none",
//                           }}
//                         >
//                           <strong>{insc.etudiant?.matricule}</strong> - {insc.etudiant?.nom} {insc.etudiant?.prenom} | UE:{" "}
//                           {insc.ec?.ue?.intitule} | EC: {insc.ec?.intitule} | Année: {insc.annee_inscription}
//                         </div>
//                       ))
//                     )}
//                   </div>
//                 </>
//               )}

//               <label>Note contrôle</label>
//               <input
//                 type="number"
//                 step="0.01"
//                 min="0"
//                 max="20"
//                 required
//                 value={form.noteControle}
//                 onChange={(e) => setForm((f) => ({ ...f, noteControle: e.target.value }))}
//                 disabled={isSubmitting}
//                 autoFocus={modalMode === "edit"}
//                 style={{ width: "100%", marginBottom: 15, padding: 8 }}
//               />

//               <label>Note examen</label>
//               <input
//                 type="number"
//                 step="0.01"
//                 min="0"
//                 max="20"
//                 required
//                 value={form.noteExamen}
//                 onChange={(e) => setForm((f) => ({ ...f, noteExamen: e.target.value }))}
//                 disabled={isSubmitting}
//                 style={{ width: "100%", marginBottom: 15, padding: 8 }}
//               />

//               <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
//                 <button
//                   type="button"
//                   onClick={() => setShowModal(false)}
//                   disabled={isSubmitting}
//                   style={{ padding: "8px 16px" }}
//                 >
//                   Annuler
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   style={{ padding: "8px 16px", backgroundColor: "#10b981", color: "white" }}
//                 >
//                   {isSubmitting ? "En cours..." : modalMode === "create" ? "Créer" : "Enregistrer"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default GestionEvaluation;










// import React, { useState, useEffect } from "react";

// const API_EVALUATIONS_URL = "http://localhost:8080/api/evaluations";

// const GestionEvaluation = () => {
//   const [evaluations, setEvaluations] = useState([]);
//   const [filteredEvaluations, setFilteredEvaluations] = useState([]);
//   const [searchIne, setSearchIne] = useState("");
//   const [selectedIndex, setSelectedIndex] = useState(null);

//   const [showModal, setShowModal] = useState(false);
//   const [modalMode, setModalMode] = useState("create"); // 'create' or 'edit'
//   const [form, setForm] = useState({
//     noteControle: "",
//     noteExamen: "",
//     inscriptionId: "",
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const [inscriptions, setInscriptions] = useState([]);
//   const [inscriptionSearch, setInscriptionSearch] = useState("");
//   const [filteredInscriptions, setFilteredInscriptions] = useState([]);

//   // Charge token dans sessionStorage
//   const token = sessionStorage.getItem("token");

//   // Charger la liste des évaluations
//   const fetchEvaluations = async () => {
//     try {
//       const res = await fetch(API_EVALUATIONS_URL, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error(`Erreur ${res.status}`);
//       const data = await res.json();
//       setEvaluations(data);
//     } catch {
//       setEvaluations([]);
//     }
//   };

//   // Charger inscriptions depuis localStorage (utilisé dans modal création)
//   const loadInscriptionsFromLocalStorage = () => {
//     try {
//       const stored = localStorage.getItem("inscriptions");
//       return stored ? JSON.parse(stored) : [];
//     } catch {
//       return [];
//     }
//   };

//   useEffect(() => {
//     fetchEvaluations();
//   }, []);

//   // Filtrage des évaluations selon recherche INE
//   useEffect(() => {
//     if (!searchIne) {
//       setFilteredEvaluations(evaluations);
//     } else {
//       const searchLower = searchIne.toLowerCase();
//       setFilteredEvaluations(
//         evaluations.filter(
//           (ev) =>
//             ev.inscription?.etudiant?.matricule?.toLowerCase().includes(searchLower)
//         )
//       );
//     }
//   }, [searchIne, evaluations]);

//   // Init inscriptions et filtre lors ouverture modal create
//   useEffect(() => {
//     if (showModal && modalMode === "create") {
//       const insc = loadInscriptionsFromLocalStorage();
//       setInscriptions(insc);
//       setFilteredInscriptions(insc);
//       setInscriptionSearch("");
//     }
//   }, [showModal, modalMode]);

//   // Filtrage inscriptions recherche
//   useEffect(() => {
//     if (!inscriptionSearch) {
//       setFilteredInscriptions(inscriptions);
//     } else {
//       const lower = inscriptionSearch.toLowerCase();
//       setFilteredInscriptions(
//         inscriptions.filter((insc) => {
//           const etu = insc.etudiant || {};
//           const ec = insc.ec || {};
//           const ue = ec.ue || {};
//           return (
//             etu.matricule?.toLowerCase().includes(lower) ||
//             etu.nom?.toLowerCase().includes(lower) ||
//             etu.prenom?.toLowerCase().includes(lower) ||
//             ec.intitule?.toLowerCase().includes(lower) ||
//             ue.intitule?.toLowerCase().includes(lower) ||
//             insc.annee_inscription?.toString().includes(lower)
//           );
//         })
//       );
//     }
//   }, [inscriptionSearch, inscriptions]);

//   // Création ou mise à jour API
//   const saveEvaluation = async (evaluation, idToUpdate = null) => {
//     setIsSubmitting(true);
//     const url = idToUpdate ? `${API_EVALUATIONS_URL}/${idToUpdate}` : API_EVALUATIONS_URL;
//     const method = idToUpdate ? "PUT" : "POST";
//     try {
//       const res = await fetch(url, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(evaluation),
//       });
//       if (!res.ok) {
//         const errorData = await res.json().catch(() => ({}));
//         const message = errorData.message || `Erreur ${res.status}`;
//         throw new Error(message);
//       }
//       await fetchEvaluations();
//       setShowModal(false);
//       setSelectedIndex(null);
//     } catch (err) {
//       alert("Erreur : " + err.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Suppression API
//   const deleteEvaluation = async (id) => {
//     if (!window.confirm("Confirmer la suppression ?")) return;
//     try {
//       const res = await fetch(`${API_EVALUATIONS_URL}/${id}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error(`Erreur ${res.status}`);
//       await fetchEvaluations();
//       setSelectedIndex(null);
//     } catch (err) {
//       alert("Erreur suppression : " + err.message);
//     }
//   };

//   // Gestion formulaire submit
//   const handleModalSubmit = (e) => {
//     e.preventDefault();

//     const inscriptionIdNum = parseInt(form.inscriptionId, 10);
//     if (isNaN(inscriptionIdNum) || inscriptionIdNum <= 0) {
//       alert("ID inscription invalide");
//       return;
//     }
//     const noteControleNum = parseFloat(form.noteControle);
//     const noteExamenNum = parseFloat(form.noteExamen);

//     if (
//       isNaN(noteControleNum) ||
//       noteControleNum < 0 ||
//       noteControleNum > 20 ||
//       isNaN(noteExamenNum) ||
//       noteExamenNum < 0 ||
//       noteExamenNum > 20
//     ) {
//       alert("Notes doivent être entre 0 et 20");
//       return;
//     }

//     const evaluationToSend = {
//       noteControle: noteControleNum,
//       noteExamen: noteExamenNum,
//       inscription: { id: inscriptionIdNum },
//     };

//     if (modalMode === "create") saveEvaluation(evaluationToSend);
//     else if (modalMode === "edit") {
//       const idToUpdate = filteredEvaluations[selectedIndex].id;
//       saveEvaluation(evaluationToSend, idToUpdate);
//     }
//   };

//   // Ouverture modal création
//   const handleCreate = () => {
//     setModalMode("create");
//     setForm({ noteControle: "", noteExamen: "", inscriptionId: "" });
//     setShowModal(true);
//   };

//   // Ouverture modal modification
//   const handleEdit = () => {
//     if (selectedIndex === null) return;
//     setModalMode("edit");
//     const ev = filteredEvaluations[selectedIndex];
//     setForm({
//       noteControle: ev.note_controle?.toString() || "",
//       noteExamen: ev.note_examen?.toString() || "",
//       inscriptionId: ev.inscription.id,
//     });
//     setShowModal(true);
//   };

//   return (
//     <div style={{ maxWidth: 1100, margin: "40px auto", padding: 20, background: "white", borderRadius: 8, boxShadow: "0 2px 16px #e0e0e0" }}>
//       <h2 style={{ textAlign: "center", marginBottom: 30 }}>Liste des évaluations</h2>
//       <div style={{ marginBottom: 15, textAlign: "center" }}>
//         <input
//           type="text"
//           placeholder="Rechercher par INE"
//           value={searchIne}
//           onChange={(e) => setSearchIne(e.target.value)}
//           disabled={isSubmitting}
//           style={{ padding: 8, fontSize: 16, width: 280, borderRadius: 6, border: "1px solid #ccc" }}
//         />
//       </div>
//       <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 15 }}>
//         <button onClick={handleCreate} disabled={isSubmitting} style={{ padding: "10px 20px", backgroundColor: "#2563eb", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>
//           {isSubmitting && modalMode === "create" ? "En cours..." : "Créer évaluation"}
//         </button>
//         <button onClick={handleEdit} disabled={selectedIndex === null || isSubmitting} style={{ padding: "10px 20px", backgroundColor: "#10b981", color: "white", border: "none", borderRadius: 6, cursor: selectedIndex === null ? "not-allowed" : "pointer" }}>
//           Modifier évaluation
//         </button>
//         <button onClick={() => selectedIndex !== null && deleteEvaluation(filteredEvaluations[selectedIndex].id)} disabled={selectedIndex === null || isSubmitting} style={{ padding: "10px 20px", backgroundColor: "#ef4444", color: "white", border: "none", borderRadius: 6, cursor: selectedIndex === null ? "not-allowed" : "pointer" }}>
//           Supprimer évaluation
//         </button>
//       </div>
//       <table style={{ width: "100%", borderCollapse: "collapse" }}>
//         <thead>
//           <tr style={{ backgroundColor: "#f1f5f9" }}>
//             <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>INE</th>
//             <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Nom</th>
//             <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Prénom</th>
//             <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>UE</th>
//             <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>EC</th>
//             <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Année</th>
//             <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Note contrôle</th>
//             <th style={{ padding: 8, borderBottom: "2px solid #e5e7eb" }}>Note examen</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredEvaluations.length === 0 ? (
//             <tr>
//               <td colSpan={8} style={{ padding: 20, color: "#888", textAlign: "center" }}>Aucune évaluation trouvée.</td>
//             </tr>
//           ) : (
//             filteredEvaluations.map((ev, index) => (
//               <tr
//                 key={ev.id}
//                 onClick={() => setSelectedIndex(index)}
//                 style={{
//                   backgroundColor: selectedIndex === index ? "#e0f2fe" : index % 2 === 0 ? "#f8fafc" : "white",
//                   cursor: "pointer",
//                 }}>
//                 <td style={{ padding: 8, borderBottom: "1px solid #e5e7eb" }}>{ev.inscription?.etudiant?.matricule}</td>
//                 <td style={{ padding: 8, borderBottom: "1px solid #e5e7eb" }}>{ev.inscription?.etudiant?.nom}</td>
//                 <td style={{ padding: 8, borderBottom: "1px solid #e5e7eb" }}>{ev.inscription?.etudiant?.prenom}</td>
//                 <td style={{ padding: 8, borderBottom: "1px solid #e5e7eb" }}>{ev.inscription?.ec?.ue?.intitule}</td>
//                 <td style={{ padding: 8, borderBottom: "1px solid #e5e7eb" }}>{ev.inscription?.ec?.intitule}</td>
//                 <td style={{ padding: 8, borderBottom: "1px solid #e5e7eb" }}>{ev.inscription?.annee_inscription}</td>
//                 <td style={{ padding: 8, borderBottom: "1px solid #e5e7eb" }}>{ev.note_controle}</td>
//                 <td style={{ padding: 8, borderBottom: "1px solid #e5e7eb" }}>{ev.note_examen}</td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>

//       {showModal && (
//         <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
//           <div style={{ backgroundColor: "white", padding: 30, borderRadius: 10, width: 400, boxShadow: "0 2px 15px rgba(0,0,0,0.2)" }}>
//             <h3>{modalMode === "create" ? "Créer une évaluation" : "Modifier une évaluation"}</h3>
//             <form onSubmit={handleModalSubmit}>
//               {modalMode === "create" && (
//                 <>
//                   <label>Rechercher une inscription</label>
//                   <input
//                     type="text"
//                     placeholder="Recherche par INE, nom, UE, EC"
//                     value={inscriptionSearch}
//                     onChange={(e) => setInscriptionSearch(e.target.value)}
//                     disabled={isSubmitting}
//                     style={{ width: "100%", marginBottom: 10, padding: 8 }}
//                   />
//                   <div style={{ maxHeight: 150, overflowY: "auto", border: "1px solid #ccc", marginBottom: 15 }}>
//                     {filteredInscriptions.length === 0 ? (
//                       <p style={{ padding: 8, color: "#888" }}>Aucune inscription trouvée.</p>
//                     ) : (
//                       filteredInscriptions.map((insc) => (
//                         <div
//                           key={insc.id}
//                           onClick={() => !isSubmitting && setForm((f) => ({ ...f, inscriptionId: insc.id }))}
//                           style={{
//                             padding: "8px 12px",
//                             cursor: isSubmitting ? "default" : "pointer",
//                             backgroundColor: form.inscriptionId === insc.id ? "#d1fae5" : "transparent",
//                           }}>
//                           <strong>{insc.etudiant?.matricule}</strong> - {insc.etudiant?.nom} {insc.etudiant?.prenom} | UE:{" "}
//                           {insc.ec?.ue?.intitule} | EC: {insc.ec?.intitule} | Année: {insc.annee_inscription}
//                         </div>
//                       ))
//                     )}
//                   </div>
//                 </>
//               )}

//               <label>Note contrôle</label>
//               <input
//                 type="number"
//                 step="0.01"
//                 min="0"
//                 max="20"
//                 required
//                 value={form.noteControle}
//                 onChange={(e) => setForm((f) => ({ ...f, noteControle: e.target.value }))}
//                 disabled={isSubmitting}
//                 autoFocus={modalMode === "edit"}
//                 style={{ width: "100%", marginBottom: 15, padding: 8 }}
//               />

//               <label>Note examen</label>
//               <input
//                 type="number"
//                 step="0.01"
//                 min="0"
//                 max="20"
//                 required
//                 value={form.noteExamen}
//                 onChange={(e) => setForm((f) => ({ ...f, noteExamen: e.target.value }))}
//                 disabled={isSubmitting}
//                 style={{ width: "100%", marginBottom: 15, padding: 8 }}
//               />

//               <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
//                 <button type="button" onClick={() => setShowModal(false)} disabled={isSubmitting} style={{ padding: "8px 16px" }}>
//                   Annuler
//                 </button>
//                 <button type="submit" disabled={isSubmitting} style={{ padding: "8px 16px", backgroundColor: "#10b981", color: "white" }}>
//                   {isSubmitting ? "En cours..." : modalMode === "create" ? "Créer" : "Enregistrer"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default GestionEvaluation;
