import { useEffect, useState } from "react";
import Header from "./Header";
import SideBar from "./SideBar";
import { useNavigate } from "react-router-dom";
import { createUsers, deleteUser, getEnseignants, getEtudiant, getUsers, statusUserPatcheur } from "../ServiceAPi/Microservice-User";
import SideBarCandidat from "./SideBarCandidat";
import UserEditForm from "./UserEditForm";
import { useSearch } from "./context/SearchContext";
import { Button } from "antd";

const Etudiant = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState("Etudiant");
  const [role, setRole] = useState("LAMBDA");
  const [active, setActive] = useState(false);
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [telephone, setTelephone] = useState("");
  const [visible, setVisible] = useState(false);
  const [listUsers, setListUsers] = useState([]);

  const [modif, setModif] = useState(false);
  const [selectedClasse, setSelected] = useState(false);
  const { searchTerm, setSearchTerm } = useSearch();
  const [itemsPerPage] = useState(10) // Nombre d'éléments par page
  const [currentPage, setCurrentPage] = useState(1) // La page courante
  const lastPageNumber = Math.ceil(listUsers.length / itemsPerPage)





  // Index de la dernière Maquette à afficher sur la page
  const indexOfLastUE = currentPage * itemsPerPage
  // Index de la première Maquette à afficher sur la page
  const indexOfFirstUE = indexOfLastUE - itemsPerPage
  // Liste des Maquette à afficher sur la page actuelle
  const currentList = listUsers
    .filter((u) => (u.prenom + ' ' + u.nom).toLowerCase().includes(searchTerm.toLowerCase()))
    .slice(indexOfFirstUE, indexOfLastUE)


  const handleSearchChange = (libelle) => {
    setSearchTerm(libelle.target.value)
  }
  const handleChangePaginate = (value) => {
    if (value === -100) {
      setCurrentPage(currentPage + 1)
    } else if (value === -200) {
      setCurrentPage(currentPage - 1)
    } else setCurrentPage(value)
  }


  useEffect(() => {
    handleUsers();
    setSearchTerm("")
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




  const handleUsers = () => {
    getEtudiant()
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
    

    createUsers(data)
      .then((response) => {
        

        console.log(response.data);
        if (response.data.error) {
          setErrorMessage(response.data.message); // <-- Affiche le message d'erreur du backend
        } else {
          setErrorMessage(''); // <-- Efface le message si tout va bien
          setVisible(false);
        }
        // }
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage('Une erreur s\'est produite. Veuillez réessayer.'); // <-- Erreur de connexion ou autre
    
      });
  };
  const handleDelete = (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
      deleteUser(id)
        .then((resp) => {
          console.log(resp.data);
          setListUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
        })
        .catch((err) => {
          console.log(err);
        });
    }
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
    console.log(testU);
    // console.log(listUsers);
  };


  return (

    <div>

      <div className="row">
        <div id="breadcrumbs-wrapper" data-image="app-assets/images/gallery/breadcrumb-bg.jpg">

          <div className="container">
            <div className="row">
              <div className="col s12 m6 l6">
                <h5 className="breadcrumbs-title mt-0 mb-0"><span>Gestion des Etudiants</span></h5>
              </div>
              <div className="col s12 m6 l6 right-align-md">
                <button className="btn-small indigo" onClick={() => setVisible(true)}>
                  Ajouter Vacataire
                </button>

                {visible && (<button className="btn red" type="button" onClick={(e) => setVisible(false)}><i className="material-icons left">error</i>
                  Fermer
                </button>)}

              </div>
           
            </div>
            {errorMessage && <div ><h2 className="error-message"> {errorMessage}</h2></div>} {/* Affiche l'erreur si elle existe */}
          </div>
        </div>
        <div className="col s12">
          <div className="container">


           
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
                            {/* <p>
                              <label>
                                <input name="role" type="radio" checked value="LAMBDA" onChange={(e) => setRole(e.target.value)} />
                                <span>LAMBDA</span>
                              </label>
                            </p> */}
                            <label>
                              <input name="role" type="radio" value="ResponsableClasse" onChange={(e) => setRole(e.target.value)} />
                              <span>Responsable Classe?</span>
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

         
              <div className="users-list-table">
                <div className="card">
                  <div className="card-content">
                    {/* <!-- datatable start --> */}
                    <div className="responsive-table">
                      <table id="users-list-datatable" className="highlight responsive-table striped responsive-table striped">
                        <thead>
                          <tr>
                            <th></th>
                            <th>numCarte</th>
                            <th>Prénom</th>
                            <th>Nom</th>
                            <th>Email</th>
                            {/* <th>Date</th> */}
                            {/* <th>Profil</th> */}
                            <th>Role</th>
                            <th>Status</th>
                            <th>Activation</th>
                            <th>Editer</th>
                            <th>Detail</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentList.map((utilisateur) => (<tr key={utilisateur.id}><td></td>
                            <td><a href="page-users-view.html">{utilisateur?.numCarte||'A definir'} </a></td>
                            <td><a href="page-users-view.html">{utilisateur.prenom} </a></td>
                            <td><a href="page-users-view.html">{utilisateur.nom} </a></td>
                            <td>{utilisateur.email} </td>
                            {/* <td>utilisateur.createat </td> */}

                            {/* <td><span className="chip yellow lighten-5"><span className="black-text"> {utilisateur.type} </span></span></td> */}
                            <td><span className="green-text">{utilisateur.role}</span></td>


                            <td>
                              {/* <span className={utilisateur.active ? "chip green lighten-5" : "chip red lighten-5"}> */}
                              <span className={utilisateur.active ? "chip green lighten-5" : "chip red lighten-5"}>
                                <span className={utilisateur.active ? "green-text" : "red-text"}>{utilisateur.active ? "Actif" : "Inactif"}</span>
                              </span>
                            </td>

                            <td>
                              <span>
                                <Button onClick={() => handleToggleActivation(utilisateur)}
                                  //  className="btn black-text" style={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
                                  >
                                  {utilisateur.active ? (
                                    <i className="material-icons red-text">cancel</i>
                                  ) : (
                                    <i className="material-icons green-text">check_circle</i>
                                  )}
                                </Button>

                                {!utilisateur.active && (
                                  <Button onClick={() => handleDelete(utilisateur.id)}    >
                                    <i className="material-icons red-text">delete</i>
                                  </Button>
                                )}
                              </span>
                            </td>



                            <td>
                              <Button
                               

                                onClick={() => handleModificateur(utilisateur)}
                              // className="btn-small waves-effect waves-light"
                              >
                                <i className="material-icons ">edit</i>
                              </Button>

                            </td>


                            <td><Button   className="btn black-text" style={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }} href="page-users-view.html"><i className="material-icons blue-text">remove_red_eye</i></Button></td>
                            {/* // Ajoutez d'autres colonnes ici si nécessaire */}
                          </tr>))}


                        </tbody>
                      </table>
                    </div>

                    <div className="card-action">
            <ul className="pagination center-align">
              {/* Bouton Précédent */}
              {currentPage > 1 && (
                <li className="waves-effect">
                  <button
                    onClick={() => handleChangePaginate(currentPage - 1)}
                    className="btn-flat"
                  >
                    ← Précédent
                  </button>
                </li>
              )}

              {/* Numéros des pages */}
              {[...Array(lastPageNumber).keys()].map((num) => (
                <li
                  key={num}
                  className={currentPage === num + 1 ? "active yellow darken-2" : "waves-effect"}
                >
                  <button
                    onClick={() => handleChangePaginate(num + 1)}
                    className="btn-flat"
                  >
                    {num + 1}
                  </button>
                </li>
              ))}

              {/* Bouton Suivant */}
              {currentPage < lastPageNumber && (
                <li className="waves-effect">
                  <button
                    onClick={() => handleChangePaginate(currentPage + 1)}
                    className="btn-flat"
                  >
                    Suivant →
                  </button>
                </li>
              )}
            </ul>
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
export default Etudiant;