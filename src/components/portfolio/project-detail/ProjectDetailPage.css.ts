import { globalStyle, style } from '@vanilla-extract/css';

export const primary = style({});
export const github = style({});

export const topbarLinks = style({
  marginLeft: 'auto',
  display: 'flex',
  gap: '4px',
  alignItems: 'center',
  zIndex: 1,
});

export const topbarLink = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '4px',
  fontSize: '0.875rem',
  fontWeight: 500,
  fontFamily: 'inherit',
  color: 'var(--color-primary)',
  textDecoration: 'none',
  height: '32px',
  padding: '0 12px',
  border: '1px solid color-mix(in srgb, var(--color-primary) 8%, transparent)',
  backgroundColor: 'color-mix(in srgb, var(--color-surface-hover) 80%, transparent)',
  backdropFilter: 'saturate(140%) blur(12px)',
  WebkitBackdropFilter: 'saturate(140%) blur(12px)',
  borderRadius: '9999px',
  whiteSpace: 'nowrap',
  transition: 'background-color 0.15s, color 0.15s, transform 0.1s',

  ':hover': {
    backgroundColor: 'var(--color-disabled-bg)',
  },

  ':active': {
    transform: 'scale(0.94)',
  },

  selectors: {
    [`&.${primary}`]: {
      background: 'var(--color-primary)',
      color: '#fff !important',
      borderRadius: '9999px',
      padding: '6px 14px',
      opacity: 1,
    },
    [`&.${primary}:hover`]: {
      background: 'var(--color-primary-hover)',
      opacity: 0.95,
    },
    [`&.${primary}:active`]: {
      transform: 'scale(0.96)',
      opacity: 0.8,
    },
    [`&.${github}`]: {
      color: '#1f2328',
      borderColor: 'rgba(31, 35, 40, 0.15)',
      backgroundColor: 'rgba(31, 35, 40, 0.04)',
    },
    [`&.${github}:hover`]: {
      backgroundColor: 'rgba(31, 35, 40, 0.08)',
    },
    [`html.dark &.${github}`]: {
      color: '#f0f6fc',
      borderColor: 'rgba(240, 246, 252, 0.15)',
      backgroundColor: 'rgba(240, 246, 252, 0.08)',
    },
    [`html.dark &.${github}:hover`]: {
      backgroundColor: 'rgba(240, 246, 252, 0.15)',
    },
  },
});

export const content = style({
  minWidth: 0,
  width: '100%',
});

export const hero = style({
  paddingBottom: '48px',
  marginBottom: '48px',

  '@media': {
    '(max-width: 640px)': {
      padding: '32px 0 32px',
    },
  },
});

export const heroMeta = style({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '16px',
  flexWrap: 'wrap',
});

export const heroTitle = style({
  fontSize: 'var(--font-h1)',
  fontWeight: 700,
  letterSpacing: '-0.03em',
  lineHeight: 1.1,
  marginBottom: '12px',
  maxWidth: '100%',
  color: 'var(--color-bold)',
  overflowWrap: 'anywhere',
  wordBreak: 'break-word',

  '@media': {
    '(max-width: 640px)': {
      overflowWrap: 'anywhere',
      wordBreak: 'break-word',
    },
  },
});

export const heroTagline = style({
  fontSize: '15px',
  color: 'var(--color-sub)',
  marginBottom: '32px',
  lineHeight: 1.6,
  maxWidth: '560px',
  overflowWrap: 'anywhere',

  '@media': {
    '(max-width: 640px)': {
      overflowWrap: 'anywhere',
      wordBreak: 'break-word',
    },
  },
});

