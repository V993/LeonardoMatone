

// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#14532d',
    },
    secondary: {
      main: '#1d4ed8',
    },
    background: {
      default: '#f4f5f7',
      paper: '#ffffff',
    },
    text: {
      primary: '#1f2937',
      secondary: '#475569',
    },
    sections: {
      about: {
        background: '#0f172a',
        card: '#1e293b',
        accent: '#38bdf8',
        text: '#f8fafc',
      },
      education: {
        background: '#e0f2fe',
        card: '#f8fbff',
        accent: '#1d4ed8',
        text: '#0f172a',
      },
      experience: {
        background: '#dcfce7',
        card: '#f1fdf4',
        accent: '#166534',
        text: '#064e3b',
      },
      projects: {
        background: '#ecfdf5',
        card: '#f5fdf9',
        accent: '#0f766e',
        text: '#0f172a',
      },
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
