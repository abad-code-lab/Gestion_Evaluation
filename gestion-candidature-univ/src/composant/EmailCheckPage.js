import React, { useState, useEffect } from 'react';

const EmailCheckPage = () => {
  const [countdown, setCountdown] = useState(1);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (countdown > 0 && redirecting) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && redirecting) {
      window.location.href = "/";
    }
  }, [countdown, redirecting]);

  const handleRedirect = (e, url) => {
    e.preventDefault();
    window.location.href = url;
  };

  const startRedirect = () => {
    setRedirecting(true);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col s12 m8 offset-m2 l6 offset-l3">
          <div className="card-panel z-depth-3 mt-4">
            <div className="center-align">
              <i className="material-icons text-primary blue-text" style={{ fontSize: '4rem' }}>email</i>
              <h4 className="blue-text text-darken-2">Vérifiez votre email</h4>
              
              <div className="divider"></div>
              
              <div className="section">
                <p className="flow-text">
                  Vos identifiants de connexion ont été envoyés à votre adresse email.
                </p>
                <p>
                  <b>N'oubliez pas de vérifier dans vos dossiers spam ou courrier indésirable.</b>
                </p>
              </div>
              
              {redirecting ? (
                <div className="section">
                  <div className="preloader-wrapper active">
                    <div className="spinner-layer spinner-blue-only">
                      <div className="circle-clipper left">
                        <div className="circle"></div>
                      </div>
                      <div className="gap-patch">
                        <div className="circle"></div>
                      </div>
                      <div className="circle-clipper right">
                        <div className="circle"></div>
                      </div>
                    </div>
                  </div>
                  <p>Redirection vers votre messagerie dans {countdown} secondes...</p>
                </div>
              ) : (
                <div className="section">
                  <button 
                    className="waves-effect waves-light btn-large blue" 
                    onClick={startRedirect}
                  >
                    <i className="material-icons left">lock_outline</i>
                    Se Connecter
                  </button>
                </div>
              )}
              
              <div className="section">
                <div className="row">
                  <div className="col s12">
                    <p>Accéder directement à votre service de messagerie :</p>
                  </div>
                  <div className="col s4">
                    <a 
                      href="https://mail.google.com" 
                      onClick={(e) => handleRedirect(e, 'https://mail.google.com')}
                      className="btn-flat waves-effect"
                    >
                      <img height={30} width={30} src="https://cdn.futura-sciences.com/buildsv6/images/largeoriginal/8/4/e/84e4ff1c1a_102482_gmail-logo-definition.jpg" alt="Gmail" className="circle" /> Gmail
                    </a>
                  </div>
                  <div className="col s4">
                    <a 
                      href="https://outlook.live.com/mail" 
                      onClick={(e) => handleRedirect(e, 'https://outlook.live.com/mail')}
                      className="btn-flat waves-effect"
                    >
                      <img height={30} width={30} src="https://www.beam-agency.fr/wp-content/uploads/2022/08/87368-858-microsoft-outlook.jpg" alt="Outlook" className="circle" /> Outlook
                    </a>
                  </div>
                  <div className="col s4">
                    <a 
                      href="https://mail.yahoo.com" 
                      onClick={(e) => handleRedirect(e, 'https://mail.yahoo.com')}
                      className="btn-flat waves-effect"
                    >
                      <img  height={30} width={30} src="https://c.clc2l.com/t/y/a/yahoo-mail-z8OQg_.jpg" alt="Yahoo" className="circle" /> Yahoo
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailCheckPage;