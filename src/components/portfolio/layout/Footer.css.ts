import { style } from '@vanilla-extract/css';

export const wrapper = style({
  alignItems: 'center',
  borderTop: '1px solid var(--color-bg-divider)',
  display: 'flex',
  justifyContent: 'center',
  padding: 'var(--space-sm)',

  '@media': {
    print: {
      selectors: {
        '&&': {
          display: 'none',
        },
      },
    },
  },
});

export const link = style({
  color: 'var(--color-sub)',
  fontSize: '0.825rem',
  fontWeight: 500,
  textDecoration: 'none',
  transition: 'color 0.15s ease',

  ':hover': {
    color: 'var(--color-primary)',
    textDecoration: 'underline',
    textUnderlineOffset: '3px',
  },
});
