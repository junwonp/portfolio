import { style } from '@vanilla-extract/css';

export const collapse = style({
  display: 'grid',
  gridTemplateRows: '0fr',
  transition: 'grid-template-rows 0.35s var(--ease-standard)',
  '@media': {
    print: {
      // Printed resumes include details even when their on-screen sections are closed.
      selectors: {
        '&&': { gridTemplateRows: 'auto' },
      },
    },
  },
});

export const open = style({
  gridTemplateRows: '1fr',
});

export const collapseInner = style({
  overflow: 'hidden',
  minHeight: 0,
});
