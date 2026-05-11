// src/theme.js
import { createTheme } from '@mui/material/styles';

const sectionPalette = {
  welcome: { base: '#b7ff9d', text: '#0b2b10', accent: '#55868c' },
  about: { base: '#a1683a', text: '#fff8f0', accent: '#ffc857' },
  education: { base: '#55868c', text: '#0b1b1d', accent: '#b7ff9d' },
  experience: { base: '#ffc857', text: '#2a1b00', accent: '#a1683a' },
  projects: { base: '#dab6fc', text: '#2a0b3d', accent: '#55868c' },
};

const buildTheme = (mode = 'light') => {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#55868c',
        contrastText: isDark ? '#0b0f17' : '#FFFFFF',
      },
      secondary: {
        main: '#ffc857',
        contrastText: '#000000',
      },
      background: {
        default: isDark ? '#07090d' : '#f4f6fb',
        paper: isDark ? '#161b24' : '#ffffff',
      },
      text: {
        primary: isDark ? '#f1f5f9' : '#000000',
        secondary: isDark ? 'rgba(241, 245, 249, 0.78)' : 'rgba(15, 23, 42, 0.72)',
        disabled: isDark ? 'rgba(203, 213, 225, 0.4)' : 'rgba(15, 23, 42, 0.38)',
      },
      divider: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.12)',
      sections: sectionPalette,
    },
    typography: {
      fontFamily: 'Roboto, sans-serif',
    },
    components: {
      MuiButton: {
        defaultProps: { variant: 'contained' },
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: isDark ? '#07090d' : '#e6ddd1',
            color: isDark ? '#f1f5f9' : '#000000',
            transition: 'background-color 240ms ease, color 240ms ease',
          },
        },
      },
    },
  });
};

export default buildTheme;
export { sectionPalette };
