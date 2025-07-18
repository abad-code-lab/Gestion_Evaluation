import { useNavigate } from "react-router-dom";
import { getConnexion, setAuthHeader } from "../ServiceAPi/Microservice-User";
import { useState } from "react";
import CryptoJS from "crypto-js";
import { jwtDecode } from 'jwt-decode';
import "./login.css";

// Fonction de chiffrement
export function encryptData(data) {
  const key = "O7+t1sh3o0XiFz3XJKpPLmyHoP6AXlZqm8l/Am78KmY="; // Remplacez par votre propre clé sécurisée
  return CryptoJS.AES.encrypt(data, key).toString();
}

const Login = () => {

  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  //   const [emailStatus, setEmailStatus] = useState("");
  const login = () => {
    const data = {
      username,
      password,
    };
    console.log("Les informations");

    getConnexion(data)
      .then((response) => {
        // console.log("Dans la méthode");
        // console.log(response.data);
       
        // Vérifie que le token est présent dans la réponse
        // if (response.data.token) {
        // const user = encryptData(JSON.stringify(response.data));
        // const user = encryptData(response.data);

        // localStorage.setItem("authToken", encryptedToken);

        // Décrypter le token pour extraire les informations
        // const decodedToken = jwtDecode(response.data.token);
        // console.log("Information sur cookie:", document.cookie);


        // const token = document.cookie // Récupérer le token dans un cookie
        //   .split('; ')
        //   .find(row => row.startsWith('accessToken='))
        //   ?.split('=')[1];
        //   console.log("****************Token:", token);
        // if (token) {
        //   const decodedToken = jwtDecode(token);
        //   const roles = decodedToken.authorities[0]; // Les rôles sont ici
        //   console.log("Roles:", roles);
        //   localStorage.setItem("userRole", roles);
        // }
        // console.log("decodedToken", decodedToken);
        // Extrait le rôle de l'utilisateur et le stocke dans localStorage
        // const userRole = decodedToken?.authorities[0]; // Assure-toi que le rôle est inclus dans le payload du token
        // localStorage.setItem("userRole", userRole);


        // Stocke également les informations utilisateur


        // localStorage.setItem("user", user);
        // localStorage.setItem("token", response.data.token);
        setAuthHeader(response.data.token);

        // console.log("userRole", userRole);
        // window.location.href = "/";
        // Redirige l'utilisateur en fonction de son rôle
        // if (userRole === "candidat") {
        //     navigate("/");
        // navigate("/accueil-candidat");
        // } else if (userRole === "ADMIN") {
        // navigate("/accueil-gerant");
        // navigate("/");
        window.location.href = "/";
        // }
        // } else {
        //   console.error("Token non trouvé dans la réponse");
        // }
      })
      .catch((error) => {
        if (error.status === 403) {
          setError("Erreur ! Votre compte est bloqué. Veuillez contacter l'administration");
          return;
        }
        console.error(error);
        // setError(error.response.data.message);
        setError("Erreur ! Verifier vos informations de connexion");
        // alert("Erreur ! Verifier vos informations de connexion");
        console.log("Erreur lors de la connexion :", error);
      });
  };



  return (

    <div style={{
      backgroundImage: `url(${process.env.PUBLIC_URL}/images/baobab.png)`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      // backgroundPosition: 'center',
      width: '100%',
      height: '100%',
    }} className="vertical-layout page-header-light vertical-menu-collapsible vertical-dark-menu preload-transitions 1-column login-bg blank-page blank-page" data-open="click" data-menu="vertical-dark-menu" data-col="1-column">
      <div className="row">
        <div className="col s12">
          <div className="container">
            <div id="login-page" className="row">
              <div className="col s12 m6 l4 z-depth-4 card-panel border-radius-6 login-card bg-opacity-8">
                <h1 className="center-align red-green">Connexion</h1>
                {error && (<h5 className="center-align red-text">{error}</h5>)}
                <form className="login-form">
                  <div className="row margin">
                    <div className="input-field input-field-login col s12">
                      <i className="material-icons material-icons-login  prefix">person_outline</i>
                      <input id="username" type="email" className="validate" onChange={(e) => setUsername(e.target.value)} required />
                      <label htmlFor="username" className="center-align">Email</label>
                    </div>
                  </div>
                  <div className="row margin">
                    <div className="input-field input-field-login col s12">
                      <i className="material-icons material-icons-login prefix">lock_outline</i>
                      <input id="password" type="password" className="validate" onChange={(e) => setPassword(e.target.value)} required />
                      <label className="label-login" htmlFor="password">Mot de Passe</label>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col s12 m12 l12">
                      <label>
                        <input type="checkbox" />
                        <span>Se Souvenir de Moi</span>
                      </label>
                    </div>
                  </div>
                  <div className="row">
                    <div className="input-field input-field-login col s12">
                      <button type="button" className=".button-login btn waves-effect waves-light border-round gradient-45deg-purple-deep-orange col s12" onClick={() => login()}>
                        Connexion
                      </button>
                    </div>
                  </div>
                  <div className="row">
                    <div className="input-field input-field-login col s6">
                      <p className="margin medium-small"><a className="a-login" href="user-register.html">Inscription</a></p>
                    </div>
                    <div className="input-field input-field-login col s6 right-align">
                      <p className="margin medium-small"><a className="a-login" href="/user-forgot-password">Mot de passe oublié ?</a></p>
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

  )
}
export default Login;