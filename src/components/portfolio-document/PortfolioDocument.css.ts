import { globalStyle, style } from '@vanilla-extract/css';

import { FIGURE_CELL_BORDER_PX, FIGURE_CELL_GAP_PX, FIGURE_CELL_PADDING_PX } from './figureRow';

import {
  PAGE_PADDING_BOTTOM_PX,
  PAGE_PADDING_TOP_PX,
  PAGE_SIDE_PADDING,
  PAGE_WIDTH,
} from './pageGeometry';

const textFont = "var(--font-family-text), 'Wanted Sans', sans-serif";
// Geist Mono lacks Hangul, so the text font follows it to keep Korean inline code machine-independent.
const codeFont = "var(--font-family-code), var(--font-family-text), 'Wanted Sans', monospace";

/*
 * A printed artifact carries its own ink. The site theme tokens are screen
 * values that flip with the user's theme, so a dark-mode run would print light
 * text on white paper. Every value below is a fixed paper/ink value instead.
 *
 * The type scale is derived from published print typography: Butterick's
 * 10-12pt body optimum with 120-145% leading, and the 9pt floor for small
 * text. Body copy sits at 11pt/1.45; nothing renders below 9pt.
 */
export const shell = style({
  vars: {
    '--doc-paper': '#ffffff',
    '--doc-backdrop': '#eef1f4',
    '--doc-ink': '#111111',
    '--doc-secondary': '#3d3d3d',
    '--doc-muted': '#595959',
    '--doc-hairline': '#d8d8d8',
    '--doc-accent': '#1f4f9e',
    '--doc-surface': '#f7f8fa',
    '--doc-inline-bg': '#eef1f6',
    '--doc-hairline-width': '0.5pt',
    '--doc-rule-width': '1pt',
    '--doc-masthead-rule': '2pt',
    '--doc-radius-chip': '2pt',
    // Page 1 inherits no flow rhythm, so the cover band spacing is stated rather than derived.
    '--doc-cover-gap': '1.9in',
    '--doc-space-1': '0.0575in',
    '--doc-space-2': '0.1035in',
    '--doc-space-3': '0.161in',
    '--doc-space-4': '0.2in',
    '--doc-space-5': '0.28in',
    '--doc-space-6': '0.4in',
  },
  background: 'var(--doc-backdrop)',
  color: 'var(--doc-ink)',
  fontFamily: textFont,
  fontSize: '11pt',
  lineHeight: 1.45,
  overflowX: 'auto',
  padding: '1.5rem',

  '@media': {
    '(max-width: 900px)': {
      padding: '0.75rem',
    },
    screen: {
      // Anchors the preview layer (PageSeams) behind the sheet; print has none.
      position: 'relative',
    },
    print: {
      background: 'var(--doc-paper)',
      overflow: 'visible',
      padding: 0,
    },
  },
});

/*
 * The sheet mirrors the @page margins on screen so the preview matches the
 * print. In print the padding is dropped and the margins come from @page: an
 * element's own padding is only honoured on the first and last page of a
 * flowing box, so element-level vertical padding would print edge-to-edge
 * sheets in between. The width stays A4 at every viewport — the shell scrolls
 * instead, because a preview that shrinks stops matching the paper it previews.
 */
export const sheet = style({
  background: 'var(--doc-paper)',
  boxSizing: 'border-box',
  color: 'var(--doc-ink)',
  margin: '0 auto',
  overflowWrap: 'anywhere',
  padding: `${PAGE_PADDING_TOP_PX}px ${PAGE_SIDE_PADDING} ${PAGE_PADDING_BOTTOM_PX}px`,
  width: PAGE_WIDTH,
  wordBreak: 'keep-all',

  selectors: {
    // PageSeams fills the preview layer once it has measured the flow. Until
    // then — and with scripting off — the sheet is its own paper; afterwards the
    // layer's sheets are, which is what lets the backdrop show in the gaps.
    '[data-page-count]:not(:empty) ~ &': {
      '@media': {
        screen: {
          background: 'transparent',
        },
      },
    },
  },

  '@media': {
    screen: {
      // PageSeams replaces this with the rest of the last page, so the final
      // sheet ends at a full A4 like the others.
      paddingBottom: `var(--doc-tail-padding, ${PAGE_PADDING_BOTTOM_PX}px)`,
      // Paints above the preview layer, which is its previous sibling.
      position: 'relative',
    },
    print: {
      background: 'var(--doc-paper)',
      margin: 0,
      padding: 0,
      width: 'auto',
    },
  },
});

globalStyle(`${sheet} a`, {
  color: 'inherit',
  fontWeight: 'inherit',
  textDecoration: 'none',
});

