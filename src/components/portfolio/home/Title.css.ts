import { globalStyle, style } from '@vanilla-extract/css';

export const header = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
});

const withBack = style({});

export const titleContainer = style({
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  margin: '0 0 0.67em 0',
  gap: 'var(--space-sm)',
  maxWidth: '100%',
  minWidth: 0,

  selectors: {
    [`&.${withBack}`]: {
      justifyContent: 'space-between',
      gap: 0,
    },
  },

  '@media': {
    '(max-width: 576px)': {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 'var(--space-xs)',
    },
  },
});

const backButton = style({
  display: 'none',
  alignItems: 'center',
  padding: 'var(--space-sm)',
  paddingLeft: 0,

  '@media': {
    '(max-width: 576px)': {
      display: 'flex',
    },
    '(min-width: 576px)': {
      display: 'none',
    },
  },
});

globalStyle(`${backButton} a`, {
  alignItems: 'center',
  borderRadius: 'var(--radius-circle)',
  color: 'var(--color-main)',
  display: 'flex',
  justifyContent: 'center',
  padding: 'var(--space-xs)',
  textDecoration: 'none',
  transition: 'background 0.2s, color 0.2s, transform 0.1s',
});

globalStyle(`${backButton} a:active`, {
  transform: 'scale(0.9)',
});

globalStyle(`${backButton} a:hover`, {
  background: 'color-mix(in srgb, var(--color-primary) 15%, transparent)',
  color: 'var(--color-primary)',
});

export const title = style({
  fontSize: 'var(--font-h1)',
  overflowWrap: 'anywhere',
  lineHeight: 1.1,
  margin: 0,
  wordBreak: 'keep-all',
  flex: 1,
  minWidth: 0,
  paddingRight: '160px',

  '@media': {
    '(max-width: 576px)': {
      width: 'auto !important',
      flex: '1 !important',
      paddingRight: 0,
      wordBreak: 'normal',
    },
  },
});

export const role = style({
  fontSize: 'var(--font-role)',
  lineHeight: 1.1,
  margin: '0 0 0.67em 0',
  overflowWrap: 'anywhere',
  wordBreak: 'keep-all',

  '@media': {
    '(max-width: 576px)': {
      wordBreak: 'normal',
    },
  },
});

export const tagline = style({
  color: 'var(--color-sub)',
  fontSize: 'var(--font-tagline)',
  lineHeight: 1.1,
  margin: '0 0 0.67em 0',
  overflowWrap: 'anywhere',
  wordBreak: 'keep-all',

  '@media': {
    '(max-width: 576px)': {
      wordBreak: 'normal',
    },
  },
});

export const pillars = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.65rem',
  listStyle: 'none',
  margin: 'var(--space-sm) 0 var(--space-md)',
  padding: 0,
});

export const pillar = style({
  alignItems: 'flex-start',
  backgroundColor: 'var(--color-code-bg)',
  borderRadius: 'var(--radius-md)',
  display: 'flex',
  gap: '0.75rem',
  lineHeight: 'inherit',
  padding: '0.75rem var(--space-sm)',
  position: 'static',
  border: '0.5px solid rgba(0, 0, 0, 0.03)',

  selectors: {
    '&::before': {
      display: 'none',
    },
    '.dark &': {
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
      border: '0.5px solid rgba(255, 255, 255, 0.04)',
    },
  },
});

export const pillarIndex = style({
  color: 'var(--color-primary-hover)',
  fontSize: '0.75rem',
  fontWeight: 600,
  flexShrink: 0,
  paddingTop: '0.1rem',
});

export const pillarContent = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.125rem',
});

export const pillarTitle = style({
  color: 'var(--color-bold)',
  fontSize: '0.875rem',
  fontWeight: 600,
});

export const pillarDesc = style({
  color: 'var(--color-sub)',
  fontSize: '0.8rem',
  lineHeight: 1.4,

  '@media': {
    '(max-width: 576px)': {
      display: 'none',
    },
  },
});
