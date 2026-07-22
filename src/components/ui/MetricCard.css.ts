import { style } from '@vanilla-extract/css';

export const metricCard = style({
  background: 'color-mix(in srgb, var(--color-surface-hover) 35%, var(--color-basic-bg))',
  borderRadius: '12px',
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  padding: '12px 16px',
  alignItems: 'flex-start',
  textAlign: 'left',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)',
  width: '100%',

  selectors: {
    '.dark &': {
      background: 'rgba(255, 255, 255, 0.03)',
      boxShadow: 'none',
      border: '0.5px solid rgba(255, 255, 255, 0.05)',
    },
  },
});

export const metricValue = style({
  color: 'var(--color-primary)',
  fontSize: '1.25rem',
  fontWeight: 700,
  lineHeight: 1.2,
  margin: 0,
});

export const metricLabel = style({
  color: 'var(--color-sub)',
  fontSize: '0.78rem',
  lineHeight: 1.3,
  margin: 0,
});
