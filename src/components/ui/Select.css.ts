import { style } from '@vanilla-extract/css';

export const customSelectContainer = style({
  position: 'relative',
  width: '100%',
  display: 'inline-block',
  zIndex: 1,
});

export const open = style({
  zIndex: 50,
});

export const selectTrigger = style({
  alignItems: 'center',
  background: 'var(--color-code-bg)',
  border: '0.5px solid var(--color-bg-divider)',
  borderRadius: '8px',
  color: 'var(--color-main)',
  cursor: 'pointer',
  display: 'flex',
  font: 'inherit',
  fontSize: '0.875rem',
  fontWeight: 500,
  justifyContent: 'space-between',
  minHeight: '42px',
  outline: 'none',
  padding: '0.65rem 0.75rem',
  textAlign: 'left',
  transition: 'border-color 0.2s ease, outline 0.2s ease',
  width: '100%',

  ':focus-visible': {
    borderColor: 'var(--color-primary)',
    outline: '2px solid color-mix(in srgb, var(--color-primary) 18%, transparent)',
  },
});

export const disabled = style({
  color: 'var(--color-placeholder)',
  cursor: 'not-allowed',
  opacity: 0.6,
});

export const triggerLabel = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  marginRight: '0.5rem',
});

export const triggerIcon = style({
  alignItems: 'center',
  color: 'var(--color-sub)',
  display: 'flex',
  flexShrink: 0,
  opacity: 0.7,
});

export const selectDropdown = style({
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  marginTop: '0.25rem',
  background: 'rgba(255, 255, 255, 0.95)',
  border: '1px solid rgba(0, 0, 0, 0.08)',
  borderRadius: '8px',
  boxShadow: '0 4px 20px var(--color-shadow)',
  zIndex: 50,
  maxHeight: '220px',
  overflowY: 'auto',
  padding: '0.25rem',
  backdropFilter: 'saturate(140%) blur(20px)',
  WebkitBackdropFilter: 'saturate(140%) blur(20px)',

  selectors: {
    'html.dark &': {
      background: 'rgba(22, 27, 34, 0.96)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
    },
  },
});

export const optionsList = style({
  margin: 0,
  padding: 0,
  listStyle: 'none',
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
});

export const optionItem = style({
  alignItems: 'center',
  borderRadius: '6px',
  color: 'var(--color-main)',
  cursor: 'pointer',
  display: 'flex',
  fontSize: '0.875rem',
  fontWeight: 500,
  justifyContent: 'space-between',
  outline: 'none',
  padding: '0.5rem 0.75rem',
  transition: 'background 0.15s ease, color 0.15s ease',
  lineHeight: 1.2,
  position: 'relative',

  ':hover': {
    background: 'var(--color-surface-hover)',
    color: 'var(--color-bold)',
  },
  ':focus-visible': {
    background: 'var(--color-surface-hover)',
    color: 'var(--color-bold)',
  },

  '::before': {
    content: 'none !important',
  },
});

export const selected = style({
  background: 'color-mix(in srgb, var(--color-primary) 10%, transparent)',
  color: 'var(--color-primary)',
});

export const optionLabel = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  marginRight: '0.5rem',
});

export const checkIcon = style({
  alignItems: 'center',
  color: 'var(--color-primary)',
  display: 'flex',
  flexShrink: 0,
});
