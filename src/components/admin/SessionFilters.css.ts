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
  border: 0,
  display: 'flex',
  gap: 'var(--space-xs)',
  margin: 0,
  minWidth: 0,
  padding: 0,
});

export const filterLabel = style({
  color: 'var(--color-sub)',
  // Keeps the legend in normal flow so the fieldset lays out like the div it replaced
  float: 'left',
  fontSize: '0.78rem',
  fontWeight: 700,
  padding: 0,
  whiteSpace: 'nowrap',
});
