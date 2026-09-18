import { globalStyle, style } from '@vanilla-extract/css';

/* Link card header */

export const linkCardBadge = style({
  background: 'color-mix(in srgb, var(--color-sub) 10%, transparent)',
  border: '0.5px solid var(--color-bg-divider)',
  borderRadius: 'var(--radius-full)',
  color: 'var(--color-sub)',
  fontSize: '0.7rem',
  fontWeight: 600,
  padding: '0.15rem 0.55rem',
  whiteSpace: 'nowrap',
});

export const linkSlugCell = style({
  fontWeight: 600,
  color: 'var(--color-primary)',
});

export const linkCompanyCell = style({
  fontWeight: 600,
  color: 'var(--color-bold)',
});

export const linkDateCell = style({
  color: 'var(--color-sub)',
  fontSize: '0.8rem',
  whiteSpace: 'nowrap',
});

export const linkProjectCell = style({
  fontSize: '0.78rem',
  color: 'var(--color-sub)',
  maxWidth: '280px',
  lineHeight: 1.45,
  wordBreak: 'keep-all',

  '@media': {
    '(max-width: 768px)': {
      maxWidth: '180px',
      fontSize: '0.73rem',
    },
  },
});

export const linkProjectList = style({
  listStyle: 'none',
  margin: 0,
  padding: 0,
});

globalStyle(`${linkProjectList} li`, {
  lineHeight: 'inherit',
  padding: 0,
});

globalStyle(`${linkProjectList} li::before`, {
  content: 'none',
});

export const actionCell = style({
  textAlign: 'right',
  whiteSpace: 'nowrap',
});

const linkConfigList = style({
  display: 'grid',
  gap: '0.45rem',
  listStyle: 'none',
  margin: 0,
  minWidth: '260px',
  padding: 0,
});

globalStyle(`${linkConfigList} > li`, {
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
