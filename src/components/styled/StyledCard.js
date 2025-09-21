// src/components/StyledCard.js
import { styled } from '@mui/material/styles';
import { Card } from '@mui/material';

const StyledCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  borderRadius: 18,
  padding: theme.spacing(3),
  background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(243, 255, 248, 0.92))',
  border: '1px solid rgba(20, 83, 50, 0.18)',
  boxShadow: '0 10px 24px rgba(15, 118, 110, 0.12)',
  transition: 'transform 180ms ease, box-shadow 200ms ease, border-color 200ms ease',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  '&:hover': {
    transform: 'translateY(-6px)',
    boxShadow: '0 18px 36px rgba(14, 116, 89, 0.22)',
    borderColor: 'rgba(22, 163, 74, 0.35)',
  },
  '&[data-interactive="true"]': {
    cursor: 'pointer',
    outline: 'none',
  },
  '&[data-interactive="true"]:focus-visible': {
    outline: `2px solid ${theme.palette.success.main || '#22c55e'}`,
    outlineOffset: 4,
  },
  '&[data-variant="project"]': {
    padding: theme.spacing(3.5),
    background:
      'linear-gradient(155deg, rgba(240, 253, 244, 0.98) 0%, rgba(236, 252, 203, 0.92) 46%, rgba(255, 255, 255, 0.94) 100%)',
    border: '1px solid rgba(22, 101, 52, 0.25)',
    overflow: 'hidden',
  },
  '&[data-variant="project"]::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(135deg, rgba(22, 101, 52, 0.12) 0%, rgba(22, 101, 52, 0) 38%)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  '&[data-variant="project"]::after': {
    content: '""',
    position: 'absolute',
    top: -theme.spacing(2),
    right: -theme.spacing(2),
    width: theme.spacing(9),
    height: theme.spacing(9),
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(34, 197, 94, 0.35) 0%, rgba(34, 197, 94, 0) 70%)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  '&[data-variant="project"]:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 22px 42px rgba(14, 116, 89, 0.24)',
    borderColor: 'rgba(22, 163, 74, 0.45)',
  },
}));

export default StyledCard;
