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

globalStyle(`${dashboardContainer} h3`, {
  margin: 0,
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

export const logoutBtn = style({
  background: 'transparent',
  border: '1px solid var(--color-bg-divider)',
  borderRadius: '8px',
  color: 'var(--color-sub)',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: 500,
  padding: '0.5rem 1rem',
  textDecoration: 'none',
  transition: 'all 0.2s ease',

  ':hover': {
    background: 'var(--color-surface-hover)',
    color: 'var(--color-bold)',
    borderColor: 'var(--color-bold)',
  },
});

export const glass = style({
  background: 'var(--glass-bg)',
  backdropFilter: 'var(--glass-blur)',
  border: 'var(--glass-border)',
  borderRadius: '8px',
  padding: 'var(--space-sm)',
  boxShadow: '0 4px 12px var(--color-shadow)',
  transition: 'box-shadow 0.2s ease',

  selectors: {
    'html.dark &': {
      boxShadow: '0 4px 12px var(--color-shadow)',
    },
  },
});

export const metricsGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '1.25rem',
  position: 'relative',
  zIndex: 4,
});

export const sectionSubtitle = style({
  color: 'var(--color-sub)',
  opacity: 0.8,
  fontSize: '0.85rem',
  margin: '0.25rem 0 1.5rem 0',
});

