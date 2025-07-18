import React from 'react';
import Header from './Header';
import SideBar from './SideBar';
import Footer from './Footer';
import SideBarEnseignant from './SideBarEnseignant';


const LayoutEnseignant = ({ children }) => {
    return (
        <div style={{
            backgroundImage: `url(${process.env.PUBLIC_URL}/images/baobab2.png)`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            width: '100%',
            height: '100%',
          }}
           class="vertical-layout page-header-light vertical-menu-collapsible vertical-dark-menu preload-transitions 2-columns   " data-open="click" data-menu="vertical-dark-menu" data-col="2-columns"
          >
        {/* <div className="app-container"> */}
            <Header />
            <SideBarEnseignant />
            {/* <div className="main-content"> */}

                <div id="main" className="container" >
                    {/* className="page-content" */}
                    {children}
                </div>
            {/* </div> */}
            <Footer />
        </div>
    );
};

export default LayoutEnseignant;
