import { style } from '@vanilla-extract/css';

export const insightsGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: '1.5rem',
  position: 'relative',
  zIndex: 2,

  '@media': {
    '(max-width: 1024px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

export const insightsCard = style({
  minWidth: 0,
  padding: 'var(--space-sm)',
});

/* Keep long external domains readable inside the three-up grid */
export const labelCell = style({
  maxWidth: '180px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});
