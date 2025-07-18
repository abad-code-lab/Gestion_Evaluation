// import { hover } from '@testing-library/user-event/dist/hover';
import React, { useEffect, useState } from 'react';
import { useSidebar } from './context/SidebarContext';
import { Link } from 'react-router-dom';
import { useUser } from './context/UserContext';
import M from 'materialize-css';

const SideBarEnseignant = () => {
    // const [visible, setVisible] = useState(false);
    // const { isSidebarVisible, toggleSidebar } = useSidebar(); // Utilisez le hook pour accéder à isSidebarVisible et toggleSidebar
    // const { isNavLocked, setIsNavLocked } = useSidebar(); // Utilisez le hook pour accéder à isSidebarVisible et toggleSidebar
    // const [isSidebarVisible, setSidebarVisible] = useState(true);
    const { isNavLocked, setIsNavLocked, toggleMenuCollapse } = useSidebar();
    const { user, logout } = useUser();

    // const handleClick = (e) => {
    //     e.preventDefault(); // Empêche   la redirection
    //     toggleSidebar(); // Bascule la visibilité du Sidebar
    // };
    // Un tableau d'états pour suivre l'état (ouvert/fermé) de chaque liste
    const [listsOpen, setListsOpen] = useState([false, false, false, false, false, false, false]); // Initialement, toutes les listes sont fermées
    const [listsOpen2, setListsOpen2] = useState([false, false, false, false, false, false, false]); // Initialement, toutes les listes sont fermées

    // Fonction pour basculer l'état d'une liste spécifique
    // const toggleList = (index) => {
    //     setListsOpen([false, false, false, false, false, false, false])
    //     const newListsOpen = [...listsOpen];
    //     newListsOpen[index] = !newListsOpen[index];
    //     setListsOpen(newListsOpen);

    // };
    const toggleList2 = (index) => {
        setListsOpen2((prevState) => {
            const newListsOpen = Array(prevState.length).fill(false); // Ferme toutes les listes
            newListsOpen[index] = !prevState[index]; // Ouvre ou ferme celle sélectionnée
            return newListsOpen;
        });
    };

    const toggleList = (index) => {
        setListsOpen((prevState) => {
            const newListsOpen = Array(prevState.length).fill(false); // Ferme toutes les listes
            newListsOpen[index] = !prevState[index]; // Ouvre ou ferme celle sélectionnée
            return newListsOpen;
        });
    };
    // useEffect(() => {

    // }, []);

    useEffect(() => {
        // Initialiser MaterializeCSS pour le menu latéral
        const sidenav = document.querySelectorAll('.sidenav');
        M.Sidenav.init(sidenav, {
            edge: 'left', // Position du menu (left/right)
            draggable: true // Permet de glisser pour ouvrir
        });
        const elems = document.querySelectorAll('.collapsible');
        if (elems) {
            M.Collapsible.init(elems, {
                accordion: true,
            });
        } else {
            console.error('Aucun élément collapsible trouvé');
        }
    }, []);
    // Fonction pour ouvrir toutes les listes
    const openAllLists = () => {
        setListsOpen(listsOpen.map(() => true)); // Met toutes les valeurs à `true`
    };

    // Fonction pour fermer toutes les listes
    const closeAllLists = () => {
        setListsOpen(listsOpen.map(() => false)); // Met toutes les valeurs à `false`
    };
    // const handleChangeVisible = () => {
    //     let e = visible;
    //     setVisible(!e)
    // }
    return (
        (<aside className={`sidenav-main nav-expanded  ${isNavLocked ? "nav-lock" : ""
            } nav-collapsible sidenav-dark sidenav-active-rounded `}>
            <div className="brand-sidebar">
                <h1 className="logo-wrapper">
                    <Link className="brand-logo darken-1" to="/accueil-gerant">
                        {/* <a className="brand-logo darken-1" href="/"> */}
                        <img className="hide-on-med-and-down" src={`${process.env.PUBLIC_URL}/images/baobab-logo.png`} style={{ width: "160px", height: "90px" }} alt="baobab logo" />
                        <img className="show-on-medium-and-down hide-on-med-and-up" src={`${process.env.PUBLIC_URL}images/baobab-logo.png`} style={{ width: "60px", height: "40px" }} alt="baobab logo " />
                        {/* <span className="logo-text hide-on-med-and-down">baobab</span> */}
                    </Link>

                    <a style={{ cursor: 'pointer' }}
                        onClick={toggleMenuCollapse}
                        className="navbar-toggler"
                    >
                        <i className="material-icons">
                            {isNavLocked ? "radio_button_checked" : "radio_button_unchecked"}
                        </i>
                    </a>

                    {/* <a className="navbar-toggler" href='' style={{ cursor: 'pointer' }} onClick={handleClick}>
                        <i className="material-icons">radio_button_checked</i>
                    </a> */}
                </h1>

            </div>

            <ul className={`sidenav sidenav-collapsible ${isNavLocked ? "sideNav-lock" : ""
                } leftside-navigation collapsible sidenav-fixed menu-shadow`} id="slide-out" data-menu="menu-navigation" data-collapsible="accordion">
                <br /><br />
                {/* Dashboard Section */}
                {/* <li className={`${listsOpen[0] ? "active" : ""} bold`}
                >
                    <a className={`collapsible-header ${listsOpen[0] ? "active" : ""}`} onClick={() => toggleList(0)}>
                        <i className="material-icons">settings_input_svideo</i>
                        <span className="menu-title" data-i18n="Dashboard">DASHBOARDS</span>
                        <span className="badge badge-pill orange float-right mr-10">3</span>
                    </a>
                    <div style={{ display: listsOpen[0] ? "block" : "none" }} className="collapsible-body">
                        <ul className="collapsible collapsible-sub" data-collapsible="accordion">
                            <li>
                                <a href="dashboard-modern-enseignements.html">
                                    <i className="material-icons">radio_button_unchecked</i>
                                    <span data-i18n="Modern">Enseignements</span>
                                </a>
                            </li>
                            <li className="active">
                                <a href="dashboard-ecommerce-budget.html">
                                    <i className="material-icons">radio_button_unchecked</i>
                                    <span data-i18n="eCommerce">Evaluations</span>
                                </a>
                            </li>
                            <li>
                                <a href="dashboard-analytics-appelsOffres.html">
                                    <i className="material-icons">radio_button_unchecked</i>
                                    <span data-i18n="Analytics">Candidatures</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </li> */}

                {/* Evaluations Section */}
                {/* <li className={`${listsOpen[1] ? "active" : ""} bold`}>
                    <a className={`collapsible-header ${listsOpen[1] ? "active" : ""}`} onClick={() => toggleList(1)}>
                        <i className="material-icons">settings_input_svideo</i>
                        <span className="menu-title" data-i18n="Dashboard">EVALUATIONS</span>
                    </a>
                    <div style={{ display: listsOpen[1] ? "block" : "none" }} className="collapsible-body">
                        <ul className="collapsible collapsible-sub" data-collapsible="accordion">
                            <li>
                                <a className="" href="#">
                                    <i className="material-icons">border_all</i>
                                    <span className="menu-title" data-i18n="Basic Tables">Evaluation des étudiants</span>
                                </a>
                            </li>
                        </ul>
                    </div>

                </li> */}

                {/* Enseignements Section */}
                {/* <li className={`${listsOpen[2] ? "active" : ""} bold`}>
                    <a className={`collapsible-header ${listsOpen[2] ? "active" : ""}`} onClick={() => toggleList(2)}>
                        <i className="material-icons">settings_input_svideo</i>
                        <span className="menu-title" data-i18n="Dashboard">ENSEIGNEMENTS</span>
                    </a>

                    <div style={{ display: listsOpen[2] ? "block" : "none" }} className="collapsible-body">
                        <ul className="collapsible collapsible-sub" data-collapsible="accordion">
                            <li>
                                <a className="" href="#">
                                    <i className="material-icons">border_all</i>
                                    <span className="menu-title" data-i18n="Basic Tables">Evaluation</span>
                                </a>
                            </li>

                            <li>
                                <Link to='/maquette/maquette/Maquette'>
                                    <i className="material-icons">radio_button_unchecked</i>
                                    Maquette
                                </Link>
                            </li>

                            <li>
                                <a className="" href="#">
                                    <i className="material-icons">image_aspect_ratio</i>
                                    <span className="menu-title" data-i18n="Form Layouts">Déclaration des heures</span>
                                </a>
                            </li>
                            <li>
                                <a className="" href="#">
                                    <i className="material-icons">border_all</i>
                                    <span className="menu-title" data-i18n="Basic Tables">Déroulement</span>
                                </a>
                            </li>
                            <li>
                                <a className="" href="#">
                                    <i className="material-icons">grid_on</i>
                                    <span className="menu-title" data-i18n="Data Tables">Emploi du temps</span>
                                </a>
                            </li>
                            <li>
                                <a className="" href="#">
                                    <i className="material-icons">image_aspect_ratio</i>
                                    <span className="menu-title" data-i18n="Form Layouts">Répartition</span>
                                </a>
                            </li>
                        </ul>
                    </div>


                </li> */}

                {/* Etudiants Section */}
                {/* <li className="bold">
                    <a className="" href="page-etudiants.html">
                        <i className="material-icons">content_paste</i>
                        <span className="menu-title" data-i18n="User">ETUDIANTS</span>
                    </a>
                </li> */}

                {/* Candidatures Section */}
                <li className={`${listsOpen[3] ? "active" : ""} bold`}>
                    <a className={`collapsible-header ${listsOpen[3] ? "active" : ""}`} onClick={() => toggleList(3)}>
                        <i className="material-icons">settings_input_svideo</i>
                        <span className="menu-title" data-i18n="Dashboard">CANDIDATURES</span>
                    </a>

                    <div style={{ display: listsOpen[3] ? "block" : "none" }} className="collapsible-body">
                        <ul className="collapsible collapsible-sub" data-collapsible="accordion">
                            <li>
                                <Link className={`${listsOpen2[30] ? "collapsible-body active modif" : ""}`} onClick={() => toggleList2(30)} to="/liste-etudiant-retenu">
                                    <i className="material-icons">border_all</i>
                                    <span className="menu-title" data-i18n="Basic Tables">Listes</span>
                                </Link>
                            </li>
                            <li>

                                <Link className={`${listsOpen2[31] ? "collapsible-body active modif" : ""}`} onClick={() => toggleList2(31)} to='/traitement'>
                                    <i className="material-icons">grid_on</i>
                                    <span className="menu-title" data-i18n="Data Tables">Traitement</span>
                                </Link>
                            </li>
                            {/* 

                            <li>

<Link className={`${listsOpen2[321] ? "collapsible-body active modif" : ""}`} onClick={() => toggleList2(321)} to='/liste-paiment-a-verifier'>
    <i className="material-icons">folder_shared</i>
    <span className="menu-title" data-i18n="Form Layouts">Paiements</span>
</Link>
</li> */}

                            <li>

                                <Link className={`${listsOpen2[32] ? "collapsible-body active modif" : ""}`} onClick={() => toggleList2(32)} to='/dossier-etudiant'>
                                    <i className="material-icons">folder_shared</i>
                                    <span className="menu-title" data-i18n="Form Layouts">Dossiers Etudiants</span>
                                </Link>
                            </li>
                            {/* <li>
                                <Link className={`${listsOpen2[33] ? "collapsible-body active modif" : ""}`} onClick={() => toggleList2(33)} to='/appel-candidature'>
                                    <i className="material-icons">folder_shared</i>
                                    <span className="menu-title" data-i18n="Form Layouts">  Appel à candidature</span>
                                </Link>

                            </li> */}
                        </ul>
                    </div>


                </li>

                {/* Calendar Section */}
                <li className={`bold ${listsOpen2[34] ? "collapsible-header active modif" : ""}`} onClick={() => toggleList2(34)}>
                    {/* <a className="" href="/calendar"> */}
                     <Link to='/calendar' className={`bold ${listsOpen2[34] ? "collapsible-header active modif" : ""}`} onClick={() => toggleList2(34)}>
                        <i className="material-icons">content_paste</i>
                        <span className="menu-title" data-i18n="User">CALENDRIER</span>
                        </Link>
                </li>


                {/* Ajout de la section Maquette */}
                {/* <li className={`${listsOpen[4] ? "active" : ""} bold`}>
                    <a className={`collapsible-header ${listsOpen[4] ? "active" : ""}`} onClick={() => toggleList(4)}>
                        <i className="material-icons">build</i>
                        <span className="menu-title" data-i18n="Maquette">ENSEIGNEMENTS</span>
                    </a>
                    <div style={{ display: listsOpen[4] ? "block" : "none" }} className="collapsible-body">
                        <ul className="collapsible collapsible-sub" data-collapsible="accordion"> */}

                            {/* <li>
                                <Link to='/maquette/maquette/Repartition' className={`${listsOpen2[42] ? "collapsible-body active modif" : ""}`} onClick={() => toggleList2(42)}>
                                    <i className="material-icons">radio_button_unchecked</i>
                                    REPARTITION
                                </Link>
                            </li>

                            <li>
                                <Link to='/maquette/maquette/Maquette' className={`${listsOpen2[43] ? "collapsible-body active modif" : ""}`} onClick={() => toggleList2(43)}>
                                    <i className="material-icons">radio_button_unchecked</i>
                                    MAQUETTE
                                </Link>
                            </li>
                            <li>
                                <Link to='/maquette/ec/EC' className={`${listsOpen2[41] ? "collapsible-body active modif" : ""}`} onClick={() => toggleList2(41)}>
                                    <i className="material-icons">radio_button_unchecked</i>
                                    EC
                                </Link>
                            </li>

                            <li>
                                <Link to='/maquette/ue/UE' className={`${listsOpen2[40] ? "collapsible-body active modif" : ""}`} onClick={() => toggleList2(40)}>
                                    <i className="material-icons">radio_button_unchecked</i>
                                    UE
                                </Link>
                            </li> */}

                            {/* <li>
                                            <Link to='/maquette/enseignement/Enseignement'>
                                                <i className="material-icons">radio_button_unchecked</i>
                                                Enseignement
                                            </Link>
                                        </li>
                                         */}
                            {/* <li>
                                            <Link to='/maquette/filiere/Filiere'>
                                                <i className="material-icons">radio_button_unchecked</i>
                                                Filière
                                            </Link>
                                        </li>
                                        */}


                            {/* <li>
                                            <Link to='/maquette/module/Module'>
                                                <i className="material-icons">radio_button_unchecked</i>
                                                Module
                                            </Link>
                                        </li> */}


                        {/* </ul>
                    </div>
                </li> */}

                {/* Paramètres Section */}
                {/* <li className={`${listsOpen[5] ? "active" : ""}`}>
                    <a className={`collapsible-header ${listsOpen[5] ? "active" : ""}`} onClick={() => toggleList(5)}>
                        <i className="material-icons">build</i>
                        <span className="menu-title" data-i18n="Dashboard">PARAMETRES</span>
                    </a>
                    <div style={{ display: listsOpen[5] ? "block" : "none" }} className="collapsible-body">
                        <ul className="collapsible collapsible-sub" data-collapsible="accordion">



                            <li>
                                <Link to='/maquette/groupe/Groupe' className={`${listsOpen2[50] ? "collapsible-body active modif" : ""}`} onClick={() => toggleList2(50)}>
                                    <i className="material-icons">radio_button_unchecked</i>
                                    GROUPES
                                </Link>
                            </li>
                            <li>
                                <Link to='/maquette/classe/Classe' className={`${listsOpen2[51] ? "collapsible-body active modif" : ""}`} onClick={() => toggleList2(51)}>
                                    <i className="material-icons">radio_button_unchecked</i>
                                    CLASSES
                                </Link>
                            </li>

                            <li>
                                <Link to='/maquette/formation/Formation' className={`${listsOpen2[52] ? "collapsible-body active modif" : ""}`} onClick={() => toggleList2(52)}>
                                    <i className="material-icons">radio_button_unchecked</i>
                                    FORMATIONS
                                </Link>
                            </li>
                            <li>
                                <Link to='/maquette/semestre/Semestre' className={`${listsOpen2[53] ? "collapsible-body active modif" : ""}`} onClick={() => toggleList2(53)}>
                                    <i className="material-icons">radio_button_unchecked</i>
                                    SEMESTRES
                                </Link>
                            </li>


                            <li>
                                <Link to='/maquette/niveau/Niveau' className={`${listsOpen2[54] ? "collapsible-body active modif" : ""}`} onClick={() => toggleList2(54)}>
                                    <i className="material-icons">radio_button_unchecked</i>
                                    NIVEAUX
                                </Link>
                            </li>
                            <li>
                                <Link to='/maquette/cycle/Cycle' className={`${listsOpen2[55] ? "collapsible-body active modif" : ""}`} onClick={() => toggleList2(55)}>
                                    <i className="material-icons">radio_button_unchecked</i>
                                    CYCLES
                                </Link>
                            </li>

                        </ul>
                    </div>
                </li> */}
                {/* <li className={`${listsOpen[6] ? "active" : ""} bold`}>
                    <a className={`collapsible-header ${listsOpen[6] ? "active" : ""}`} onClick={() => toggleList(6)}>
                        <i className="material-icons">person_outline</i>
                        <span className="menu-title" data-i18n="Maquette">UTILISATEURS</span>
                    </a>
                    <div style={{ display: listsOpen[6] ? "block" : "none" }} className="collapsible-body">
                        <ul className="collapsible collapsible-sub" data-collapsible="accordion">

                            <li>
                                <Link to='/enseignants' className={`${listsOpen2[60] ? "collapsible-body active modif" : ""}`} onClick={() => toggleList2(60)}>
                                    <i className="material-icons">radio_button_unchecked</i>
                                    ENSEIGNANTS
                                </Link>
                            </li>
                            <li>
                                <Link to='/vacataires' className={`${listsOpen2[61] ? "collapsible-body active modif" : ""}`} onClick={() => toggleList2(61)}>
                                    <i className="material-icons">radio_button_unchecked</i>
                                    VACATAIRES
                                </Link>
                            </li> <li>
                                <Link to='/etudiants' className={`${listsOpen2[62] ? "collapsible-body active modif" : ""}`} onClick={() => toggleList2(62)}>
                                    <i className="material-icons">radio_button_unchecked</i>
                                    ETUDIANTS
                                </Link>
                            </li>


                        </ul>
                    </div>
                </li> */}

            </ul>
            {user && (
                <div className="user-info">
                    {/* <div > */}
                    <p><strong>{user.prenom} {user.nom}</strong></p>
                    <p><strong>{user.email}</strong></p>
                    {/* <p onClick={() => logout()} className="logout-btn">Déconnexion</p> */}
                    <p><strong>{user.type}</strong></p>
                </div>

            )}
            <div className="navigation-background">
                <a className="sidenav-trigger btn-sidenav-toggle btn-floating btn-medium hide-on-large-only" data-target="slide-out">
                    <i className="material-icons">menu</i>
                </a>
            </div>




        </aside>)

    );
};

export default SideBarEnseignant;

