import { style } from '@vanilla-extract/css';

export const container = style({
  alignItems: 'center',
  backgroundColor: 'var(--color-basic-bg)',
  color: 'var(--color-main)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: 'var(--space-sm)',
  textAlign: 'center',
});

// The 404 numeral is the page hero, so it stays oversized versus --font-h1;
// weight, color, and margins come from the global h1 style
export const title = style({
  fontSize: '3rem',
});

// Explicit margins: the global p style only overrides margin-bottom, so the
// browser-default 1em top margin would otherwise gap the title apart
export const description = style({
  color: 'var(--color-sub)',
  fontSize: '1.25rem',
  margin: '0 0 var(--space-sm)',
});

export const homeLink = style({
  border: '1px solid var(--color-primary)',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--color-primary)',
  fontWeight: 600,
  padding: 'var(--space-xs) var(--space-sm)',
  textDecoration: 'none',
});
