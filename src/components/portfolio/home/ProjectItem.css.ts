import { style } from '@vanilla-extract/css';

export const projectItem = style({
  minWidth: 0,
  transition: 'background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1)',

  selectors: {
    '&.is-link': {
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

export const isLink = style({});
