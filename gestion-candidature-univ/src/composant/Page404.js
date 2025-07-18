import React from "react";
import { Link } from "react-router-dom";

const Page404 = () => {
    const pageStyle = {
        minHeight: "100vh",
        background: `url(${process.env.PUBLIC_URL}/app-assets/images/gallery/error-2.png) no-repeat center center fixed`,
        backgroundSize: "cover",
    };

    return (
        <div
            className="vertical-layout page-header-light vertical-menu-collapsible vertical-dark-menu preload-transitions 1-column blank-page"
            data-open="click"
            data-menu="vertical-dark-menu"
            data-col="1-column"
            style={pageStyle} // On ajoute le style ici
        >
            <div className="row">
                <div className="col s12">
                    <div className="container">
                        <div className="section section-404 p-0 m-0 height-100vh">
                            <div className="row">
                                <div className="col s12 center-align white">
                                    <h1 className="error-code m-0">404</h1>
                                    <h6 className="mb-2">BAD REQUEST</h6>
                                    <Link
                                        to="/"
                                        className="btn waves-effect waves-light gradient-45deg-deep-purple-blue gradient-shadow mb-4"
                                    >
                                        Retour vers la page d'accueil
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="content-overlay"></div>
                </div>
            </div>
        </div>
    );
};

export default Page404;
