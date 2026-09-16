import { style } from '@vanilla-extract/css';

export const warning = style({
  background: 'var(--doc-paper)',
  color: 'var(--doc-ink)',
  padding: '1rem',
  border: '2px solid currentColor',
  '@media': { print: { display: 'none' } },
});

/*
 * The preview's paper, screen only. The printed page breaks belong to the print
 * engine, so this layer gives the preview the same page units by painting one A4
 * rectangle per page behind the document. It carries no content and is dropped
 * from print entirely.
 */
export const layer = style({
  inset: 0,
  pointerEvents: 'none',
  position: 'absolute',

  '@media': {
    print: {
      display: 'none',
    },
  },
});

// The sheet's own background is transparent once this layer has sheets, so these
// rectangles are what the document appears to be printed on.
export const pageSheet = style({
  background: 'var(--doc-paper)',
  boxShadow: '0 20px 60px rgb(15 23 42 / 0.16)',
  position: 'absolute',
});
