import { globalStyle, style } from '@vanilla-extract/css';

export const loginContainer = style({
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
  minHeight: '70vh',
  padding: '1rem',
});

export const loginCard = style({
  background: 'var(--color-basic-bg)',
  borderRadius: 'var(--radius-lg)',
  boxShadow: 'var(--shadow-card-lifted)',
  maxWidth: '400px',
  padding: '2.5rem',
  width: '100%',
  border: '0.5px solid rgba(0, 0, 0, 0.05)',

  selectors: {
    'html.dark &': {
      boxShadow: 'var(--shadow-card-lifted)',
      border: '0.5px solid rgba(255, 255, 255, 0.05)',
    },
  },
});

globalStyle(`${loginCard} h2`, {
  fontSize: '1.75rem',
  margin: '0 0 0.5rem 0',
  textAlign: 'center',
});

export const subtitle = style({
  color: 'var(--color-sub)',
  fontSize: '0.9rem',
  lineHeight: 1.5,
  margin: '0 0 2rem 0',
  textAlign: 'center',

  selectors: {
    'html.dark &': {
      color: '#999',
    },
  },
});

// Compound selector (two classes) beats `.subtitle`'s single-class color
// regardless of stylesheet order, so the error tint stays deterministic.
export const subtitleError = style({
  selectors: {
    [`&.${subtitle}`]: {
      color: 'var(--color-error)',
    },
  },
});

export const errorContainer = style({
  background: 'rgba(238, 0, 0, 0.05)',
  border: '1px solid rgba(238, 0, 0, 0.15)',
  borderRadius: 'var(--radius-md)',
  padding: '1.25rem',
  textAlign: 'left',

  selectors: {
    'html.dark &': {
      background: 'rgba(238, 0, 0, 0.1)',
      border: '1px solid rgba(238, 0, 0, 0.2)',
    },
  },
});

export const errorDescription = style({
  color: 'var(--color-main)',
  fontSize: '0.95rem',
  fontWeight: 600,
  margin: '0 0 0.5rem 0',
});

export const errorActionHint = style({
  color: 'var(--color-sub)',
  fontSize: '0.825rem',
  lineHeight: 1.4,
  margin: 0,

  selectors: {
    'html.dark &': {
      color: '#aaa',
    },
  },
});

export const errorMessage = style({
  color: '#e00',
  fontSize: '0.85rem',
  margin: '-0.5rem 0 1.5rem 0',
  textAlign: 'left',
});

// Layout only — sizing, colors, and interaction states come from the Button primitive.
export const submitButton = style({
  width: '100%',
});
