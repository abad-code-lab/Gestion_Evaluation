import React, { useState } from 'react';
import Papa from 'papaparse';

const ImportCsv = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleFileChange = (e) => {
    setError('');
    setSuccessMessage('');
    setFile(e.target.files[0]);
  };

  const handleImport = () => {
    if (!file) {
      setError('Veuillez sélectionner un fichier CSV.');
      return;
    }

    Papa.parse(file, {
      delimiter: ";", // important pour ton fichier
      skipEmptyLines: true,
      complete: function(results) {
        // results.data est un tableau de tableaux (pas d'en-tête)
        // On mappe chaque ligne vers un objet { INE, NOM, PRENOM }
        const etudiants = results.data.map(row => ({
          INE: row[0],
          NOM: row[1],
          PRENOM: row[2]
        }));
        localStorage.setItem('etudiants', JSON.stringify(etudiants));
        setSuccessMessage('Fichier CSV importé et données sauvegardées localement !');
        setFile(null);
      },
      error: function(err) {
        setError('Erreur lors de la lecture du fichier CSV : ' + err.message);
        setSuccessMessage('');
      }
    });
  };

  return (
    <div>
      <h2>Importer un fichier CSV d'étudiants</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleImport} disabled={!file}>Importer</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
};

export default ImportCsv;
