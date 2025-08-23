import React, { useEffect, useRef, useState } from 'react';

const EtudiantsListe = () => {
  const [etudiants, setEtudiants] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);

  const [niveauSelectionne, setNiveauSelectionne] = useState(null); // M1 ou M2
  const [semestreSelectionne, setSemestreSelectionne] = useState(null);
  const [filiereSelectionnee, setFiliereSelectionnee] = useState(null);
  const [ueSelectionnee, setUeSelectionnee] = useState(null);
  const [ecSelectionne, setEcSelectionne] = useState(null);

  // Etats pour modifier un étudiant
  const [editIne, setEditIne] = useState('');
  const [editNom, setEditNom] = useState('');
  const [editPrenom, setEditPrenom] = useState('');

  const [uesData, setUesData] = useState([]);
  const [loadingUE, setLoadingUE] = useState(true);
  const [errorUE, setErrorUE] = useState(null);

  const tableRef = useRef(null);
  const popupRef = useRef(null);
  const editPopupRef = useRef(null);
  const actionsRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem('etudiants');
    if (stored) {
      try {
        setEtudiants(JSON.parse(stored));
      } catch {
        setEtudiants([]);
      }
    }
  }, []);

  useEffect(() => {
    setLoadingUE(true);
    fetch('http://localhost:8080/api/evaluation/liste_ec')
      .then(response => {
        if (!response.ok) throw new Error('Erreur chargement EC');
        return response.json();
      })
      .then(rawData => {
        // Regroupement par semestre > filière > UE > EC
        const grouped = [];

        rawData.forEach(ecItem => {
          const ue = ecItem.ue;
          const semestre = ue.semestre;
          const niveau = semestre.niveau ? semestre.niveau.nom : null; // ex: "M1"
          const filiere = ue.classe ? ue.classe.libelle : null; // ex: "M1_INFO"

          // Trouver ou créer semestre
          let semestreGroup = grouped.find(s => s.id === semestre.id);
          if (!semestreGroup) {
            semestreGroup = {
              id: semestre.id,
              libelle: semestre.libelle,
              niveau,
              filieres: [],
            };
            grouped.push(semestreGroup);
          }

          // Trouver ou créer filiere
          let filiereGroup = semestreGroup.filieres.find(f => f.nom === filiere);
          if (!filiereGroup) {
            filiereGroup = {
              nom: filiere,
              ues: [],
            };
            semestreGroup.filieres.push(filiereGroup);
          }

          // Trouver ou créer UE
          let ueGroup = filiereGroup.ues.find(u => u.id === ue.id);
          if (!ueGroup) {
            ueGroup = {
              id: ue.id,
              codeUE: ue.code || ue.codeUE || '',
              intitule: ue.libelle,
              ecs: [],
            };
            filiereGroup.ues.push(ueGroup);
          }

          // Ajouter EC avec un id unique garanti
          ueGroup.ecs.push({
            id: ecItem.id !== undefined && ecItem.id !== null
              ? ecItem.id
              : `${ue.id}-${ecItem.libelle}`, // correction ici : id unique
            codeEC: ecItem.code || ecItem.libelle || ecItem.codeEC || '',
            intitule: ecItem.libelle,
          });
        });

        setUesData(grouped);
        setLoadingUE(false);
      })
      .catch(e => {
        setUesData([]);
        setErrorUE(e.message);
        setLoadingUE(false);
        console.error('Erreur chargement EC:', e);
      });
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        tableRef.current &&
        !tableRef.current.contains(event.target) &&
        !(popupRef.current && popupRef.current.contains(event.target)) &&
        !(editPopupRef.current && editPopupRef.current.contains(event.target)) &&
        !(actionsRef.current && actionsRef.current.contains(event.target))
      ) {
        setSelectedIndex(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!showPopup) return;
    function handleClickOutsidePopup(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutsidePopup);
    return () => document.removeEventListener('mousedown', handleClickOutsidePopup);
  }, [showPopup]);

  useEffect(() => {
    if (!showEditPopup) return;
    function handleClickOutsideEditPopup(event) {
      if (editPopupRef.current && !editPopupRef.current.contains(event.target)) {
        setShowEditPopup(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutsideEditPopup);
    return () => document.removeEventListener('mousedown', handleClickOutsideEditPopup);
  }, [showEditPopup]);

  const handleRowClick = index => setSelectedIndex(index);

  const handleAddClick = e => {
    e.stopPropagation();
    if (selectedIndex === null) {
      alert("Veuillez sélectionner un étudiant.");
      return;
    }
    setShowPopup(true);
    setNiveauSelectionne(null);
    setSemestreSelectionne(null);
    setFiliereSelectionnee(null);
    setUeSelectionnee(null);
    setEcSelectionne(null);
  };

  const handleAjouterInscription = () => {
    if (!ueSelectionnee || !ecSelectionne) return;

    const etudiant = etudiants[selectedIndex];
    const stored = localStorage.getItem('inscriptions');
    let inscriptions = stored ? JSON.parse(stored) : [];

    const existeDeja = inscriptions.some(
      insc =>
        insc.etudiant.matricule === (etudiant.INE || etudiant.ine) &&
        insc.ec.codeEC === ecSelectionne.codeEC
    );

    if (existeDeja) {
      alert(`⚠️ Cet étudiant est déjà inscrit à l'EC "${ecSelectionne.intitule}"`);
      return;
    }

    const nextId = inscriptions.length > 0
      ? Math.max(...inscriptions.map(insc => insc.id)) + 1
      : 1;

    const nouvelleInscription = {
      id: nextId,
      annee_inscription: new Date().getFullYear(),
      etudiant: {
        id: selectedIndex + 1,
        nom: etudiant.NOM || etudiant.nom,
        prenom: etudiant.PRENOM || etudiant.prenom,
        matricule: etudiant.INE || etudiant.ine,
        email: etudiant.email || 'email@uasz.sn'
      },
      ec: {
        id: ecSelectionne.id,
        codeEC: ecSelectionne.codeEC,
        intitule: ecSelectionne.intitule,
        ue: {
          id: ueSelectionnee.id,
          codeUE: ueSelectionnee.codeUE,
          intitule: ueSelectionnee.intitule
        }
      }
    };

    inscriptions.push(nouvelleInscription);
    localStorage.setItem('inscriptions', JSON.stringify(inscriptions));

    alert(
      `✅ Inscription enregistrée :\n${etudiant.NOM || etudiant.nom} inscrit à l'EC "${ecSelectionne.intitule}"`
    );

    setShowPopup(false);
  };

  const handleEdit = e => {
    e.stopPropagation();
    if (selectedIndex === null) return;
    const selectedEtudiant = etudiants[selectedIndex];
    setEditIne(selectedEtudiant.INE || selectedEtudiant.ine || '');
    setEditNom(selectedEtudiant.NOM || selectedEtudiant.nom || '');
    setEditPrenom(selectedEtudiant.PRENOM || selectedEtudiant.prenom || '');
    setShowEditPopup(true);
  };

  const handleSaveEdit = () => {
    const updatedEtudiants = [...etudiants];
    updatedEtudiants[selectedIndex] = {
      ...updatedEtudiants[selectedIndex],
      INE: editIne,
      NOM: editNom,
      PRENOM: editPrenom,
      ine: editIne,
      nom: editNom,
      prenom: editPrenom,
    };
    localStorage.setItem('etudiants', JSON.stringify(updatedEtudiants));
    setEtudiants(updatedEtudiants);
    setShowEditPopup(false);
  };

  const handleDelete = e => {
    e.stopPropagation();
    if (selectedIndex === null) return;
    if (!window.confirm("Confirmer la suppression de cet étudiant ?")) return;

    const updatedEtudiants = [...etudiants];
    updatedEtudiants.splice(selectedIndex, 1);
    localStorage.setItem('etudiants', JSON.stringify(updatedEtudiants));
    setEtudiants(updatedEtudiants);
    setSelectedIndex(null);
  };

  const semestresDisponibles = niveauSelectionne
    ? uesData
        .filter(s => s.niveau === niveauSelectionne)
        .map(s => ({ id: s.id, libelle: s.libelle }))
    : [];

  const filieresDisponibles = semestreSelectionne
    ? uesData.find(s => s.id === semestreSelectionne)?.filieres || []
    : [];

  const uesFiltrees = filiereSelectionnee
    ? filieresDisponibles.find(f => f.nom === filiereSelectionnee)?.ues || []
    : [];

  return (
    <div style={{
      maxWidth: 900,
      margin: '40px auto',
      background: 'white',
      borderRadius: 8,
      boxShadow: '0 2px 16px #e0e0e0',
      padding: '30px 30px 20px 30px'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: 30, fontWeight: 700 }}>
        Liste des étudiants
      </h1>

      <div ref={actionsRef} style={{ display: 'flex', gap: 12, marginBottom: 18, justifyContent: 'center' }}>
        <button
          style={primaryBtnStyle(selectedIndex === null)}
          onClick={handleAddClick}
          disabled={selectedIndex === null}
        >
          Ajouter
        </button>
        <button
          style={editBtnStyle(selectedIndex === null)}
          onClick={handleEdit}
          disabled={selectedIndex === null}
        >
          Modifier
        </button>
        <button
          style={deleteBtnStyle(selectedIndex === null)}
          onClick={handleDelete}
          disabled={selectedIndex === null}
        >
          Supprimer
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
          </tr>
        </thead>
        <tbody>
          {etudiants.length === 0 ? (
            <tr>
              <td colSpan={3} style={{ textAlign: 'center', padding: 30, color: '#888' }}>
                Aucun étudiant importé.
              </td>
            </tr>
          ) : (
            etudiants.map((etudiant, index) => (
              <tr
                key={index}
                style={{
                  background: selectedIndex === index ? '#c8e6c9' : index % 2 === 0 ? '#f8fafc' : 'white',
                  cursor: 'pointer'
                }}
                onClick={() => handleRowClick(index)}
              >
                <td style={tdStyle}>{etudiant.INE || etudiant.ine}</td>
                <td style={tdStyle}>{etudiant.NOM || etudiant.nom}</td>
                <td style={tdStyle}>{etudiant.PRENOM || etudiant.prenom}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {loadingUE && <div style={{textAlign: 'center', marginTop: 20}}>Chargement des UE/EC...</div>}
      {errorUE && <div style={{textAlign: 'center', marginTop: 20, color: 'red'}}>Erreur: {errorUE}</div>}

      {showPopup && (
        <div style={popupOverlayStyle}>
          <div style={popupStyle} ref={popupRef}>
            <h3>Ajouter l'étudiant à un EC</h3>

            {!niveauSelectionne && (
              <div>
                <strong>Choisir le niveau :</strong>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {["M1", "M2"].map(niveau => (
                    <li key={niveau} style={{ margin: '8px 0' }}>
                      <button
                        style={{
                          background: '#f1f5f9',
                          color: '#222',
                          border: 'none',
                          borderRadius: 4,
                          padding: '7px 14px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          width: '100%',
                          textAlign: 'left'
                        }}
                        onClick={() => {
                          setNiveauSelectionne(niveau);
                          setSemestreSelectionne(null);
                          setFiliereSelectionnee(null);
                          setUeSelectionnee(null);
                          setEcSelectionne(null);
                        }}
                      >
                        {niveau}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {niveauSelectionne && !semestreSelectionne && (
              <div>
                <strong>Choisir un semestre :</strong>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {semestresDisponibles.map((sem) => (
                    <li key={sem.id} style={{ margin: '8px 0' }}>
                      <button
                        style={{
                          background: '#f1f5f9',
                          color: '#222',
                          border: 'none',
                          borderRadius: 4,
                          padding: '7px 14px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          width: '100%',
                          textAlign: 'left'
                        }}
                        onClick={() => {
                          setSemestreSelectionne(sem.id);
                          setFiliereSelectionnee(null);
                          setUeSelectionnee(null);
                          setEcSelectionne(null);
                        }}
                      >
                        {sem.libelle}
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  style={{ marginTop: 8, color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer' }}
                  onClick={() => setNiveauSelectionne(null)}
                >
                  &larr; Retour au niveau
                </button>
              </div>
            )}

            {niveauSelectionne && semestreSelectionne && !filiereSelectionnee && filieresDisponibles.length > 0 && (
              <div>
                <strong>Choisir une filière :</strong>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {filieresDisponibles.map(filiere => (
                    <li key={filiere.nom} style={{ margin: '8px 0' }}>
                      <button
                        style={{
                          background: '#f1f5f9',
                          color: '#222',
                          border: 'none',
                          borderRadius: 4,
                          padding: '7px 14px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          width: '100%',
                          textAlign: 'left'
                        }}
                        onClick={() => {
                          setFiliereSelectionnee(filiere.nom);
                          setUeSelectionnee(null);
                          setEcSelectionne(null);
                        }}
                      >
                        {filiere.nom}
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  style={{ marginTop: 8, color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer' }}
                  onClick={() => setSemestreSelectionne(null)}
                >
                  &larr; Retour aux semestres
                </button>
              </div>
            )}

            {niveauSelectionne && semestreSelectionne && filiereSelectionnee && !ueSelectionnee && (
              <div>
                <strong>Choisir une UE :</strong>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {uesFiltrees.map(ue => (
                    <li key={ue.id} style={{ margin: '8px 0' }}>
                      <button
                        style={{
                          background: '#f1f5f9',
                          color: '#222',
                          border: 'none',
                          borderRadius: 4,
                          padding: '7px 14px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          width: '100%',
                          textAlign: 'left'
                        }}
                        onClick={() => {
                          setUeSelectionnee(ue);
                          setEcSelectionne(null);
                        }}
                      >
                        {ue.codeUE} - {ue.intitule}
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  style={{ marginTop: 8, color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer' }}
                  onClick={() => setFiliereSelectionnee(null)}
                >
                  &larr; Retour aux filières
                </button>
              </div>
            )}

            {ueSelectionnee && (
              <div>
                <strong>Choisir un EC :</strong>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {ueSelectionnee.ecs.map(ec => (
                    <li key={ec.id} style={{ margin: '6px 0' }}>
                      <button
                        style={{
                          background: ecSelectionne?.id === ec.id ? '#059669' : '#f1f5f9',
                          color: ecSelectionne?.id === ec.id ? 'white' : '#222',
                          border: 'none',
                          borderRadius: 4,
                          padding: '7px 14px',
                          cursor: 'pointer',
                          width: '100%',
                          textAlign: 'left',
                          fontWeight: 'bold',
                        }}
                        onClick={() => setEcSelectionne(ec)}
                      >
                        {ec.codeEC && ec.codeEC !== ec.intitule ? `${ec.codeEC} - ${ec.intitule}` : ec.intitule}
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  style={{ marginTop: 8, color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer' }}
                  onClick={() => setUeSelectionnee(null)}
                >
                  &larr; Retour aux UE
                </button>
              </div>
            )}

            {ecSelectionne && (
              <button
                style={primaryBtnStyle(false, { marginTop: 18, width: '100%' })}
                onClick={handleAjouterInscription}
              >
                Ajouter
              </button>
            )}

            <button style={closeBtnStyle} onClick={() => setShowPopup(false)}>
              Fermer
            </button>
          </div>
        </div>
      )}

      {showEditPopup && (
        <div style={popupOverlayStyle}>
          <div style={editModalContent} ref={editPopupRef}>
            <h3 style={editModalTitleStyle}>Modifier l'étudiant</h3>
            <div style={materialField}>
              <label style={materialLabel}>INE</label>
              <input
                value={editIne}
                onChange={(e) => setEditIne(e.target.value)}
                style={materialInput}
              />
            </div>
            <div style={materialField}>
              <label style={materialLabel}>Nom</label>
              <input
                value={editNom}
                onChange={(e) => setEditNom(e.target.value)}
                style={materialInput}
              />
            </div>
            <div style={materialField}>
              <label style={materialLabel}>Prénom</label>
              <input
                value={editPrenom}
                onChange={(e) => setEditPrenom(e.target.value)}
                style={materialInput}
              />
            </div>
            <div style={modalBtnRow}>
              <button onClick={() => setShowEditPopup(false)} style={cancelBtnStyle}>Annuler</button>
              <button onClick={handleSaveEdit} style={editSaveBtnStyle}>Enregistrer</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};


// Styles inchangés, tu peux copier/coller depuis ton code précédent

const primaryBtnStyle = (isDisabled, extraStyles = {}) => ({
  background: '#059669',
  color: 'white',
  border: 'none',
  borderRadius: 5,
  padding: '10px 18px',
  fontWeight: 'bold',
  fontSize: 15,
  cursor: isDisabled ? 'not-allowed' : 'pointer',
  opacity: isDisabled ? 0.6 : 1,
  filter: isDisabled ? 'grayscale(0.3)' : 'none',
  transition: 'opacity 0.2s, filter 0.2s',
  ...extraStyles
});
const editBtnStyle = (isDisabled, extraStyles = {}) => ({
  background: '#3b82f6',
  color: 'white',
  border: 'none',
  borderRadius: 5,
  padding: '10px 18px',
  fontWeight: 'bold',
  fontSize: 15,
  cursor: isDisabled ? 'not-allowed' : 'pointer',
  opacity: isDisabled ? 0.6 : 1,
  filter: isDisabled ? 'grayscale(0.3)' : 'none',
  transition: 'opacity 0.2s, filter 0.2s',
  ...extraStyles
});
const deleteBtnStyle = (isDisabled, extraStyles = {}) => ({
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
  transition: 'opacity 0.2s, filter 0.2s',
  ...extraStyles
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
const popupStyle = {
  background: 'white', borderRadius: 10, padding: 30, minWidth: 340, minHeight: 320, boxShadow: '0 2px 16px #e0e0e0', position: 'relative'
};
const closeBtnStyle = {
  position: 'absolute',
  top: 12,
  right: 12,
  background: 'transparent',
  border: 'none',
  color: '#888',
  fontWeight: 'bold',
  fontSize: 18,
  cursor: 'pointer'
};
const editModalContent = {
  background: 'white',
  padding: '38px 32px 28px 32px',
  borderRadius: 8,
  width: 600,
  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.19)',
  display: 'flex',
  flexDirection: 'column',
};
const editModalTitleStyle = {
  fontSize: '2.4rem',
  fontWeight: 400,
  marginBottom: 30,
  marginTop: 0,
  letterSpacing: '-1px',
  fontFamily: 'inherit',
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

export default EtudiantsListe;






















// import React, { useEffect, useRef, useState } from 'react';

// const EtudiantsListe = () => {
//   const [etudiants, setEtudiants] = useState([]);
//   const [selectedIndex, setSelectedIndex] = useState(null);
//   const [showPopup, setShowPopup] = useState(false);
//   const [showEditPopup, setShowEditPopup] = useState(false);

//   const [niveauSelectionne, setNiveauSelectionne] = useState(null); // M1 ou M2
//   const [semestreSelectionne, setSemestreSelectionne] = useState(null);
//   const [filiereSelectionnee, setFiliereSelectionnee] = useState(null);
//   const [ueSelectionnee, setUeSelectionnee] = useState(null);
//   const [ecSelectionne, setEcSelectionne] = useState(null);

//   // Etats pour modifier un étudiant
//   const [editIne, setEditIne] = useState('');
//   const [editNom, setEditNom] = useState('');
//   const [editPrenom, setEditPrenom] = useState('');

//   const [uesData, setUesData] = useState([]);
//   const [loadingUE, setLoadingUE] = useState(true);
//   const [errorUE, setErrorUE] = useState(null);

//   const tableRef = useRef(null);
//   const popupRef = useRef(null);
//   const editPopupRef = useRef(null);
//   const actionsRef = useRef(null);

//   // Chargement des étudiants existants du localStorage
//   useEffect(() => {
//     const stored = localStorage.getItem('etudiants');
//     if (stored) {
//       try {
//         setEtudiants(JSON.parse(stored));
//       } catch {
//         setEtudiants([]);
//       }
//     }
//   }, []);

//   // Chargement depuis l'API, transformation et regroupement des données EC/UE/semestre/filiere
//   useEffect(() => {
//     setLoadingUE(true);
//     fetch('http://localhost:8080/api/evaluation/liste_ec')
//       .then(response => {
//         if (!response.ok) throw new Error('Erreur chargement EC');
//         return response.json();
//       })
//       .then(rawData => {
//         // rawData = liste d'EC avec info UE, semestre, niveau, filiere (classe/libelle)

//         // On regroupe par semestreId > filiere (classe.libelle) > UE > EC

//         const grouped = [];

//         rawData.forEach(ecItem => {
//           const ue = ecItem.ue;
//           const semestre = ue.semestre;
//           const niveau = semestre.niveau ? semestre.niveau.nom : null; // ex: "M1"
//           const filiere = ue.classe ? ue.classe.libelle : null; // ex: "M1_INFO" (filiere supposée dans classe)

//           // Trouver ou ajouter semestre dans grouped
//           let semestreGroup = grouped.find(s => s.id === semestre.id);
//           if (!semestreGroup) {
//             semestreGroup = {
//               id: semestre.id,
//               libelle: semestre.libelle,
//               niveau: niveau,
//               filieres: [], // tableau des filières regroupées
//             };
//             grouped.push(semestreGroup);
//           }

//           // Trouver ou ajouter filiere
//           let filiereGroup = semestreGroup.filieres.find(f => f.nom === filiere);
//           if (!filiereGroup) {
//             filiereGroup = {
//               nom: filiere,
//               ues: [],
//             };
//             semestreGroup.filieres.push(filiereGroup);
//           }

//           // Trouver ou ajouter UE
//           let ueGroup = filiereGroup.ues.find(u => u.id === ue.id);
//           if (!ueGroup) {
//             ueGroup = {
//               id: ue.id,
//               codeUE: ue.code || ue.codeUE || '',  // certains champs peuvent manquer
//               intitule: ue.libelle,
//               ecs: [],
//             };
//             filiereGroup.ues.push(ueGroup);
//           }

//           // Ajouter EC à UE
//           ueGroup.ecs.push({
//             id: ecItem.id || ecItem.ue?.id || Math.random(), // id EC unique
//             codeEC: ecItem.code || ecItem.libelle || ecItem.codeEC || '',
//             intitule: ecItem.libelle,
//           });
//         });

//         setUesData(grouped);
//         setLoadingUE(false);
//       })
//       .catch(e => {
//         setUesData([]);
//         setErrorUE(e.message);
//         setLoadingUE(false);
//         console.error('Erreur chargement EC:', e);
//       });
//   }, []);

//   // Effets pour gérer clic en dehors
//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (
//         tableRef.current &&
//         !tableRef.current.contains(event.target) &&
//         !(popupRef.current && popupRef.current.contains(event.target)) &&
//         !(editPopupRef.current && editPopupRef.current.contains(event.target)) &&
//         !(actionsRef.current && actionsRef.current.contains(event.target))
//       ) {
//         setSelectedIndex(null);
//       }
//     }
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   useEffect(() => {
//     if (!showPopup) return;
//     function handleClickOutsidePopup(event) {
//       if (popupRef.current && !popupRef.current.contains(event.target)) {
//         setShowPopup(false);
//       }
//     }
//     document.addEventListener('mousedown', handleClickOutsidePopup);
//     return () => document.removeEventListener('mousedown', handleClickOutsidePopup);
//   }, [showPopup]);

//   useEffect(() => {
//     if (!showEditPopup) return;
//     function handleClickOutsideEditPopup(event) {
//       if (editPopupRef.current && !editPopupRef.current.contains(event.target)) {
//         setShowEditPopup(false);
//       }
//     }
//     document.addEventListener('mousedown', handleClickOutsideEditPopup);
//     return () => document.removeEventListener('mousedown', handleClickOutsideEditPopup);
//   }, [showEditPopup]);

//   // Gestion des interactions utilisateurs (sélection, ajouter, modifier, supprimer)
//   const handleRowClick = (index) => {
//     setSelectedIndex(index);
//   };

//   const handleAddClick = (e) => {
//     e.stopPropagation();
//     if (selectedIndex === null) {
//       alert("Veuillez sélectionner un étudiant.");
//       return;
//     }
//     setShowPopup(true);
//     setNiveauSelectionne(null);
//     setSemestreSelectionne(null);
//     setFiliereSelectionnee(null);
//     setUeSelectionnee(null);
//     setEcSelectionne(null);
//   };

//   const handleAjouterInscription = () => {
//     if (!ueSelectionnee || !ecSelectionne) return;

//     const etudiant = etudiants[selectedIndex];
//     const stored = localStorage.getItem('inscriptions');
//     let inscriptions = stored ? JSON.parse(stored) : [];

//     const existeDeja = inscriptions.some(
//       insc =>
//         insc.etudiant.matricule === (etudiant.INE || etudiant.ine) &&
//         insc.ec.codeEC === ecSelectionne.codeEC
//     );

//     if (existeDeja) {
//       alert(`⚠️ Cet étudiant est déjà inscrit à l'EC "${ecSelectionne.intitule}"`);
//       return;
//     }

//     const nextId = inscriptions.length > 0
//       ? Math.max(...inscriptions.map(insc => insc.id)) + 1
//       : 1;

//     const nouvelleInscription = {
//       id: nextId,
//       annee_inscription: new Date().getFullYear(),
//       etudiant: {
//         id: selectedIndex + 1,
//         nom: etudiant.NOM || etudiant.nom,
//         prenom: etudiant.PRENOM || etudiant.prenom,
//         matricule: etudiant.INE || etudiant.ine,
//         email: etudiant.email || 'email@uasz.sn'
//       },
//       ec: {
//         id: ecSelectionne.id,
//         codeEC: ecSelectionne.codeEC,
//         intitule: ecSelectionne.intitule,
//         ue: {
//           id: ueSelectionnee.id,
//           codeUE: ueSelectionnee.codeUE,
//           intitule: ueSelectionnee.intitule
//         }
//       }
//     };

//     inscriptions.push(nouvelleInscription);
//     localStorage.setItem('inscriptions', JSON.stringify(inscriptions));

//     alert(
//       `✅ Inscription enregistrée :\n${etudiant.NOM || etudiant.nom} inscrit à l'EC "${ecSelectionne.intitule}"`
//     );

//     setShowPopup(false);
//   };

//   const handleEdit = (e) => {
//     e.stopPropagation();
//     if (selectedIndex === null) return;
//     const selectedEtudiant = etudiants[selectedIndex];
//     setEditIne(selectedEtudiant.INE || selectedEtudiant.ine || '');
//     setEditNom(selectedEtudiant.NOM || selectedEtudiant.nom || '');
//     setEditPrenom(selectedEtudiant.PRENOM || selectedEtudiant.prenom || '');
//     setShowEditPopup(true);
//   };

//   const handleSaveEdit = () => {
//     const updatedEtudiants = [...etudiants];
//     updatedEtudiants[selectedIndex] = {
//       ...updatedEtudiants[selectedIndex],
//       INE: editIne,
//       NOM: editNom,
//       PRENOM: editPrenom,
//       ine: editIne,
//       nom: editNom,
//       prenom: editPrenom,
//     };
//     localStorage.setItem('etudiants', JSON.stringify(updatedEtudiants));
//     setEtudiants(updatedEtudiants);
//     setShowEditPopup(false);
//   };

//   const handleDelete = (e) => {
//     e.stopPropagation();
//     if (selectedIndex === null) return;
//     if (!window.confirm("Confirmer la suppression de cet étudiant ?")) return;

//     const updatedEtudiants = [...etudiants];
//     updatedEtudiants.splice(selectedIndex, 1);
//     localStorage.setItem('etudiants', JSON.stringify(updatedEtudiants));
//     setEtudiants(updatedEtudiants);
//     setSelectedIndex(null);
//   };

//   // Filtres pour le popup, adaptés à la nouvelle structure

//   // Niveau => semestres disponibles
//   const semestresDisponibles = niveauSelectionne
//     ? uesData
//         .filter(s => s.niveau === niveauSelectionne)
//         .map(s => ({ id: s.id, libelle: s.libelle }))
//     : [];

//   // Semestre choisi => filières disponibles
//   const filieresDisponibles = semestreSelectionne
//     ? uesData.find(s => s.id === semestreSelectionne)?.filieres || []
//     : [];

//   // Filtre UE selon semestre et filiere
//   const uesFiltrees = filiereSelectionnee
//     ? filieresDisponibles.find(f => f.nom === filiereSelectionnee)?.ues || []
//     : [];

//   return (
//     <div style={{
//       maxWidth: '900px',
//       margin: '40px auto',
//       background: 'white',
//       borderRadius: '8px',
//       boxShadow: '0 2px 16px #e0e0e0',
//       padding: '30px 30px 20px 30px'
//     }}>
//       <h1 style={{ textAlign: 'center', marginBottom: 30, fontWeight: 700 }}>
//         Liste des étudiants
//       </h1>

//       <div ref={actionsRef} style={{ display: 'flex', gap: 12, marginBottom: 18, justifyContent: 'center' }}>
//         <button
//           style={primaryBtnStyle(selectedIndex === null)}
//           onClick={handleAddClick}
//           disabled={selectedIndex === null}
//         >
//           Ajouter
//         </button>
//         <button
//           style={editBtnStyle(selectedIndex === null)}
//           onClick={handleEdit}
//           disabled={selectedIndex === null}
//         >
//           Modifier
//         </button>
//         <button
//           style={deleteBtnStyle(selectedIndex === null)}
//           onClick={handleDelete}
//           disabled={selectedIndex === null}
//         >
//           Supprimer
//         </button>
//       </div>

//       <table
//         ref={tableRef}
//         style={{ width: '100%', borderCollapse: 'collapse', marginTop: 10 }}
//       >
//         <thead>
//           <tr>
//             <th style={thStyle}>INE</th>
//             <th style={thStyle}>Nom</th>
//             <th style={thStyle}>Prénom</th>
//           </tr>
//         </thead>
//         <tbody>
//           {etudiants.length === 0 ? (
//             <tr>
//               <td colSpan={3} style={{ textAlign: 'center', padding: 30, color: '#888' }}>
//                 Aucun étudiant importé.
//               </td>
//             </tr>
//           ) : (
//             etudiants.map((etudiant, index) => (
//               <tr
//                 key={index}
//                 style={{
//                   background: selectedIndex === index ? '#c8e6c9' : index % 2 === 0 ? '#f8fafc' : 'white',
//                   cursor: 'pointer'
//                 }}
//                 onClick={() => handleRowClick(index)}
//               >
//                 <td style={tdStyle}>{etudiant.INE || etudiant.ine}</td>
//                 <td style={tdStyle}>{etudiant.NOM || etudiant.nom}</td>
//                 <td style={tdStyle}>{etudiant.PRENOM || etudiant.prenom}</td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>

//       {loadingUE && <div style={{textAlign: 'center', marginTop: 20}}>Chargement des UE/EC...</div>}
//       {errorUE && <div style={{textAlign: 'center', marginTop: 20, color: 'red'}}>Erreur: {errorUE}</div>}

//       {/* Popup MODAL AJOUT EC */}
//       {showPopup && (
//         <div style={popupOverlayStyle}>
//           <div style={popupStyle} ref={popupRef}>
//             <h3>Ajouter l'étudiant à un EC</h3>

//             {/* Étape 0 : Niveau */}
//             {!niveauSelectionne && (
//               <div>
//                 <strong>Choisir le niveau :</strong>
//                 <ul style={{ listStyle: 'none', padding: 0 }}>
//                   {["M1", "M2"].map(niveau => (
//                     <li key={niveau} style={{ margin: '8px 0' }}>
//                       <button
//                         style={{
//                           background: '#f1f5f9',
//                           color: '#222',
//                           border: 'none',
//                           borderRadius: 4,
//                           padding: '7px 14px',
//                           cursor: 'pointer',
//                           fontWeight: 'bold',
//                           width: '100%',
//                           textAlign: 'left'
//                         }}
//                         onClick={() => {
//                           setNiveauSelectionne(niveau);
//                           setSemestreSelectionne(null);
//                           setFiliereSelectionnee(null);
//                           setUeSelectionnee(null);
//                           setEcSelectionne(null);
//                         }}
//                       >
//                         {niveau}
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}

//             {/* Étape 1 : Semestre */}
//             {niveauSelectionne && !semestreSelectionne && (
//               <div>
//                 <strong>Choisir un semestre :</strong>
//                 <ul style={{ listStyle: 'none', padding: 0 }}>
//                   {semestresDisponibles.map((sem) => (
//                     <li key={sem.id} style={{ margin: '8px 0' }}>
//                       <button
//                         style={{
//                           background: '#f1f5f9',
//                           color: '#222',
//                           border: 'none',
//                           borderRadius: 4,
//                           padding: '7px 14px',
//                           cursor: 'pointer',
//                           fontWeight: 'bold',
//                           width: '100%',
//                           textAlign: 'left'
//                         }}
//                         onClick={() => {
//                           setSemestreSelectionne(sem.id);
//                           setFiliereSelectionnee(null);
//                           setUeSelectionnee(null);
//                           setEcSelectionne(null);
//                         }}
//                       >
//                         {sem.libelle}
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//                 <button
//                   style={{ marginTop: 8, color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer' }}
//                   onClick={() => setNiveauSelectionne(null)}
//                 >
//                   &larr; Retour au niveau
//                 </button>
//               </div>
//             )}

//             {/* Étape 2 : Filière (si semestre et semestres > 1) */}
//             {niveauSelectionne && semestreSelectionne && !filiereSelectionnee && filieresDisponibles.length > 0 && (
//               <div>
//                 <strong>Choisir une filière :</strong>
//                 <ul style={{ listStyle: 'none', padding: 0 }}>
//                   {filieresDisponibles.map(filiere => (
//                     <li key={filiere.nom} style={{ margin: '8px 0' }}>
//                       <button
//                         style={{
//                           background: '#f1f5f9',
//                           color: '#222',
//                           border: 'none',
//                           borderRadius: 4,
//                           padding: '7px 14px',
//                           cursor: 'pointer',
//                           fontWeight: 'bold',
//                           width: '100%',
//                           textAlign: 'left'
//                         }}
//                         onClick={() => {
//                           setFiliereSelectionnee(filiere.nom);
//                           setUeSelectionnee(null);
//                           setEcSelectionne(null);
//                         }}
//                       >
//                         {filiere.nom}
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//                 <button
//                   style={{ marginTop: 8, color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer' }}
//                   onClick={() => setSemestreSelectionne(null)}
//                 >
//                   &larr; Retour aux semestres
//                 </button>
//               </div>
//             )}

//             {/* Étape 3 : UE */}
//             {niveauSelectionne && semestreSelectionne && filiereSelectionnee && !ueSelectionnee && (
//               <div>
//                 <strong>Choisir une UE :</strong>
//                 <ul style={{ listStyle: 'none', padding: 0 }}>
//                   {uesFiltrees.map(ue => (
//                     <li key={ue.id} style={{ margin: '8px 0' }}>
//                       <button
//                         style={{
//                           background: '#f1f5f9',
//                           color: '#222',
//                           border: 'none',
//                           borderRadius: 4,
//                           padding: '7px 14px',
//                           cursor: 'pointer',
//                           fontWeight: 'bold',
//                           width: '100%',
//                           textAlign: 'left'
//                         }}
//                         onClick={() => {
//                           setUeSelectionnee(ue);
//                           setEcSelectionne(null);
//                         }}
//                       >
//                         {ue.codeUE} - {ue.intitule}
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//                 <button
//                   style={{ marginTop: 8, color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer' }}
//                   onClick={() => setFiliereSelectionnee(null)}
//                 >
//                   &larr; Retour aux filières
//                 </button>
//               </div>
//             )}

//             {/* Étape 4 : EC */}
//             {ueSelectionnee && (
//               <div>
//                 <strong>Choisir un EC :</strong>
//                 <ul style={{ listStyle: 'none', padding: 0 }}>
//                   {ueSelectionnee.ecs.map(ec => (
//                     <li key={ec.id} style={{ margin: '6px 0' }}>
//                       <button
//                         style={{
//                           background: ecSelectionne?.id === ec.id ? '#059669' : '#f1f5f9',
//                           color: ecSelectionne?.id === ec.id ? 'white' : '#222',
//                           border: 'none',
//                           borderRadius: 4,
//                           padding: '7px 14px',
//                           cursor: 'pointer',
//                           width: '100%',
//                           textAlign: 'left'
//                         }}
//                         onClick={() => setEcSelectionne(ec)}
//                       >
//                         {ec.codeEC && ec.codeEC !== ec.intitule ? `${ec.codeEC} - ${ec.intitule}` : ec.intitule}

//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//                 <button
//                   style={{ marginTop: 8, color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer' }}
//                   onClick={() => setUeSelectionnee(null)}
//                 >
//                   &larr; Retour aux UE
//                 </button>
//               </div>
//             )}

//             {/* Bouton Ajouter */}
//             {ecSelectionne && (
//               <button
//                 style={primaryBtnStyle(false, { marginTop: 18, width: '100%' })}
//                 onClick={handleAjouterInscription}
//               >
//                 Ajouter
//               </button>
//             )}

//             {/* Fermer popup */}
//             <button style={closeBtnStyle} onClick={() => setShowPopup(false)}>
//               Fermer
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Popup MODAL MODIFIER ETUDIANT */}
//       {showEditPopup && (
//         <div style={popupOverlayStyle}>
//           <div style={editModalContent} ref={editPopupRef}>
//             <h3 style={editModalTitleStyle}>Modifier l'étudiant</h3>
//             <div style={materialField}>
//               <label style={materialLabel}>INE</label>
//               <input
//                 value={editIne}
//                 onChange={(e) => setEditIne(e.target.value)}
//                 style={materialInput}
//               />
//             </div>
//             <div style={materialField}>
//               <label style={materialLabel}>Nom</label>
//               <input
//                 value={editNom}
//                 onChange={(e) => setEditNom(e.target.value)}
//                 style={materialInput}
//               />
//             </div>
//             <div style={materialField}>
//               <label style={materialLabel}>Prénom</label>
//               <input
//                 value={editPrenom}
//                 onChange={(e) => setEditPrenom(e.target.value)}
//                 style={materialInput}
//               />
//             </div>
//             <div style={modalBtnRow}>
//               <button onClick={() => setShowEditPopup(false)} style={cancelBtnStyle}>Annuler</button>
//               <button onClick={handleSaveEdit} style={editSaveBtnStyle}>Enregistrer</button>
//             </div>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// };

// // Styles (identiques) pour boutons, tableau, popup, etc.
// // (À copier depuis ton code original, inchangés)

// const primaryBtnStyle = (isDisabled, extraStyles = {}) => ({
//   background: '#059669',
//   color: 'white',
//   border: 'none',
//   borderRadius: 5,
//   padding: '10px 18px',
//   fontWeight: 'bold',
//   fontSize: 15,
//   cursor: isDisabled ? 'not-allowed' : 'pointer',
//   opacity: isDisabled ? 0.6 : 1,
//   filter: isDisabled ? 'grayscale(0.3)' : 'none',
//   transition: 'opacity 0.2s, filter 0.2s',
//   ...extraStyles
// });
// const editBtnStyle = (isDisabled, extraStyles = {}) => ({
//   background: '#3b82f6',
//   color: 'white',
//   border: 'none',
//   borderRadius: 5,
//   padding: '10px 18px',
//   fontWeight: 'bold',
//   fontSize: 15,
//   cursor: isDisabled ? 'not-allowed' : 'pointer',
//   opacity: isDisabled ? 0.6 : 1,
//   filter: isDisabled ? 'grayscale(0.3)' : 'none',
//   transition: 'opacity 0.2s, filter 0.2s',
//   ...extraStyles
// });
// const deleteBtnStyle = (isDisabled, extraStyles = {}) => ({
//   background: '#ef4444',
//   color: 'white',
//   border: 'none',
//   borderRadius: 5,
//   padding: '10px 18px',
//   fontWeight: 'bold',
//   fontSize: 15,
//   cursor: isDisabled ? 'not-allowed' : 'pointer',
//   opacity: isDisabled ? 0.6 : 1,
//   filter: isDisabled ? 'grayscale(0.3)' : 'none',
//   transition: 'opacity 0.2s, filter 0.2s',
//   ...extraStyles
// });

// const thStyle = {
//   background: '#f1f5f9',
//   fontWeight: 'bold',
//   padding: '10px 8px',
//   borderBottom: '2px solid #e5e7eb',
//   textAlign: 'left'
// };
// const tdStyle = {
//   padding: '9px 8px',
//   borderBottom: '1px solid #e5e7eb'
// };

// const popupOverlayStyle = {
//   position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
//   background: 'rgba(0,0,0,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99
// };
// const popupStyle = {
//   background: 'white', borderRadius: 10, padding: 30, minWidth: 340, minHeight: 320, boxShadow: '0 2px 16px #e0e0e0', position: 'relative'
// };
// const closeBtnStyle = {
//   position: 'absolute',
//   top: 12,
//   right: 12,
//   background: 'transparent',
//   border: 'none',
//   color: '#888',
//   fontWeight: 'bold',
//   fontSize: 18,
//   cursor: 'pointer'
// };

// const editModalContent = {
//   background: 'white',
//   padding: '38px 32px 28px 32px',
//   borderRadius: 8,
//   width: 600,
//   boxShadow: '0 4px 24px rgba(0, 0, 0, 0.19)',
//   display: 'flex',
//   flexDirection: 'column',
// };
// const editModalTitleStyle = {
//   fontSize: '2.4rem',
//   fontWeight: 400,
//   marginBottom: 30,
//   marginTop: 0,
//   letterSpacing: '-1px',
//   fontFamily: 'inherit',
// };
// const materialField = {
//   marginBottom: 18,
//   display: 'flex',
//   flexDirection: 'column',
// };
// const materialLabel = {
//   fontSize: 18,
//   color: '#222',
//   marginBottom: 5,
//   fontWeight: 400,
//   fontFamily: 'inherit',
// };
// const materialInput = {
//   width: '100%',
//   padding: '13px 12px',
//   borderRadius: 6,
//   border: '1px solid #e0e0e0',
//   background: '#fff',
//   fontSize: 18,
//   color: '#222',
//   outline: 'none',
//   fontFamily: 'inherit',
//   boxSizing: 'border-box',
//   transition: 'border 0.2s',
// };
// const modalBtnRow = {
//   display: 'flex',
//   justifyContent: 'flex-end',
//   gap: 10,
//   marginTop: 12,
// };
// const editSaveBtnStyle = {
//   background: '#10b981',
//   color: 'white',
//   border: 'none',
//   padding: '10px 26px',
//   borderRadius: 5,
//   fontSize: 16,
//   fontWeight: 600,
//   cursor: 'pointer',
// };
// const cancelBtnStyle = {
//   background: '#9ca3af',
//   color: 'white',
//   border: 'none',
//   padding: '10px 26px',
//   borderRadius: 5,
//   fontSize: 16,
//   fontWeight: 600,
//   cursor: 'pointer',
//   opacity: 0.7,
// };

// export default EtudiantsListe;














// import React, { useEffect, useRef, useState } from 'react';
// import uesData from '../data/ues.json'; // Structure adaptée avec semestre, filiere, ues

// const EtudiantsListe = () => {
//   const [etudiants, setEtudiants] = useState([]);
//   const [selectedIndex, setSelectedIndex] = useState(null);
//   const [showPopup, setShowPopup] = useState(false);
//   const [showEditPopup, setShowEditPopup] = useState(false);

//   const [niveauSelectionne, setNiveauSelectionne] = useState(null); // M1 ou M2
//   const [semestreSelectionne, setSemestreSelectionne] = useState(null);
//   const [filiereSelectionnee, setFiliereSelectionnee] = useState(null);
//   const [ueSelectionnee, setUeSelectionnee] = useState(null);
//   const [ecSelectionne, setEcSelectionne] = useState(null);

//   // Etats pour modifier un étudiant
//   const [editIne, setEditIne] = useState('');
//   const [editNom, setEditNom] = useState('');
//   const [editPrenom, setEditPrenom] = useState('');

//   const tableRef = useRef(null);
//   const popupRef = useRef(null);
//   const editPopupRef = useRef(null);
//   const actionsRef = useRef(null);

//   useEffect(() => {
//     const stored = localStorage.getItem('etudiants');
//     if (stored) {
//       try {
//         setEtudiants(JSON.parse(stored));
//       } catch {
//         setEtudiants([]);
//       }
//     }
//   }, []);

//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (
//         tableRef.current &&
//         !tableRef.current.contains(event.target) &&
//         !(popupRef.current && popupRef.current.contains(event.target)) &&
//         !(editPopupRef.current && editPopupRef.current.contains(event.target)) &&
//         !(actionsRef.current && actionsRef.current.contains(event.target))
//       ) {
//         setSelectedIndex(null);
//       }
//     }
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   useEffect(() => {
//     if (!showPopup) return;
//     function handleClickOutsidePopup(event) {
//       if (popupRef.current && !popupRef.current.contains(event.target)) {
//         setShowPopup(false);
//       }
//     }
//     document.addEventListener('mousedown', handleClickOutsidePopup);
//     return () => document.removeEventListener('mousedown', handleClickOutsidePopup);
//   }, [showPopup]);

//   useEffect(() => {
//     if (!showEditPopup) return;
//     function handleClickOutsideEditPopup(event) {
//       if (editPopupRef.current && !editPopupRef.current.contains(event.target)) {
//         setShowEditPopup(false);
//       }
//     }
//     document.addEventListener('mousedown', handleClickOutsideEditPopup);
//     return () => document.removeEventListener('mousedown', handleClickOutsideEditPopup);
//   }, [showEditPopup]);

//   const handleRowClick = (index) => {
//     setSelectedIndex(index);
//   };

//   const handleAddClick = (e) => {
//     e.stopPropagation();
//     if (selectedIndex === null) {
//       alert("Veuillez sélectionner un étudiant.");
//       return;
//     }
//     setShowPopup(true);
//     setNiveauSelectionne(null);
//     setSemestreSelectionne(null);
//     setFiliereSelectionnee(null);
//     setUeSelectionnee(null);
//     setEcSelectionne(null);
//   };

//   const handleAjouterInscription = () => {
//     if (!ueSelectionnee || !ecSelectionne) return;

//     const etudiant = etudiants[selectedIndex];
//     const stored = localStorage.getItem('inscriptions');
//     let inscriptions = stored ? JSON.parse(stored) : [];

//     const existeDeja = inscriptions.some(
//       insc =>
//         insc.etudiant.matricule === (etudiant.INE || etudiant.ine) &&
//         insc.ec.codeEC === ecSelectionne.codeEC
//     );

//     if (existeDeja) {
//       alert(`⚠️ Cet étudiant est déjà inscrit à l'EC "${ecSelectionne.intitule}"`);
//       return;
//     }

//     const nextId = inscriptions.length > 0
//       ? Math.max(...inscriptions.map(insc => insc.id)) + 1
//       : 1;

//     const nouvelleInscription = {
//       id: nextId,
//       annee_inscription: new Date().getFullYear(),
//       etudiant: {
//         id: selectedIndex + 1,
//         nom: etudiant.NOM || etudiant.nom,
//         prenom: etudiant.PRENOM || etudiant.prenom,
//         matricule: etudiant.INE || etudiant.ine,
//         email: etudiant.email || 'email@uasz.sn'
//       },
//       ec: {
//         id: ecSelectionne.id,
//         codeEC: ecSelectionne.codeEC,
//         intitule: ecSelectionne.intitule,
//         ue: {
//           id: ueSelectionnee.id,
//           codeUE: ueSelectionnee.codeUE,
//           intitule: ueSelectionnee.intitule
//         }
//       }
//     };

//     inscriptions.push(nouvelleInscription);
//     localStorage.setItem('inscriptions', JSON.stringify(inscriptions));

//     alert(
//       `✅ Inscription enregistrée :\n${etudiant.NOM || etudiant.nom} inscrit à l'EC "${ecSelectionne.intitule}"`
//     );

//     setShowPopup(false);
//   };

//   const handleEdit = (e) => {
//     e.stopPropagation();
//     if (selectedIndex === null) return;
//     const selectedEtudiant = etudiants[selectedIndex];
//     setEditIne(selectedEtudiant.INE || selectedEtudiant.ine || '');
//     setEditNom(selectedEtudiant.NOM || selectedEtudiant.nom || '');
//     setEditPrenom(selectedEtudiant.PRENOM || selectedEtudiant.prenom || '');
//     setShowEditPopup(true);
//   };

//   const handleSaveEdit = () => {
//     const updatedEtudiants = [...etudiants];
//     updatedEtudiants[selectedIndex] = {
//       ...updatedEtudiants[selectedIndex],
//       INE: editIne,
//       NOM: editNom,
//       PRENOM: editPrenom,
//       ine: editIne,
//       nom: editNom,
//       prenom: editPrenom,
//     };
//     localStorage.setItem('etudiants', JSON.stringify(updatedEtudiants));
//     setEtudiants(updatedEtudiants);
//     setShowEditPopup(false);
//   };

//   const handleDelete = (e) => {
//     e.stopPropagation();
//     if (selectedIndex === null) return;
//     if (!window.confirm("Confirmer la suppression de cet étudiant ?")) return;

//     const updatedEtudiants = [...etudiants];
//     updatedEtudiants.splice(selectedIndex, 1);
//     localStorage.setItem('etudiants', JSON.stringify(updatedEtudiants));
//     setEtudiants(updatedEtudiants);
//     setSelectedIndex(null);
//   };

//   // Filtrer les semestres selon le niveau sélectionné
//   const semestresDisponibles = niveauSelectionne === "M1"
//     ? [1, 2]
//     : niveauSelectionne === "M2"
//       ? [3, 4]
//       : [];

//   // Filtrer les UE selon semestre et filière sélectionnés
//   const uesFiltrees = semestreSelectionne
//     ? uesData.find(item =>
//         item.semestre === semestreSelectionne &&
//         (semestreSelectionne === 1 || item.filiere === filiereSelectionnee)
//       )?.ues || []
//     : [];

//   return (
//     <div style={{
//       maxWidth: '900px',
//       margin: '40px auto',
//       background: 'white',
//       borderRadius: '8px',
//       boxShadow: '0 2px 16px #e0e0e0',
//       padding: '30px 30px 20px 30px'
//     }}>
//       <h1 style={{ textAlign: 'center', marginBottom: 30, fontWeight: 700 }}>
//         Liste des étudiants
//       </h1>
//       <div ref={actionsRef} style={{ display: 'flex', gap: 12, marginBottom: 18, justifyContent: 'center' }}>
//         <button
//           style={primaryBtnStyle(selectedIndex === null)}
//           onClick={handleAddClick}
//           disabled={selectedIndex === null}
//         >
//           Ajouter
//         </button>
//         <button
//           style={editBtnStyle(selectedIndex === null)}
//           onClick={handleEdit}
//           disabled={selectedIndex === null}
//         >
//           Modifier
//         </button>
//         <button
//           style={deleteBtnStyle(selectedIndex === null)}
//           onClick={handleDelete}
//           disabled={selectedIndex === null}
//         >
//           Supprimer
//         </button>
//       </div>
//       <table
//         ref={tableRef}
//         style={{ width: '100%', borderCollapse: 'collapse', marginTop: 10 }}
//       >
//         <thead>
//           <tr>
//             <th style={thStyle}>INE</th>
//             <th style={thStyle}>Nom</th>
//             <th style={thStyle}>Prénom</th>
//           </tr>
//         </thead>
//         <tbody>
//           {etudiants.length === 0 ? (
//             <tr>
//               <td colSpan={3} style={{ textAlign: 'center', padding: 30, color: '#888' }}>
//                 Aucun étudiant importé.
//               </td>
//             </tr>
//           ) : (
//             etudiants.map((etudiant, index) => (
//               <tr
//                 key={index}
//                 style={{
//                   background: selectedIndex === index ? '#c8e6c9' : index % 2 === 0 ? '#f8fafc' : 'white',
//                   cursor: 'pointer'
//                 }}
//                 onClick={() => handleRowClick(index)}
//               >
//                 <td style={tdStyle}>{etudiant.INE || etudiant.ine}</td>
//                 <td style={tdStyle}>{etudiant.NOM || etudiant.nom}</td>
//                 <td style={tdStyle}>{etudiant.PRENOM || etudiant.prenom}</td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>

//       {/* POPUP MODAL pour AJOUT EC */}
//       {showPopup && (
//         <div style={popupOverlayStyle}>
//           <div style={popupStyle} ref={popupRef}>
//             <h3>Ajouter l'étudiant à un EC</h3>

//             {/* Étape 0 : Choix du niveau */}
//             {!niveauSelectionne && (
//               <div>
//                 <strong>Choisir le niveau :</strong>
//                 <ul style={{ listStyle: 'none', padding: 0 }}>
//                   {["M1", "M2"].map(niveau => (
//                     <li key={niveau} style={{ margin: '8px 0' }}>
//                       <button
//                         style={{
//                           background: '#f1f5f9',
//                           color: '#222',
//                           border: 'none',
//                           borderRadius: 4,
//                           padding: '7px 14px',
//                           cursor: 'pointer',
//                           fontWeight: 'bold',
//                           width: '100%',
//                           textAlign: 'left'
//                         }}
//                         onClick={() => {
//                           setNiveauSelectionne(niveau);
//                           setSemestreSelectionne(null);
//                           setFiliereSelectionnee(null);
//                           setUeSelectionnee(null);
//                           setEcSelectionne(null);
//                         }}
//                       >
//                         {niveau}
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}

//             {/* Étape 1 : Choix du semestre */}
//             {niveauSelectionne && !semestreSelectionne && (
//               <div>
//                 <strong>Choisir un semestre :</strong>
//                 <ul style={{ listStyle: 'none', padding: 0 }}>
//                   {semestresDisponibles.map((num) => (
//                     <li key={num} style={{ margin: '8px 0' }}>
//                       <button
//                         style={{
//                           background: '#f1f5f9',
//                           color: '#222',
//                           border: 'none',
//                           borderRadius: 4,
//                           padding: '7px 14px',
//                           cursor: 'pointer',
//                           fontWeight: 'bold',
//                           width: '100%',
//                           textAlign: 'left'
//                         }}
//                         onClick={() => {
//                           setSemestreSelectionne(num);
//                           setFiliereSelectionnee(null);
//                           setUeSelectionnee(null);
//                           setEcSelectionne(null);
//                         }}
//                       >
//                         Semestre {num}
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//                 <button
//                   style={{ marginTop: 8, color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer' }}
//                   onClick={() => setNiveauSelectionne(null)}
//                 >
//                   &larr; Retour au niveau
//                 </button>
//               </div>
//             )}

//             {/* Étape 2 : Choix filière si semestre > 1 */}
//             {niveauSelectionne && semestreSelectionne > 1 && !filiereSelectionnee && (
//               <div>
//                 <strong>Choisir une filière :</strong>
//                 <ul style={{ listStyle: 'none', padding: 0 }}>
//                   {['GL', 'RS'].map(filiere => (
//                     <li key={filiere} style={{ margin: '8px 0' }}>
//                       <button
//                         style={{
//                           background: '#f1f5f9',
//                           color: '#222',
//                           border: 'none',
//                           borderRadius: 4,
//                           padding: '7px 14px',
//                           cursor: 'pointer',
//                           fontWeight: 'bold',
//                           width: '100%',
//                           textAlign: 'left'
//                         }}
//                         onClick={() => {
//                           setFiliereSelectionnee(filiere);
//                           setUeSelectionnee(null);
//                           setEcSelectionne(null);
//                         }}
//                       >
//                         {filiere}
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//                 <button
//                   style={{ marginTop: 8, color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer' }}
//                   onClick={() => setSemestreSelectionne(null)}
//                 >
//                   &larr; Retour aux semestres
//                 </button>
//               </div>
//             )}

//             {/* Étape 3 : Choix de l'UE */}
//             {niveauSelectionne && (semestreSelectionne === 1 || filiereSelectionnee) && !ueSelectionnee && (
//               <div>
//                 <strong>Choisir une UE :</strong>
//                 <ul style={{ listStyle: 'none', padding: 0 }}>
//                   {uesFiltrees.map(ue => (
//                     <li key={ue.id} style={{ margin: '8px 0' }}>
//                       <button
//                         style={{
//                           background: '#f1f5f9',
//                           color: '#222',
//                           border: 'none',
//                           borderRadius: 4,
//                           padding: '7px 14px',
//                           cursor: 'pointer',
//                           fontWeight: 'bold',
//                           width: '100%',
//                           textAlign: 'left'
//                         }}
//                         onClick={() => {
//                           setUeSelectionnee(ue);
//                           setEcSelectionne(null);
//                         }}
//                       >
//                         {ue.codeUE} - {ue.intitule}
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//                 <button
//                   style={{ marginTop: 8, color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer' }}
//                   onClick={() => {
//                     if (semestreSelectionne > 1) setFiliereSelectionnee(null);
//                     else setSemestreSelectionne(null);
//                   }}
//                 >
//                   &larr; Retour
//                 </button>
//               </div>
//             )}

//             {/* Étape 4 : Choix de l'EC */}
//             {niveauSelectionne && semestreSelectionne && ueSelectionnee && (
//               <div>
//                 <strong>Choisir un EC :</strong>
//                 <ul style={{ listStyle: 'none', padding: 0 }}>
//                   {ueSelectionnee.ecs.map(ec => (
//                     <li key={ec.id} style={{ margin: '6px 0' }}>
//                       <button
//                         style={{
//                           background: ecSelectionne?.id === ec.id ? '#059669' : '#f1f5f9',
//                           color: ecSelectionne?.id === ec.id ? 'white' : '#222',
//                           border: 'none',
//                           borderRadius: 4,
//                           padding: '7px 14px',
//                           cursor: 'pointer',
//                           width: '100%',
//                           textAlign: 'left'
//                         }}
//                         onClick={() => setEcSelectionne(ec)}
//                       >
//                         {ec.codeEC} - {ec.intitule}
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//                 <button
//                   style={{ marginTop: 8, color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer' }}
//                   onClick={() => setUeSelectionnee(null)}
//                 >
//                   &larr; Retour aux UE
//                 </button>
//               </div>
//             )}

//             {/* Bouton Ajouter */}
//             {ecSelectionne && (
//               <button
//                 style={primaryBtnStyle(false, { marginTop: 18, width: '100%' })}
//                 onClick={handleAjouterInscription}
//               >
//                 Ajouter
//               </button>
//             )}

//             {/* Fermer le popup */}
//             <button style={closeBtnStyle} onClick={() => setShowPopup(false)}>
//               Fermer
//             </button>
//           </div>
//         </div>
//       )}

//       {/* POPUP MODAL pour MODIFIER ETUDIANT */}
//       {showEditPopup && (
//         <div style={popupOverlayStyle}>
//           <div style={editModalContent} ref={editPopupRef}>
//             <h3 style={editModalTitleStyle}>Modifier l'étudiant</h3>
//             <div style={materialField}>
//               <label style={materialLabel}>INE</label>
//               <input
//                 value={editIne}
//                 onChange={(e) => setEditIne(e.target.value)}
//                 style={materialInput}
//               />
//             </div>
//             <div style={materialField}>
//               <label style={materialLabel}>Nom</label>
//               <input
//                 value={editNom}
//                 onChange={(e) => setEditNom(e.target.value)}
//                 style={materialInput}
//               />
//             </div>
//             <div style={materialField}>
//               <label style={materialLabel}>Prénom</label>
//               <input
//                 value={editPrenom}
//                 onChange={(e) => setEditPrenom(e.target.value)}
//                 style={materialInput}
//               />
//             </div>
//             <div style={modalBtnRow}>
//               <button onClick={() => setShowEditPopup(false)} style={cancelBtnStyle}>Annuler</button>
//               <button onClick={handleSaveEdit} style={editSaveBtnStyle}>Enregistrer</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // Styles pour les boutons d’action
// const primaryBtnStyle = (isDisabled, extraStyles = {}) => ({
//   background: '#059669',
//   color: 'white',
//   border: 'none',
//   borderRadius: 5,
//   padding: '10px 18px',
//   fontWeight: 'bold',
//   fontSize: 15,
//   cursor: isDisabled ? 'not-allowed' : 'pointer',
//   opacity: isDisabled ? 0.6 : 1,
//   filter: isDisabled ? 'grayscale(0.3)' : 'none',
//   transition: 'opacity 0.2s, filter 0.2s',
//   ...extraStyles
// });
// const editBtnStyle = (isDisabled, extraStyles = {}) => ({
//   background: '#3b82f6',
//   color: 'white',
//   border: 'none',
//   borderRadius: 5,
//   padding: '10px 18px',
//   fontWeight: 'bold',
//   fontSize: 15,
//   cursor: isDisabled ? 'not-allowed' : 'pointer',
//   opacity: isDisabled ? 0.6 : 1,
//   filter: isDisabled ? 'grayscale(0.3)' : 'none',
//   transition: 'opacity 0.2s, filter 0.2s',
//   ...extraStyles
// });
// const deleteBtnStyle = (isDisabled, extraStyles = {}) => ({
//   background: '#ef4444',
//   color: 'white',
//   border: 'none',
//   borderRadius: 5,
//   padding: '10px 18px',
//   fontWeight: 'bold',
//   fontSize: 15,
//   cursor: isDisabled ? 'not-allowed' : 'pointer',
//   opacity: isDisabled ? 0.6 : 1,
//   filter: isDisabled ? 'grayscale(0.3)' : 'none',
//   transition: 'opacity 0.2s, filter 0.2s',
//   ...extraStyles
// });

// // Styles du tableau
// const thStyle = {
//   background: '#f1f5f9',
//   fontWeight: 'bold',
//   padding: '10px 8px',
//   borderBottom: '2px solid #e5e7eb',
//   textAlign: 'left'
// };
// const tdStyle = {
//   padding: '9px 8px',
//   borderBottom: '1px solid #e5e7eb'
// };

// // Styles du popup d’ajout EC
// const popupOverlayStyle = {
//   position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
//   background: 'rgba(0,0,0,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99
// };
// const popupStyle = {
//   background: 'white', borderRadius: 10, padding: 30, minWidth: 340, minHeight: 320, boxShadow: '0 2px 16px #e0e0e0', position: 'relative'
// };
// const closeBtnStyle = {
//   position: 'absolute',
//   top: 12,
//   right: 12,
//   background: 'transparent',
//   border: 'none',
//   color: '#888',
//   fontWeight: 'bold',
//   fontSize: 18,
//   cursor: 'pointer'
// };

// // Styles du popup de modification étudiant
// const editModalContent = {
//   background: 'white',
//   padding: '38px 32px 28px 32px',
//   borderRadius: 8,
//   width: 600,
//   boxShadow: '0 4px 24px rgba(0, 0, 0, 0.19)',
//   display: 'flex',
//   flexDirection: 'column',
// };
// const editModalTitleStyle = {
//   fontSize: '2.4rem',
//   fontWeight: 400,
//   marginBottom: 30,
//   marginTop: 0,
//   letterSpacing: '-1px',
//   fontFamily: 'inherit',
// };
// const materialField = {
//   marginBottom: 18,
//   display: 'flex',
//   flexDirection: 'column',
// };
// const materialLabel = {
//   fontSize: 18,
//   color: '#222',
//   marginBottom: 5,
//   fontWeight: 400,
//   fontFamily: 'inherit',
// };
// const materialInput = {
//   width: '100%',
//   padding: '13px 12px',
//   borderRadius: 6,
//   border: '1px solid #e0e0e0',
//   background: '#fff',
//   fontSize: 18,
//   color: '#222',
//   outline: 'none',
//   fontFamily: 'inherit',
//   boxSizing: 'border-box',
//   transition: 'border 0.2s',
// };
// const modalBtnRow = {
//   display: 'flex',
//   justifyContent: 'flex-end',
//   gap: 10,
//   marginTop: 12,
// };
// const editSaveBtnStyle = {
//   background: '#10b981',
//   color: 'white',
//   border: 'none',
//   padding: '10px 26px',
//   borderRadius: 5,
//   fontSize: 16,
//   fontWeight: 600,
//   cursor: 'pointer',
// };
// const cancelBtnStyle = {
//   background: '#9ca3af',
//   color: 'white',
//   border: 'none',
//   padding: '10px 26px',
//   borderRadius: 5,
//   fontSize: 16,
//   fontWeight: 600,
//   cursor: 'pointer',
//   opacity: 0.7,
// };


// export default EtudiantsListe;
