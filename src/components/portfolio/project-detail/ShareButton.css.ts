import { globalStyle, style } from '@vanilla-extract/css';

export const shareWrapper = style({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
});

export const shareBtn = style({
  alignItems: 'center',
  background: 'transparent',
  borderRadius: '50%',
  border: 'none',
  color: 'var(--color-main)',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'center',
  padding: 'var(--space-xs)',
  transition: 'background 0.2s, color 0.2s, transform 0.1s',

  ':hover': {
    background: 'var(--color-bg-divider)',
    color: 'var(--color-primary)',
  },

  ':active': {
    transform: 'scale(0.9)',
  },

  ':focus-visible': {
    outline: '2px solid var(--color-primary)',
    outlineOffset: '2px',
  },
});

export const toast = style({
  background: 'var(--color-main)',
  borderRadius: '6px',
  bottom: 'calc(100% + 8px)',
  color: 'var(--color-basic-bg)',
  fontSize: '0.75rem',
  left: '50%',
  padding: '0.375rem 0.625rem',
  pointerEvents: 'none',
  position: 'absolute',
  transform: 'translateX(-50%)',
  whiteSpace: 'nowrap',
  zIndex: 10,

  '::after': {
    borderColor: 'var(--color-main) transparent transparent transparent',
    borderStyle: 'solid',
    borderWidth: '4px 4px 0',
    bottom: '-4px',
    content: '""',
    left: '50%',
    position: 'absolute',
    transform: 'translateX(-50%)',
  },
});

export const shareBtnText = style({
  alignItems: 'center',
  background: 'transparent',
  borderRadius: '20px',
  border: '1px solid var(--color-bg-divider)',
  color: 'var(--color-sub)',
  cursor: 'pointer',
  display: 'inline-flex',
  fontFamily: 'inherit',
  fontSize: '0.8125rem',
  gap: '0.375rem',
  padding: '0.4rem 0.875rem',
  transition: 'background 0.2s, border-color 0.2s, color 0.2s, transform 0.1s',

  ':hover': {
    background: 'color-mix(in srgb, var(--color-primary) 8%, transparent)',
    borderColor: 'var(--color-primary)',
    color: 'var(--color-primary)',
  },

  ':active': {
    transform: 'scale(0.96)',
  },

  ':focus-visible': {
    outline: '2px solid var(--color-primary)',
    outlineOffset: '2px',
  },

  selectors: {
    '&.copied': {
      borderColor: 'var(--color-primary)',
      color: 'var(--color-primary)',
    },
  },
});

export const copied = style({});

globalStyle(`${shareBtnText} span`, {
  lineHeight: 1,
});
