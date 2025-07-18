import React, { useState } from 'react';
import { useHistory, useNavigate } from 'react-router-dom';
import { forgotPasswordByEmail } from '../ServiceAPi/Microservice-User';

const UserForgotpassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Ajout de l'état de chargement
  const navigate = useNavigate();
  const handleResetPassword = () => {
    setLoading(true); // Démarre le chargement lorsque la demande est envoyée

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


    setLoading(false); // Arrête le chargement en cas d'erreur
  };
// Fonction pour gérer la validation de l'email
const handleEmailChange = (e) => {
  const emailValue = e.target.value;
  setEmail(emailValue);

  // Validation de l'email avec une expression régulière
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailPattern.test(emailValue)) {
    setError('Veuillez entrer un email valide');
  } else {
    setError('');
  }
};
  return (
    <div className="vertical-layout page-header-light vertical-menu-collapsible vertical-dark-menu preload-transitions 1-column login-bg blank-page blank-page" data-open="click" data-menu="vertical-dark-menu" data-col="1-column">
      <div className="row">
        <div className="col s12">
          <div className="container">
            <div id="forgot-password-page" className="row">
              {/* Centrage horizontal et vertical */}
              <div className="col s12 m6 l4 offset-m3 offset-l4 z-depth-4 card-panel border-radius-6 forgot-password-card bg-opacity-8">
                <h3 className="center-align red-green">Mot de Passe Oublié</h3>
                {error && (<h5 className="center-align red-text">{error}</h5>)}
                <p className="center-align">Vous pouvez réinitialiser votre mot de passe ici</p>

                <form className="login-form">
                  <div className="row margin">
                    <div className="input-field input-field-login col s12">
                      <i className="material-icons material-icons-login prefix">email</i>
                      <input 
                        id="email" 
                        type="email" 
                        className="validate" 
                        value={email} 
                        onChange={handleEmailChange} 
                        required 
                      />
                      <label htmlFor="email" className="center-align">Email</label>
                    </div>
                  </div>
                   {/* Affichage du spinner pendant le chargement */}
                   {loading && (
                    <div className="center-align">
                      <div className="preloader-wrapper active">
                        <div className="spinner-layer spinner-blue-only">
                          <div className="circle-clipper left">
                            <div className="circle"></div>
                          </div><div className="gap-patch">
                            <div className="circle"></div>
                          </div><div className="circle-clipper right">
                            <div className="circle"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="row margin">
                    <div className="input-field input-field-login col s12">
                      <button
                        type="button"
                        disabled={loading}
                        className="button-login btn waves-effect waves-light border-round gradient-45deg-purple-deep-orange col s12"
                        onClick={handleResetPassword}
                      >
                        Réinitialiser
                      </button>
                    </div>
                  </div>
                  <div className="row">
                    <div className="input-field input-field-login col s6">
                      <p className="margin medium-small center-align"><a className="a-login" href="/connexion">Retour à la connexion</a></p>
                    </div>
                    <div className="input-field input-field-login col s6 right-align">
                      <p className="margin medium-small center-align"><a className="a-login" href="/register">S'inscrire</a></p>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="content-overlay"></div>
        </div>
      </div>
    </div>
  );
};

export default UserForgotpassword;
