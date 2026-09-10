import { style } from '@vanilla-extract/css';

export const skillChip = style({
  display: 'inline-flex',
  alignItems: 'center',
  color: 'var(--color-sub)',
  fontSize: '0.8125rem',
  fontWeight: 550,
  lineHeight: 1.4,
  whiteSpace: 'nowrap',
  padding: '0.15rem 0.25rem',
  fontFamily: 'inherit',

  selectors: {
    'html.dark &': {
      color: 'var(--color-bold)',
    },
  },
});
