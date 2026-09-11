import { style } from '@vanilla-extract/css';

export const metricsGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '1.25rem',
  position: 'relative',
  zIndex: 4,
});
