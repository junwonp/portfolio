import { style } from '@vanilla-extract/css';

const isLink = style({});

export const projectItem = style({
  lineHeight: 'inherit',
  minWidth: 0,
  padding: 0,
  position: 'static',
  transition: 'background-color 0.2s var(--ease-standard)',

  selectors: {
    '&::before': {
      display: 'none',
    },
    [`&.${isLink}`]: {
      textDecoration: 'none',
      color: 'inherit',
      display: 'block',
    },
  },

  ':focus-visible': {
    outline: '2px solid var(--color-primary)',
    outlineOffset: '-2px',
  },
});
