import { style } from '@vanilla-extract/css';

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
  padding: 'var(--space-sm)',
});

export const tableCard = style({
  display: 'flex',
  flexDirection: 'column',
});

export const pathCell = style({
  maxWidth: '250px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

/* Progress-bar metric columns (평균 스크롤 / 본문 진행) need room for the mini bars */
export const progressHeaderCell = style({
  minWidth: '100px',
});

export const flexCard = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: '1.5rem',
});

// No gap: SectionHeading's built-in bottom margin supplies the heading→content
// spacing (previously this gap) so switching to SectionHeading doesn't double it.
export const subSection = style({
  display: 'flex',
  flexDirection: 'column',
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

export const mutedText = style({
  color: 'var(--color-sub)',
  fontSize: '0.78rem',
  marginTop: '0.2rem',
});

/* Mini progress bars for table cells */

export const miniProgressCell = style({
  alignItems: 'center',
  display: 'inline-flex',
  gap: '0.4rem',
  minWidth: '80px',
});

export const miniProgressBar = style({
  background: 'var(--color-bg-subdivider)',
  borderRadius: '3px',
  flex: 1,
  height: '6px',
  maxWidth: '60px',
  overflow: 'hidden',
});

export const miniProgressFill = style({
  borderRadius: '3px',
  height: '100%',
  transition: 'width 0.3s ease',
});

export const scrollBar = style({
  background: 'var(--color-primary)',
});

export const readBar = style({
  background: 'var(--color-cat-frameworks)',
});

export const miniProgressVal = style({
  color: 'var(--color-sub)',
  fontSize: '0.8rem',
  fontVariantNumeric: 'tabular-nums',
  fontWeight: 500,
  minWidth: '2.5rem',
  textAlign: 'right',
});
