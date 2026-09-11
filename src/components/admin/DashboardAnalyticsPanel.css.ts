import { globalStyle, style } from '@vanilla-extract/css';

export const metricFilterCard = style({
  alignItems: 'end',
  display: 'grid',
  gap: 'var(--space-sm)',
  padding: 'var(--space-sm)',
  gridTemplateColumns: 'minmax(0, 1fr) minmax(260px, 420px)',
  position: 'relative',
  zIndex: 5,

  '@media': {
    '(max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

export const metricFilterForm = style({});

globalStyle(`${metricFilterForm} label`, {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.4rem',
});

globalStyle(`${metricFilterForm} span`, {
  color: 'var(--color-sub)',
  fontSize: '0.78rem',
  fontWeight: 700,
});
