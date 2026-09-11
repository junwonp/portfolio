import { globalStyle, style } from '@vanilla-extract/css';

export const chartLegend = style({
  alignItems: 'center',
  display: 'flex',
  gap: 'var(--space-sm)',
  marginTop: 0,
});

export const legendItem = style({
  alignItems: 'center',
  display: 'flex',
  gap: '0.35rem',
});

export const views = style({});
export const sessions = style({});

export const legendColor = style({
  borderRadius: 'var(--radius-full)',
  display: 'inline-block',
  height: '4px',
  width: '14px',

  selectors: {
    [`&.${views}`]: {
      background: 'var(--color-primary)',
    },
    [`&.${sessions}`]: {
      background: 'var(--color-cat-frameworks)',
    },
  },
});

export const legendText = style({
  color: 'var(--color-sub)',
  fontSize: '0.75rem',
  fontWeight: 500,
});

export const chartActions = style({
  alignItems: 'flex-end',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-xs)',

  '@media': {
    '(max-width: 768px)': {
      alignItems: 'flex-start',
    },
  },
});

export const trafficSummaryGrid = style({
  display: 'grid',
  gap: '0.75rem',
  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  marginBottom: '1.25rem',

  '@media': {
    '(max-width: 768px)': {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
  },
});

export const summaryItem = style({
  background: 'var(--color-code-bg)',
  border: '0.5px solid var(--color-bg-divider)',
  borderRadius: 'var(--radius-sm)',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-2xs)',
  minWidth: 0,
  padding: '0.8rem',
});

globalStyle(`${summaryItem} strong`, {
  color: 'var(--color-bold)',
  fontSize: '1.25rem',
});

export const summaryLabel = style({
  color: 'var(--color-sub)',
  fontSize: '0.75rem',
  fontWeight: 500,
});

export const chartWrapper = style({
  position: 'relative',
  width: '100%',
});

export const svgChart = style({
  height: 'auto',
  overflow: 'visible',
  width: '100%',
});

export const gridLine = style({
  stroke: 'var(--color-bg-divider)',
  strokeWidth: 1,
});

export const axisLabel = style({
  fill: 'var(--color-sub)',
  fontSize: '10px',
  fontFamily: 'inherit',
  fontWeight: 500,
});

export const xAxis = style({});
export const yAxis = style({});

export const noData = style({});

export const interactiveDot = style({
  cursor: 'pointer',
  transition: 'r 0.2s var(--ease-emphasized)',

  selectors: {
    [`&.${noData}`]: {
      opacity: 0.35,
    },
  },
});

export const chartTooltip = style({
  background: 'var(--color-basic-bg)',
  border: '0.5px solid var(--color-bg-divider)',
  borderRadius: 'var(--radius-sm)',
  boxShadow: '0 4px 15px var(--color-shadow)',
  fontSize: '0.8rem',
  padding: '0.5rem 0.75rem',
  pointerEvents: 'none',
  position: 'absolute',
  transform: 'translate(-50%, -100%)',
  transition: 'all 0.1s ease',
  zIndex: 'var(--z-raised)',

  selectors: {
    'html.dark &': {
      boxShadow: '0 4px 15px var(--color-shadow)',
    },
  },
});

export const tooltipDate = style({
  fontWeight: 600,
  marginBottom: '0.25rem',
  borderBottom: '0.5px solid var(--color-bg-divider)',
  paddingBottom: '0.25rem',
});

export const muted = style({});
export const blue = style({});
export const green = style({});

export const tooltipRow = style({
  alignItems: 'center',
  display: 'flex',
  gap: '0.4rem',
  marginTop: '0.15rem',

  selectors: {
    [`&.${muted}`]: {
      color: 'var(--color-sub)',
    },
  },
});

export const dot = style({
  borderRadius: 'var(--radius-circle)',
  display: 'inline-block',
  height: '6px',
  width: '6px',

  selectors: {
    [`&.${blue}`]: {
      background: 'var(--color-primary)',
    },
    [`&.${green}`]: {
      background: 'var(--color-cat-frameworks)',
    },
  },
});
