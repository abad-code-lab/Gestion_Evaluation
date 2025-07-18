import React, { useEffect } from 'react';
import M from 'materialize-css'; // Import Materialize JS
import { useUser } from './context/UserContext';

const ProfileDropdown = () => {
  const { user, logout } = useUser();
  useEffect(() => {
    // Initialize the dropdown after the component is mounted
    M.Dropdown.init(document.querySelectorAll('.dropdown-trigger'));
  }, []);
  const getInitials = (prenom, nom) => {
    const first = prenom ? prenom[0].toUpperCase() : '';
    const last = nom ? nom[0].toUpperCase() : '';
    return first + last;
  };
  const AvatarInitials = ({ prenom, nom }) => {
    return (
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          backgroundColor: '#5A8DEE',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
        }}
      >
        {getInitials(prenom|| '', nom || '')}
      </div>
    );
  };






  return (
    <div className="test-li">
      <ul

        id="profile-dropdown"
        className="dropdown-content"
        style={{
          minWidth: "220px",
          padding: "10px 0",
          right: 0,
          left: "auto"
        }}
      >

        <li ><a className="grey-text text-darken-1" href="/profils"><i className="material-icons">person_outline</i> Profile</a></li>
        {/* <li><a className="grey-text text-darken-1" href="app-chat.html"><i className="material-icons">chat_bubble_outline</i> Chat</a></li> */}
        <li><a className="grey-text text-darken-1" href="/reset-password"><i className="material-icons">lock_outline</i> Mot de Passe</a></li>
        <li><a className="grey-text text-darken-1" href="/faq"><i className="material-icons">help_outline</i> Help</a></li>
        <li className="divider"></li>
        {/* <li><a className="grey-text text-darken-1" href="user-lock-screen.html"><i className="material-icons">lock_outline</i> Lock</a></li> */}
        {/* <li><a className="grey-text text-darken-1"  onClick={() => logout()}><i className="material-icons">keyboard_tab</i> Déconnexions</a></li> */}
        <li style={{ display: "flex", justifyContent: "center" }}>
          <button
            onClick={() => logout()}
            className="logout-btn"
            style={{
              width: "100%",
              maxWidth: "200px", // optionnel : limite la largeur
              backgroundColor: '#F44336',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              marginTop: '15px',
              fontSize: '16px',
              fontWeight: 'bold',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              transition: 'background-color 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#d32f2f'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#F44336'}
          >
            Déconnexion
          </button>
        </li>

        {/* <i className="material-icons">keyboard_tab</i> Déconnexion
        </button></li> */}
      </ul>

      <li>
        <a className="waves-block waves-light dropdown-trigger" href="#" data-target="profile-dropdown">
          {/* <span className="avatar-status avatar-online"> */}
          {/* <img src={`${process.env.PUBLIC_URL}/app-assets/images/avatar/avatar-7.png`} alt="avatar" />
              */}
          <AvatarInitials prenom={user?.prenom || 'Seydina'} nom={user?.nom || 'Ndiaye'} />
          {/* </span> */}
        </a>
      </li>
    </div>
  );
};

export default ProfileDropdown;
