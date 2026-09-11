import { globalStyle, style } from '@vanilla-extract/css';

/* Session timeline */

export const timeline = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.15rem',
  listStyle: 'none',
  margin: 0,
  padding: '0.75rem 1rem 0.75rem 2rem',
  position: 'relative',

  ':before': {
    content: '""',
    position: 'absolute',
    left: '1.2rem',
    top: '0.75rem',
    bottom: '0.75rem',
    width: '1px',
    background: 'var(--color-bg-divider)',
  },
});

export const timelineItem = style({
  display: 'flex',
  gap: '0.6rem',
  lineHeight: 'inherit',
  padding: '0.35rem 0',
  position: 'relative',
});

export const timelineTotalItem = style({
  lineHeight: 'inherit',
  padding: 0,
});

export const timelineDot = style({
  background: 'var(--color-primary)',
  border: '2px solid var(--color-basic-bg)',
  borderRadius: 'var(--radius-circle)',
  flexShrink: 0,
  height: '8px',
  left: '-1.3rem',
  marginTop: '0.35rem',
  position: 'relative',
  width: '8px',
  zIndex: 'var(--z-base)',
});

export const timelineDotSmall = style({
  background: 'var(--color-sub)',
  borderRadius: 'var(--radius-circle)',
  flexShrink: 0,
  height: '5px',
  marginTop: '0.35rem',
  width: '5px',
});

export const timelineContent = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.2rem',
  minWidth: 0,
});

export const timelineRow = style({
  alignItems: 'baseline',
  display: 'flex',
  flexWrap: 'wrap',
  gap: 'var(--space-xs)',
});

export const timelinePath = style({
  color: 'var(--color-bold)',
  fontSize: '0.85rem',
  fontWeight: 600,
});

export const timelinePathPrefix = style({
  color: 'var(--color-sub)',
  fontWeight: 400,
  opacity: 0.7,
});

export const timelineDwell = style({
  color: 'var(--color-sub)',
  fontSize: '0.75rem',
  fontWeight: 500,
  whiteSpace: 'nowrap',
});

export const timelineBars = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.2rem',
  marginTop: '0.15rem',
});

export const timelineBarRow = style({
  alignItems: 'center',
  display: 'flex',
  gap: '0.4rem',
});

// width:100% is load-bearing: without it the flex item collapses and the track renders zero-width
export const timelineBar = style({
  maxWidth: '120px',
  width: '100%',
});

export const timelineBarLabel = style({
  color: 'var(--color-sub)',
  fontSize: '0.68rem',
  fontWeight: 600,
  minWidth: '2.4rem',
});

export const timelineBarVal = style({
  color: 'var(--color-sub)',
  fontSize: '0.72rem',
  fontVariantNumeric: 'tabular-nums',
  fontWeight: 600,
  minWidth: '2.2rem',
});

export const timelineSection = style({
  color: 'var(--color-sub)',
  fontSize: '0.7rem',
  fontStyle: 'italic',
  marginTop: '0.1rem',
});

export const timelineActive = style({
  color: 'var(--color-sub)',
  fontSize: '0.7rem',
  marginTop: '0.1rem',
});

export const timelineInteractionLabel = style({
  color: 'var(--color-main)',
  fontSize: '0.78rem',
  maxWidth: '300px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const timelineNavArrow = style({
  alignItems: 'center',
  display: 'flex',
  gap: '0.3rem',
  marginBottom: '0.1rem',
});

export const timelineNavFrom = style({
  color: 'var(--color-sub)',
  fontSize: '0.7rem',
  fontWeight: 500,
  maxWidth: '180px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const timelineNavSymbol = style({
  color: 'var(--color-primary)',
  fontSize: '0.75rem',
  fontWeight: 700,
});

export const timelineTotal = style({
  borderTop: '0.5px solid var(--color-bg-divider)',
  color: 'var(--color-sub)',
  fontSize: '0.78rem',
  fontWeight: 600,
  lineHeight: 'inherit',
  margin: '0.6rem 0 0',
  paddingTop: '0.6rem',
  paddingLeft: '1.3rem',
});

/* Interaction events panel */

export const interactionGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-xs)',
});

globalStyle(`${interactionGroup} ul`, {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.35rem',
  listStyle: 'none',
  margin: 0,
  padding: 0,
});

export const interactionLabel = style({
  color: 'var(--color-bold)',
  fontSize: '0.85rem',
  fontWeight: 600,
  marginRight: 'auto',
  maxWidth: '300px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const interactionAction = style({
  borderRadius: 'var(--radius-full)',
  fontSize: '0.72rem',
  fontWeight: 700,
  padding: '0.15rem 0.55rem',
  whiteSpace: 'nowrap',
});

export const actionOpen = style({
  background: 'color-mix(in srgb, var(--color-primary) 12%, transparent)',
  color: 'var(--color-primary)',
});

export const actionClose = style({
  background: 'color-mix(in srgb, var(--color-sub) 10%, transparent)',
  color: 'var(--color-sub)',
});
