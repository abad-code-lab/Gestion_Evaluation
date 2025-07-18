import React, { useState } from 'react';
import { useHistory, useNavigate } from 'react-router-dom';
import { forgotPasswordByEmail, updatePassword_v2 } from '../ServiceAPi/Microservice-User';

const UserResetpassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false); // Ajout de l'état de chargement
  const navigate = useNavigate();

   const [oldPassword, setOldPassword] = useState(""); // Ancien mot de passe (par défaut)
    const [newPassword, setNewPassword] = useState(""); // Nouveau mot de passe
    const [confirmPassword, setConfirmPassword] = useState(""); // Confirmation du mot de passe
    const [error, setError] = useState(""); // Message d'erreur
    const [success, setSuccess] = useState(""); // Message de succès
   
  const handleResetPassword = () => {
    // Démarre le chargement lorsque la demande est envoyée

    // Logique pour réinitialiser le mot de passe ici
    forgotPasswordByEmail(email).then((response) => {
      console.log("Réinitialisation du mot de passe réussie", response);
      alert('Demande de réinitialisation du mot de passe envoyée!');
      setError('Demande de réinitialisation du mot de passe envoyée!');
      navigate('/connexion'); // Redirige vers la page de connexion après la réinitialisation
    }
    ).catch((error) => {
      console.error("Erreur lors de la réinitialisation du mot de passe", error);
      setError("Erreur lors de la réinitialisation du mot de passe", error);
    });


    // Arrête le chargement en cas d'erreur
  };
  // Fonction pour gérer la mise à jour du mot de passe
  const handleUpdatePassword = () => {
    setLoading(true); 
    if (newPassword !== confirmPassword) {
      setError("Les nouveaux mots de passe ne correspondent pas !");
      setSuccess("");
      return;
    }

    if (oldPassword === newPassword) {
      setError("Le nouveau mot de passe doit être différent de l'ancien !");
      setSuccess("");
      return;
    }

    if (newPassword && confirmPassword) {
      updatePassword_v2({ oldPassword,newPassword })
      
        .then((resp) => {
          // incrementerEtape(candidat.id).then(() => {
            if(!resp.data.error) {
              setSuccess("Mot de passe mis à jour avec succès !");
              
              setError("");
              setOldPassword(""); // Réinitialiser les champs
              setNewPassword("");
              setConfirmPassword("");
              // window.location.reload();
              navigate(-1);
            }else {
              setError(resp.data.message);
              setSuccess("");
            }

           
          // })
          
        })
        .catch((err) => {
          setError(err.response?.data?.message || "Erreur lors de la mise à jour du mot de passe.");
          setSuccess("");
        });
    } else {
      setError("Veuillez remplir tous les champs !");
      setSuccess("");
    }
    setLoading(false); 
  };
  return (
    <div className="vertical-layout page-header-light vertical-menu-collapsible vertical-dark-menu preload-transitions 1-column login-bg blank-page blank-page" data-open="click" data-menu="vertical-dark-menu" data-col="1-column">
     <div className="row">
            <div className="card" style={{ borderRadius: '15px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
              <div className="card-content" style={{ padding: '30px' }}>
                <h6 style={{ textAlign: 'center', marginBottom: '25px', fontSize: '1.3rem' }}>
                  Changer le mot de passe
                </h6>
                <div className="row">
                  {/* Ancien mot de passe (désactivé) */}
                  <div className="col s12" style={{ marginBottom: '20px' }}>
                    <input
                      type="text"
                      id="oldPassword"
                      value={oldPassword || ''}
                      onChange={(e) => setOldPassword(e.target.value)}
                      // disabled
                      style={{ borderRadius: '5px' }}
                    />
                    <label htmlFor="oldPassword">Ancien mot de passe</label>
                  </div>

                  {/* Nouveau mot de passe */}
                  <div className="input-field col s12" style={{ marginBottom: '20px' }}>
                    <input
                      type="password"
                      id="newPassword"
                      value={newPassword || ''}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      style={{ borderRadius: '5px' }}
                    />
                    <label htmlFor="newPassword">Nouveau mot de passe</label>
                  </div>

                  {/* Confirmation du mot de passe */}
                  <div className="input-field col s12" style={{ marginBottom: '20px' }}>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword || ''}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      style={{ borderRadius: '5px' }}
                    />
                    <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                  </div>
                </div>

                {/* Messages de succès et d'erreur */}
                {error && <p className="red-text" style={{ textAlign: 'center' }}>{error}</p>}
                {success && <p className="green-text" style={{ textAlign: 'center' }}>{success}</p>}

                {/* Bouton pour soumettre */}
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <button
                    className="btn waves-light"
                    onClick={handleUpdatePassword}
                    style={{ borderRadius: '25px', padding: '0 30px' }}
                  >
                    Mettre à jour
                  </button>
                </div>
              </div>
            </div>
          </div>
  </div>
  
  );
};

export default UserResetpassword;
