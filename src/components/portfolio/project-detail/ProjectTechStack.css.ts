import { style } from '@vanilla-extract/css';

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
});

export const techCategory = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.625rem',
});

export const categoryTitle = style({
  fontSize: '13px',
  fontWeight: 700,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  color: 'var(--color-bold)',
  opacity: 0.8,
});

export const techGrid = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.375rem',
});
