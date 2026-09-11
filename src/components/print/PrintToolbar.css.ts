import { style } from '@vanilla-extract/css';

export const toolbar = style({
  bottom: 'calc(1.5rem + env(safe-area-inset-bottom))',
  display: 'flex',
  justifyContent: 'center',
  left: '50%',
  position: 'fixed',
  transform: 'translateX(-50%)',
  zIndex: 'var(--z-sticky)',

  '@media': {
    print: {
      display: 'none',
    },
  },
});

export const printButton = style({
  alignItems: 'center',
  background: 'rgba(255, 255, 255, 0.75)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.5)',
  borderRadius: 'var(--radius-full)',
  color: '#111111',
  cursor: 'pointer',
  display: 'inline-flex',
  font: '700 0.875rem/1 var(--font-family-text), sans-serif',
  gap: 'var(--space-xs)',
  height: '48px',
  padding: '0 1.25rem',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.8)',
  transition: 'background 0.15s, transform 0.1s',

  ':hover': {
    background: 'rgba(255, 255, 255, 0.9)',
  },

  ':active': {
    transform: 'scale(0.95)',
  },

  selectors: {
    '.dark &': {
      background: 'rgba(15, 23, 42, 0.75)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      color: '#f1f5f9',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
    },
    '.dark &:hover': {
      background: 'rgba(15, 23, 42, 0.9)',
    },
  },
});
