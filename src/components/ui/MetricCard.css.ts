import { style } from '@vanilla-extract/css';

export const metricCard = style({
  background: 'color-mix(in srgb, var(--color-surface-hover) 35%, var(--color-basic-bg))',
  borderRadius: 'var(--radius-lg)',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.375rem',
  padding: '12px 16px',
  alignItems: 'flex-start',
  textAlign: 'left',
  boxShadow: 'var(--shadow-card)',
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

export const metricDesc = style({
  color: 'var(--color-sub)',
  opacity: 0.7,
  fontSize: '0.7rem',
  lineHeight: 1.3,
  margin: 0,
});
