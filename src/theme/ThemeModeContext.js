// src/theme/ThemeModeContext.js
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'lm-theme-mode';
const ATTR = 'data-theme';

const ThemeModeContext = createContext({
  mode: 'light',
  isExplicit: false,
  setMode: () => {},
  toggleMode: () => {},
});

const readSystemPref = () => {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const readStored = () => {
  if (typeof window === 'undefined') return null;
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
};

export function ThemeModeProvider({ children }) {
  const [stored, setStored] = useState(() => readStored());
  const [systemMode, setSystemMode] = useState(() => readSystemPref());

  const mode = stored ?? systemMode;
  const isExplicit = stored !== null;

  // Apply attribute to <html> so CSS variables flip globally.
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.setAttribute(ATTR, mode);
  }, [mode]);

  // Track system preference changes for users who haven't set a manual override.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => setSystemMode(e.matches ? 'dark' : 'light');
    if (mql.addEventListener) mql.addEventListener('change', handler);
    else mql.addListener(handler);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener('change', handler);
      else mql.removeListener(handler);
    };
  }, []);

  const setMode = useCallback((next) => {
    if (next !== 'light' && next !== 'dark') return;
    setStored(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const toggleMode = useCallback(() => {
    setStored((prev) => {
      const current = prev ?? readSystemPref();
      const next = current === 'dark' ? 'light' : 'dark';
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ mode, isExplicit, setMode, toggleMode }),
    [mode, isExplicit, setMode, toggleMode]
  );

  return <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>;
}

export function useThemeMode() {
  return useContext(ThemeModeContext);
}
