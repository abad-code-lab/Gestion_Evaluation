import React, { useState, useEffect } from "react";

const EnseignantProfile = ({ enseignantData, onClose }) => {
    // Initialisation de l'état à partir des props ou de l'API
    const [enseignant, setEnseignant] = useState({
        id: enseignantData?.id || "",
        email: enseignantData?.email || "",
        nom: enseignantData?.nom || "",
        prenom: enseignantData?.prenom || "",
        telephone: enseignantData?.telephone || "",
        active: enseignantData?.active || false,
        type: enseignantData?.type || "",
        role: enseignantData?.role || "",
        token: enseignantData?.token || "",
        refreshToken: enseignantData?.refreshToken || "",
        grade: enseignantData?.grade || enseignantData?.titreOuPrefession || "",

        matricule: enseignantData?.matricule || ""
    });

    useEffect(() => {
        // Si enseignantData est modifié, on met à jour l'état
        if (enseignantData) {
            setEnseignant({
                id: enseignantData.id,
                email: enseignantData.email,
                nom: enseignantData.nom,
                prenom: enseignantData.prenom,
                telephone: enseignantData.telephone,
                active: enseignantData.active,
                type: enseignantData.type,
                token: enseignantData.token,
                refreshToken: enseignantData.refreshToken,
                grade: enseignantData.grade,
                matricule: enseignantData.matricule
            });
        }
    }, [enseignantData]);

    return (
        <div className="section users-view">
            <div className="card-panel">
                <div className="row">
                    <div className="col s12 m7">
                        <div className="display-flex media">
                            <a href="#" className="avatar">
                                <img
                                    src="../../../app-assets/images/avatar/avatar-15.png"
                                    alt="avatar"
                                    className="z-depth-4 circle"
                                    height="94"
                                    width="94"
                                />
                            </a>
                            <div className="media-body">
                                <h6 className="media-heading">
                                    <span className="users-view-name">{enseignant.nom} {enseignant.prenom}</span>
                                    <span className="grey-text">@</span>
                                    <span className="users-view-username grey-text">{enseignant.email}</span>
                                </h6>
                                <span>ID:</span>
                                <span className="users-view-id">{enseignant.id}</span>
                            </div>
                        </div>
                    </div>
                    <div className="col s12 m5 quick-action-btns display-flex justify-content-end align-items-center pt-2">
                        <a href="app-email.html" className="btn-small btn-light-indigo">
                            <i className="material-icons">mail_outline</i>
                        </a>
                        <a href="user-profile-page.html" className="btn-small btn-light-indigo">
                            Liste des Enseignants
                        </a>


                        <button className="btn-small indigo" onClick={onClose}>


                            Liste des Enseignants
                        </button>



                    </div>
                </div>
            </div>

            {/* Enseignant Details */}
            <div className="card">
                <div className="card-content">
                    <div className="row">
                        <div className="col s12 m6">
                            <table className="highlight responsive-table striped">
                                <tbody>
                                    <tr>
                                        <td>Email:</td>
                                        <td>{enseignant.email}</td>
                                    </tr>
                                    <tr>
                                        <td>Nom:</td>
                                        <td>{enseignant.nom}</td>
                                    </tr>
                                    <tr>
                                        <td>Prénom:</td>
                                        <td>{enseignant.prenom}</td>
                                    </tr>
                                    <tr>
                                        <td>Phone:</td>
                                        <td>{enseignant.telephone}</td>
                                    </tr>
                                    <tr>
                                        <td>Status:</td>
                                        <td>
                                            <span className={`chip ${enseignant.active ? 'green lighten-5 green-text' : 'red lighten-5 red-text'}`}>
                                                {enseignant.active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>{enseignant.type === "Enseignant" ? 'Grade : ' : 'Titre/Profession : '} </td>
                                        <td>{enseignant.grade}</td>
                                    </tr>
                                    {enseignant.type === "Enseignant" && (<tr>
                                        <td>Matricule:</td>
                                        <td>{enseignant.matricule}</td>
                                    </tr>)
                                    }

                                </tbody>
                            </table>
                        </div>
                        <div className="col s12 m6">
                            <h6>Personal Info</h6>
                            <table className="highlight responsive-table striped">
                                <tbody>
                                    <tr>
                                        <td>Type:</td>
                                        <td>{enseignant.type}</td>
                                    </tr>
                                    <tr>
                                        <td>Role:</td>
                                        <td>{enseignant.role}</td>
                                    </tr>

                                </tbody>
                            </table>
                        </div>
                        <div className=" center-align col s12">
                            <button className="btn red" type="button" onClick={(e) => onClose(false)}><i className="material-icons left">error</i>
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnseignantProfile;
