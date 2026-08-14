import { globalStyle, style } from '@vanilla-extract/css';

export const resumeShell = style({
  vars: {
    '--resume-bg': '#eef1f4',
    '--resume-paper': '#ffffff',
    '--resume-text': '#111111',
    '--resume-muted': '#5d5d5d',
    '--resume-rule': '#747474',
  },
  background: 'var(--resume-bg)',
  color: 'var(--resume-text)',
  minHeight: '100vh',
  overflowX: 'auto',
  padding: '1.5rem',

  '@media': {
    '(max-width: 900px)': {
      padding: '0.75rem',
    },
    print: {
      background: '#ffffff',
      minHeight: 0,
      overflow: 'visible',
      padding: 0,
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
  zIndex: 'var(--z-sticky)',

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
  borderRadius: 'var(--radius-full)',
  color: '#111111',
  cursor: 'pointer',
  display: 'inline-flex',
  font: '700 0.875rem/1 var(--font-family-text), sans-serif',
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
      border: '1px solid rgba(255, 255, 255, 0.1)',
      color: '#f1f5f9',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
    },
    '.dark &:hover': {
      background: 'rgba(15, 23, 42, 0.9)',
    },
  },
});

export const resumeDocument = style({
  display: 'grid',
  gap: '1.5rem',
  justifyContent: 'center',

  '@media': {
    '(max-width: 900px)': {
      justifyContent: 'start',
    },
    print: {
      display: 'block',
    },
  },
});

export const resumePage = style({
  background: 'var(--resume-paper)',
  boxShadow: '0 20px 60px rgb(15 23 42 / 0.16)',
  color: 'var(--resume-text)',
  minHeight: '11in',
  overflowWrap: 'anywhere',
  padding: '0.6in 0.6in 0.5in',
  width: '8.5in',
  wordBreak: 'keep-all',

  selectors: {
    '&:last-child': {
      '@media': {
        print: {
          breakAfter: 'auto',
          pageBreakAfter: 'auto',
        },
      },
    },
  },

  '@media': {
    '(max-width: 900px)': {
      padding: '0.35in 0.32in',
      width: 'min(8.5in, calc(100vw - 1.5rem))',
    },
    print: {
      boxShadow: 'none',
      breakAfter: 'page',
      minHeight: '11in',
      pageBreakAfter: 'always',
      padding: '0.5in 0.5in 0.44in',
      width: '8.5in',
    },
  },
});

globalStyle(`${resumePage} a`, {
  color: 'inherit',
  fontWeight: 'inherit',
  textDecoration: 'none',
});

export const hero = style({
  marginBottom: '0.26in',
});

globalStyle(`${hero} h1`, {
  color: 'var(--resume-text)',
  fontSize: '24pt',
  fontWeight: 800,
  letterSpacing: 0,
  lineHeight: 1.08,
  margin: '0 0 0.11in',
});

export const headline = style({
  color: '#3f3f3f',
  fontSize: '15pt',
  fontWeight: 800,
  lineHeight: 1.15,
  margin: '0 0 0.06in',
});

export const contactList = style({
  color: 'var(--resume-muted)',
  display: 'flex',
  flexDirection: 'column',
  fontSize: '10.5pt',
  fontStyle: 'normal',
  gap: '0.04in',
  lineHeight: 1.22,
  margin: '0 0 0.16in',
});

globalStyle(`${contactList} a`, {
  color: 'inherit',
  fontWeight: 'inherit',
  textDecoration: 'none',
});

export const contactRow = style({
  display: 'flex',
  gap: '0.08in',

  '@media': {
    '(max-width: 900px)': {
      flexWrap: 'wrap',
    },
  },
});

export const divider = style({
  color: 'var(--resume-muted)',
  opacity: 0.6,
});

export const summary = style({
  marginTop: '0.16in',
});

export const section = style({});
export const sectionFrame = style({});

globalStyle(`${section} h2, ${summary} h2`, {
  borderBottom: '1.2pt solid var(--resume-rule)',
  color: '#000000',
  fontSize: '19pt',
  fontWeight: 800,
  letterSpacing: 0,
  lineHeight: 1.1,
  margin: '0 0 0.11in',
  paddingBottom: '0.06in',
});

globalStyle(`${summary} h2`, {
  borderBottom: 0,
  fontSize: '13.3pt',
  marginBottom: '0.08in',
  paddingBottom: 0,
});

export const workEntry = style({
  marginBottom: '0.18in',
});

