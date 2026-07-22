import { globalStyle, style } from '@vanilla-extract/css';

export const tabBar = style({
  borderRadius: '999px',
  bottom: 'calc(1rem + env(safe-area-inset-bottom))',
  display: 'flex',
  left: '50%',
  transform: 'translateX(-50%)',
  padding: '0.25rem',
  position: 'fixed',
  width: 'calc(100% - 1.5rem)',
  maxWidth: '500px',
  zIndex: 50,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06), inset 0 1px 1px rgba(255, 255, 255, 0.8)',
  touchAction: 'none',

  selectors: {
    'html.dark &': {
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
    },
  },

  '@media': {
    '(min-width: 961px)': {
      display: 'none',
    },
    print: {
      selectors: {
        '&&': {
          display: 'none',
        },
      },
    },
  },
});

export const activeBg = style({
  position: 'absolute',
  left: 0,
  top: '0.25rem',
  bottom: '0.25rem',
  background: 'var(--color-primary)',
  borderRadius: '999px',
  boxShadow: '0 2px 8px color-mix(in srgb, var(--color-primary) 30%, transparent)',
  zIndex: 0,
  transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s',
  pointerEvents: 'auto',
  cursor: 'grab',
  willChange: 'transform, opacity',

  selectors: {
    '&.dragging': {
      transition: 'none',
      cursor: 'grabbing',
    },
  },
});

export const dragging = style({});

export const tab = style({
  alignItems: 'center',
  background: 'transparent',
  border: 'none',
  borderRadius: '999px',
  color: 'var(--color-sub)',
  cursor: 'pointer',
  display: 'flex',
  flex: 1,
  fontFamily: 'inherit',
  fontSize: '0.75rem',
  fontWeight: 500,
  justifyContent: 'center',
  minHeight: '44px',
  padding: '0.5rem 0.25rem',
  transition: 'transform 0.1s',
  wordBreak: 'keep-all',
  zIndex: 1,
  position: 'relative',
  userSelect: 'none',
  WebkitUserSelect: 'none',

  ':active': {
    transform: 'scale(0.92)',
  },

  selectors: {
    '&.active': {
      color: 'var(--color-on-primary)',
      fontWeight: 700,
    },
  },
});

export const active = style({});

export const projectNav = style({
  display: 'flex',
  position: 'fixed',
  bottom: 'calc(1rem + env(safe-area-inset-bottom))',
  left: '50%',
  transform: 'translateX(-50%)',
  width: 'calc(100% - 1.5rem)',
  maxWidth: '500px',
  padding: 0,
  zIndex: 50,
  alignItems: 'center',
  pointerEvents: 'none',

  '@media': {
    '(min-width: 961px)': {
      display: 'none',
    },
    '(max-width: 960px)': {
      display: 'grid',
      gridTemplateColumns: '48px 1fr 48px',
      gap: '4px',
    },
    print: {
      selectors: {
        '&&': {
          display: 'none',
        },
      },
    },
  },
});

export const islandSlot = style({
  display: 'flex',
  alignItems: 'center',
  pointerEvents: 'none',

  selectors: {
    '&.left': {
      flex: 1,
      justifyContent: 'flex-start',
    },
    '&.center': {
      flex: '0 1 auto',
      minWidth: 0,
      justifyContent: 'center',
      margin: '0 8px',
    },
    '&.right': {
      flex: 1,
      justifyContent: 'flex-end',
    },
  },
});

export const left = style({});
export const center = style({});
export const right = style({});

export const island = style({
  borderRadius: '999px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06), inset 0 1px 1px rgba(255, 255, 255, 0.8)',
  pointerEvents: 'auto',

  selectors: {
    'html.dark &': {
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
    },
  },
});

globalStyle(`${projectNav} ${tabBar}`, {
  position: 'relative',
  bottom: 'auto',
  left: 'auto',
  transform: 'none',
  width: '100%',
  maxWidth: 'none',
  overflowX: 'auto',
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  touchAction: 'pan-x',
  display: 'flex',
});

globalStyle(`${projectNav} ${tabBar}::-webkit-scrollbar`, {
  display: 'none',
});

export const circle = style({
  height: '48px',
  width: '48px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  color: 'var(--color-main)',
  textDecoration: 'none',
  transition: 'background 0.15s, color 0.15s',
  borderRadius: '50%',
});

export const backBtn = style({
  ':hover': {
    background: 'var(--color-disabled-bg)',
  },
});

export const linksPill = style({
  display: 'flex',
  alignItems: 'stretch',
  height: '48px',
  padding: 0,
  overflow: 'hidden',
  minWidth: '48px',
});

export const linkItem = style({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 12px',
  color: 'var(--color-sub)',
  textDecoration: 'none',
  transition: 'background 0.15s, color 0.15s',

  ':hover': {
    background: 'var(--color-disabled-bg)',
    color: 'var(--color-bold)',
  },
});
