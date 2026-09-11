import { keyframes, style } from '@vanilla-extract/css';

export const noWrapCell = style({
  whiteSpace: 'nowrap',
});

export const timeColumn = style({
  width: '140px',
});

/* Self-contained (not pathCell + modifier) so no two classes compete on maxWidth */
export const referrerCell = style({
  maxWidth: '200px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const uaCell = style({
  maxWidth: '280px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

/* Expandable session rows */

export const expandToggle = style({
  alignItems: 'center',
  background: 'none',
  border: 'none',
  color: 'var(--color-main)',
  cursor: 'pointer',
  display: 'inline-flex',
  font: 'inherit',
  fontSize: '0.85rem',
  gap: '0.35rem',
  padding: 0,
  textAlign: 'left',
  whiteSpace: 'nowrap',

  ':hover': {
    color: 'var(--color-primary)',
  },
});

export const expandChevron = style({
  display: 'inline-block',
  fontSize: '0.7rem',
  transition: 'transform 0.15s ease',
  width: '10px',
});

export const expandChevronOpen = style({
  transform: 'rotate(90deg)',
});

export const expandedRow = style({
  background: 'var(--color-code-bg)',
});

const detailReveal = keyframes({
  from: { opacity: 0, transform: 'translateY(-6px)' },
  to: { opacity: 1, transform: 'none' },
});

export const detailRow = style({
  animation: `${detailReveal} 0.22s var(--ease-standard)`,
});

export const detailCell = style({
  padding: '0 !important',
});

export const uaPreview = style({
  color: 'var(--color-sub)',
  fontSize: '0.75rem',
});

/* Link cell in sessions table */

export const linkCell = style({
  color: 'var(--color-primary)',
  fontSize: '0.82rem',
  fontWeight: 600,
  textDecoration: 'none',

  ':hover': {
    textDecoration: 'underline',
  },
});

export const mutedCell = style({
  color: 'var(--color-sub)',
  opacity: 0.5,
});
