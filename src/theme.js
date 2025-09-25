

// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    /* Align primary/secondary with provided palette */
    primary: {
      main: '#55868c', // dark-cyan
      contrastText: '#0b1b1d',
    },
    secondary: {
      main: '#ffc857', // sunglow
      contrastText: '#2a1b00',
    },
    background: {
      default: '#f7f8fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#1f2937',
      secondary: '#475569',
    },
    /* Provide a simple section mapping for reference */
    sections: {
      welcome: { base: '#b7ff9d', text: '#0b2b10', accent: '#55868c' },
      about: { base: '#a1683a', text: '#fff8f0', accent: '#ffc857' },
      education: { base: '#55868c', text: '#0b1b1d', accent: '#b7ff9d' },
      experience: { base: '#ffc857', text: '#2a1b00', accent: '#a1683a' },
      projects: { base: '#dab6fc', text: '#2a0b3d', accent: '#55868c' },
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
  components: {
    MuiButton: {
      defaultProps: {
        variant: 'contained',
      },
    },
  },
});

export default theme;
