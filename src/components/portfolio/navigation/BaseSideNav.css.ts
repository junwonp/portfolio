import { globalStyle, style } from '@vanilla-extract/css';

export const sideNav = style({
  position: 'sticky',
  top: 'var(--space-xl)',
  alignSelf: 'flex-start',
  paddingTop: 'var(--space-xl)',

  '@media': {
    '(max-width: 960px)': {
      display: 'none',
    },
  },
});

export const active = style({});

export const navListWrapper = style({
  position: 'relative',
});

export const activeBg = style({
  position: 'absolute',
  left: 0,
  right: 0,
  background: 'color-mix(in srgb, var(--color-primary) 8%, transparent)',
  borderRadius: '8px',
  zIndex: 0,
  transition: 'transform 0.25s var(--ease-standard), opacity 0.2s',
  pointerEvents: 'none',
  willChange: 'transform, opacity',
});

export const navList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
  listStyle: 'none',
  margin: 0,
  padding: 0,
  position: 'relative',
  zIndex: 1,
});

globalStyle(`${navList} li`, {
  padding: 0,
});

globalStyle(`${navList} li::before`, {
  display: 'none !important',
});

export const navItem = style({
  background: 'transparent',
  border: 'none',
  color: 'var(--color-sub)',
  cursor: 'pointer',
  display: 'block',
  fontFamily: 'inherit',
  fontSize: '0.875rem',
  padding: '0.5rem 1rem',
  textAlign: 'left',
  transition: 'background-color 0.15s ease',
  width: '100%',
  borderRadius: '8px',

  ':hover': {
    color: 'var(--color-bold)',
    background: 'var(--color-surface-hover)',
  },

  selectors: {
    [`&.${active}`]: {
      background: 'transparent !important',
      color: 'var(--color-primary)',
      fontWeight: 600,
    },
  },
});

export const navLabel = style({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: 'block',
});
