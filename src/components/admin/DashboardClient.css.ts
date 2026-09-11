import { globalStyle, style } from '@vanilla-extract/css';

export const dashboardContainer = style({
  display: 'flex',
  flexDirection: 'column',
  fontFamily: 'var(--font-family-text), sans-serif',
  gap: 'var(--space-md)',
  margin: 'var(--space-sm) auto',
  width: '100%',
});

globalStyle(`${dashboardContainer} h1`, {
  margin: 0,
});

globalStyle(`${dashboardContainer} h2`, {
  margin: 0,
});

// Section headings are level 2 for the outline but keep the previous level-3
// scale so the dashboard's visual density does not shift.
globalStyle(`${dashboardContainer} div h2`, {
  fontSize: 'var(--font-h3)',
  fontWeight: 700,
  letterSpacing: 'normal',
});

export const dashboardHeader = style({
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'space-between',
  borderBottom: '0.5px solid var(--color-bg-divider)',
  paddingBottom: 'var(--space-sm)',
});

export const subtitle = style({
  color: 'var(--color-sub)',
  fontSize: '0.9375rem',
  margin: '0.25rem 0 0 0',
});

export const dashboardViewSwitcher = style({
  alignItems: 'center',
  background: 'var(--glass-bg)',
  backdropFilter: 'var(--glass-blur)',
  border: 'var(--glass-border)',
  borderRadius: 'var(--radius-full)',
  boxShadow: 'var(--shadow-glass)',
  display: 'flex',
  gap: 'var(--space-sm)',
  justifyContent: 'space-between',
  padding: '0.45rem',
  position: 'sticky',
  top: 'var(--space-xs)',
  zIndex: 'var(--z-docked)',

  '@media': {
    '(max-width: 768px)': {
      alignItems: 'stretch',
      borderRadius: 'var(--radius-sm)',
      flexDirection: 'column',
    },
  },
});

export const switcherCopy = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.1rem',
  minWidth: 0,
  paddingLeft: '0.8rem',

  '@media': {
    '(max-width: 768px)': {
      paddingLeft: '0.35rem',
    },
  },
});

globalStyle(`${switcherCopy} span`, {
  color: 'var(--color-sub)',
  fontSize: '0.72rem',
  fontWeight: 700,
});

globalStyle(`${switcherCopy} strong`, {
  color: 'var(--color-bold)',
  fontSize: '0.95rem',
});

export const segmentedControl = style({
  background: 'var(--color-code-bg)',
  border: '0.5px solid var(--color-bg-divider)',
  borderRadius: 'var(--radius-full)',
  display: 'grid',
  flex: '0 0 auto',
  gap: 'var(--space-2xs)',
  gridTemplateColumns: 'repeat(2, minmax(92px, 1fr))',
  padding: '0.25rem',

  '@media': {
    '(max-width: 768px)': {
      width: '100%',
    },
  },
});
