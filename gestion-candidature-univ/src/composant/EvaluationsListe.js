import React, { useEffect, useRef, useState } from 'react';

const API_EVALUATIONS_URL = 'http://localhost:8080/api/v1/evaluations';

const EvaluationsListe = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [filteredEvaluations, setFilteredEvaluations] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [searchIne, setSearchIne] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [form, setForm] = useState({
    noteControle: '',
    noteExamen: '',
    inscriptionId: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [inscriptions, setInscriptions] = useState([]);
  const [inscriptionSearch, setInscriptionSearch] = useState('');
  const [filteredInscriptions, setFilteredInscriptions] = useState([]);

  const tableRef = useRef(null);
  const modalRef = useRef(null);
  const actionsRef = useRef(null);

  useEffect(() => {
    fetchEvaluations();
  }, []);

  useEffect(() => {
    if (showModal && modalMode === 'create') {
      const loadedInscriptions = loadInscriptionsFromLocalStorage();
      setInscriptions(loadedInscriptions);
      setFilteredInscriptions(loadedInscriptions);
      setInscriptionSearch('');
    }
  }, [showModal, modalMode]);

  useEffect(() => {
    if (!searchIne) {
      setFilteredEvaluations(evaluations);
    } else {
      setFilteredEvaluations(
        evaluations.filter(ev =>
          ev.inscription &&
          ev.inscription.etudiant &&
          (ev.inscription.etudiant.matricule || '')
            .toLowerCase()
            .includes(searchIne.toLowerCase())
        )
      );
    }
  }, [searchIne, evaluations]);

  useEffect(() => {
    if (!inscriptionSearch) {
      setFilteredInscriptions(inscriptions);
    } else {
      const searchLower = inscriptionSearch.toLowerCase();
      setFilteredInscriptions(
        inscriptions.filter(insc => {
          const etu = insc.etudiant || {};
          const ec = insc.ec || {};
          const ue = ec.ue || {};
          return (
            etu.matricule?.toLowerCase().includes(searchLower) ||
            etu.nom?.toLowerCase().includes(searchLower) ||
            etu.prenom?.toLowerCase().includes(searchLower) ||
            ec.intitule?.toLowerCase().includes(searchLower) ||
            ue.intitule?.toLowerCase().includes(searchLower) ||
            insc.annee_inscription?.toString().includes(searchLower)
          );
        })
      );
    }
  }, [inscriptionSearch, inscriptions]);

  const loadInscriptionsFromLocalStorage = () => {
    const stored = localStorage.getItem('inscriptions');
    if (!stored) return [];
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  };

  async function fetchEvaluations() {
    try {
      const res = await fetch(API_EVALUATIONS_URL);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setEvaluations(data);
    } catch {
      setEvaluations([]);
    }
  }

  async function createEvaluation(evaluation) {
    const response = await fetch(API_EVALUATIONS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(evaluation),
    });

    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || JSON.stringify(errorData);
      } catch {
        errorMessage = await response.text();
      }
      throw new Error(`Erreur ${response.status} : ${errorMessage}`);
    }

    return response.json();
  }

  async function updateEvaluation(id, evaluation) {
    const response = await fetch(`${API_EVALUATIONS_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(evaluation),
    });

    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || JSON.stringify(errorData);
      } catch {
        errorMessage = await response.text();
      }
      throw new Error(`Erreur ${response.status} : ${errorMessage}`);
    }

    return response.json();
  }

  async function deleteEvaluation(id) {
    const response = await fetch(`${API_EVALUATIONS_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) {
      throw new Error(`Erreur ${response.status} lors de la suppression`);
    }
    fetchEvaluations();
  }

  const handleRowClick = index => setSelectedIndex(index);

  const handleCreate = e => {
    e.stopPropagation();
    setModalMode('create');

    const inscriptionFromStorage = localStorage.getItem('inscription');
    let inscriptionId = '';
    if (inscriptionFromStorage) {
      try {
        const parsed = JSON.parse(inscriptionFromStorage);
        if (typeof parsed === 'object' && parsed !== null && parsed.id) {
          inscriptionId = parsed.id;
        }
      } catch {
        inscriptionId = '';
      }
    }
    setForm({
      noteControle: '',
      noteExamen: '',
      inscriptionId: inscriptionId,
    });
    setInscriptionSearch('');
    setShowModal(true);
  };

  const handleEdit = e => {
    e.stopPropagation();
    if (selectedIndex === null) return;
    const ev = filteredEvaluations[selectedIndex];
    setModalMode('edit');
    setForm({
      noteControle: ev.note_controle?.toString() || '',
      noteExamen: ev.note_examen?.toString() || '',
      inscriptionId: ev.inscription.id,
    });
    setShowModal(true);
  };

  const handleModalSubmit = async e => {
    e.preventDefault();

    const inscriptionIdNum = parseInt(form.inscriptionId, 10);
    if (isNaN(inscriptionIdNum) || inscriptionIdNum <= 0) {
      alert("L'ID d'inscription doit être un nombre entier positif.");
      return;
    }

    const noteControleNum = parseFloat(form.noteControle);
    const noteExamenNum = parseFloat(form.noteExamen);

    if (isNaN(noteControleNum) || noteControleNum < 0 || noteControleNum > 20) {
      alert("La note de contrôle doit être un nombre entre 0 et 20.");
      return;
    }
    if (isNaN(noteExamenNum) || noteExamenNum < 0 || noteExamenNum > 20) {
      alert("La note d'examen doit être un nombre entre 0 et 20.");
      return;
    }

    setIsSubmitting(true);
    try {
      const evaluation = {
        noteControle: noteControleNum,
        noteExamen: noteExamenNum,
        inscriptionId: inscriptionIdNum,
      };

      if (modalMode === 'create') {
        await createEvaluation(evaluation);
      } else if (modalMode === 'edit') {
        const ev = filteredEvaluations[selectedIndex];
        await updateEvaluation(ev.id, evaluation);
      }
      setShowModal(false);
      fetchEvaluations();              // Mets à jour la liste après création/modification
      setSelectedIndex(null);          // Désélectionne la ligne modifiée/créée
    } catch (error) {
      alert("Une erreur est survenue lors de la sauvegarde : " + error.message);
      console.error("Détail de l'erreur :", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async e => {
    e.stopPropagation();
    if (selectedIndex === null) return;
    const ev = filteredEvaluations[selectedIndex];
    if (window.confirm('Confirmer la suppression de cette évaluation ?')) {
      try {
        await deleteEvaluation(ev.id);
        setSelectedIndex(null);
      } catch (error) {
        alert("Erreur lors de la suppression : " + error.message);
      }
    }
  };

  return (
    <>
      <style>{`
        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>

      <div style={{
        maxWidth: '1100px',
        margin: '40px auto',
        background: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 16px #e0e0e0',
        padding: '30px 30px 20px 30px'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: 30, fontWeight: 700 }}>
          Liste des évaluations
        </h2>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
          <input
            value={searchIne}
            onChange={e => setSearchIne(e.target.value)}
            placeholder="Rechercher par INE"
            style={{
              padding: '10px 14px',
              borderRadius: 6,
              border: '1px solid #e0e0e0',
              fontSize: 16,
              width: 280,
              marginRight: 10
            }}
            disabled={isSubmitting}
          />
        </div>

        <div ref={actionsRef} style={{ display: 'flex', gap: 12, marginBottom: 18, justifyContent: 'center' }}>
          <button
            style={createBtnStyle}
            onClick={handleCreate}
            disabled={isSubmitting}
          >
            {isSubmitting && modalMode === 'create' ? "En cours..." : "Créer évaluation"}
          </button>
          <button
            style={editBtnStyle(selectedIndex === null || isSubmitting)}
            onClick={handleEdit}
            disabled={selectedIndex === null || isSubmitting}
          >
            Modifier évaluation
          </button>
          <button
            style={deleteBtnStyle(selectedIndex === null || isSubmitting)}
            onClick={handleDelete}
            disabled={selectedIndex === null || isSubmitting}
          >
            Supprimer évaluation
          </button>
        </div>

        <table
          ref={tableRef}
          style={{ width: '100%', borderCollapse: 'collapse', marginTop: 10 }}
        >
          <thead>
            <tr>
              <th style={thStyle}>INE</th>
              <th style={thStyle}>Nom</th>
              <th style={thStyle}>Prénom</th>
              <th style={thStyle}>UE</th>
              <th style={thStyle}>EC</th>
              <th style={thStyle}>Année</th>
              <th style={thStyle}>Note contrôle</th>
              <th style={thStyle}>Note examen</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvaluations.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: 30, color: '#888' }}>
                  Aucune évaluation trouvée.
                </td>
              </tr>
            ) : (
              filteredEvaluations.map((ev, index) => (
                <tr
                  key={ev.id}
                  style={{
                    background: selectedIndex === index ? '#e0f2fe' : index % 2 === 0 ? '#f8fafc' : 'white',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleRowClick(index)}
                >
                  <td style={tdStyle}>{ev.inscription?.etudiant?.matricule}</td>
                  <td style={tdStyle}>{ev.inscription?.etudiant?.nom}</td>
                  <td style={tdStyle}>{ev.inscription?.etudiant?.prenom}</td>
                  <td style={tdStyle}>{ev.inscription?.ec?.ue?.intitule}</td>
                  <td style={tdStyle}>{ev.inscription?.ec?.intitule}</td>
                  <td style={tdStyle}>{ev.inscription?.annee_inscription}</td>
                  <td style={tdStyle}>{ev.note_controle}</td>
                  <td style={tdStyle}>{ev.note_examen}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {showModal && (
          <div style={popupOverlayStyle}>
            <div style={modalContent} ref={modalRef}>
              <h3 style={{ marginBottom: 16 }}>
                {modalMode === 'create' ? "Créer une évaluation" : "Modifier l'évaluation"}
              </h3>
              <form onSubmit={handleModalSubmit}>
                {modalMode === 'create' && (
                  <>
                    <div style={materialField}>
                      <label style={materialLabel}>Rechercher une inscription</label>
                      <input
                        type="text"
                        value={inscriptionSearch}
                        onChange={e => setInscriptionSearch(e.target.value)}
                        placeholder="Recherche par INE, nom, UE, EC..."
                        style={materialInput}
                        autoFocus
                        disabled={isSubmitting}
                      />
                    </div>
                    <div style={{
                      maxHeight: 150,
                      overflowY: 'auto',
                      border: '1px solid #e0e0e0',
                      borderRadius: 6,
                      marginBottom: 16,
                      backgroundColor: '#fafafa'
                    }}>
                      {filteredInscriptions.length === 0 ? (
                        <p style={{ padding: 10, color: '#888' }}>Aucune inscription trouvée.</p>
                      ) : (
                        filteredInscriptions.map(insc => {
                          const etu = insc.etudiant || {};
                          const ec = insc.ec || {};
                          const ue = ec.ue || {};
                          const isSelected = form.inscriptionId === insc.id;
                          return (
                            <div
                              key={insc.id}
                              onClick={() => !isSubmitting && setForm({ ...form, inscriptionId: insc.id })}
                              style={{
                                padding: '8px 12px',
                                cursor: isSubmitting ? 'default' : 'pointer',
                                backgroundColor: isSelected ? '#d1fae5' : 'transparent',
                                borderBottom: '1px solid #ddd',
                                fontSize: 14,
                                userSelect: 'none'
                              }}
                            >
                              <strong>{etu.matricule}</strong> - {etu.nom} {etu.prenom} | UE: {ue.intitule} | EC: {ec.intitule} | Année: {insc.annee_inscription}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </>
                )}
                <div style={materialField}>
                  <label style={materialLabel}>Note contrôle</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="20"
                    value={form.noteControle}
                    onChange={e => setForm({ ...form, noteControle: e.target.value })}
                    placeholder="Ex: 15.75"
                    style={materialInput}
                    required
                    autoFocus={modalMode === 'edit'}
                    disabled={isSubmitting}
                  />
                </div>
                <div style={materialField}>
                  <label style={materialLabel}>Note examen</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="20"
                    value={form.noteExamen}
                    onChange={e => setForm({ ...form, noteExamen: e.target.value })}
                    placeholder="Ex: 14.50"
                    style={materialInput}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div style={modalBtnRow}>
                  <button type="button" onClick={() => setShowModal(false)} style={cancelBtnStyle} disabled={isSubmitting}>Annuler</button>
                  <button type="submit" style={modalMode === 'create' ? createBtnStyle : editSaveBtnStyle} disabled={isSubmitting}>
                    {isSubmitting ? "En cours..." : (modalMode === 'create' ? "Créer" : "Enregistrer")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// Styles (inchangés)
const createBtnStyle = {
  background: '#2563eb',
  color: 'white',
  border: 'none',
  borderRadius: 5,
  padding: '10px 18px',
  fontWeight: 'bold',
  fontSize: 15,
  cursor: 'pointer',
  transition: 'opacity 0.2s, filter 0.2s'
};
const editBtnStyle = (isDisabled) => ({
  background: '#10b981',
  color: 'white',
  border: 'none',
  borderRadius: 5,
  padding: '10px 18px',
  fontWeight: 'bold',
  fontSize: 15,
  cursor: isDisabled ? 'not-allowed' : 'pointer',
  opacity: isDisabled ? 0.6 : 1,
  filter: isDisabled ? 'grayscale(0.3)' : 'none',
  transition: 'opacity 0.2s, filter 0.2s'
});
const deleteBtnStyle = (isDisabled) => ({
  background: '#ef4444',
  color: 'white',
  border: 'none',
  borderRadius: 5,
  padding: '10px 18px',
  fontWeight: 'bold',
  fontSize: 15,
  cursor: isDisabled ? 'not-allowed' : 'pointer',
  opacity: isDisabled ? 0.6 : 1,
  filter: isDisabled ? 'grayscale(0.3)' : 'none',
  transition: 'opacity 0.2s, filter 0.2s'
});
const thStyle = {
  background: '#f1f5f9',
  fontWeight: 'bold',
  padding: '10px 8px',
  borderBottom: '2px solid #e5e7eb',
  textAlign: 'left'
};
const tdStyle = {
  padding: '9px 8px',
  borderBottom: '1px solid #e5e7eb'
};
const popupOverlayStyle = {
  position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
  background: 'rgba(0,0,0,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99
};
const modalContent = {
  background: 'white', borderRadius: 10, padding: 30, minWidth: 340, minHeight: 320, boxShadow: '0 2px 16px #e0e0e0', position: 'relative'
};
const materialField = {
  marginBottom: 18,
  display: 'flex',
  flexDirection: 'column',
};
const materialLabel = {
  fontSize: 18,
  color: '#222',
  marginBottom: 5,
  fontWeight: 400,
  fontFamily: 'inherit',
};
const materialInput = {
  width: '100%',
  padding: '13px 12px',
  borderRadius: 6,
  border: '1px solid #e0e0e0',
  background: '#fff',
  fontSize: 18,
  color: '#222',
  outline: 'none',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
  transition: 'border 0.2s',
};
const modalBtnRow = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 10,
  marginTop: 12,
};
const editSaveBtnStyle = {
  background: '#10b981',
  color: 'white',
  border: 'none',
  padding: '10px 26px',
  borderRadius: 5,
  fontSize: 16,
  fontWeight: 600,
  cursor: 'pointer',
};
const cancelBtnStyle = {
  background: '#9ca3af',
  color: 'white',
  border: 'none',
  padding: '10px 26px',
  borderRadius: 5,
  fontSize: 16,
  fontWeight: 600,
  cursor: 'pointer',
  opacity: 0.7,
};

export default EvaluationsListe;