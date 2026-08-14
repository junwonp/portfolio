import { style } from '@vanilla-extract/css';

const open = style({});

export { open };

export const collapse = style({
  height: '0',
  overflow: 'hidden',
  transition: 'height 0.35s var(--ease-standard)',

  selectors: {
    [`&.${open}`]: {
      height: 'var(--collapse-height)',
    },
  },

  '@media': {
    print: {
      selectors: {
        '&&': {
          height: 'auto',
          overflow: 'visible',
        },
      },
    },
  },
});
