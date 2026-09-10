import { globalStyle, style } from '@vanilla-extract/css';

export const mermaidDiagram = style({
  display: 'grid',
  gap: '0.75rem',
  margin: '24px 0 32px',
  padding: 'var(--space-sm)',
  border: '1px solid var(--color-bg-divider)',
  borderRadius: '0.875rem',
  background: 'var(--color-basic-bg)',
  overflow: 'hidden',

  '@media': {
    '(max-width: 720px)': {
      borderRadius: 'var(--radius-md)',
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
  borderRadius: 'var(--radius-full)',
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

globalStyle(`${diagramHeader} strong`, {
  '@media': {
    '(max-width: 720px)': {
      textAlign: 'left',
    },
  },
});

export const diagramFrame = style({
  border: '1px solid var(--color-bg-subdivider)',
  borderRadius: '0.625rem',
  background: 'var(--color-table-bg)',
  overflowX: 'auto',
});

export const lightDiagram = style({
  display: 'block',
  maxWidth: '100%',
  margin: '0 auto',
  height: 'auto',
  selectors: { 'html.dark &': { display: 'none' } },
});

export const darkDiagram = style({
  display: 'none',
  maxWidth: '100%',
  margin: '0 auto',
  height: 'auto',
  selectors: { 'html.dark &': { display: 'block' } },
});
