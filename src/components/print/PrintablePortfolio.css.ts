import { globalStyle, style } from '@vanilla-extract/css';

export const shell = style({
  vars: {
    '--print-bg': '#eef1f4',
    '--print-paper': '#ffffff',
    '--print-text': '#111111',
    '--print-muted': '#5d5d5d',
    '--print-divider': '#e2e8f0',
  },
  background: 'var(--print-bg)',
  color: 'var(--print-text)',
  minHeight: '100vh',
  overflowX: 'auto',
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',

  '@media': {
    '(max-width: 900px)': {
      padding: '0.75rem',
      justifyContent: 'flex-start',
    },
    print: {
      background: '#ffffff',
      minHeight: 0,
      overflow: 'visible',
      padding: 0,
      display: 'block',
    },
  },
});

export const toolbar = style({
  bottom: 'calc(1.5rem + env(safe-area-inset-bottom))',
  display: 'flex',
  justifyContent: 'center',
  left: '50%',
  position: 'fixed',
  transform: 'translateX(-50%)',
  zIndex: 50,

  '@media': {
    print: {
      display: 'none',
    },
  },
});

export const printButton = style({
  alignItems: 'center',
  background: 'rgba(255, 255, 255, 0.75)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.5)',
  borderRadius: '999px',
  color: '#111111',
  cursor: 'pointer',
  display: 'inline-flex',
  font: '700 0.875rem/1 sans-serif',
  gap: '0.5rem',
  height: '48px',
  padding: '0 1.25rem',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.8)',
  transition: 'background 0.15s, transform 0.1s',

  ':hover': {
    background: 'rgba(255, 255, 255, 0.9)',
  },

  ':active': {
    transform: 'scale(0.95)',
  },

  selectors: {
    '.dark &': {
      background: 'rgba(15, 23, 42, 0.75)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      color: '#f1f5f9',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
    },
    '.dark &:hover': {
      background: 'rgba(15, 23, 42, 0.9)',
    },
  },
});

export const document = style({
  display: 'flex',
  justifyContent: 'center',
});

export const page = style({
  background: 'var(--print-paper)',
  boxShadow: '0 20px 60px rgb(15 23 42 / 0.16)',
  color: 'var(--print-text)',
  height: '297mm',
  width: '210mm',
  padding: '55mm 25mm 30mm',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  alignItems: 'center',
  position: 'relative',
  boxSizing: 'border-box',

  '@media': {
    '(max-width: 900px)': {
      width: 'min(210mm, calc(100vw - 1.5rem))',
      height: 'auto',
      minHeight: 'calc(100vh - 1.5rem)',
      padding: '3rem 1.5rem 2.2rem',
    },
    print: {
      boxShadow: 'none',
      height: '297mm',
      width: '210mm',
      padding: '55mm 25mm 30mm',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  },
});

export const content = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
});

export const title = style({
  fontSize: '2.25rem',
  fontWeight: 800,
  color: '#000000',
  margin: '0 0 1.8rem',
  letterSpacing: '-0.02em',

  '@media': {
    '(max-width: 900px)': {
      fontSize: '1.75rem',
    },
    print: {
      fontSize: '26pt !important',
    },
  },
});

export const divider = style({
  width: '48px',
  border: 0,
  borderTop: '2px solid #747474',
  margin: '0 0 3.2rem',
  opacity: 0.8,
});

export const description = style({
  fontSize: '1.125rem',
  lineHeight: 1.8,
  color: 'var(--print-muted)',
  textAlign: 'center',
  margin: '0 0 4.2rem',
  wordBreak: 'keep-all',

  '@media': {
    '(max-width: 900px)': {
      fontSize: '1rem',
    },
    print: {
      fontSize: '12pt !important',
    },
  },
});

export const ctaButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#0066ff',
  color: '#ffffff !important',
  fontSize: '1rem',
  fontWeight: 700,
  textDecoration: 'none !important',
  padding: '0.95rem 2.8rem',
  borderRadius: '999px',
  marginBottom: '1.8rem',
  boxShadow: '0 4px 14px rgba(0, 102, 255, 0.15)',
  transition: 'background-color 0.2s, transform 0.15s',
  printColorAdjust: 'exact',
  WebkitPrintColorAdjust: 'exact',

  ':hover': {
    backgroundColor: '#0052cc',
    transform: 'translateY(-1px)',
  },

  '@media': {
    '(max-width: 900px)': {
      fontSize: '0.9375rem',
      padding: '0.8rem 2.2rem',
    },
    print: {
      fontSize: '11pt !important',
      boxShadow: 'none !important',
    },
  },
});

export const linkText = style({
  fontSize: '1.05rem',
  color: '#0066ff',
  textDecoration: 'underline',
  fontWeight: 500,

  '@media': {
    '(max-width: 900px)': {
      fontSize: '0.9375rem',
    },
    print: {
      fontSize: '11pt !important',
    },
  },
});

export const footer = style({
  width: '100%',
  textAlign: 'center',
  fontSize: '0.8125rem',
  color: 'var(--print-muted)',
  lineHeight: 1.6,
  borderTop: '1.2px solid var(--print-divider)',
  paddingTop: '1.8rem',
  boxSizing: 'border-box',

  '@media': {
    print: {
      fontSize: '8.5pt !important',
    },
  },
});

globalStyle(`${footer} p`, {
  margin: 0,
});

globalStyle('html, body', {
  '@media': {
    print: {
      background: '#ffffff !important',
      height: 'auto !important',
      overflow: 'visible !important',
    },
  },
});
