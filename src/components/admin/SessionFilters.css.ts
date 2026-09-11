import { style } from '@vanilla-extract/css';

/* Session filters */

export const sessionFilters = style({
  alignItems: 'center',
  display: 'flex',
  flexWrap: 'wrap',
  gap: 'var(--space-sm)',
  marginBottom: '1rem',
});

export const filterGroup = style({
  alignItems: 'center',
  display: 'flex',
  gap: 'var(--space-xs)',
});

export const filterLabel = style({
  color: 'var(--color-sub)',
  fontSize: '0.78rem',
  fontWeight: 700,
  whiteSpace: 'nowrap',
});
