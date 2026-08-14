import { globalStyle, style } from '@vanilla-extract/css';

export const dayPlannerEvidence = style({
  display: 'grid',
  gap: 'var(--space-sm)',
  margin: '0 0 var(--space-md)',
});

export const sectionHeading = style({});

globalStyle(`${sectionHeading} p`, {
  margin: 0,
  color: 'var(--color-sub)',
  fontSize: '0.9rem',
  lineHeight: 1.6,
});

export const surfaceMap = style({
  border: '1px solid var(--color-bg-divider)',
  borderRadius: '1.125rem',
  boxShadow: '0 12px 30px color-mix(in srgb, var(--color-shadow) 70%, transparent)',
  padding: 'var(--space-sm)',
  background:
    'radial-gradient(circle at top left, color-mix(in srgb, var(--color-primary) 14%, transparent), transparent 42%), var(--color-basic-bg)',

  '@media': {
    '(max-width: 440px)': {
      borderRadius: '0.875rem',
    },
  },
});

globalStyle(`${surfaceMap} h3`, {
  margin: '0 0 var(--space-sm)',
  color: 'var(--color-bold)',
  fontSize: '1rem',
});

export const surfaceList = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
  gap: '0.625rem',
  margin: 0,
  padding: 0,
  listStyle: 'none',

  '@media': {
    '(max-width: 860px)': {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
    '(max-width: 440px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

globalStyle(`${surfaceList} li`, {
  display: 'grid',
  alignContent: 'start',
  gap: 'var(--space-xs)',
  minHeight: '170px',
  padding: '14px',
  border: '1px solid var(--color-bg-subdivider)',
  borderRadius: '0.875rem',
  background: 'color-mix(in srgb, var(--color-basic-bg) 88%, var(--color-primary) 12%)',
});

globalStyle(`${surfaceList} span`, {
  color: 'var(--color-primary)',
  fontSize: '0.75rem',
  fontWeight: 800,
  letterSpacing: '0.08em',
});

globalStyle(`${surfaceList} strong`, {
  color: 'var(--color-bold)',
  fontSize: '0.92rem',
  lineHeight: 1.25,
});

globalStyle(`${surfaceList} p`, {
  margin: 0,
  color: 'var(--color-main)',
  fontSize: '0.8rem',
  lineHeight: 1.5,
});

export const verificationCard = style({
  border: '1px solid var(--color-bg-divider)',
  borderRadius: '1.125rem',
  background: 'var(--color-basic-bg)',
  boxShadow: '0 12px 30px color-mix(in srgb, var(--color-shadow) 70%, transparent)',
  padding: 'var(--space-sm)',

  '@media': {
    '(max-width: 440px)': {
      borderRadius: '0.875rem',
    },
  },
});

globalStyle(`${verificationCard} h3`, {
  margin: '0 0 var(--space-sm)',
  color: 'var(--color-bold)',
  fontSize: '1rem',
});

globalStyle(`${verificationCard} dl`, {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: '0.625rem',
  margin: 0,
});

globalStyle(`${verificationCard} div`, {
  display: 'grid',
  gap: '0.375rem',
  padding: '14px',
  borderRadius: '0.875rem',
  background: 'color-mix(in srgb, var(--color-code-bg) 74%, transparent)',
});

globalStyle(`${verificationCard} dt`, {
  color: 'var(--color-sub)',
  fontSize: '0.78rem',
  fontWeight: 700,
});

globalStyle(`${verificationCard} dd`, {
  display: 'grid',
  gap: '0.375rem',
  margin: 0,
});

globalStyle(`${verificationCard} strong`, {
  color: 'var(--color-primary)',
  fontSize: '1.35rem',
  lineHeight: 1.1,
});

globalStyle(`${verificationCard} span`, {
  color: 'var(--color-main)',
  fontSize: '0.8rem',
  lineHeight: 1.5,
});

globalStyle(`@media (max-width: 860px)`, {
  [`${verificationCard} dl`]: {
    gridTemplateColumns: '1fr',
  },
});
