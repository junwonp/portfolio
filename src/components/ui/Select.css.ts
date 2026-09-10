import { style } from '@vanilla-extract/css';

export const customSelectContainer = style({
  position: 'relative',
  width: '100%',
  display: 'inline-block',
});

export const selectControl = style({
  appearance: 'none',
  WebkitAppearance: 'none',
  width: '100%',
  minHeight: '42px',
  background: 'var(--color-code-bg)',
  border: '0.5px solid var(--color-bg-divider)',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--color-main)',
  cursor: 'pointer',
  font: 'inherit',
  fontSize: '0.875rem',
  fontWeight: 500,
  padding: '0.65rem 2rem 0.65rem 0.75rem',
  textAlign: 'left',
  transition: 'border-color 0.2s ease, outline 0.2s ease',

  ':focus-visible': {
    borderColor: 'var(--color-primary)',
    outline: '2px solid color-mix(in srgb, var(--color-primary) 18%, transparent)',
  },

  ':disabled': {
    color: 'var(--color-placeholder)',
    cursor: 'not-allowed',
    opacity: 0.6,
  },
});

export const triggerIcon = style({
  position: 'absolute',
  right: '0.75rem',
  top: '50%',
  transform: 'translateY(-50%)',
  display: 'flex',
  alignItems: 'center',
  color: 'var(--color-sub)',
  opacity: 0.7,
  pointerEvents: 'none',
});
