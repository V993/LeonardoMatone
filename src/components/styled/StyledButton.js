// src/components/StyledButton.js
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: 999,
  padding: '10px 26px',
  textTransform: 'none',
  fontWeight: 600,
  letterSpacing: 0.4,
  background:
    'linear-gradient(135deg, rgba(var(--dark-cyan-rgb), 0.95) 0%, rgba(var(--dark-cyan-rgb), 0.85) 40%, rgba(var(--sunglow-rgb), 0.85) 100%)',
  color: theme.palette.common.white,
  boxShadow: '0 10px 24px rgba(85, 134, 140, 0.22)',
  transition: 'transform 160ms ease, box-shadow 200ms ease, filter 180ms ease',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 14px 32px rgba(85, 134, 140, 0.28)',
    filter: 'brightness(1.05)',
  },
  '&:active': {
    transform: 'translateY(0)',
    boxShadow: '0 8px 18px rgba(85, 134, 140, 0.24)',
  },
}));

export default StyledButton;
