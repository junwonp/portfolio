import { globalStyle, style } from '@vanilla-extract/css';

import { projectItem } from './ProjectItem.css';

export const companyWrapper = style({
  display: 'flex',
  flexDirection: 'column',
});

export const open = style({});

export const companyCard = style({
  background: 'var(--color-basic-bg)',
  borderRadius: 'var(--radius-lg)',
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
  overflow: 'hidden',
  padding: '1.5rem',
  boxShadow: 'var(--shadow-card)',
  border: '0.5px solid color-mix(in srgb, var(--color-bg-divider) 40%, transparent)',

  selectors: {
    'html.dark &': {
      boxShadow: 'var(--shadow-card)',
      border: '0.5px solid rgba(255, 255, 255, 0.05)',
    },
    [`&.${open}`]: {
      boxShadow: 'var(--shadow-card-lifted)',
    },
    [`html.dark &.${open}`]: {
      boxShadow: 'var(--shadow-card-lifted)',
    },
  },

  '@media': {
    '(max-width: 576px)': {
      padding: '1.25rem',
    },
  },
});

export const companyHeader = style({
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-xs)',
  marginBottom: 0,
  padding: 0,
  textAlign: 'left',
  width: '100%',
  fontFamily: 'inherit',
});

export const companyTop = style({
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'space-between',
  gap: 'var(--space-sm)',
  width: '100%',
});

export const companyLeft = style({
  alignItems: 'center',
  display: 'flex',
  gap: '0.75rem',
  flexWrap: 'wrap',
  minWidth: 0,
});

export const companyAdminActions = style({
  alignItems: 'center',
  display: 'inline-flex',
  gap: '0.375rem',
});

export const companyName = style({
  color: 'var(--color-bold)',
  fontSize: 'var(--font-h3)',
  fontWeight: 700,
  margin: 0,
  overflowWrap: 'anywhere',
});

export const badges = style({
  display: 'flex',
  gap: 'var(--space-xs)',
});

export const companyRight = style({
  color: 'var(--color-sub)',
  fontSize: '0.9375rem',
});

export const companyInfoRow = style({
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  gap: 'var(--space-sm)',

  '@media': {
    '(max-width: 576px)': {
      alignItems: 'flex-start',
    },
  },
});

export const roleLine = style({
  alignItems: 'center',
  color: 'var(--color-sub)',
  display: 'flex',
  fontSize: '1rem',
  gap: 'var(--space-xs)',
  minWidth: 0,
  overflowWrap: 'anywhere',

  '@media': {
    '(max-width: 576px)': {
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '0.15rem',
    },
  },
});

export const roleSeparator = style({
  opacity: 0.5,

  '@media': {
    '(max-width: 576px)': {
      display: 'none',
    },
  },
});

export const expandIndicator = style({
  alignItems: 'center',
  color: 'var(--color-sub)',
  display: 'flex',
  gap: 'var(--space-2xs)',
  fontSize: '0.875rem',
  fontWeight: 500,
  transition: 'color 0.15s',

  selectors: {
    [`${companyHeader}:hover &`]: {
      color: 'var(--color-primary)',
    },
  },
});

globalStyle(`@media (max-width: 576px)`, {
  [`${expandIndicator} span`]: {
    display: 'none',
  },
});

export const chevronIcon = style({
  transition: 'transform 0.2s',
  flexShrink: 0,
  color: 'var(--color-sub)',

  selectors: {
    [`${companyHeader}:hover &`]: {
      color: 'var(--color-primary)',
    },
    [`&.${open}`]: {
      transform: 'rotate(180deg)',
      color: 'var(--color-primary)',
    },
  },
});

export const highlights = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  listStyle: 'none',
  margin: 0,
  padding: 0,
});

globalStyle(`${highlights} li`, {
  alignItems: 'flex-start',
  display: 'flex',
  gap: '0.75rem',
  padding: 0,
});

globalStyle(`${highlights} li:before`, {
  display: 'none !important',
});

export const bullet = style({
  width: '5px',
  height: '5px',
  borderRadius: 'var(--radius-circle)',
  backgroundColor: 'var(--color-primary)',
  marginTop: '0.65rem',
  flexShrink: 0,
});

export const highlightText = style({
  color: 'var(--color-main)',
  fontSize: '0.9375rem',
  lineHeight: 1.5,
  minWidth: 0,
  overflowWrap: 'anywhere',
});

export const projectList = style({
  borderTop: '0.5px solid var(--color-bg-divider)',
  display: 'flex',
  flexDirection: 'column',
  margin: '0.75rem -1.5rem -1.5rem -1.5rem',
  minWidth: 0,

  '@media': {
    '(max-width: 576px)': {
      margin: '0.5rem -1.25rem -1.25rem -1.25rem',
    },
  },
});

globalStyle(`${projectList} .${projectItem}`, {
  borderTop: '0.5px solid var(--color-bg-divider)',
});

export const additionalLink = style({
  alignSelf: 'flex-start',
  color: 'var(--color-primary)',
  fontSize: '0.875rem',
  fontWeight: 600,
  marginTop: '0.75rem',
  textDecoration: 'none',

  ':hover': {
    textDecoration: 'underline',
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

export const role = style({
  '@media': {
    '(max-width: 576px)': {
      fontSize: '0.9375rem',
    },
  },
});

export const periodCompact = style({
  '@media': {
    '(max-width: 576px)': {
      fontSize: '0.8125rem',
    },
  },
});