// The site-wide important inline-code rule otherwise discards the Hangul fallback.
globalStyle(`${sheet}[data-document-sheet] code:not(pre code)`, {
  fontFamily: `${codeFont} !important`,
});

export const masthead = style({
  borderBottom: 'var(--doc-masthead-rule) solid var(--doc-ink)',
  breakInside: 'avoid',
  paddingBottom: 'var(--doc-space-3)',
  pageBreakInside: 'avoid',
});

export const name = style({
  color: 'var(--doc-ink)',
  fontSize: '24pt',
  fontWeight: 800,
  letterSpacing: '-0.02em',
  lineHeight: 1.1,
  margin: 0,
});

export const role = style({
  color: 'var(--doc-ink)',
  fontSize: '14pt',
  fontWeight: 700,
  lineHeight: 1.2,
  margin: 'var(--doc-space-1) 0 0',
});

export const tagline = style({
  color: 'var(--doc-secondary)',
  fontSize: '11.5pt',
  fontWeight: 400,
  lineHeight: 1.45,
  margin: 'var(--doc-space-1) 0 0',
});

export const contact = style({
  color: 'var(--doc-muted)',
  display: 'flex',
  flexWrap: 'wrap',
  fontSize: '9.5pt',
  fontStyle: 'normal',
  gap: '0.04in var(--doc-space-4)',
  lineHeight: 1.35,
  margin: 'var(--doc-space-2) 0 0',
});

export const contactItem = style({
  alignItems: 'baseline',
  display: 'inline-flex',
});

export const metrics = style({
  breakInside: 'avoid',
  display: 'grid',
  gap: 'var(--doc-space-3)',
  gridAutoColumns: '1fr',
  gridAutoFlow: 'column',
  listStyle: 'none',
  margin: 'var(--doc-space-3) 0 0',
  padding: 0,
  pageBreakInside: 'avoid',
});

export const metric = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.01in',
});

export const metricValue = style({
  color: 'var(--doc-accent)',
  fontSize: '14pt',
  fontVariantNumeric: 'tabular-nums',
  fontWeight: 700,
  letterSpacing: '-0.01em',
  lineHeight: 1.15,
});

export const metricLabel = style({
  color: 'var(--doc-muted)',
  fontSize: '9pt',
  lineHeight: 1.3,
});

// Neutralize the site-wide `ul li` bullet/padding so list semantics stay invisible.
globalStyle(`${metrics} li`, {
  borderLeft: 'var(--doc-hairline-width) solid var(--doc-hairline)',
  lineHeight: 1.25,
  padding: '0 0 0 var(--doc-space-2)',
  position: 'static',
});

globalStyle(`${metrics} li:first-child`, {
  borderLeft: 'none',
  paddingLeft: 0,
});

globalStyle(`${metrics} li::before`, {
  content: 'none',
  display: 'none',
});

export const section = style({
  margin: 'var(--doc-space-5) 0 0',

  '@media': {
    print: {
      breakBefore: 'page',
      // Margins are truncated at a forced break anyway; the @page margin is the
      // real top spacing on every page after the first.
      marginTop: 0,
      pageBreakBefore: 'always',
    },
  },
});

/*
 * The cover carries the profile framing. It is pushed well clear of the masthead
 * rule so page 1 reads as composed rather than as content that ran out.
 */
export const pillars = style({
  breakInside: 'avoid',
  display: 'grid',
  gap: 0,
  listStyle: 'none',
  margin: 'var(--doc-cover-gap) 0 0',
  padding: 0,
  pageBreakInside: 'avoid',
});

export const pillar = style({
  alignItems: 'baseline',
  breakInside: 'avoid',
  columnGap: 'var(--doc-space-4)',
  display: 'grid',
  gridTemplateColumns: '0.4in 1fr',
  pageBreakInside: 'avoid',

  selectors: {
    '& + &': {
      borderTop: 'var(--doc-hairline-width) solid var(--doc-hairline)',
      marginTop: 'var(--doc-space-6)',
      paddingTop: 'var(--doc-space-6)',
    },
  },
});

export const pillarIndex = style({
  color: 'var(--doc-accent)',
  fontSize: '11pt',
  fontVariantNumeric: 'tabular-nums',
  fontWeight: 700,
  letterSpacing: '0.02em',
  lineHeight: 1.35,
});

export const pillarBody = style({
  display: 'flex',
  flexDirection: 'column',
});

export const pillarTitle = style({
  color: 'var(--doc-ink)',
  fontSize: '13pt',
  fontWeight: 700,
  lineHeight: 1.3,
});

