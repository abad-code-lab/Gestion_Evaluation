import React, { useEffect, useRef, useState } from 'react';

const InscriptionsListe = () => {
  const [inscriptions, setInscriptions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [ine, setIne] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');

  const tableRef = useRef(null);
  const modalRef = useRef(null);
  const actionsRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem('inscriptions');
    if (stored) {
      setInscriptions(JSON.parse(stored));
    }
  }, []);

  // Désélectionne la ligne si clic en dehors du tableau, modale et boutons
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        tableRef.current &&
        !tableRef.current.contains(event.target) &&
        !(modalRef.current && modalRef.current.contains(event.target)) &&
        !(actionsRef.current && actionsRef.current.contains(event.target))
      ) {
        setSelectedIndex(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Ferme la modale si clic en dehors
  useEffect(() => {
    if (!showModal) return;
    function handleClickOutsideModal(event) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target)
      ) {
        setShowModal(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutsideModal);
    return () => document.removeEventListener('mousedown', handleClickOutsideModal);
  }, [showModal]);

  // const handleRowClick = (index) => {
  //   setSelectedIndex(index);
  // };

  const handleRowClick = (index) => {
  setSelectedIndex(index);
  const selected = inscriptions[index];
  localStorage.setItem('inscription', JSON.stringify(selected)); // Sauvegarde l'inscription sélectionnée
};


  const handleEdit = (e) => {
    e.stopPropagation();
    if (selectedIndex === null) return;
    const selected = inscriptions[selectedIndex];
    setIne(selected.etudiant.matricule || '');
    setNom(selected.etudiant.nom || '');
    setPrenom(selected.etudiant.prenom || '');
    setShowModal(true);
  };

  const handleSave = () => {
    const updated = [...inscriptions];
    updated[selectedIndex].etudiant.matricule = ine;
    updated[selectedIndex].etudiant.nom = nom;
    updated[selectedIndex].etudiant.prenom = prenom;

    localStorage.setItem('inscriptions', JSON.stringify(updated));
    setInscriptions(updated);
    setShowModal(false);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (selectedIndex === null) return;
    if (!window.confirm("Confirmer la suppression ?")) return;
    const updated = [...inscriptions];
    updated.splice(selectedIndex, 1);
    localStorage.setItem('inscriptions', JSON.stringify(updated));
    setInscriptions(updated);
    setSelectedIndex(null);
  };

  if (inscriptions.length === 0) {
    return <p style={{ textAlign: 'center', marginTop: '20px' }}>Aucune inscription enregistrée.</p>;
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '30px auto', padding: '0 15px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Étudiants Inscrits à un EC</h2>

      <div
        ref={actionsRef}
        style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 20 }}
      >
        <button
          onClick={handleEdit}
          disabled={selectedIndex === null}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            padding: '8px 14px',
            cursor: selectedIndex !== null ? 'pointer' : 'not-allowed',
            opacity: selectedIndex === null ? 0.6 : 1,
            filter: selectedIndex === null ? 'grayscale(0.3)' : 'none',
            transition: 'opacity 0.2s, filter 0.2s'
          }}
        >
          Modifier
        </button>
        <button
          onClick={handleDelete}
          disabled={selectedIndex === null}
          style={{
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            padding: '8px 14px',
            cursor: selectedIndex !== null ? 'pointer' : 'not-allowed',
            opacity: selectedIndex === null ? 0.6 : 1,
            filter: selectedIndex === null ? 'grayscale(0.3)' : 'none',
            transition: 'opacity 0.2s, filter 0.2s'
          }}
        >
          Supprimer
        </button>
      </div>

      <table
        ref={tableRef}
        style={{ width: '100%', borderCollapse: 'collapse' }}
      >
        <thead>
          <tr>
            <th style={headerStyle}>ID</th>
            <th style={headerStyle}>INE</th>
            <th style={headerStyle}>Nom</th>
            <th style={headerStyle}>Prénom</th>
            <th style={headerStyle}>UE</th>
            <th style={headerStyle}>EC</th>
            <th style={headerStyle}>Année</th>
          </tr>
        </thead>
        <tbody>
          {inscriptions.map((insc, index) => (
            <tr
              key={index}
              style={{
                backgroundColor: selectedIndex === index ? '#e0f2fe' : index % 2 === 0 ? '#f9f9f9' : 'white',
                cursor: 'pointer'
              }}
              onClick={() => handleRowClick(index)}
            >
              <td style={cellStyle}>{insc.id}</td>
              <td style={cellStyle}>{insc.etudiant.matricule}</td>
              <td style={cellStyle}>{insc.etudiant.nom}</td>
              <td style={cellStyle}>{insc.etudiant.prenom}</td>
              <td style={cellStyle}>{insc.ec.ue.intitule}</td>
              <td style={cellStyle}>{insc.ec.intitule}</td>
              <td style={cellStyle}>{insc.annee_inscription}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div style={modalOverlay}>
          <div style={modalContent} ref={modalRef}>
            <h3 style={{ marginBottom: 16 }}>Modifier l'étudiant inscrit</h3>
            <div style={{ marginBottom: 8 }}>
              <label style={labelStyle}>INE :</label>
              <input
                value={ine}
                onChange={(e) => setIne(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: 8 }}>
              <label style={labelStyle}>Nom :</label>
              <input
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Prénom :</label>
              <input
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button onClick={() => setShowModal(false)} style={cancelBtnStyle}>Annuler</button>
              <button onClick={handleSave} style={saveBtnStyle}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const headerStyle = {
  borderBottom: '2px solid #10b981',
  padding: '10px',
  textAlign: 'left',
  backgroundColor: '#e0f2f1',
  color: '#004d40',
};

const cellStyle = {
  padding: '8px',
  borderBottom: '1px solid #ddd',
};

const modalOverlay = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.3)', display: 'flex',
  justifyContent: 'center', alignItems: 'center', zIndex: 1000
};

const modalContent = {
  background: 'white', padding: 20, borderRadius: 8,
  width: 500, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
};

const inputStyle = {
  width: '100%',
  padding: '4px 8px',
  borderRadius: 4,
  border: '1px solid #ccc',
  fontSize: '14px',
  height: '28px',
};

const labelStyle = {
  display: 'block',
  marginBottom: 2,
  fontSize: '14px',
  fontWeight: 500
};

const saveBtnStyle = {
  background: '#10b981', color: 'white', border: 'none', padding: '8px 14px',
  borderRadius: 4, cursor: 'pointer'
};

const cancelBtnStyle = {
  background: '#9ca3af', color: 'white', border: 'none', padding: '8px 14px',
  borderRadius: 4, cursor: 'pointer'
};

export default InscriptionsListe;
