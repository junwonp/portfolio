import { style } from '@vanilla-extract/css';

export const metricCard = style({
  background: 'color-mix(in srgb, var(--color-surface-hover) 35%, var(--color-basic-bg))',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.375rem',
  padding: '12px 16px',
  alignItems: 'flex-start',
  textAlign: 'left',
  width: '100%',

  selectors: {
    '.dark &': {
      background: 'rgba(255, 255, 255, 0.03)',
      boxShadow: 'none',
      border: '0.5px solid rgba(255, 255, 255, 0.05)',
    },
  },
});

// The card is a column flexbox; `order` keeps the visual order (value, label,
// description) while the DOM stays valid `<dl>` order (`dt` before `dd`).
export const metricValue = style({
  color: 'var(--color-primary)',
  fontSize: '1.25rem',
  fontWeight: 700,
  lineHeight: 1.2,
  margin: 0,
  order: 0,
});

export const metricLabel = style({
  color: 'var(--color-sub)',
  fontSize: '0.78rem',
  lineHeight: 1.3,
  margin: 0,
  order: 1,
});

export const metricDesc = style({
  color: 'var(--color-sub)',
  opacity: 0.7,
  fontSize: '0.7rem',
  lineHeight: 1.3,
  margin: 0,
  order: 2,
});
