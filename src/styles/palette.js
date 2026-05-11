// src/styles/palette.js
//
// Semantic palette tokens. These resolve at runtime to CSS variables defined in
// src/index.css, which flip between light/dark via the [data-theme] attribute
// on <html>. Using `var(--token)` everywhere lets a single attribute swap re-
// theme the entire site without re-rendering components.

export const textOnLight = {
  strong: 'var(--text-strong)',
  primary: 'var(--text-primary)',
  secondary: 'var(--text-secondary)',
  muted: 'var(--text-muted)',
  subtle: 'var(--text-subtle)',
};

export const textOnDark = {
  strong: 'var(--text-on-accent)',
  muted: 'var(--text-on-accent)',
};

export const surfaceColors = {
  base: 'var(--surface-base)',
  raised: 'var(--surface-raised)',
  overlay: 'var(--surface-overlay)',
  subtle: 'var(--surface-subtle)',
  border: 'var(--border-default)',
  borderStrong: 'var(--border-strong)',
  shadowSoft: 'var(--shadow-soft)',
  shadowStrong: 'var(--shadow-strong)',
};

export const overlayColors = {
  dark: 'rgba(0, 0, 0, 0.84)',
  darkSoft: 'rgba(0, 0, 0, 0.64)',
};
