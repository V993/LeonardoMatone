// src/styles/chipStyles.js
export const sharedChipSx = {
  borderRadius: '999px',
  px: 1.65,
  py: 0.4,
  fontWeight: 400,
  letterSpacing: 0.25,
  fontSize: '0.78rem',
  textTransform: 'none',
  backgroundColor: 'var(--chip-bg)',
  border: '1px solid var(--chip-border)',
  color: 'var(--chip-text)',
  boxShadow: '0 6px 14px rgba(85, 134, 140, 0.14)',
  transition: 'background-color 200ms ease, box-shadow 200ms ease, transform 200ms ease, color 200ms ease',
  '& .MuiChip-label': {
    color: 'var(--chip-text)',
  },
  '&:hover': {
    backgroundColor: 'var(--chip-bg-hover)',
    boxShadow: '0 10px 20px rgba(85, 134, 140, 0.22)',
    transform: 'translateY(-1px)',
  },
};

export const sharedChipProps = {
  size: 'small',
};
