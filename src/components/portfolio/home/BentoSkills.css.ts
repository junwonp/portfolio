import { globalStyle, style } from '@vanilla-extract/css';

export const bentoGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gridAutoFlow: 'dense',
  gap: '1.25rem',

  '@media': {
    '(max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

export const span2 = style({});

export const card = style({
  background: 'var(--color-basic-bg)',
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
  border: '0.5px solid rgba(0, 0, 0, 0.06)',

  selectors: {
    'html.dark &': {
      background: 'var(--color-code-bg)',
      boxShadow: 'var(--shadow-card)',
      border: '0.5px solid rgba(255, 255, 255, 0.05)',
    },
    [`&.${span2}`]: {
      gridColumn: 'span 2',
    },
  },

  '@media': {
    '(max-width: 768px)': {
      selectors: {
        [`&.${span2}`]: {
          gridColumn: 'auto',
        },
      },
    },
  },
});

export const cardHeader = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.6rem',
  marginBottom: '1rem',
  color: 'var(--cat-color)',
});


export const cardTitle = style({
  color: 'var(--color-bold)',
  fontSize: '0.9375rem',
  fontWeight: 700,
  letterSpacing: '0.02em',
  margin: 0,
});

export const tagList = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 'var(--space-xs)',
  minWidth: 0,
});

export const cardFooter = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  marginTop: '1rem',
  borderTop: '0.5px solid color-mix(in srgb, var(--cat-color) 15%, var(--color-bg-divider))',
  paddingTop: '0.75rem',
});

export const cardProse = style({});

globalStyle(`${cardProse} p`, {
  fontSize: '0.8125rem',
  lineHeight: 1.6,
  color: 'var(--color-sub)',
  margin: 0,
  wordBreak: 'keep-all',
});
