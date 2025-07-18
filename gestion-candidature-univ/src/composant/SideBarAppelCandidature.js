// import { hover } from '@testing-library/user-event/dist/hover';
import React, { useEffect, useState } from 'react';
import { useSidebar } from './context/SidebarContext';
import { Link, useParams } from 'react-router-dom';
import M from 'materialize-css';
const SideBarAppelCandidature = () => {
    const { id } = useParams();
    // const [visible, setVisible] = useState(false);
    const { isSidebarVisible, toggleSidebar } = useSidebar(); // Utilisez le hook pour accéder à isSidebarVisible et toggleSidebar
    const [isNavLocked, setIsNavLocked] = useState(true);
    const toggleMenuCollapse = () => {
        setIsNavLocked((prevState) => !prevState);
    };
      useEffect(() => {
        const elems = document.querySelectorAll('.collapsible');
        if (elems) {
          M.Collapsible.init(elems, {
            accordion: true,
          });
        } else {
          console.error('Aucun élément collapsible trouvé');
        }
      }, []);

    // const handleChangeVisible = () => {
    //     let e = visible;
    //     setVisible(!e)
    // }
    return (
        (<aside className={`sidenav-main nav-expanded  ${isNavLocked ? "nav-lock" : ""
            } nav-collapsible sidenav-dark sidenav-active-rounded `}>
            <div className="brand-sidebar">
                <h1 className="logo-wrapper">
                    <a className="brand-logo darken-1" href="1-accueil-admin.html">
                        <img className="hide-on-med-and-down" src={`${process.env.PUBLIC_URL}/images/logo-uasz.jpeg`} alt="dep info logo" />
                        <img className="show-on-medium-and-down hide-on-med-and-up" src={`${process.env.PUBLIC_URL}images/logo_dep_info.png`} style={{ width: "50px", height: "25px" }} alt="dep info logo " />
                        <span className="logo-text hide-on-med-and-down">CahierTexte</span>
                    </a>
                    <a style={{ cursor: 'pointer' }}
                        onClick={toggleMenuCollapse}
                        className="navbar-toggler"
                    >
                        <i className="material-icons">
                            {isNavLocked ? "radio_button_checked" : "radio_button_unchecked"}
                        </i>
                    </a>



                </h1>
            </div>

            <ul className={`sidenav sidenav-collapsible ${isNavLocked ? "sideNav-lock" : ""
                } leftside-navigation collapsible sidenav-fixed menu-shadow`} id="slide-out" data-menu="menu-navigation" data-collapsible="accordion">
                {/* Dashboard Section */}
                <li className="active bold">

                    <Link className="waves-effect waves-cyan" to='/traitement'>
                        <i className="material-icons">settings_input_svideo</i>
                        <span className="menu-title" data-i18n="Dashboard">DASHBOARDS</span>
                    </Link>


                </li>

                {/* Evaluations Section */}
                <li className="bold">

                    <Link className="waves-effect waves-cyan" to={`/liste-etudiant/${id}`}>
                        <i className="material-icons">settings_input_svideo</i>
                        <span className="menu-title" data-i18n="Basic Tables">Listes</span>
                    </Link>

                </li>

                {/* Enseignements Section */}
                <li className="bold">

                    <Link className="waves-effect waves-cyan" to={`/traitement-etudiant/${id}`}>
                        <i className="material-icons">settings_input_svideo</i>
                        <span className="menu-title" data-i18n="Basic Tables">Traitement</span>
                    </Link>


                </li>
                <li className="bold">

                    <Link className="waves-effect waves-cyan" to={`/dossier-etudiant/${id}`}>
                        <i className="material-icons">image_aspect_ratio</i>
                        <span className="menu-title" data-i18n="Form Layouts">Dossiers Etudiants</span>
                    </Link>


                </li><li className="bold">

                    <Link className="waves-effect waves-cyan" to='/appel-candidature'>
                        <i className="material-icons">image_aspect_ratio</i>
                        <span className="menu-title" data-i18n="Form Layouts">  Appel à candidature</span>
                    </Link>

                </li>



            </ul>

            <div className="navigation-background"></div>
            <a className="sidenav-trigger btn-sidenav-toggle btn-floating btn-medium hide-on-large-only" href="#" data-target="slide-out">
          <i className="material-icons">menu</i>
        </a>

        </aside>)

    );
};

export default SideBarAppelCandidature;



{/* // <aside className="sidenav-main nav-expanded nav-lock nav-collapsible sidenav-dark sidenav-active-rounded">
        //     <div className="brand-sidebar">
        //         <h1 className="logo-wrapper"><a className="brand-logo darken-1" href="accueil.html"><img className="hide-on-med-and-down " src="app-assets/images/logo/logo_dep_info.png" alt="dep info logo" /><img className="show-on-medium-and-down hide-on-med-and-up" src="app-assets/images/logo/materialize-logo-color.png" alt="materialize logo" /><span className="logo-text hide-on-med-and-down">CahierTexte</span></a><a className="navbar-toggler" href="#"><i className="material-icons">radio_button_checked</i></a></h1>
        //     </div>
        //     <ul className="sidenav sidenav-collapsible leftside-navigation collapsible sidenav-fixed menu-shadow" id="slide-out" data-menu="menu-navigation" data-collapsible="accordion">
        //         <li class="bold"><a class="waves-effect waves-cyan " href="#"><i class="material-icons">content_paste</i><span class="menu-title" data-i18n="User">RESULTAT</span></a>
        //         </li>
        //         <li class="bold"><a class="waves-effect waves-cyan " href="app-file-manager-candidat.html"><i class="material-icons">content_paste</i><span class="menu-title" data-i18n="User">SUIVI DOSSIER</span></a>
        //         </li>
        //         <li class="bold"><a class="waves-effect waves-cyan " href="form-wizard-candidature.html"><i class="material-icons">content_paste</i><span class="menu-title" data-i18n="User">DOSSIER CANDIDATURE</span></a>
        //         </li>

        //     </ul>
        //     <div className="navigation-background"></div><a className="sidenav-trigger btn-sidenav-toggle btn-floating btn-medium waves-effect waves-light hide-on-large-only" href="#" data-target="slide-out"><i className="material-icons">menu</i></a>

        // </aside> */}

//     )
// }
// export default SideBar;