export const workHeader = style({
  alignItems: 'flex-start',
  display: 'flex',
  gap: '0.2in',
  justifyContent: 'space-between',
  margin: '0 0 0.12in',

  '@media': {
    '(max-width: 900px)': {
      display: 'block',
    },
    print: {
      display: 'flex !important',
      justifyContent: 'space-between !important',
    },
  },
});

export const simpleItem = style({});

globalStyle(`${workHeader} h3, ${simpleItem} h3`, {
  color: '#000000',
  fontSize: '13.4pt',
  fontWeight: 800,
  letterSpacing: 0,
  lineHeight: 1.15,
  margin: 0,
});

export const role = style({
  color: '#4a4a4a',
  fontSize: '10.8pt',
  fontStyle: 'italic',
  fontWeight: 500,
  lineHeight: 1.2,
  margin: '0.04in 0 0',
});

export const periodBlock = style({
  color: '#111111',
  flex: '0 0 1.55in',
  fontSize: '10.9pt',
  lineHeight: 1.24,
  textAlign: 'right',

  '@media': {
    '(max-width: 900px)': {
      marginTop: '0.04in',
      textAlign: 'left',
    },
    print: {
      marginTop: '0 !important',
      textAlign: 'right',
      flex: '0 0 1.55in !important',
    },
  },
});

globalStyle(`${periodBlock} p, ${simpleItem} header p`, {
  margin: 0,

  '@media': {
    '(max-width: 900px)': {
      marginTop: '0.04in',
      textAlign: 'left',
    },
    print: {
      marginTop: '0 !important',
      textAlign: 'right',
      flex: '0 0 1.55in !important',
    },
  },
});

globalStyle(`${periodBlock} p + p`, {
  color: 'var(--resume-muted)',
  marginTop: '0.03in',
});

export const projectBlock = style({
  marginBottom: '0.11in',

  selectors: {
    '&:last-child': {
      marginBottom: 0,
    },
  },
});

globalStyle(`${projectBlock} h4`, {
  color: '#000000',
  fontSize: '12.3pt',
  fontWeight: 800,
  lineHeight: 1.2,
  margin: '0 0 0.08in',
});

export const projectSummary = style({
  color: '#111111',
  fontSize: '10.3pt',
  lineHeight: 1.34,
  margin: '0 0 0.08in',
});

globalStyle(`${projectSummary} strong`, {
  color: '#000000',
  fontWeight: 800,
});

export const bullets = style({
  color: '#111111',
  fontSize: '10.25pt',
  listStyle: 'none',
  margin: 0,
  padding: 0,

  selectors: {
    [`${simpleItem} &`]: {
      marginBottom: 0,
    },
  },
});

globalStyle(`${bullets} li`, {
  lineHeight: 1.30,
  padding: '0.016in 0 0.016in 0.23in',
  position: 'relative',
});

globalStyle(`${bullets} li::before`, {
  color: '#696969',
  content: '"•"',
  fontWeight: 800,
  left: '0.05in',
  position: 'absolute',
});

globalStyle(`${bullets} strong`, {
  color: '#000000',
  fontWeight: 800,
});

export const skills = style({
  display: 'grid',
  gap: '0.08in',
  margin: '0 0 0.3in',
});

export const skillRow = style({
  display: 'grid',
  gridTemplateColumns: '1.38in 1fr',

  '@media': {
    '(max-width: 900px)': {
      gridTemplateColumns: '1fr',
    },
    print: {
      gridTemplateColumns: '1.38in 1fr !important',
    },
  },
});

globalStyle(`${skillRow} dt`, {
  color: '#000000',
  fontSize: '11.3pt',
  fontWeight: 800,
  lineHeight: 1.2,
});

globalStyle(`${skillRow} dd`, {
  color: '#111111',
  fontSize: '11.2pt',
  lineHeight: 1.2,
  margin: 0,
});

export const simpleList = style({
  display: 'grid',
  gap: '0.14in',
});

globalStyle(`${simpleItem} header`, {
  alignItems: 'baseline',
  display: 'flex',
  gap: '0.2in',
  justifyContent: 'space-between',
  marginBottom: '0.07in',

  '@media': {
    '(max-width: 900px)': {
      display: 'block',
    },
    print: {
      display: 'flex !important',
      justifyContent: 'space-between !important',
    },
  },
});

globalStyle(`${simpleItem} header p`, {
  color: '#111111',
  flex: '0 0 1.1in',
  fontSize: '10.8pt',
  lineHeight: 1.2,
  textAlign: 'right',
});

export const secureEmail = style({
  display: 'inline-flex',
  alignItems: 'center',
});

export const atSign = style({});

globalStyle(`${atSign}::before`, {
  content: '"@"',
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
