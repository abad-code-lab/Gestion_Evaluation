import React, { useState, useEffect } from "react";
import { updateProfil } from "../ServiceAPi/Microservice-User";
import { useUser } from "./context/UserContext";
import { useNavigate } from "react-router-dom";

const UserEditForm2 = () => {
    const navigate = useNavigate();
    const { user, logout } = useUser();
    const [prenom, setPrenom] = useState("");
    const [nom, setNom] = useState("");
    const [telephone, setTelephone] = useState("");
    const [email, setEmail] = useState("");
    const [type, setType] = useState("");
    const [roles, setRole] = useState("");
    const [description, setDescription] = useState("");
    const [active, setActive] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [grade, setGrade] = useState('');
    const [titreOuProfession, setTitreOuProfession] = useState('');
    const [matricule, setMatricule] = useState('');
    const [numCarte, setNumCarte] = useState('');

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        if (password && e.target.value !== password) {
            setError("Les mots de passe ne correspondent pas");
        } else {
            setError("");
        }
    };

    useEffect(() => {
        if (user) {
            setPrenom(user.prenom || "");
            setNom(user.nom || "");
            setTelephone(user.telephone || "");
            setEmail(user.email || "");
            setType(user.type || "");
            setRole(user.role || "");
            setDescription(user.description || "");
            setActive(user.active || false);
            setGrade(user.grade || '');
            setMatricule(user.matricule || '');
            setTitreOuProfession(user.titreOuProfession || '');
            setNumCarte(user.numCarte || '');
        }
    }, [user]);
    const updateProfileur = (id) => {
        updateProfil(id, { prenom, nom, telephone, titreOuProfession, numCarte, email, grade, matricule, type, roles, description, active })
            .then((resp) => {
                console.log(resp.data);
                // onCancel(false);
                navigate(-1)
            })
            .catch((err) => {
                console.log(err);
            });
    }


    const handleSubmit = (e) => {
        e.preventDefault();
        // onUpdate();
        updateProfileur(user.id);



    };

    return (
        <div className="row">
            <div className="">
                <div className="card card-tabs">
                    <div className="card-content">
                        <h4 className="card-title">Modification de profile {user?.type}</h4>
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="input-field  col s6">
                                    <label className="active">Prénom *</label>
                                    <input type="text" value={prenom} onChange={(e) => setPrenom(e.target.value)} />
                                </div>
                                <div className="input-field  col s6">
                                    <label className="active">Nom *</label>
                                    <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} />
                                </div>
                            </div>


                            {type !== "Etudiant" && type !== "Vacataire" && (<div className="row">
                                <div className="input-field col s6">
                                    <label className="active" htmlFor="grade">Grade *</label>
                                    <input
                                        id="grade"
                                        name="grade"
                                        type="text"
                                        value={grade}
                                        data-error=".errorTxt2"
                                        onChange={(e) => setGrade(e.target.value)}
                                    />
                                    <small className="errorTxt2"></small>
                                </div>
                                <div className="input-field col s6">
                                    <label className="active" htmlFor="matricule">Matricule *</label>
                                    <input
                                        id="matricule"
                                        name="matricule"
                                        type="text"
                                        data-error=".errorTxt3"
                                        value={matricule}
                                        onChange={(e) => setMatricule(e.target.value)}
                                    />
                                    <small className="errorTxt3"></small>
                                </div>
                            </div>)

                            }



                            <div className="row">
                                <div className="input-field col s6">
                                    <label className="active">Téléphone *</label>
                                    <input type="text" value={telephone} onChange={(e) => setTelephone(e.target.value)} />
                                </div>
                                <div className="input-field col s6">
                                    <label className="active">Email *</label>
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                            </div>



                            {type == "Vacataire" && (
                                <div className="input-field col s12">
                                    <label className="active" htmlFor="grade">Titre/Profession *</label>
                                    <input
                                        id="titreOuProfession"
                                        name="titreOuProfession"

                                        type="text"
                                        value={titreOuProfession}
                                        data-error=".errorTxt2"
                                        onChange={(e) => setTitreOuProfession(e.target.value)}
                                    />
                                    <small className="errorTxt2"></small>
                                </div>
                            )

                            }
                            {type === "Etudiant" && (
                                <div className="input-field col s12">
                                    <label className="active" htmlFor="numCarte">Numero Carte *</label>
                                    <input
                                        id="numCarte"
                                        name="numCarte"

                                        type="text"
                                        value={numCarte}
                                        data-error=".errorTxt2"
                                        onChange={(e) => setNumCarte(e.target.value)}
                                    />
                                    <small className="errorTxt2"></small>
                                </div>
                            )

                            }

                            {/* <div className="row">
                                <div className="input-field col s6">
                                    <label className="active">Mot de passe *</label>
                                    <input type="password" value={password} onChange={handlePasswordChange} />
                                </div>
                                <div className="input-field col s6">
                                    <label className="active">Confirmer le mot de passe *</label>
                                    <input type="password" value={confirmPassword} onChange={handleConfirmPasswordChange} />
                                    {error && <span className="red-text">{error}</span>}
                                </div>
                            </div> */}
                            {/* <div className="input-field">
                                <label className="active">Description *</label>
                                <textarea className="materialize-textarea" value={description} onChange={(e) => setDescription(e.target.value)} />
                            </div> */}
                            <div className="row">
                                <div className="col 6">
                                    <p>Type</p>
                                    {["Enseignant", "Vacataire", "Etudiant"].map((option) => (
                                        <label key={option}>
                                            <input disabled type="radio" value={option} checked={type === option} onChange={(e) => setType(e.target.value)} />
                                            <span>{option}</span>
                                        </label>
                                    ))}
                                </div>

                                <div className="col s6">
                                    <p>Rôle</p>
                                    {[type !== "Etudiant" ? "ADMIN" : null, type === "Etudiant" ? "ResponsableClasse" : null]
                                        .filter(Boolean)
                                        .map((option) => (
                                            <label key={option}>
                                                <input
                                                    type="checkbox"
                                                    disabled
                                                    value={option}
                                                    checked={roles === option} // Une seule case peut être cochée à la fois
                                                    onChange={(e) => setRole(e.target.checked ? e.target.value : "LAMDA")} // Si décoché, vide la valeur
                                                />
                                                <span>{option}</span>
                                            </label>
                                        ))}
                                </div>

                            </div>
                            <br />
                            <div className="col s12">
                                <label>Activer le compte ?</label>
                                <p>
                                    <label>
                                        <input disabled type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
                                        <span>Oui</span>
                                    </label>
                                </p>
                            </div>
                            <br />
                            <div className="input-field center-align">
                                <button className="btn waves-effect waves-light" type="submit">
                                    Modifier <i className="material-icons right">edit</i>
                                </button>
                                <button className="btn red" type="button" onClick={() => navigate(-1)}>
                                    <i className="material-icons left">cancel</i> Fermer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserEditForm2;
