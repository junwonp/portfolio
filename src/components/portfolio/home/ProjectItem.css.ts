import { style } from '@vanilla-extract/css';

export const isLink = style({});

export const projectItem = style({
  minWidth: 0,
  transition: 'background-color 0.2s var(--ease-standard)',

  selectors: {
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
