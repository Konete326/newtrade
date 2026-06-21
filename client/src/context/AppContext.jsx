import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [sidebarSelected, setSidebarSelected] = useState(() => {
    return localStorage.getItem('sidebarSelected') || 'Dashboard';
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('sidebarSelected', sidebarSelected);
  }, [sidebarSelected]);

  return (
    <AppContext.Provider
      value={{
        darkMode,
        setDarkMode,
        sidebarToggle,
        setSidebarToggle,
        sidebarSelected,
        setSidebarSelected,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
