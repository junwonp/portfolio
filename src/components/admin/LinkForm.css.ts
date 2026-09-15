import { globalStyle, style } from '@vanilla-extract/css';

export const applicationForm = style({
  display: 'grid',
  gap: 'var(--space-sm)',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',

  '@media': {
    '(max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

export const error = style({});

export const projectOrderField = style({
  border: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.4rem',
  gridColumn: '1 / -1',
  margin: 0,
  minWidth: 0,
  padding: 0,
});

globalStyle(`${applicationForm} label`, {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.4rem',
});

globalStyle(`${applicationForm} span, ${projectOrderField} > legend`, {
  color: 'var(--color-sub)',
  fontSize: '0.78rem',
  fontWeight: 700,
});

// Keeps the legend in normal flow so the fieldset lays out exactly like the
// div it replaced (a rendered legend otherwise sits outside the flex content box)
globalStyle(`${projectOrderField} > legend`, {
  float: 'left',
  padding: 0,
});

export const fieldHelp = style({
  color: 'var(--color-sub)',
  fontSize: '0.78rem',
  lineHeight: 1.5,
  margin: '-0.1rem 0 0',
});

export const slugField = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.4rem',
  minWidth: 0,
});

globalStyle(`${applicationForm} input`, {
  background: 'var(--color-code-bg)',
  border: '0.5px solid var(--color-bg-divider)',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--color-main)',
  font: 'inherit',
  minWidth: 0,
  padding: '0.65rem 0.75rem',
});

globalStyle(`${applicationForm} input:focus`, {
  borderColor: 'var(--color-primary)',
  outline: '2px solid color-mix(in srgb, var(--color-primary) 18%, transparent)',
});

globalStyle(`${applicationForm} button`, {
  alignSelf: 'end',
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
