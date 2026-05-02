import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const themes = [
  { id: 'pink',  label: '🌸 Pink',       desc: 'Feminine & Soft'  },
  { id: 'dusky', label: '🌹 Dusky Rose', desc: 'Warm & Muted'     },
  { id: 'dark',  label: '🌙 Dark',       desc: 'Sleek & Moody'    },
];

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() =>
    localStorage.getItem('acneai-theme') || 'pink'
  );

  useEffect(() => {
    // pink is :root default so remove attribute, others set it
    if (theme === 'pink') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', theme);
    }
    localStorage.setItem('acneai-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);