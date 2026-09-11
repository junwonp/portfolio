import { globalStyle, style } from '@vanilla-extract/css';

export const projectTechStack = style({
  margin: '2rem 0 3rem',

  '@media': {
    '(max-width: 640px)': {
      margin: '1.5rem 0 2.5rem',
    },
  },
});

export const techCategoryGrid = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const techCategory = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.625rem',
  padding: 0,
  lineHeight: 'inherit',
});

export const categoryTitle = style({
  margin: 0,
  fontFamily: 'inherit',
  fontSize: '13px',
  fontWeight: 700,
  letterSpacing: '0.05em',
  lineHeight: 'inherit',
  textTransform: 'uppercase',
  color: 'var(--color-bold)',
  opacity: 0.8,
});

export const techGrid = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.375rem',
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

// Suppress the global prose list bullet and li padding for the chip rows.
globalStyle(`${techCategory}::before`, {
  content: 'none',
});

globalStyle(`${techGrid} > li`, {
  padding: 0,
  lineHeight: 'inherit',
});

globalStyle(`${techGrid} > li::before`, {
  content: 'none',
});

export const visuallyHidden = style({
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clipPath: 'inset(50%)',
  whiteSpace: 'nowrap',
  border: 0,
});
