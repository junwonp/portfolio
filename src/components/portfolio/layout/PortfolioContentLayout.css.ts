import { globalStyle, style } from '@vanilla-extract/css';

export const surface = style({
  position: 'relative',
  width: '100%',
});

export const mobileHeaderSlot = style({
  display: 'contents',

  '@media': {
    print: {
      selectors: {
        '&&': {
          display: 'none',
        },
      },
    },
  },
});

export const desktopHeader = style({
  alignItems: 'center',
  background: 'transparent',
  borderBottom: 'none',
  boxSizing: 'border-box',
  display: 'flex',
  height: 'auto',
  justifyContent: 'flex-end',
  left: '50%',
  maxWidth: '800px',
  padding: '2rem 0 0',
  pointerEvents: 'none',
  position: 'fixed',
  top: 0,
  transform: 'translateX(-50%)',
  width: '100%',
  zIndex: 50,

  '@media': {
    '(max-width: 960px)': {
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

globalStyle(`${desktopHeader} *`, {
  pointerEvents: 'auto',
});

export const layout = style({
  display: 'flex',
  justifyContent: 'center',
  paddingBottom: '120px',
  position: 'relative',
  width: '100%',

  selectors: {
    [`${surface}.has-desktop-header &`]: {
      marginTop: '80px',
    },
  },

  '@media': {
    '(max-width: 1400px)': {
      gap: 'var(--space-md)',
      justifyContent: 'flex-start',
    },
    '(max-width: 960px)': {
      display: 'block',
      paddingBottom: '80px',
      selectors: {
        [`${surface}.has-desktop-header &`]: {
          marginTop: 'var(--space-md)',
        },
      },
    },
    print: {
      display: 'block',
      selectors: {
        '&&': {
          marginTop: '0 !important',
          paddingBottom: '0 !important',
        },
      },
    },
  },
});

export const hasDesktopHeader = style({});

export const navWrapper = style({
  bottom: 0,
  position: 'absolute',
  right: 'calc(100% + var(--space-md))',
  top: 0,
  width: '160px',

  '@media': {
    '(max-width: 1400px)': {
      flexShrink: 0,
      position: 'relative',
      right: 'auto',
    },
    '(max-width: 960px)': {
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

export const mainContent = style({
  maxWidth: '800px',
  minWidth: 0,
  transition: 'opacity 0.3s ease, transform 0.3s ease',
  width: '100%',

  '@media': {
    '(max-width: 1400px)': {
      flex: 1,
    },
    '(max-width: 960px)': {
      maxWidth: '100%',
    },
    print: {
      maxWidth: 'none',
    },
  },
});

export const content = style({
  minWidth: 0,
  width: '100%',
});