export const pillarDescription = style({
  color: 'var(--doc-secondary)',
  fontSize: '11pt',
  lineHeight: 1.45,
  marginTop: 'var(--doc-space-1)',
  maxWidth: '5.4in',
});

// Neutralize the site-wide `ul li` bullet/padding so list semantics stay invisible.
globalStyle(`${pillars} li`, {
  lineHeight: 1.3,
  padding: 0,
  position: 'static',
});

globalStyle(`${pillars} li::before`, {
  content: 'none',
  display: 'none',
});

export const sectionHeading = style({
  alignItems: 'baseline',
  borderBottom: 'var(--doc-rule-width) solid var(--doc-ink)',
  breakAfter: 'avoid',
  color: 'var(--doc-ink)',
  display: 'flex',
  fontSize: '14pt',
  fontWeight: 800,
  gap: 'var(--doc-space-2)',
  letterSpacing: '-0.01em',
  lineHeight: 1.2,
  margin: '0 0 var(--doc-space-3)',
  paddingBottom: 'var(--doc-space-1)',
  pageBreakAfter: 'avoid',
});

export const sectionNumber = style({
  color: 'var(--doc-accent)',
  fontSize: '11pt',
  fontVariantNumeric: 'tabular-nums',
  fontWeight: 700,
  letterSpacing: '0.02em',
});

export const project = style({
  borderTop: 'var(--doc-hairline-width) solid var(--doc-hairline)',
  breakInside: 'avoid',
  margin: 'var(--doc-space-4) 0 0',
  paddingTop: 'var(--doc-space-3)',
  pageBreakInside: 'avoid',

  selectors: {
    '&:first-of-type': {
      borderTop: 'none',
      marginTop: 0,
      paddingTop: 0,
    },
  },
});

/*
 * Screen preview only. A simulated page break needs real space on the flowing
 * sheet, and the space is not a constant: it is whatever is left of the A4 that
 * page started on, so PageSeams sets --doc-page-advance per break. The class sits
 * inside a screen media query so print keeps each block's own margin, and it is
 * declared after the block margins so it wins the equal-specificity cascade.
 */
export const pageGap = style({
  '@media': {
    screen: {
      marginTop: 'var(--doc-page-advance)',
    },
  },
});

export const projectHeader = style({
  alignItems: 'baseline',
  breakInside: 'avoid',
  display: 'flex',
  gap: 'var(--doc-space-4)',
  justifyContent: 'space-between',
  pageBreakInside: 'avoid',
});

export const projectTitle = style({
  color: 'var(--doc-ink)',
  fontSize: '12.5pt',
  fontWeight: 700,
  lineHeight: 1.25,
  margin: 0,
});

export const projectPeriod = style({
  color: 'var(--doc-muted)',
  flex: '0 0 auto',
  fontSize: '9.5pt',
  fontVariantNumeric: 'tabular-nums',
  fontWeight: 500,
  lineHeight: 1.3,
  margin: 0,
  textAlign: 'right',
  whiteSpace: 'nowrap',
});

export const projectRole = style({
  color: 'var(--doc-secondary)',
  fontSize: '10.5pt',
  fontWeight: 600,
  lineHeight: 1.35,
  margin: 'var(--doc-space-1) 0 0',
});

export const projectMeta = style({
  alignItems: 'baseline',
  breakInside: 'avoid',
  display: 'flex',
  flexWrap: 'wrap',
  fontSize: '9.5pt',
  gap: '0.02in var(--doc-space-3)',
  lineHeight: 1.35,
  margin: 'var(--doc-space-1) 0 0',
  pageBreakInside: 'avoid',
});

export const projectPlatforms = style({
  color: 'var(--doc-secondary)',
  fontSize: '9.5pt',
});

export const projectLink = style({
  color: 'var(--doc-muted)',
  fontSize: '9.5pt',
});

export const summary = style({
  color: 'var(--doc-ink)',
  fontSize: '11pt',
  lineHeight: 1.45,
  margin: 'var(--doc-space-2) 0 0',
});

export const bullets = style({
  color: 'var(--doc-ink)',
  fontSize: '11pt',
  lineHeight: 1.45,
  listStyle: 'none',
  margin: 'var(--doc-space-2) 0 0',
  padding: 0,
});

globalStyle(`${bullets} li`, {
  padding: '0 0 0 0.14in',
  position: 'relative',
});

globalStyle(`${bullets} li::before`, {
  color: 'var(--doc-muted)',
  content: '"–"',
  left: 0,
  position: 'absolute',
  top: 0,
});

export const chips = style({
  breakInside: 'avoid',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.03in',
  listStyle: 'none',
  margin: 'var(--doc-space-2) 0 0',
  padding: 0,
  pageBreakInside: 'avoid',
});

