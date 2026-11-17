'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = (localStorage.getItem('dhaka-theme') || localStorage.getItem('fplus-theme')) as Theme | null;
      if (saved === 'light') {
        setTheme('light');
        document.documentElement.classList.add('theme-light');
      } else {
        setTheme('dark');
        document.documentElement.classList.remove('theme-light');
      }
    } catch {}
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('dhaka-theme', next);
        if (next === 'light') {
          document.documentElement.classList.add('theme-light');
        } else {
          document.documentElement.classList.remove('theme-light');
        }
      } catch {}
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
