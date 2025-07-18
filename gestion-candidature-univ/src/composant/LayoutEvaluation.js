import React, { useCallback, useMemo } from 'react';
import Header from './Header';
import SideBar from './SideBar';
import Footer from './Footer';
import { useSidebar } from './context/SidebarContext';
import SideBarEnseignant from './SideBarEnseignant';

import SideBarEvaluation from './SideBarEvaluation';
import { useMediaQuery } from '@mui/material';


const LayoutEvaluation = ({ children }) => {
    
    const { sidebarState, setSidebarState } = useSidebar();
    const {isMobileOpen, toggleMobileDrawer,isMobile } = useSidebar();
  
    // const isMobileOpen = sidebarState.isMobileOpen || false; // Assurez-vous que isMobileOpen est défini
  
    
    console.log('isMobile', isMobile);
  
  
    const handleSidebarStateChange = useCallback((newState) => {
      setSidebarState(newState);
    }, [setSidebarState]);
  
    const containerStyles = useMemo(() => ({
      background: 'linear-gradient(135deg, #14b8a6 0%, #10b981 100%)',
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }), []);
  
    const bodyLayoutStyles = useMemo(() => ({
      flex: 1,
      position: 'relative',
      display: 'flex'
    }), []);
  
    const sidebarWrapperStyles = useMemo(() => ({
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
      zIndex: 1000,
      transition: 'transform 0.3s ease-in-out'
    }), []);
  
    const mainContentStyles = useMemo(() => {
      const isCollapsed = sidebarState.isCollapsed && !sidebarState.isHovered;
  
      const paddingLeft = isMobile
        ? 0
        : isCollapsed
          ? 65
          : 250;
  
      return {
        width: '100%',
        paddingLeft,
        paddingRight: 20,
        paddingTop: 20,
        paddingBottom: 20,
        transition: 'padding-left 0.3s ease-in-out',
        minHeight: '100%',
        boxSizing: 'border-box'
      };
    }, [sidebarState.isCollapsed, sidebarState.isHovered, isMobile]);
  
    return (
      <div style={containerStyles}>
        {/* Affiche le Header avec un bouton menu en mobile */}
        <Header />
        <div style={bodyLayoutStyles}>
          <div style={sidebarWrapperStyles}>

                    <SideBarEvaluation 
                    onStateChange={handleSidebarStateChange}
                    isMobileOpen={isMobileOpen}
                    toggleMobileDrawer={toggleMobileDrawer}
                    />
                </div>
                <div
                    id="main"
                    className="container content-transition"
                    style={mainContentStyles}
                >
                    {children}
                </div>
            </div>
            <Footer />
        </div>
    );
};


export default LayoutEvaluation;
