import { useEffect, useState } from "react";
import Header from "./Header";
import SideBar from "./SideBar";
import { useNavigate } from "react-router-dom";
import { createUsers, getUsers, statusUserPatcheur } from "../ServiceAPi/Microservice-User";

import UserEditForm from "./UserEditForm";

const Utilisateur = () => {

  const navigate = useNavigate();
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState("Enseignant");
  const [role, setRole] = useState("LAMBDA");
  const [active, setActive] = useState(false);
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [telephone, setTelephone] = useState("");
  const [visible, setVisible] = useState(false);
  const [listUsers, setListUsers] = useState([]);
  const [critera, setCritera] = useState([]);
  const [modif, setModif] = useState(false);
  const [selectedClasse, setSelected] = useState(false);
  useEffect(() => {
    handleUsers();
  }, [visible, modif]);

  const handleModificateur = (classe) => {
    setSelected(classe);
    setModif(true);

    // Ajout de l'encrage vers la section de modification
    const formSection = document.getElementById("modification-section");
    if (formSection) {
      formSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };


  const handleCritera = (c) => {
    let listCritere = critera;
    if (!listCritere.includes([c])) {
      listCritere.push(c)
      console.log("Dans la marre  ou sur la rive");
    }


    setCritera(listCritere)


    console.log("Les criteres de filtrage");
    console.log(critera);

  }

  const filterUsers = () => {



  }


  const handleUsers = () => {
    getUsers()
      .then((resp) => {
        console.log(resp.data);
        setListUsers(resp.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  const PatchStatusUser = (id) => {
    statusUserPatcheur(id)
      .then((resp) => {
        console.log(resp.data);
        setListUsers(listUsers);
      })
      .catch((err) => {
        console.log(err);
      });
  }


  const createUser = () => {
    const data = {
      email,
      password,
      prenom,
      nom,
      telephone,
      active,
      type,
      roles: role
    };
    console.log("Les informations");
    console.log(data);

    createUsers(data)
      .then((response) => {
        console.log("Dans la methode");

        console.log(response.data);
        // if (response.data.token !== "null") {
        //   // setAuthHeader(response.data.token);
        //   setInfosUser(response.data);
        // localStorage.setItem("user_id", JSON.stringify(response.data));
        //   // Définissez le token dans l'état et redirigez vers la page d'accueil
        // navigate("/");
        setVisible(false)
        // }
      })
      .catch((error) => {
        // deleteToken();
        // setAuthHeader(null);
        console.log(error);
        console.error(error);

        // alert(error);
      });
  };


  const handleToggleActivation = (utilisateur) => {

    utilisateur.active = !utilisateur.active;

    let testU = listUsers.map((u) => {
      if (utilisateur.id === u.id) {
        u.active = !u.active;
      }
      return u;
    })
    setListUsers(listUsers.map((u) => {
      if (utilisateur.id === u.id) {
        u.active = !u.active;
      }
      return u;
    }))
    PatchStatusUser(utilisateur.id)
    // console.log(testU);
    // console.log(listUsers);
  };


  return (

    <div>

      <div className="row">
        <div id="breadcrumbs-wrapper" data-image="app-assets/images/gallery/breadcrumb-bg.jpg">

          <div className="container">
            <div className="row">
              <div className="col s12 m6 l6">
                <h5 className="breadcrumbs-title mt-0 mb-0"><span>Gestion des utilisateurs</span></h5>
              </div>
              <div className="col s12 m6 l6 right-align-md">
                <ol className="breadcrumbs mb-0">
                  <li className="breadcrumb-item"><a href="accueil.html">Home</a>
                  </li>
                  <li className="breadcrumb-item"><a href="#">User</a>
                  </li>
                  <li className="breadcrumb-item active">Users List
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
        <div className="col s12">
          <div className="container">


            <div className="container center-align">
              <br />
              <button className="btn-small indigo" onClick={() => setVisible(true)}>
                Ajouter Utilisateur
              </button>
              {visible && (<button className="btn red" type="button" onClick={(e) => setVisible(false)}><i className="material-icons left">error</i>
                Fermer
              </button>)}


              {/* <a  id="lienAjout"></a> */}

              <br />
            </div>
            {visible && (<div className="row">
              <div className="col s12">
                <div id="validations" className="card card-tabs">
                  <div className="card-content">
                    <div className="card-title">
                      <div className="row">
                        <div className="col s12 m6 l10">
                          <h4 className="card-title">Formulaire d'ajout d'utilisateur</h4>
                        </div>
                        <div className="col s12 m6 l2">

                        </div>
                      </div>
                    </div>
                    <div id="view-validations">
                      <form className="formValidate" id="formValidate" method="post">
                        <div className="row">
                          <div className="input-field col s12">
                            <label htmlFor="uname">Prénom *</label>
                            <input id="uname" name="prenom" type="text" data-error=".errorTxt1"
                              onChange={(e) => setPrenom(e.target.value)}
                            />
                            <small className="errorTxt1"></small>
                          </div>
                          <div className="input-field col s12">
                            <label htmlFor="uname">Nom *</label>
                            <input id="uname" name="nom" type="text" data-error=".errorTxt1"
                              onChange={(e) => setNom(e.target.value)}
                            />
                            <small className="errorTxt1"></small>
                          </div>    <div className="input-field col s12">
                            <label htmlFor="uname">Telephone *</label>
                            <input id="uname" name="nom" type="text" data-error=".errorTxt1"
                              onChange={(e) => setTelephone(e.target.value)}
                            />
                            <small className="errorTxt1"></small>
                          </div>
                          <div className="input-field col s12">
                            <label htmlFor="uname">Email *</label>
                            <input id="uname" name="email" type="email" data-error=".errorTxt1"
                              onChange={(e) => setEmail(e.target.value)}
                            />
                            <small className="errorTxt1"></small>
                          </div>  <div className="input-field col s12">
                            <label htmlFor="uname">Mot de Passe *</label>
                            <input id="uname" name="password" type="password" data-error=".errorTxt1"
                              onChange={(e) => setPassword(e.target.value)}
                            />
                            <small className="errorTxt1"></small>
                          </div>  <div className="input-field col s12">
                            <label htmlFor="uname">Confirmer le Mot de Passe *</label>
                            <input id="uname" name="password2" type="password" data-error=".errorTxt1"
                              onChange={(e) => setPassword2(e.target.value)}
                            />
                            <small className="errorTxt1"></small>
                          </div>

                          <div className="col s12">
                            <p>Type</p>
                            <p>
                              <label>
                                <input name="type" type="radio" value="Enseignant" checked
                                  onChange={(e) => setType(e.target.value)}

                                />
                                <span>Enseignant</span>
                              </label>
                            </p>
                            <p>
                              <label>
                                <input name="type" value="Vacataire" type="radio" onChange={(e) => setType(e.target.value)} />
                                <span>Vacataire</span>
                              </label>
                            </p>
                            <p>
                              <label>
                                <input name="type" value="Etudiant" type="radio" onChange={(e) => setType(e.target.value)} />
                                <span>Etudiant</span>
                              </label>
                            </p>
                            <div className="input-field">
                              <small className="errorTxt8"></small>
                            </div>
                          </div>

                          <div className="input-field col s12">
                            <textarea id="ccomment" name="description" className="materialize-textarea validate" data-error=".errorTxt7"></textarea>
                            <label htmlFor="ccomment">Description *</label>
                            <small className="errorTxt7"></small>
                          </div>
                          <div className="col s12">
                            <p>Rôle</p>
                            <p>
                              <label>
                                <input name="role" type="radio" checked value="ADMIN" onChange={(e) => setRole(e.target.value)} />
                                <span>Administrateur</span>
                              </label>
                            </p>
                            <label>
                              <input name="role" type="radio" value="ResponsableClasse" onChange={(e) => setRole(e.target.value)} />
                              <span>Responsable Classe</span>
                            </label>
                            <div className="input-field">
                              <small className="errorTxt8"></small>
                            </div>
                          </div>
                          <div className="col s12">
                            <label htmlFor="tnc_select">Voulez-vous activer le compte ?</label>
                            <p>
                              <label>
                                <input type="checkbox" id="enseignant" name="activer" value="1"
                                  onChange={(e) => setActive(e.target.checked)}
                                />
                                <span>Oui</span>
                              </label>
                            </p>
                            {/* <p>
                          <label>
                            <input type="checkbox" id="vacataire" name="vacataire" value="1"/>
                            <span>Responsable de classe</span>
                          </label>
                        </p>  */}
                            <div className="input-field">
                              <small className="errorTxt6"></small>
                            </div>
                          </div>
                          <div className="input-field col s12">
                            <div id="result"></div>
                            <button className="btn waves-effect waves-light right submit" type="button" name="action" onClick={() => createUser()}>Envoyer
                              <i className="material-icons right">send</i>
                            </button>

                            {/* right submit */}
                            <button className="btn red" type="button" onClick={(e) => setVisible(false)}><i className="material-icons left">error</i>
                              Annuler
                            </button>
                          </div>
                        </div>




                      </form>
                    </div>

                  </div>
                </div>
              </div>
            </div>
            )}

            {modif && (<UserEditForm onCancel={setModif} user={selectedClasse} />)}
            <section className="users-list-wrapper section">
              <div className="users-list-filter">
                <div className="card-panel">
                  <div className="row">
                    <form>
                      <div className="col s12 m6 l3">
                        <label htmlFor="users-list-verified">Profil</label>
                        <div className="input-field">
                          <select className="form-control" id="users-list-verified" onChange={(e) => handleCritera({ profil: e.target.value })}>
                            <option value="">Tout</option>
                            <option value="Enseignant">Enseignant</option>
                            <option value="Vacataire">Vacataire</option>
                            <option value="Etudiant">Etudiant</option>
                          </select>
                        </div>
                      </div>
                      <div className="col s12 m6 l3">
                        <label htmlFor="users-list-role">Role</label>
                        <div className="input-field">
                          <select className="form-control" id="users-list-role" onChange={(e) => handleCritera({ role: e.target.value })}>
                            <option value="">Tout</option>
                            <option value="User">Administrateur</option>
                            <option value="Staff">Responsable de Classe</option>
                            <option value="Staff">Lamda</option>
                          </select>
                        </div>
                      </div>
                      <div className="col s12 m6 l3">
                        <label htmlFor="users-list-status">Status</label>
                        <div className="input-field">
                          <select className="form-control" id="users-list-status" defaultValue={""} onChange={(e) => handleCritera({ status: e.target.value })}>
                            <option value="">Tout</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Banned">Banned</option>
                          </select>
                        </div>
                      </div>
                      <div className="col s12 m6 l3 display-flex align-items-center show-btn">
                        <button type="submit" className="btn btn-block indigo waves-effect waves-light">Show</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="users-list-table">
                <div className="card">
                  <div className="card-content">
                    {/* <!-- datatable start --> */}
                    <div className="responsive-table">
                      <table id="users-list-datatable" className="highlight responsive-table striped responsive-table striped">
                        <thead>
                          <tr>
                            <th></th>
                            <th>Prénom</th>
                            <th>Nom</th>
                            <th>Email</th>
                            {/* <th>Date</th> */}
                            <th>Profil</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Activation</th>
                            <th>Editer</th>
                            <th><i className="material-icons">remove_red_eye</i></th>
                          </tr>
                        </thead>
                        <tbody>
                          {listUsers.map((utilisateur) => (<tr key={utilisateur.id}><td></td>
                            <td><a href="page-users-view.html">{utilisateur.prenom} </a></td>
                            <td><a href="page-users-view.html">{utilisateur.nom} </a></td>
                            <td>{utilisateur.email} </td>
                            {/* <td>utilisateur.createat </td> */}

                            <td><span className="chip yellow lighten-5"><span className="black-text"> {utilisateur.type} </span></span></td>
                            <td><span className="green-text">{utilisateur.role}</span></td>


                            <td>
                              {/* <span className={utilisateur.active ? "chip green lighten-5" : "chip red lighten-5"}> */}
                              <span className={utilisateur.active ? "chip green lighten-5" : "chip red lighten-5"}>
                                <span className={utilisateur.active ? "green-text" : "red-text"}>{utilisateur.active ? "Actif" : "Inactif"}</span>
                              </span>
                            </td>

                            <td>

                              <span >
                                <button

                                  onClick={() => handleToggleActivation(utilisateur)}
                                // className="btn-small waves-effect waves-light"
                                >
                                  {utilisateur.active ? <i className="material-icons red-text">cancel</i> : <i className="material-icons green-text">check_circle</i>}
                                </button>

                              </span>
                            </td>

                            <td>
                              <button

                                onClick={() => handleModificateur(utilisateur)}
                              // className="btn-small waves-effect waves-light"
                              >
                                <i className="material-icons green-text">edit</i>
                              </button>

                              <a href="page-users-view.html"><i className="material-icons"></i></a></td>

                            <td>
                              <button

                                onClick={() => handleModificateur(utilisateur)}
                              // className="btn-small waves-effect waves-light"
                              >
                                <i className="material-icons green-text">remove_red_eye</i>
                              </button>

                              <a href="page-users-view.html"><i className="material-icons"></i></a></td>
                            {/* // Ajoutez d'autres colonnes ici si nécessaire */}
                          </tr>))}


                        </tbody>
                      </table>
                    </div>

                  </div>
                </div>
              </div>
            </section>

          </div>
          <div className="content-overlay"></div>
        </div>
      </div>
    </div>

  )
}
export default Utilisateur;