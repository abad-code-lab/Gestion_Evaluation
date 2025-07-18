import React, { useState } from 'react';
import axios from 'axios';

const AjouterEvaluation = ({ onAdded }) => {
  const [noteControle, setNoteControle] = useState('');
  const [noteExamen, setNoteExamen] = useState('');
  const [inscriptionId, setInscriptionId] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    if (!inscriptionId.trim()) return "L'ID d'inscription est obligatoire.";
    const nc = parseFloat(noteControle);
    if (isNaN(nc) || nc < 0 || nc > 20) return 'La note du contrôle doit être un nombre entre 0 et 20.';
    const ne = parseFloat(noteExamen);
    if (isNaN(ne) || ne < 0 || ne > 20) return "La note de l'examen doit être un nombre entre 0 et 20.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:8080/api/evaluations', {
        noteControle: parseFloat(noteControle),
        noteExamen: parseFloat(noteExamen),
        inscriptionId: inscriptionId.trim(),
      });
      setSuccess(true);
      setNoteControle('');
      setNoteExamen('');
      setInscriptionId('');
      if (onAdded) onAdded();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'ajout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: 'auto' }}>
      <div style={{ marginBottom: 15 }}>
        <label>ID Inscription</label><br />
        <input
          type="text"
          value={inscriptionId}
          onChange={e => setInscriptionId(e.target.value)}
          disabled={loading}
          required
          style={{ width: '100%', padding: 8 }}
        />
      </div>

      <div style={{ marginBottom: 15 }}>
        <label>Note Contrôle (0-20)</label><br />
        <input
          type="number"
          step="0.01"
          min="0"
          max="20"
          value={noteControle}
          onChange={e => setNoteControle(e.target.value)}
          disabled={loading}
          required
          style={{ width: '100%', padding: 8 }}
        />
      </div>

      <div style={{ marginBottom: 15 }}>
        <label>Note Examen (0-20)</label><br />
        <input
          type="number"
          step="0.01"
          min="0"
          max="20"
          value={noteExamen}
          onChange={e => setNoteExamen(e.target.value)}
          disabled={loading}
          required
          style={{ width: '100%', padding: 8 }}
        />
      </div>

      {error && <p style={{ color: 'red', marginBottom: 15 }}>{error}</p>}
      {success && <p style={{ color: 'green', marginBottom: 15 }}>Évaluation ajoutée avec succès !</p>}

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: '8px 0',
          backgroundColor: '#22bb33',
          color: 'white',
          border: 'none',
          borderRadius: 5,
          cursor: loading ? 'not-allowed' : 'pointer',
          width: '50%',
          fontSize: 15,
          fontWeight: 500,
          transition: 'background-color 0.3s',
          margin: '0 auto',
          display: 'block',
        }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1e7e34')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#22bb33')}
      >
        {loading ? 'Ajout en cours...' : 'Ajouter'}
      </button>
    </form>
  );
};

export default AjouterEvaluation;
