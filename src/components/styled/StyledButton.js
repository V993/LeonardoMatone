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
    'linear-gradient(135deg, rgba(34, 197, 94, 0.92) 0%, rgba(16, 185, 129, 0.88) 40%, rgba(45, 212, 191, 0.85) 100%)',
  color: theme.palette.common.white,
  boxShadow: '0 10px 24px rgba(15, 118, 110, 0.2)',
  transition: 'transform 160ms ease, box-shadow 200ms ease, filter 180ms ease',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 14px 32px rgba(15, 118, 110, 0.28)',
    filter: 'brightness(1.05)',
  },
  '&:active': {
    transform: 'translateY(0)',
    boxShadow: '0 8px 18px rgba(15, 118, 110, 0.24)',
  },
}));

export default StyledButton;
