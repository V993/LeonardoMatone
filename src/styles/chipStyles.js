// src/styles/chipStyles.js
export const sharedChipSx = {
  borderRadius: '999px',
  px: 1.65,
  py: 0.4,
  fontWeight: 400,
  letterSpacing: 0.25,
  fontSize: '0.78rem',
  textTransform: 'none',
  backgroundColor: 'rgba(var(--dark-cyan-rgb), 0.12)',
  border: '1px solid rgba(var(--dark-cyan-rgb), 0.18)',
  color: '#1f2937',
  boxShadow: '0 6px 14px rgba(85, 134, 140, 0.14)',
  transition: 'background-color 200ms ease, box-shadow 200ms ease, transform 200ms ease',
  '&:hover': {
    backgroundColor: 'rgba(var(--dark-cyan-rgb), 0.18)',
    boxShadow: '0 10px 20px rgba(85, 134, 140, 0.18)',
    transform: 'translateY(-1px)',
  },
};

export const sharedChipProps = {
  size: 'small',
};
