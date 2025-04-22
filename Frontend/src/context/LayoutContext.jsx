import { createContext, useContext, useMemo } from 'react';
import { useMediaQuery } from '@mui/material';

export const LayoutContext = createContext();

export const LayoutProvider = ({ children }) => {
  const isMobile = useMediaQuery('(max-width:650px)');
  const isTablet = useMediaQuery('(min-width:651px) and (max-width:950px)');
  const isDesktop = useMediaQuery('(min-width:951px)');
  
  const isSidebarVisible = (role) => 
    role === "Doctor" || role === "Admin";

  const getContentMargin = (userRole) => {
    if (!isSidebarVisible(userRole)) return { marginLeft: 0, width: '100%' };
    
    return {
      marginLeft: isDesktop ? '240px' : isTablet ? '125px' : 0,
      width: isDesktop ? 'calc(100% - 240px)' : 
             isTablet ? 'calc(100% - 125px)' : '100%'
    };
  };

  const value = useMemo(() => ({
    isMobile,
    isTablet,
    isDesktop,
    getContentMargin
  }), [isMobile, isTablet, isDesktop]);

  return (
    <LayoutContext.Provider value={value}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};