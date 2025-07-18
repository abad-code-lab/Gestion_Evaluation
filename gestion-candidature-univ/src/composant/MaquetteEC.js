import React, { useState } from 'react';
import uesData from '../data/ues.json'; // Assure-toi que ce fichier existe et est bien structuré

const MaquetteEC = () => {
  const [rows, setRows] = useState([]);

  const handleCharger = () => {
    console.log("Données JSON chargées :", uesData); // pour test console

    const lignes = [];
    uesData.forEach(ue => {
      ue.ecs.forEach(ec => {
        lignes.push({
          codeUE: ue.codeUE,
          intituleUE: ue.intitule,
          codeEC: ec.codeEC,
          intituleEC: ec.intitule
        });
      });
    });
    setRows(lignes);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '30px auto', padding: '0 15px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Maquette des EC</h2>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button onClick={handleCharger}>Charger</button>
        <button onClick={() => console.log("Contenu brut JSON :", uesData)} style={{ marginLeft: '10px' }}>
          Voir les données JSON
        </button>
      </div>

      {rows.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={headerStyle}>Code UE</th>
              <th style={headerStyle}>Intitulé UE</th>
              <th style={headerStyle}>Code EC</th>
              <th style={headerStyle}>Intitulé EC</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={index}
                style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white' }}
              >
                <td style={cellStyle}>{row.codeUE}</td>
                <td style={cellStyle}>{row.intituleUE}</td>
                <td style={cellStyle}>{row.codeEC}</td>
                <td style={cellStyle}>{row.intituleEC}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ textAlign: 'center', color: '#999' }}>Clique sur "Charger" pour afficher les EC.</p>
      )}
    </div>
  );
};

const headerStyle = {
  borderBottom: '2px solid #10b981',
  padding: '10px',
  backgroundColor: '#e0f2f1',
  color: '#004d40',
  textAlign: 'left'
};

const cellStyle = {
  padding: '8px',
  borderBottom: '1px solid #ddd'
};

export default MaquetteEC;
