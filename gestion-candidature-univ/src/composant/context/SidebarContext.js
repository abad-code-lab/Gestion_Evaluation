import { useMediaQuery } from '@mui/material';
import React, { createContext, useContext, useState } from 'react';

// Création du contexte
const SidebarContext = createContext();

// Provider pour le contexte de la Sidebar
export const SidebarProvider = ({ children }) => {
    
    const [sidebarState, setSidebarState] = useState({
        isCollapsed: false,
        isHovered: false,
        isLocked: false,
        // isMobileOpen: false,

      });
      const [isMobileOpen, setIsMobileOpen] = useState(false);
      const toggleMobileDrawer = () => {
    
        setIsMobileOpen(!isMobileOpen);
      };
      const isMobile = useMediaQuery('(max-width:900px)');

    return (
        <SidebarContext.Provider value={{ sidebarState,setSidebarState,isMobileOpen, toggleMobileDrawer,isMobile }}>
            {children}
        </SidebarContext.Provider>
    );
};

// Hook personnalisé pour utiliser le contexte de la Sidebar
export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
};
