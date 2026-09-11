import { style } from '@vanilla-extract/css';

export const skillGroup = style({
  display: 'inline-flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '0.35rem',
  listStyle: 'none',
  margin: 0,
  padding: 0,
});

export const skillItem = style({
  display: 'flex',
  lineHeight: 'inherit',
  padding: 0,
  position: 'static',

  selectors: {
    '&::before': {
      display: 'none',
    },
  },
});

export const lastChipWrapper = style({
  display: 'inline-flex',
  alignItems: 'center',
  whiteSpace: 'nowrap',
  lineHeight: 'inherit',
  padding: 0,
  position: 'static',

  selectors: {
    '&::before': {
      display: 'none',
    },
  },
});

export const divider = style({
  display: 'inline-flex',
  alignItems: 'center',
  color: 'var(--color-sub)',
  opacity: 0.35,
  fontSize: '0.75rem',
  fontWeight: 400,
  lineHeight: 1,
  userSelect: 'none',
  marginLeft: '0.35rem',

  selectors: {
    'html.dark &': {
      color: 'var(--color-bold)',
      opacity: 0.3,
    },
  },
});
