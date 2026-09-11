import { globalStyle, keyframes, style } from '@vanilla-extract/css';

const panelEnter = keyframes({
  from: {
    opacity: 0,
    transform: 'translateY(6px)',
  },
  to: {
    opacity: 1,
    transform: 'translateY(0)',
  },
});

export const dashboardPanel = style({
  animation: `${panelEnter} 0.3s var(--ease-emphasized)`,
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-md)',
  minWidth: 0,
});

export const tableScroll = style({
  overflowX: 'auto',
  width: '100%',
});

globalStyle(`${tableScroll} table`, {
  borderCollapse: 'collapse',
  fontSize: '0.9rem',
  width: '100%',
});

globalStyle(`${tableScroll} th, ${tableScroll} td`, {
  padding: '0.75rem 1rem',
  textAlign: 'left',
});

globalStyle(`${tableScroll} th`, {
  borderBottom: '1.5px solid var(--color-bg-divider)',
  color: 'var(--color-sub)',
  fontWeight: 600,
});

globalStyle(`${tableScroll} td`, {
  borderBottom: '0.5px solid var(--color-bg-subdivider)',
});

export const num = style({
  textAlign: 'right',
});

export const rangeBadge = style({
  border: '0.5px solid var(--color-bg-divider)',
  borderRadius: 'var(--radius-full)',
  color: 'var(--color-sub)',
  flex: '0 0 auto',
  fontSize: '0.8rem',
  fontWeight: 600,
  padding: '0.35rem 0.75rem',
});

export const spacerTop = style({
  borderTop: '0.5px solid var(--color-bg-divider)',
  marginTop: 0,
  paddingTop: '1.5rem',
});

export const chartSection = style({
  padding: 'var(--space-sm)',
  position: 'relative',
  zIndex: 3,
});
