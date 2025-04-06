
import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';
type ReadingMode = boolean;

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
  readingMode: ReadingMode;
  toggleReadingMode: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check if there's a saved theme preference or use system preference
  const getSavedTheme = (): Theme => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) return savedTheme;
    
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const [theme, setTheme] = useState<Theme>(getSavedTheme);
  const [readingMode, setReadingMode] = useState<ReadingMode>(
    localStorage.getItem('readingMode') === 'true'
  );

  useEffect(() => {
    // Apply the theme to the document element
    document.documentElement.classList.remove('dark', 'light', 'reading-mode');
    
    document.documentElement.classList.add(theme);
    
    if (readingMode && theme === 'light') {
      document.documentElement.classList.add('reading-mode');
    }
    
    // Save the theme preference to localStorage
    localStorage.setItem('theme', theme);
    localStorage.setItem('readingMode', readingMode.toString());
  }, [theme, readingMode]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const toggleReadingMode = () => {
    setReadingMode(prevMode => !prevMode);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, readingMode, toggleReadingMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
