import { globalStyle, style } from '@vanilla-extract/css';

export const field = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

export const summary = style({
  alignItems: 'flex-start',
  display: 'flex',
  gap: '8px',
  justifyContent: 'space-between',

  '@media': {
    '(max-width: 640px)': {
      alignItems: 'stretch',
      flexDirection: 'column',
    },
  },
});

export const selectedList = style({
  display: 'flex',
  flex: 1,
  flexWrap: 'wrap',
  gap: '6px',
  minWidth: 0,
});

export const selectedChip = style({
  background: 'var(--color-primary)',
  border: '1px solid var(--color-primary)',
  borderRadius: '999px',
  color: 'var(--color-basic-bg)',
  fontSize: '0.75rem',
  fontWeight: 700,
  lineHeight: 1,
  padding: '7px 9px',
});

export const placeholder = style({
  color: 'var(--color-sub)',
  fontSize: '0.8125rem',
  lineHeight: 1.6,
});

export const openButton = style({
  border: '1px solid color-mix(in srgb, var(--color-primary) 14%, transparent)',
  borderRadius: '8px',
  cursor: 'pointer',
  font: 'inherit',
  alignItems: 'center',
  background: 'color-mix(in srgb, var(--color-primary) 8%, transparent)',
  color: 'var(--color-primary)',
  display: 'inline-flex',
  flex: '0 0 auto',
  fontSize: '0.8125rem',
  gap: '6px',
  padding: '8px 10px',
});

export const addButton = style({
  border: '1px solid color-mix(in srgb, var(--color-primary) 14%, transparent)',
  borderRadius: '8px',
  cursor: 'pointer',
  font: 'inherit',
  background: 'color-mix(in srgb, var(--color-primary) 8%, transparent)',
  color: 'var(--color-primary)',
  fontSize: '0.875rem',
  padding: '8px 10px',
});

export const doneButton = style({
  border: '1px solid color-mix(in srgb, var(--color-primary) 14%, transparent)',
  borderRadius: '8px',
  cursor: 'pointer',
  font: 'inherit',
  background: 'var(--color-primary)',
  color: 'var(--color-basic-bg)',
  fontWeight: 700,
  padding: '99px 14px',
});

export const iconButton = style({
  border: '1px solid color-mix(in srgb, var(--color-primary) 14%, transparent)',
  borderRadius: '8px',
  cursor: 'pointer',
  font: 'inherit',
  alignItems: 'center',
  aspectRatio: '1',
  background: 'transparent',
  color: 'var(--color-text)',
  display: 'inline-flex',
  justifyContent: 'center',
  width: '34px',
});

export const backdrop = style({
  alignItems: 'center',
  background: 'rgba(0, 0, 0, 0.42)',
  display: 'flex',
  inset: 0,
  justifyContent: 'center',
  padding: '16px',
  position: 'fixed',
  zIndex: 1100,

  '@media': {
    '(max-width: 640px)': {
      alignItems: 'stretch',
      padding: 0,
    },
  },
});

export const panel = style({
  background: 'var(--color-basic-bg)',
  border: '1px solid color-mix(in srgb, var(--color-primary) 12%, transparent)',
  borderRadius: '8px',
  boxShadow: '0 20px 70px rgba(0, 0, 0, 0.22)',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  maxHeight: 'min(720px, calc(100vh - 32px))',
  maxWidth: '760px',
  padding: '20px',
  width: 'min(100%, 760px)',

  '@media': {
    '(max-width: 640px)': {
      borderRadius: 0,
      maxHeight: '100vh',
      width: '100%',
    },
  },
});

export const header = style({
  alignItems: 'center',
  display: 'flex',
  gap: '8px',
  justifyContent: 'space-between',
});

globalStyle(`${header} h3`, {
  fontSize: '1rem',
  margin: 0,
});

export const actions = style({
  alignItems: 'center',
  display: 'flex',
  gap: '8px',
  justifyContent: 'flex-end',
});

export const customRow = style({
  alignItems: 'center',
  display: 'flex',
  gap: '8px',

  '@media': {
    '(max-width: 640px)': {
      alignItems: 'stretch',
      flexDirection: 'column',
    },
  },
});

export const kicker = style({
  color: 'var(--color-sub)',
  display: 'block',
  fontSize: '0.75rem',
  fontWeight: 700,
  marginBottom: '4px',
});

export const groupLabel = style({
  color: 'var(--color-sub)',
  display: 'block',
  fontSize: '0.75rem',
  fontWeight: 700,
});

export const content = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  overflow: 'auto',
});

export const group = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
});

export const chipGrid = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '6px',
});

export const chip = style({
  background: 'var(--color-basic-bg)',
  border: '1px solid color-mix(in srgb, var(--color-primary) 12%, transparent)',
  borderRadius: '999px',
  color: 'var(--color-sub)',
  cursor: 'pointer',
  font: 'inherit',
  fontSize: '0.75rem',
  padding: '7px 9px',

  selectors: {
    '&.selected': {
      background: 'var(--color-primary)',
      borderColor: 'var(--color-primary)',
      color: 'var(--color-basic-bg)',
      fontWeight: 700,
    },
  },
});

export const selected = style({});

export const empty = style({
  color: 'var(--color-sub)',
  fontSize: '0.875rem',
  margin: 0,
});

export const input = style({
  background: 'var(--color-code-bg)',
  border: '1px solid color-mix(in srgb, var(--color-primary) 14%, transparent)',
  borderRadius: '8px',
  color: 'var(--color-text)',
  flex: 1,
  font: 'inherit',
  minHeight: '38px',
  minWidth: 0,
  padding: '8px 10px',
});
