import { style } from '@vanilla-extract/css';

export const educationList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-md)',
});

export const item = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: 'var(--space-md)',

  '@media': {
    '(max-width: 768px)': {
      flexDirection: 'column',
      gap: '0.5rem',
    },
  },
});

export const info = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
});

export const school = style({
  fontSize: 'var(--font-h3)',
  fontWeight: 700,
  margin: 0,
  color: 'var(--color-bold)',
});

export const major = style({
  fontSize: '0.9375rem',
  color: 'var(--color-main)',
  margin: 0,
});

export const dateWrapper = style({
  flexShrink: 0,
  textAlign: 'right',
  fontSize: '0.875rem',
  color: 'var(--color-placeholder)',
  paddingTop: '0.125rem',

  '@media': {
    '(max-width: 768px)': {
      textAlign: 'left',
    },
  },
});
