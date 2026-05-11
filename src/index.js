// src/index.js
import React, { useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ThemeProvider } from '@mui/material/styles';
import buildTheme from './theme';
import { ThemeModeProvider, useThemeMode } from './theme/ThemeModeContext';

function ThemedApp() {
  const { mode } = useThemeMode();
  const muiTheme = useMemo(() => buildTheme(mode), [mode]);
  return (
    <ThemeProvider theme={muiTheme}>
      <App />
    </ThemeProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeModeProvider>
    <ThemedApp />
  </ThemeModeProvider>
);
