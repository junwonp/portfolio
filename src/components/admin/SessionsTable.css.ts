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

export const deviceCell = style({
  maxWidth: '240px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const deviceDetail = style({
  color: 'var(--color-sub)',
  fontSize: '0.75rem',
  marginLeft: '0.35rem',
});

export const locationCell = style({
  maxWidth: '180px',
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

/* detailCell zeroes its padding, so the note carries its own */
export const detailNote = style({
  color: 'var(--color-sub)',
  fontSize: '0.75rem',
  margin: 0,
  padding: '0.75rem 1rem 0',
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
