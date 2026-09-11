import { globalStyle, style } from '@vanilla-extract/css';

export const resumeShell = style({
  vars: {
    '--resume-bg': '#eef1f4',
    '--resume-paper': '#ffffff',
    '--resume-text': '#111111',
    '--resume-muted': '#5d5d5d',
    '--resume-rule': '#747474',
    '--resume-accent': '#2a5cb8',
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
  minHeight: '11.69in',
  overflowWrap: 'anywhere',
  padding: '0.6in 0.6in 0.5in',
  width: '8.27in',
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
      width: 'min(8.27in, calc(100vw - 1.5rem))',
    },
    print: {
      boxShadow: 'none',
      breakAfter: 'page',
      minHeight: '11.69in',
      pageBreakAfter: 'always',
      padding: '0.5in 0.5in 0.44in',
      width: '8.27in',
    },
  },
});

globalStyle(`${resumePage} a`, {
  color: 'inherit',
  fontWeight: 'inherit',
  textDecoration: 'none',
});

export const hero = style({
  marginBottom: '0.12in',
});

// Name/role block on the left, two-line contact on the right end
export const heroTopRow = style({
  alignItems: 'center',
  display: 'flex',
  gap: '0.3in',
  justifyContent: 'space-between',
  marginBottom: '0.08in',
});

export const identityBlock = style({});

globalStyle(`${hero} h1`, {
  color: 'var(--resume-text)',
  fontSize: '24pt',
  fontWeight: 800,
  letterSpacing: 0,
  lineHeight: 1.08,
  margin: '0 0 0.07in',
});

export const headline = style({
  color: '#3f3f3f',
  fontSize: '15.5pt',
  fontWeight: 800,
  lineHeight: 1.15,
  margin: 0,
});

export const contactList = style({
  alignItems: 'flex-end',
  color: 'var(--resume-muted)',
  display: 'flex',
  flexDirection: 'column',
  flexShrink: 0,
  fontSize: '11pt',
  fontStyle: 'normal',
  gap: '0.04in',
  lineHeight: 1.22,
  margin: 0,
  textAlign: 'right',
});

globalStyle(`${contactList} a`, {
  color: 'inherit',
  fontWeight: 'inherit',
  textDecoration: 'none',
});

export const contactRow = style({
  display: 'flex',
  gap: '0.08in',
  justifyContent: 'flex-end',

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

export const metricStrip = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  listStyle: 'none',
  margin: '0.05in 0 0.06in',
  padding: 0,
});

globalStyle(`${metricStrip} li`, {
  alignItems: 'center',
  borderLeft: '1pt solid #d8d8d8',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.02in',
  // Neutralize the site-wide ul li bullet/padding styles from globals.css
  paddingLeft: 0,
  textAlign: 'center',
});

globalStyle(`${metricStrip} li:before`, {
  content: 'none',
  display: 'none',
});

globalStyle(`${metricStrip} li:first-child`, {
  borderLeft: 'none',
});

export const metricValue = style({
  color: 'var(--resume-accent)',
  fontSize: '12.4pt',
  fontWeight: 800,
  lineHeight: 1.05,
});

export const metricLabel = style({
  color: 'var(--resume-muted)',
  fontSize: '9.1pt',
  lineHeight: 1.05,
});

export const techLine = style({
  color: '#3a3a3a',
  fontSize: '11pt',
  lineHeight: 1.3,
  margin: '0.06in 0 0',
});

globalStyle(`${techLine} strong`, {
  color: '#000000',
  fontWeight: 800,
});

export const summary = style({
  marginTop: '0.1in',
});

export const section = style({});

// Divider-free sections rely on vertical rhythm: stacked sections get an
// explicit top gap while the first frame on each page stays flush
export const sectionFrame = style({
  selectors: {
    '&:not(:first-child)': {
      marginTop: '0.16in',
    },
  },
});

globalStyle(`${section} h2, ${summary} h2`, {
  borderBottom: 0,
  color: '#000000',
  fontSize: '19pt',
  fontWeight: 800,
  letterSpacing: 0,
  lineHeight: 1.1,
  margin: '0 0 0.1in',
  paddingBottom: 0,
});

globalStyle(`${summary} h2`, {
  borderBottom: 0,
  fontSize: '13.7pt',
  marginBottom: '0.08in',
  paddingBottom: 0,
});

export const workEntry = style({
  marginBottom: '0.09in',
});

