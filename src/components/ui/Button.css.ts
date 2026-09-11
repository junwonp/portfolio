import { style, styleVariants } from '@vanilla-extract/css';

// Absorbs the pillButton/circleButton posture (shape + interaction) and the
// admin button variants (logoutBtn/primaryBtn/dangerBtn/printBtn) into one
// primitive. Colors, radii, and spacing reference theme tokens only.

export const base = style({
  alignItems: 'center',
  cursor: 'pointer',
  display: 'inline-flex',
  fontFamily: 'inherit',
  fontWeight: 600,
  justifyContent: 'center',
  textDecoration: 'none',
  transition: 'background 0.2s ease, border-color 0.2s ease, color 0.2s ease, transform 0.1s ease',
  whiteSpace: 'nowrap',

  ':active': {
    transform: 'scale(0.97)',
  },

  ':disabled': {
    cursor: 'default',
    opacity: 0.55,
  },
});

export const variant = styleVariants({
  primary: {
    background: 'var(--color-primary)',
    border: 'none',
    color: 'var(--color-on-primary)',
    fontWeight: 700,

    ':hover': {
      background: 'var(--color-primary-hover)',
    },
  },
  ghost: {
    background: 'transparent',
    border: 'none',
    color: 'var(--color-sub)',

    ':hover': {
      background: 'var(--color-surface-hover)',
      color: 'var(--color-bold)',
    },
  },
  outline: {
    background: 'transparent',
    border: '1px solid var(--color-bg-divider)',
    color: 'var(--color-sub)',

    ':hover': {
      background: 'var(--color-surface-hover)',
      borderColor: 'var(--color-bold)',
      color: 'var(--color-bold)',
    },
  },
  danger: {
    background: 'transparent',
    border: '1px solid color-mix(in srgb, var(--color-error) 35%, var(--color-bg-divider))',
    color: 'var(--color-error)',

    ':hover': {
      background: 'color-mix(in srgb, var(--color-error) 10%, transparent)',
      borderColor: 'var(--color-error)',
    },
  },
});

export const size = styleVariants({
  sm: {
    fontSize: '0.8125rem',
    minHeight: '2.125rem',
    padding: 'var(--space-2xs) var(--space-xs)',
  },
  md: {
    fontSize: 'var(--font-h6)',
    minHeight: '2.5rem',
    padding: 'var(--space-xs) var(--space-sm)',
  },
});

export const shape = styleVariants({
  pill: {
    borderRadius: 'var(--radius-full)',
  },
  circle: {
    borderRadius: 'var(--radius-circle)',
  },
  rounded: {
    borderRadius: 'var(--radius-sm)',
  },
});

// Square hit areas matching each size's minHeight so icon-only buttons stay circular/pill
export const iconOnlySm = style({
  padding: 0,
  width: '2.125rem',
});

export const iconOnlyMd = style({
  padding: 0,
  width: '2.5rem',
});
