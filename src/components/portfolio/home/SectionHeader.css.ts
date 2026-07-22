import { globalStyle, style } from '@vanilla-extract/css';

export const sectionHeader = style({
  marginTop: 0,
  marginBottom: 'var(--space-sm)',

  '@media': {
    '(max-width: 960px)': {
      marginTop: 0,
    },
  },
});

globalStyle(`${sectionHeader} h2`, {
  fontSize: 'var(--font-h2)',
  fontWeight: 800,
  color: 'var(--color-bold)',
  letterSpacing: '-0.02em',
  margin: 0,
});
