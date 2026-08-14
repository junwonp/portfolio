import { globalStyle, keyframes, style } from '@vanilla-extract/css';

const menuReveal = keyframes({
  from: {
    opacity: 0,
    transform: 'scale(0.95) translateY(-4px)',
  },
  to: {
    opacity: 1,
    transform: 'scale(1) translateY(0)',
  },
});

export const active = style({});

export const stickyHeader = style({
  alignItems: 'center',
  background: 'transparent',
  borderBottom: 'none',
  backdropFilter: 'none',
  WebkitBackdropFilter: 'none',
  display: 'none',
  justifyContent: 'flex-end',
  position: 'fixed',
  top: 0,
  zIndex: 'var(--z-sticky)',
  height: 'auto',

  '@media': {
    '(min-width: 576px)': {
      display: 'flex',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: '800px',
      padding: '0 2rem',
      paddingTop: '2rem',
    },
    '(min-width: 1024px)': {
      maxWidth: '900px',
    },
    '(min-width: 1280px)': {
      maxWidth: '1000px',
    },
    '(min-width: 1536px)': {
      maxWidth: '1200px',
    },
    '(max-width: 576px)': {
      display: 'flex',
      left: 'auto',
      right: 0,
      transform: 'none',
      width: 'auto',
      padding: '0 1rem',
      paddingTop: 'calc(16px + env(safe-area-inset-top))',
    },
  },
});

export const langToggleWrapper = style({
  display: 'flex',
  alignItems: 'center',
  marginRight: '0.5rem',
});

export const langToggle = style({
  alignItems: 'center',
  borderRadius: 'var(--radius-full)',
  color: 'var(--color-sub)',
  cursor: 'pointer',
  display: 'flex',
  fontSize: '0.8125rem',
  fontWeight: 500,
  height: '36px',
  padding: '0 0.875rem',
  transition: 'background-color 0.15s, color 0.15s, transform 0.1s',
  boxSizing: 'border-box',
  boxShadow: 'var(--shadow-floating)',

  ':hover': {
    color: 'var(--color-bold)',
  },

  ':active': {
    transform: 'scale(0.88)',
    backgroundColor: 'var(--color-disabled-bg)',
    color: 'var(--color-bold)',
  },

  selectors: {
    'html.dark &': {
      boxShadow: 'var(--shadow-floating)',
    },
  },
});

export const mobileOnly = style({
  display: 'none !important',

  '@media': {
    '(max-width: 576px)': {
      display: 'inline-flex !important',
    },
  },
});

export const pcOnly = style({
  display: 'block',

  '@media': {
    '(max-width: 576px)': {
      display: 'none',
    },
  },
});

export const actions = style({
  alignItems: 'center',
  display: 'flex',
  flexShrink: 0,
  gap: '0.5rem',
  minWidth: 0,
});

export const langToggleBtn = style({
  background: 'transparent',
  border: 'none',
  color: 'var(--color-sub)',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '30px',
  height: '30px',
  borderRadius: '50%',
  fontSize: '0.75rem',
  fontWeight: 600,
  transition: 'background-color 0.15s, color 0.15s, transform 0.1s',
  boxSizing: 'border-box',

  ':hover': {
    color: 'var(--color-bold)',
    backgroundColor: 'var(--color-disabled-bg)',
  },

  ':active': {
    transform: 'scale(0.85) !important',
    backgroundColor: 'color-mix(in srgb, var(--color-main) 12%, var(--color-disabled-bg)) !important',
  },
});

export const actionGroup = style({
  borderRadius: 'var(--radius-full)',
  display: 'flex',
  alignItems: 'center',
  padding: '3px',
  gap: '1px',
  height: '36px',
  boxSizing: 'border-box',
  boxShadow: 'var(--shadow-floating)',

  selectors: {
    'html.dark &': {
      boxShadow: 'var(--shadow-floating)',
    },
  },
});

export const error = style({
  color: 'var(--color-error)',
  fontSize: '0.7rem',
});