export const metricFilterCard = style({
  alignItems: 'end',
  display: 'grid',
  gap: 'var(--space-sm)',
  gridTemplateColumns: 'minmax(0, 1fr) minmax(260px, 420px)',
  position: 'relative',
  zIndex: 5,

  '@media': {
    '(max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

globalStyle(`${metricFilterCard} .${sectionSubtitle}`, {
  marginBottom: 0,
});

export const dashboardViewSwitcher = style({
  alignItems: 'center',
  borderRadius: '999px',
  display: 'flex',
  gap: 'var(--space-sm)',
  justifyContent: 'space-between',
  padding: '0.45rem',
  position: 'sticky',
  top: 'var(--space-xs)',
  zIndex: 30,

  '@media': {
    '(max-width: 768px)': {
      alignItems: 'stretch',
      borderRadius: '8px',
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
  borderRadius: '999px',
  display: 'grid',
  flex: '0 0 auto',
  gap: '0.25rem',
  gridTemplateColumns: 'repeat(2, minmax(92px, 1fr))',
  padding: '0.25rem',

  '@media': {
    '(max-width: 768px)': {
      width: '100%',
    },
  },
});

export const active = style({});

globalStyle(`${segmentedControl} button`, {
  background: 'transparent',
  border: 0,
  borderRadius: '999px',
  color: 'var(--color-sub)',
  cursor: 'pointer',
  font: 'inherit',
  fontSize: '0.82rem',
  fontWeight: 700,
  minHeight: '38px',
  padding: '0 0.85rem',
  transition: 'background 0.2s ease, color 0.2s ease, transform 0.1s ease',
});

globalStyle(`${segmentedControl} button:hover:not(.active)`, {
  background: 'var(--color-surface-hover)',
  color: 'var(--color-bold)',
});

globalStyle(`${segmentedControl} button:focus-visible`, {
  outline: '2px solid color-mix(in srgb, var(--color-primary) 22%, transparent)',
  outlineOffset: '2px',
});

globalStyle(`${segmentedControl} button:active`, {
  transform: 'scale(0.97)',
});

globalStyle(`${segmentedControl} button.active`, {
  background: 'var(--color-primary)',
  color: 'var(--color-basic-bg)',
});

export const dashboardPanel = style({
  animation: `${panelEnter} 0.24s cubic-bezier(0.16, 1, 0.3, 1)`,
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-md)',
  minWidth: 0,
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

export const applicationLinkCard = style({
  display: 'block',
  position: 'relative',
  zIndex: 1,

  selectors: {
    '&:first-of-type': {
      zIndex: 2,
    },
  },
});

export const applicationLinkPanel = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
});

export const applicationForm = style({
  display: 'grid',
  gap: '1rem',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',

  '@media': {
    '(max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

export const success = style({});
export const error = style({});

export const formResult = style({
  borderRadius: '8px',
  fontSize: '0.875rem',
  fontWeight: 600,
  gridColumn: '1 / -1',
  padding: '0.75rem 0.9rem',

  selectors: {
    [`&.${success}`]: {
      background: 'color-mix(in srgb, var(--color-primary) 12%, transparent)',
      border: '0.5px solid color-mix(in srgb, var(--color-primary) 35%, transparent)',
      color: 'var(--color-primary)',
    },
    [`&.${error}`]: {
      background: 'color-mix(in srgb, var(--color-error) 12%, transparent)',
      border: '0.5px solid color-mix(in srgb, var(--color-error) 35%, transparent)',
      color: 'var(--color-error)',
    },
  },
});

export const projectOrderField = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.4rem',
  gridColumn: '1 / -1',
});

globalStyle(`${applicationForm} label`, {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.4rem',
});

globalStyle(`${applicationForm} span, ${projectOrderField} > span`, {
  color: 'var(--color-sub)',
  fontSize: '0.78rem',
  fontWeight: 700,
});

export const fieldHelp = style({
  color: 'var(--color-sub)',
  fontSize: '0.78rem',
  lineHeight: 1.5,
  margin: '-0.1rem 0 0',
});

globalStyle(`${applicationForm} input`, {
  background: 'var(--color-code-bg)',
  border: '0.5px solid var(--color-bg-divider)',
  borderRadius: '8px',
  color: 'var(--color-main)',
  font: 'inherit',
  minWidth: 0,
  padding: '0.65rem 0.75rem',
});

globalStyle(`${applicationForm} input:focus`, {
  borderColor: 'var(--color-primary)',
  outline: '2px solid color-mix(in srgb, var(--color-primary) 18%, transparent)',
});

export const projectOrderGrid = style({
  display: 'grid',
  gap: '0.75rem',
  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',

  '@media': {
    '(max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

export const primaryBtn = style({
  alignSelf: 'end',
  background: 'var(--color-primary)',
  border: 'none',
  borderRadius: '8px',
  color: 'var(--color-basic-bg)',
  cursor: 'pointer',
  font: 'inherit',
  fontWeight: 700,
  minHeight: '42px',
  padding: '0.65rem 1rem',

  ':hover': {
    filter: 'brightness(0.96)',
  },
});

export const applicationTable = style({
  marginTop: '-0.25rem',
});

export const dangerBtn = style({
  background: 'transparent',
  border: '0.5px solid color-mix(in srgb, var(--color-error) 35%, var(--color-bg-divider))',
  borderRadius: '8px',
  color: 'var(--color-error)',
  cursor: 'pointer',
  font: 'inherit',
  fontSize: '0.78rem',
  fontWeight: 700,
  minHeight: '34px',
  padding: '0.35rem 0.65rem',
  transition: 'background 0.2s ease, border-color 0.2s ease',

  ':hover': {
    background: 'color-mix(in srgb, var(--color-error) 10%, transparent)',
    borderColor: 'var(--color-error)',
  },
});

export const printBtn = style({
  background: 'transparent',
  border: '0.5px solid color-mix(in srgb, var(--color-primary) 35%, var(--color-bg-divider))',
  borderRadius: '8px',
  color: 'var(--color-primary)',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  font: 'inherit',
  fontSize: '0.78rem',
  fontWeight: 700,
  minHeight: '34px',
  padding: '0.35rem 0.65rem',
  textDecoration: 'none',
  transition: 'background 0.2s ease, border-color 0.2s ease',

  ':hover': {
    background: 'color-mix(in srgb, var(--color-primary) 10%, transparent)',
    borderColor: 'var(--color-primary)',
  },
});

export const linkConfigList = style({
  display: 'grid',
  gap: '0.45rem',
  margin: 0,
  minWidth: '260px',
});

globalStyle(`${linkConfigList} > div`, {
  alignItems: 'start',
  display: 'grid',
  gap: '0.75rem',
  gridTemplateColumns: '4rem minmax(0, 1fr)',
});

globalStyle(`${linkConfigList} dt`, {
  color: 'var(--color-sub)',
  fontSize: '0.72rem',
  fontWeight: 700,
  letterSpacing: '0.02em',
});

globalStyle(`${linkConfigList} dd`, {
  color: 'var(--color-main)',
  fontSize: '0.82rem',
  fontWeight: 600,
  margin: 0,
  minWidth: 0,
});

export const projectOrderList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.2rem',
  listStyle: 'none',
  margin: 0,
  padding: 0,
});

export const mutedText = style({
  color: 'var(--color-sub)',
  fontSize: '0.78rem',
  marginTop: '0.2rem',
});

export const emptyTableCell = style({
  color: 'var(--color-sub)',
  padding: '2rem 1rem',
  textAlign: 'center',
});

export const metricCard = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
});

export const cardLabel = style({
  color: 'var(--color-sub)',
  fontSize: '0.875rem',
  fontWeight: 500,
  marginBottom: '0.5rem',
});

export const cardValue = style({
  fontSize: '2rem',
  fontWeight: 700,
  marginBottom: '0.25rem',
  color: 'var(--color-bold)',
});

export const cardDesc = style({
  color: 'var(--color-sub)',
  opacity: 0.8,
  fontSize: '0.75rem',
});

export const sectionHeadingRow = style({
  alignItems: 'flex-start',
  display: 'flex',
  gap: '1rem',
  justifyContent: 'space-between',

  '@media': {
    '(max-width: 768px)': {
      alignItems: 'stretch',
      flexDirection: 'column',
    },
  },
});

export const chartSection = style({
  position: 'relative',
  zIndex: 3,
});

globalStyle(`${chartSection} .${sectionHeadingRow}`, {
  marginBottom: '1.25rem',
});

globalStyle(`${chartSection} .${sectionSubtitle}`, {
  marginBottom: '0.5rem',
});

export const chartLegend = style({
  alignItems: 'center',
  display: 'flex',
  gap: '1rem',
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
  borderRadius: '999px',
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

export const rangeBadge = style({
  border: '0.5px solid var(--color-bg-divider)',
  borderRadius: '999px',
  color: 'var(--color-sub)',
  flex: '0 0 auto',
  fontSize: '0.8rem',
  fontWeight: 600,
  padding: '0.35rem 0.75rem',
});

export const chartActions = style({
  alignItems: 'flex-end',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',

  '@media': {
    '(max-width: 768px)': {
      alignItems: 'flex-start',
    },
  },
});

export const rangeTabs = style({
  background: 'var(--color-code-bg)',
  border: '0.5px solid var(--color-bg-divider)',
  borderRadius: '999px',
  display: 'inline-flex',
  gap: '0.25rem',
  padding: '0.25rem',
});

globalStyle(`${rangeTabs} a`, {
  borderRadius: '999px',
  color: 'var(--color-sub)',
  fontSize: '0.8rem',
  fontWeight: 600,
  lineHeight: 1,
  padding: '0.45rem 0.75rem',
  textDecoration: 'none',
  transition: 'background 0.2s ease, color 0.2s ease',
  whiteSpace: 'nowrap',
});

globalStyle(`${rangeTabs} a.active`, {
  background: 'var(--color-primary)',
  color: 'var(--color-basic-bg)',
});

globalStyle(`${rangeTabs} a:hover:not(.active)`, {
  background: 'var(--color-surface-hover)',
  color: 'var(--color-bold)',
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
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
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
  transition: 'r 0.2s cubic-bezier(0.16, 1, 0.3, 1)',

  selectors: {
    [`&.${noData}`]: {
      opacity: 0.35,
    },
  },
});

export const chartTooltip = style({
  background: 'var(--color-basic-bg)',
  border: '0.5px solid var(--color-bg-divider)',
  borderRadius: '8px',
  boxShadow: '0 4px 15px var(--color-shadow)',
  fontSize: '0.8rem',
  padding: '0.5rem 0.75rem',
  pointerEvents: 'none',
  position: 'absolute',
  transform: 'translate(-50%, -100%)',
  transition: 'all 0.1s ease',
  zIndex: 10,

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
  borderRadius: '50%',
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


export const detailsGrid = style({
  display: 'grid',
  gridTemplateColumns: '1.5fr 1fr',
  gap: '1.5rem',
  position: 'relative',
  zIndex: 2,

  '@media': {
    '(max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

export const detailsCard = style({
  minWidth: 0,
});

export const tableCard = style({
  display: 'flex',
  flexDirection: 'column',
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

export const pathCell = style({
  maxWidth: '250px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const num = style({
  textAlign: 'right',
});

export const actionCell = style({
  textAlign: 'right',
  whiteSpace: 'nowrap',
});

export const flexCard = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: '1.5rem',
});

export const subSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
});

export const spacerTop = style({
  borderTop: '0.5px solid var(--color-bg-divider)',
  marginTop: 0,
  paddingTop: '1.5rem',
});

export const progressList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.85rem',
  listStyle: 'none',
  margin: 0,
  padding: 0,
});

export const listLabel = style({
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '0.85rem',
  marginBottom: '0.25rem',
});

export const labelText = style({
  maxWidth: '200px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  color: 'var(--color-main)',
});

export const labelVal = style({
  color: 'var(--color-sub)',
});

export const progressBar = style({
  background: 'var(--color-bg-subdivider)',
  borderRadius: '4px',
  height: '6px',
  overflow: 'hidden',
  width: '100%',
});

export const progressFill = style({
  borderRadius: '4px',
  height: '100%',
  transition: 'width 0.3s ease',

  selectors: {
    [`&.${blue}`]: {
      background: 'var(--color-cat-frameworks)',
    },
    [`&.${green}`]: {
      background: 'var(--color-primary)',
    },
  },
});

export const emptyState = style({
  color: 'var(--color-sub)',
  opacity: 0.8,
  fontSize: '0.9rem',
  padding: '2rem 0',
  textAlign: 'center',
});

export const alertBox = style({
  selectors: {
    [`&.${error}`]: {
      background: 'color-mix(in srgb, var(--color-error) 12%, transparent)',
      border: '1px solid color-mix(in srgb, var(--color-error) 35%, transparent)',
      borderRadius: '8px',
      color: 'var(--color-error)',
      fontSize: '0.9rem',
      padding: '1rem',
      textAlign: 'center',
    },
  },
});

export const ipBadge = style({
  background: 'var(--color-code-bg)',
  border: '0.5px solid var(--color-bg-divider)',
  borderRadius: '4px',
  color: 'var(--color-primary)',
  fontFamily: 'var(--font-family-code), monospace',
  fontSize: '0.8rem',
  padding: '0.2rem 0.4rem',
});