// A filled editorial tag: a border would read as a row of buttons.
export const chip = style({
  background: 'var(--doc-surface)',
  borderRadius: 'var(--doc-radius-chip)',
  color: 'var(--doc-secondary)',
  fontSize: '9pt',
  lineHeight: 1.3,
  printColorAdjust: 'exact',
  WebkitPrintColorAdjust: 'exact',
});

globalStyle(`${chips} li`, {
  padding: '0.012in 0.045in',
  position: 'static',
});

globalStyle(`${chips} li::before`, {
  content: 'none',
  display: 'none',
});

/*
 * A row of screenshots, all at one height, sized to the sheet's content width by
 * figureRow.ts. Each cell is exactly its image's ratio plus the frame chrome, so
 * the row cannot outgrow the width or the per-image height cap, and every image
 * keeps its own ratio: nothing is cropped, stretched or overlaid.
 */
export const figureRow = style({
  breakInside: 'avoid',
  display: 'flex',
  gap: `${FIGURE_CELL_GAP_PX}px`,
  margin: 'var(--doc-space-3) 0 0',
  pageBreakInside: 'avoid',
});

export const figureCell = style({
  background: 'var(--doc-surface)',
  border: `${FIGURE_CELL_BORDER_PX}px solid var(--doc-hairline)`,
  boxSizing: 'border-box',
  flex: '0 0 auto',
  // The UA gives figure a 1em/40px margin, which would space the row past the
  // content width and make Chromium shrink the whole print job to fit.
  margin: 0,
  padding: `${FIGURE_CELL_PADDING_PX}px`,
});

export const figureImage = style({
  display: 'block',
  // The cell matches the image's ratio; contain absorbs the sub-pixel remainder.
  height: '100%',
  objectFit: 'contain',
  width: '100%',
});

export const inlineCode = style({
  background: 'var(--doc-inline-bg)',
  borderRadius: 'var(--doc-radius-chip)',
  color: 'var(--doc-ink)',
  fontFamily: codeFont,
  fontSize: '0.92em',
  fontWeight: 500,
  padding: '0.01in 0.035in',
  printColorAdjust: 'exact',
  WebkitPrintColorAdjust: 'exact',
});

export const skillList = style({
  breakInside: 'avoid',
  display: 'grid',
  gap: 'var(--doc-space-2)',
  margin: 0,
  pageBreakInside: 'avoid',
});

export const skillRow = style({
  borderTop: 'var(--doc-hairline-width) solid var(--doc-hairline)',
  breakInside: 'avoid',
  columnGap: 'var(--doc-space-3)',
  display: 'grid',
  gridTemplateColumns: '1.45in 1fr',
  paddingTop: 'var(--doc-space-2)',
  pageBreakInside: 'avoid',

  selectors: {
    '&:first-child': {
      borderTop: 'none',
      paddingTop: 0,
    },
  },
});

export const skillTitle = style({
  color: 'var(--doc-ink)',
  fontSize: '11pt',
  fontWeight: 700,
  lineHeight: 1.35,
});

export const skillValues = style({
  color: 'var(--doc-secondary)',
  fontSize: '11pt',
  lineHeight: 1.45,
  margin: 0,
});

export const educationList = style({
  breakInside: 'avoid',
  display: 'grid',
  gap: 'var(--doc-space-3)',
  pageBreakInside: 'avoid',
});

export const educationRow = style({
  alignItems: 'baseline',
  breakInside: 'avoid',
  display: 'flex',
  gap: 'var(--doc-space-4)',
  justifyContent: 'space-between',
  pageBreakInside: 'avoid',
});

export const educationSchool = style({
  color: 'var(--doc-ink)',
  fontSize: '12pt',
  fontWeight: 700,
  lineHeight: 1.3,
  margin: 0,
});

export const educationMajor = style({
  color: 'var(--doc-secondary)',
  fontSize: '11pt',
  lineHeight: 1.35,
  margin: 'var(--doc-space-1) 0 0',
});

export const educationPeriod = style({
  color: 'var(--doc-muted)',
  flex: '0 0 auto',
  fontSize: '9.5pt',
  fontVariantNumeric: 'tabular-nums',
  fontWeight: 500,
  lineHeight: 1.3,
  margin: 0,
  textAlign: 'right',
  whiteSpace: 'nowrap',
});

// Any ancestor with overflow other than visible isolates fragmentation, which
// clips the flow to one page instead of paginating it.
globalStyle('html, body', {
  '@media': {
    print: {
      background: '#ffffff !important',
      height: 'auto !important',
      overflow: 'visible !important',
    },
  },
});