export const metricsRow = style({
  display: 'grid',
  gap: '12px',
  gridTemplateColumns: 'repeat(var(--metric-count), minmax(0, 1fr))',
  margin: 0,
  maxWidth: '680px',
  width: '100%',

  selectors: {
    'html.dark &': {
      background: 'transparent',
      boxShadow: 'none',
      border: 'none',
    },
  },

  '@media': {
    '(max-width: 640px)': {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
    '(max-width: 360px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

export const projectArticle = style({
  marginBottom: '56px',
  maxWidth: '100%',
  minWidth: 0,
  overflowWrap: 'anywhere',
  wordBreak: 'break-word',
});

globalStyle(`${projectArticle} h2, ${projectArticle} h3, ${projectArticle} p, ${projectArticle} li, ${projectArticle} blockquote, ${projectArticle} strong, ${projectArticle} code`, {
  maxWidth: '100%',
  overflowWrap: 'anywhere',
  wordBreak: 'break-word',
});

globalStyle(`${projectArticle} pre, ${projectArticle} pre code`, {
  whiteSpace: 'pre-wrap',
});

globalStyle(`@media (max-width: 640px)`, {
  [`${projectArticle} p, ${projectArticle} li`]: {
    overflowWrap: 'anywhere',
    wordBreak: 'break-word',
  },
});

export const h2Subtitle = style({
  display: 'block',
  fontSize: '0.9rem',
  fontWeight: 500,
  color: 'var(--color-sub)',
  letterSpacing: 0,
  marginTop: '4px',
});

export const errorMsg = style({
  color: 'var(--color-sub)',
  fontSize: '14px',
});

globalStyle(`${projectArticle} table`, {
  display: 'table',
  width: '100%',
  maxWidth: '100%',
  margin: '18px 0 24px',
  border: '1px solid var(--color-table-border)',
  borderRadius: '12px',
  borderCollapse: 'separate',
  borderSpacing: 0,
  background: 'var(--color-basic-bg)',
  fontSize: '0.92rem',
  lineHeight: 1.55,
  overflow: 'hidden',
});

globalStyle(`${projectArticle} thead tr:first-child th:first-child, ${projectArticle} table > tr:first-child > td:first-child, ${projectArticle} table > tbody:first-child > tr:first-child > td:first-child`, {
  borderTopLeftRadius: '11px',
});

globalStyle(`${projectArticle} thead tr:first-child th:last-child, ${projectArticle} table > tr:first-child > td:last-child, ${projectArticle} table > tbody:first-child > tr:first-child > td:last-child`, {
  borderTopRightRadius: '11px',
});

globalStyle(`${projectArticle} tbody tr:last-child td:first-child, ${projectArticle} table > tr:last-child > td:first-child, ${projectArticle} table > tbody:last-child > tr:first-child > td:first-child`, {
  borderBottomLeftRadius: '11px',
});

globalStyle(`${projectArticle} tbody tr:last-child td:last-child, ${projectArticle} table > tr:last-child > td:last-child, ${projectArticle} table > tbody:last-child > tr:last-child > td:last-child`, {
  borderBottomRightRadius: '11px',
});

globalStyle(`${projectArticle} thead`, {
  background: 'var(--color-table-bg)',
});

globalStyle(`${projectArticle} th, ${projectArticle} td`, {
  minWidth: '92px',
  padding: '10px 12px',
  borderRight: '1px solid var(--color-table-border)',
  borderBottom: '1px solid var(--color-table-border)',
  color: 'var(--color-main)',
  textAlign: 'left',
  verticalAlign: 'top',
});

globalStyle(`${projectArticle} th`, {
  color: 'var(--color-bold)',
  fontWeight: 700,
  whiteSpace: 'nowrap',
});

globalStyle(`${projectArticle} th:last-child, ${projectArticle} td:last-child`, {
  minWidth: '260px',
  borderRight: 0,
  whiteSpace: 'normal',
});

globalStyle(`${projectArticle} tr:last-child td`, {
  borderBottom: 0,
});

globalStyle(`@media (max-width: 576px)`, {
  [`${projectArticle} table`]: {
    background: 'transparent',
    border: 0,
    borderRadius: 0,
    display: 'block',
    overflow: 'visible',
  },
  [`${projectArticle} thead`]: {
    display: 'none',
  },
  [`${projectArticle} tbody`]: {
    display: 'grid',
    gap: '10px',
  },
  [`${projectArticle} tr`]: {
    background: 'var(--color-basic-bg)',
    border: '1px solid var(--color-table-border)',
    borderRadius: '12px',
    display: 'block',
    overflow: 'hidden',
  },
  [`${projectArticle} td`]: {
    borderRight: 0,
    display: 'grid',
    gap: '10px',
    gridTemplateColumns: 'minmax(92px, 35%) minmax(0, 1fr)',
    minWidth: 0,
    overflowWrap: 'anywhere',
    whiteSpace: 'normal',
  },
  [`${projectArticle} td::before`]: {
    color: 'var(--color-sub)',
    content: 'attr(data-label)',
    fontSize: '0.78rem',
    fontWeight: 700,
    lineHeight: 1.4,
  },
  [`${projectArticle} td:last-child`]: {
    minWidth: 0,
  },
});
