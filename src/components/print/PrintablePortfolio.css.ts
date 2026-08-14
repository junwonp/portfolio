import { globalStyle, style } from '@vanilla-extract/css';

/* ── Shell ── */

export const shell = style({
  background: '#eef1f4',
  color: '#000',
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
      background: '#fff',
      minHeight: 0,
      overflow: 'visible',
      padding: 0,
      display: 'block',
    },
  },
});

/* ── Toolbar ── */

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
  background: 'rgba(255, 255, 255, 0.8)',
  border: '1px solid rgba(0, 0, 0, 0.1)',
  borderRadius: 'var(--radius-full)',
  color: '#111',
  cursor: 'pointer',
  display: 'inline-flex',
  font: '700 0.875rem/1 sans-serif',
  gap: '0.5rem',
  height: '48px',
  padding: '0 1.25rem',
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',

  selectors: {
    '.dark &': {
      background: 'rgba(15, 23, 42, 0.8)',
      borderColor: 'rgba(255, 255, 255, 0.12)',
      color: '#f1f5f9',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
    },
  },
});

/* ── Document & Page ── */

export const document = style({
  display: 'flex',
  justifyContent: 'center',
});

export const page = style({
  background: '#fff',
  color: '#000',
  width: '210mm',
  minHeight: '297mm',
  padding: '22mm 24mm 24mm',
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box',

  '@media': {
    '(max-width: 900px)': {
      width: 'min(210mm, calc(100vw - 1.5rem))',
      minHeight: 'auto',
      padding: '2rem 1.25rem 1.8rem',
    },
    print: {
      width: '210mm',
      minHeight: '297mm',
      height: 'auto',
      padding: '22mm 24mm 24mm',
    },
  },
});

/* ── Header ── */

export const header = style({
  marginBottom: '1.2rem',
});

export const headerTop = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: '1rem',
  marginBottom: '0.7rem',
});

export const headerTitle = style({
  fontSize: '1.75rem',
  fontWeight: 800,
  letterSpacing: '-0.02em',
  margin: '0 0 0.15rem',
  color: '#000',
  lineHeight: 1.15,

  '@media': {
    print: {
      fontSize: '22pt',
    },
  },
});

export const headerRole = style({
  fontSize: '0.9375rem',
  fontWeight: 500,
  color: '#333',
  margin: 0,
  lineHeight: 1.4,

  '@media': {
    print: {
      fontSize: '12pt',
    },
  },
});

export const headerCompany = style({
  fontSize: '0.875rem',
  fontWeight: 600,
  color: '#000',
  margin: '0.25rem 0 0',
  lineHeight: 1.4,

  '@media': {
    print: {
      fontSize: '11pt',
    },
  },
});

export const headerLinks = style({
  display: 'flex',
  gap: '0.85rem',
  flexShrink: 0,
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
});

export const headerLink = style({
  fontSize: '0.8125rem',
  fontWeight: 500,
  color: '#444',
  textDecoration: 'none',
  whiteSpace: 'nowrap',

  '@media': {
    print: {
      fontSize: '9.5pt',
    },
  },
});

export const headerDivider = style({
  width: '100%',
  border: 0,
  borderTop: '1.5px solid #000',
  margin: 0,
});

/* ── Projects Section ── */

export const projectsSection = style({
  marginBottom: '1.4rem',
});

export const projectsHeading = style({
  fontSize: '0.8125rem',
  fontWeight: 700,
  color: '#000',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  margin: '0 0 0.6rem',

  '@media': {
    print: {
      fontSize: '10pt',
    },
  },
});

export const projectList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.6rem',
});

export const projectCard = style({
  padding: '0.7rem 0.85rem',
  border: '1px solid #ddd',
  borderRadius: '6px',
  pageBreakInside: 'avoid',
});

export const projectTitle = style({
  fontSize: '1.0625rem',
  fontWeight: 700,
  margin: '0 0 0.2rem',
  color: '#000',
  letterSpacing: '-0.01em',
  lineHeight: 1.3,

  '@media': {
    print: {
      fontSize: '14pt',
    },
  },
});

export const projectDescription = style({
  fontSize: '0.875rem',
  color: '#222',
  margin: '0 0 0.5rem',
  lineHeight: 1.55,
  wordBreak: 'keep-all',

  '@media': {
    print: {
      fontSize: '11pt',
    },
  },
});

export const skillTags = style({
  display: 'flex',
  gap: '0.35rem',
  flexWrap: 'wrap',
});

export const skillTag = style({
  display: 'inline-block',
  fontSize: '0.71875rem',
  fontWeight: 600,
  color: '#222',
  background: '#f5f5f5',
  border: '1px solid #ddd',
  borderRadius: '4px',
  padding: '0.12rem 0.5rem',
  lineHeight: 1.5,
  printColorAdjust: 'exact',
  WebkitPrintColorAdjust: 'exact',

  '@media': {
    print: {
      fontSize: '9pt',
      background: '#f5f5f5',
      border: '1px solid #ccc',
    },
  },
});

/* ── CTA Section ── */

export const ctaSection = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
});

export const ctaDivider = style({
  width: '100%',
  border: 0,
  borderTop: '1px solid #ddd',
  margin: '1.4rem 0 0.55rem',
});

export const ctaButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#06f',
  color: '#fff',
  textDecoration: 'none',
  fontSize: '0.9375rem',
  fontWeight: 700,
  padding: '0.65rem 2.2rem',
  borderRadius: '8px',
  printColorAdjust: 'exact',
  WebkitPrintColorAdjust: 'exact',

  '@media': {
    print: {
      fontSize: '12pt',
    },
  },
});

export const linkText = style({
  fontSize: '0.84375rem',
  color: '#06f',
  textDecoration: 'underline',
  fontWeight: 500,
  marginTop: '0.35rem',

  '@media': {
    print: {
      fontSize: '10pt',
    },
  },
});

export const ctaNote = style({
  fontSize: '0.71875rem',
  color: '#777',
  margin: '0.85rem 0 0',
  textAlign: 'center',

  '@media': {
    print: {
      fontSize: '8pt',
    },
  },
});

/* ── Footer ── */

export const footer = style({
  width: '100%',
  textAlign: 'center',
  fontSize: '0.6875rem',
  color: '#555',
  lineHeight: 1.6,
  marginTop: '0.55rem',

  '@media': {
    print: {
      fontSize: '8pt',
    },
  },
});

globalStyle(`${footer} p`, {
  margin: 0,
});

/* ── Global Print Reset ── */

globalStyle('html, body', {
  '@media': {
    print: {
      background: '#fff',
      height: 'auto',
      overflow: 'visible',
    },
  },
});
