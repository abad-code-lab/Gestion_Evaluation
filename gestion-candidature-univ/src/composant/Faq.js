import React, { useEffect } from 'react';

const FAQ = () => {
  useEffect(() => {
    const M = window.M;
    const elems = document.querySelectorAll('.collapsible');
    if (M) {
      M.Collapsible.init(elems, { accordion: false });
    }
  }, []);

  return (
    <div className="container faq-container z-depth-1" style={{
      maxWidth: '800px',
      margin: '40px auto',
      padding: '30px',
      backgroundColor: 'white',
      borderRadius: '8px'
    }}>
      <h4 style={{ textAlign: 'center', marginBottom: '30px', color: '#1976d2' }}>Foire Aux Questions</h4>
      <ul className="collapsible popout">
        <li>
          <div className="collapsible-header">
            <i className="material-icons">account_circle</i>
            Comment puis-je créer un compte ?
          </div>
          <div className="collapsible-body">
            <span>
              Cliquez sur "S'inscrire" en haut à droite et remplissez le formulaire. Un email de confirmation vous sera envoyé.
            </span>
          </div>
        </li>
        <li>
          <div className="collapsible-header">
            <i className="material-icons">payment</i>
            Quels sont les moyens de paiement acceptés ?
          </div>
          <div className="collapsible-body">
            <span>Nous acceptons les cartes bancaires, PayPal, Orange Money et Wave.</span>
          </div>
        </li>
        <li>
          <div className="collapsible-header">
            <i className="material-icons">edit</i>
            Puis-je modifier mes informations personnelles ?
          </div>
          <div className="collapsible-body">
            <span>Oui, accédez à votre profil puis cliquez sur "Modifier mes informations".</span>
          </div>
        </li>
        <li>
          <div className="collapsible-header">
            <i className="material-icons">support_agent</i>
            Comment contacter le support client ?
          </div>
          <div className="collapsible-body">
            <span>Vous pouvez nous écrire via le formulaire de contact ou appeler au +221 XXX XXX XXX.</span>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default FAQ;