export const moreMenuContainer = style({
  position: 'relative',
  display: 'inline-flex',
});

export const moreButton = style({
  background: 'transparent',
  border: 'none',
  color: 'var(--color-sub)',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '30px',
  height: '30px',
  borderRadius: '50%',
  transition: 'background-color 0.15s, color 0.15s, transform 0.1s',

  ':hover': {
    color: 'var(--color-bold)',
    backgroundColor: 'var(--color-disabled-bg)',
  },

  ':active': {
    transform: 'scale(0.85) !important',
    backgroundColor: 'color-mix(in srgb, var(--color-main) 12%, var(--color-disabled-bg)) !important',
  },

  selectors: {
    [`&.${active}`]: {
      color: 'var(--color-bold)',
      backgroundColor: 'rgba(0, 0, 0, 0.08) !important',
    },
    [`html.dark &.${active}`]: {
      backgroundColor: 'rgba(255, 255, 255, 0.12) !important',
    },
  },
});

export const dropdownMenu = style({
  position: 'absolute',
  top: 'calc(100% + 8px)',
  right: 0,
  zIndex: 'var(--z-dropdown)',
  minWidth: '200px',
  background: 'rgba(255, 255, 255, 0.94)',
  backdropFilter: 'saturate(140%) blur(20px)',
  WebkitBackdropFilter: 'saturate(140%) blur(20px)',
  border: '0.5px solid rgba(0, 0, 0, 0.08)',
  borderRadius: '16px',
  boxShadow: 'var(--shadow-menu)',
  padding: '6px',
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
  transformOrigin: 'top right',
  animation: `${menuReveal} 0.25s var(--ease-emphasized) forwards`,

  selectors: {
    'html.dark &': {
      background: 'rgba(28, 28, 30, 0.95)',
      border: '0.5px solid rgba(255, 255, 255, 0.08)',
      boxShadow: 'var(--shadow-menu)',
    },
  },
});

export const menuDivider = style({
  background: 'rgba(0, 0, 0, 0.06)',
  height: '0.5px',
  margin: '4px 6px',

  selectors: {
    'html.dark &': {
      background: 'rgba(255, 255, 255, 0.08)',
    },
  },
});

export const dropdownItem = style({
  background: 'transparent !important',
  border: 'none !important',
  color: 'var(--color-bold) !important',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  fontSize: '0.875rem',
  fontWeight: 500,
  padding: '8px 12px',
  textAlign: 'left',
  textDecoration: 'none !important',
  width: '100%',
  borderRadius: '10px',
  transition: 'background-color 0.15s, color 0.15s, transform 0.1s',
  boxSizing: 'border-box',

  ':hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.05) !important',
  },

  ':active': {
    transform: 'scale(0.97)',
    backgroundColor: 'rgba(0, 0, 0, 0.08) !important',
  },

  selectors: {
    'html.dark &:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08) !important',
    },
    'html.dark &:active': {
      backgroundColor: 'rgba(255, 255, 255, 0.12) !important',
    },
  },
});

globalStyle(`${stickyHeader} a[class*="IconLink_iconLink"]`, {
  width: '30px !important',
  height: '30px !important',
  padding: '0 !important',
  background: 'transparent !important',
  border: 'none !important',
  color: 'var(--color-sub) !important',
  borderRadius: '50% !important',
  transition: 'background-color 0.15s, color 0.15s, transform 0.1s !important',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
});

globalStyle(`${stickyHeader} a[class*="IconLink_iconLink"]:hover`, {
  background: 'var(--color-disabled-bg) !important',
  color: 'var(--color-bold) !important',
});

globalStyle(`${stickyHeader} a[class*="IconLink_iconLink"]:active`, {
  transform: 'scale(0.85) !important',
  background: 'color-mix(in srgb, var(--color-main) 12%, var(--color-disabled-bg)) !important',
  color: 'var(--color-bold) !important',
});