export const workHeader = style({
  alignItems: 'flex-start',
  display: 'flex',
  gap: '0.2in',
  justifyContent: 'space-between',
  margin: '0 0 0.09in',

  '@media': {
    print: {
      display: 'flex !important',
      justifyContent: 'space-between !important',
    },
  },
});

export const simpleItem = style({});

globalStyle(`${workHeader} h3, ${simpleItem} h3`, {
  color: '#000000',
  fontSize: '13.8pt',
  fontWeight: 800,
  letterSpacing: 0,
  lineHeight: 1.15,
  margin: 0,
});

export const role = style({
  color: '#4a4a4a',
  fontSize: '11.3pt',
  fontStyle: 'italic',
  fontWeight: 500,
  lineHeight: 1.2,
  margin: '0.03in 0 0',
});

export const periodBlock = style({
  color: '#111111',
  flex: '0 0 auto',
  fontSize: '11.4pt',
  lineHeight: 1.24,
  textAlign: 'right',

  '@media': {
    print: {
      marginTop: '0 !important',
      textAlign: 'right',
      flex: '0 0 1.55in !important',
    },
  },
});

globalStyle(`${periodBlock} p`, {
  margin: 0,
  textAlign: 'right',

  '@media': {
    print: {
      marginTop: '0 !important',
      textAlign: 'right',
    },
  },
});

globalStyle(`${simpleItem} header p`, {
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
  marginBottom: '0.07in',

  selectors: {
    '&:last-child': {
      marginBottom: 0,
    },
  },
});

export const projectHeader = style({
  alignItems: 'baseline',
  display: 'flex',
  gap: '0.2in',
  justifyContent: 'space-between',
  margin: '0 0 0.06in',

  '@media': {
    print: {
      display: 'flex !important',
      justifyContent: 'space-between !important',
    },
  },
});

globalStyle(`${projectHeader} h4`, {
  color: '#000000',
  fontSize: '12.7pt',
  fontWeight: 800,
  lineHeight: 1.2,
  margin: 0,
});

export const projectPeriod = style({
  color: 'var(--resume-muted)',
  flex: '0 0 auto',
  fontSize: '11pt',
  lineHeight: 1.2,
  margin: 0,
  textAlign: 'right',
});

export const projectSummary = style({
  color: '#111111',
  fontSize: '10.8pt',
  lineHeight: 1.3,
  margin: '0 0 0.06in',
});

globalStyle(`${projectSummary} strong`, {
  color: '#000000',
  fontWeight: 800,
});

export const bullets = style({
  color: '#111111',
  fontSize: '10.75pt',
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
  lineHeight: 1.22,
  padding: '0.008in 0 0.008in 0.23in',
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
  columnGap: '0.4in',
  gridTemplateColumns: 'repeat(2, 1fr)',
  margin: '0 0 0.2in',
  rowGap: '0.06in',

  '@media': {
    '(max-width: 900px)': {
      gridTemplateColumns: '1fr',
    },
    print: {
      gridTemplateColumns: 'repeat(2, 1fr) !important',
    },
  },
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

globalStyle(`${skillRow}:last-child`, {
  gridColumn: '1 / -1',
});

globalStyle(`${skillRow} dt`, {
  color: '#000000',
  fontSize: '11.8pt',
  fontWeight: 800,
  lineHeight: 1.2,
});

globalStyle(`${skillRow} dd`, {
  color: '#111111',
  fontSize: '11.7pt',
  lineHeight: 1.2,
  margin: 0,
});

export const simpleList = style({
  display: 'grid',
  gap: '0.12in',
});

globalStyle(`${simpleItem} header`, {
  alignItems: 'baseline',
  display: 'flex',
  gap: '0.2in',
  justifyContent: 'space-between',
  marginBottom: '0.06in',

  '@media': {
    print: {
      display: 'flex !important',
      justifyContent: 'space-between !important',
    },
  },
});

globalStyle(`${simpleItem} header p`, {
  color: '#111111',
  flex: '0 0 auto',
  fontSize: '11.3pt',
  lineHeight: 1.2,
  textAlign: 'right',
});

// Inline code snippets (e.g. SDK names) — monospace with a subtle chip
export const inlineCode = style({
  background: '#f1f3f6',
  borderRadius: '3px',
  color: '#111111',
  fontFamily: 'var(--font-family-code), monospace',
  fontSize: '0.9em',
  fontWeight: 500,
  padding: '0.02in 0.06in',
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
