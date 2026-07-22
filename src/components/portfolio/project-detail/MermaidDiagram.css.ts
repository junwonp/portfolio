import { globalStyle, style } from '@vanilla-extract/css';

export const mermaidDiagram = style({
  display: 'grid',
  gap: '12px',
  margin: '24px 0 32px',
  padding: 'var(--space-sm)',
  border: '1px solid var(--color-bg-divider)',
  borderRadius: '14px',
  background: 'var(--color-basic-bg)',
  overflow: 'hidden',

  '@media': {
    '(max-width: 720px)': {
      borderRadius: '12px',
      padding: 'var(--space-sm)',
    },
  },
});

export const diagramHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 'var(--space-sm)',
  padding: '2px 2px 0',

  '@media': {
    '(max-width: 720px)': {
      alignItems: 'flex-start',
      flexDirection: 'column',
    },
  },
});

globalStyle(`${diagramHeader} span`, {
  flexShrink: 0,
  border: '1px solid var(--color-bg-divider)',
  borderRadius: '999px',
  padding: '5px 10px',
  background: 'var(--color-code-bg)',
  color: 'var(--color-primary)',
  fontSize: '0.75rem',
  fontWeight: 800,
  letterSpacing: '0.02em',
});

globalStyle(`${diagramHeader} strong`, {
  color: 'var(--color-bold)',
  fontSize: '0.95rem',
  lineHeight: 1.4,
  textAlign: 'right',
});

globalStyle(`@media (max-width: 720px)`, {
  [`${diagramHeader} strong`]: {
    textAlign: 'left',
  },
});

export const diagramFrame = style({
  border: '1px solid var(--color-bg-subdivider)',
  borderRadius: '10px',
  background: 'var(--color-table-bg)',
  overflowX: 'auto',
});

export const diagramSurface = style({
  display: 'grid',
  minWidth: 0,
  padding: '4px var(--space-sm) var(--space-sm)',
  placeItems: 'center',

  '@media': {
    '(max-width: 720px)': {
      padding: '4px 10px 10px',
    },
  },
});

export const diagramLoading = style({
  margin: 0,
  color: 'var(--color-main)',
  fontFamily: 'var(--font-family-code)',
  fontSize: '0.875rem',
  lineHeight: 1.6,
  padding: 'var(--space-md)',
  textAlign: 'center',
});

export const diagramError = style({
  margin: 0,
  fontFamily: 'var(--font-family-code)',
  fontSize: '0.875rem',
  lineHeight: 1.6,
  padding: 'var(--space-sm) var(--space-sm) 0',
  color: 'var(--color-error)',
  fontWeight: 700,
});

export const diagramFallback = style({
  margin: 0,
  color: 'var(--color-main)',
  fontFamily: 'var(--font-family-code)',
  fontSize: '0.875rem',
  lineHeight: 1.6,
  padding: 'var(--space-sm)',
  whiteSpace: 'pre-wrap',
});

globalStyle(`${mermaidDiagram} svg`, {
  display: 'block',
  maxWidth: '100%',
  height: 'auto',
  fontFamily: 'var(--font-family-text), sans-serif !important',
});

globalStyle(`${mermaidDiagram} svg .node rect, ${mermaidDiagram} svg .node circle, ${mermaidDiagram} svg .node polygon, ${mermaidDiagram} svg .node path`, {
  fill: 'var(--color-basic-bg) !important',
  stroke: 'var(--color-bg-divider) !important',
  strokeWidth: '1.4px !important',
  transition: 'fill 0.2s ease, stroke 0.2s ease, filter 0.2s ease',
});

globalStyle(`${mermaidDiagram} svg .node:hover rect, ${mermaidDiagram} svg .node:hover circle, ${mermaidDiagram} svg .node:hover polygon, ${mermaidDiagram} svg .node:hover path`, {
  fill: 'var(--color-code-bg) !important',
  stroke: 'var(--color-primary) !important',
});

globalStyle(`${mermaidDiagram} svg .node .label`, {
  fontWeight: '700 !important',
  lineHeight: '1.35 !important',
  color: 'var(--color-bold) !important',
  fill: 'var(--color-bold) !important',
  overflow: 'visible !important',
  transition: 'fill 0.2s ease',
});

globalStyle(`${mermaidDiagram} svg foreignObject, ${mermaidDiagram} svg .label div, ${mermaidDiagram} svg .label span, ${mermaidDiagram} svg .nodeLabel`, {
  lineHeight: '1.35 !important',
  overflow: 'visible !important',
});

globalStyle(`${mermaidDiagram} svg .node:hover .label`, {
  fill: 'var(--color-primary) !important',
});

globalStyle(`${mermaidDiagram} svg .edgePath .path`, {
  stroke: 'var(--color-primary) !important',
  strokeWidth: '1.6px !important',
  transition: 'stroke 0.2s ease, stroke-width 0.2s ease',
});

globalStyle(`${mermaidDiagram} svg .edgePath:hover .path`, {
  stroke: 'var(--color-primary) !important',
  strokeWidth: '2px !important',
});

globalStyle(`${mermaidDiagram} svg .marker`, {
  fill: 'var(--color-primary) !important',
  stroke: 'none !important',
  transition: 'fill 0.2s ease',
});

globalStyle(`${mermaidDiagram} svg .cluster rect`, {
  fill: 'color-mix(in srgb, var(--color-basic-bg) 60%, transparent) !important',
  stroke: 'var(--color-bg-divider) !important',
  strokeWidth: '1px !important',
  strokeDasharray: '4 4 !important',
  rx: '12px !important',
  ry: '12px !important',
});
