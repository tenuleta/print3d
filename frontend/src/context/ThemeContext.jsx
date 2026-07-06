import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

const lightColors = {
  bg: '#f8fafc',
  card: '#ffffff',
  cardBorder: '#e2e8f0',
  text: '#1e293b',
  textSecondary: '#64748b',
  textMuted: '#94a3b8',
  input: '#f8fafc',
  inputBorder: '#e2e8f0',
  divider: '#f1f5f9',
  error: '#fef2f2',
  errorText: '#dc2626',
  errorBorder: '#fecaca',
  success: '#f0fdf4',
  successText: '#166534',
  successBorder: '#bbf7d0',
  heroBg: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
  heroText: '#fff',
  heroSub: '#94a3b8',
  navBg: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
  filterBg: '#ffffff',
};

const darkColors = {
  bg: '#0f172a',
  card: '#1e293b',
  cardBorder: '#334155',
  text: '#f1f5f9',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',
  input: '#0f172a',
  inputBorder: '#475569',
  divider: '#334155',
  error: '#451a1a',
  errorText: '#fca5a5',
  errorBorder: '#7f1d1d',
  success: '#052e16',
  successText: '#86efac',
  successBorder: '#166534',
  heroBg: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
  heroText: '#f1f5f9',
  heroSub: '#64748b',
  navBg: 'linear-gradient(135deg, #0f172a 0%, #020617 100%)',
  filterBg: '#1e293b',
};

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  const toggle = () => setDark(!dark);
  const colors = dark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ dark, toggle, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
