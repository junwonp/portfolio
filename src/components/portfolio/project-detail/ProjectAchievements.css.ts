import { globalStyle, style } from '@vanilla-extract/css';

export const achievements = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  marginBottom: '56px',
});

export const open = style({});

export const achCard = style({
  borderRadius: '16px',
  background: 'var(--color-basic-bg)',
  overflow: 'hidden',
  minWidth: 0,
  transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',

  ':hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 6px 24px rgba(0, 0, 0, 0.04)',
  },

  selectors: {
    'html.dark &': {
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
      border: '0.5px solid rgba(255, 255, 255, 0.05)',
    },
    'html.dark &:hover': {
      boxShadow: '0 6px 24px rgba(0, 0, 0, 0.22)',
    },
    [`&.${open}`]: {
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.05)',
    },
    [`html.dark &.${open}`]: {
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.25)',
    },
  },
});

export const achHeader = style({
  width: '100%',
  padding: '16px 20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '16px',
  cursor: 'pointer',
  userSelect: 'none',
  background: 'transparent',
  border: 'none',
  textAlign: 'left',

  '@media': {
    '(max-width: 640px)': {
      padding: '14px 16px',
      gap: '12px',
    },
  },
});

export const achTitleRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  flex: 1,
  minWidth: 0,

  '@media': {
    '(max-width: 640px)': {
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '8px',
    },
  },
});

export const achTag = style({
  flexShrink: 0,
  minWidth: '60px',
  textAlign: 'center',
});

export const achTitle = style({
  fontSize: '1.0625rem',
  fontWeight: 600,
  color: 'var(--color-bold)',
  lineHeight: 1.4,
  overflowWrap: 'anywhere',

  '@media': {
    '(max-width: 640px)': {
      fontSize: '0.9375rem',
    },
  },
});

export const achHeaderRight = style({
  display: 'flex',
  alignItems: 'center',
  color: 'var(--color-sub)',
});

export const achChevron = style({
  transition: 'transform 0.2s',
  flexShrink: 0,

  selectors: {
    [`&.${open}`]: {
      transform: 'rotate(180deg)',
      color: 'var(--color-primary)',
    },
  },
});

export const achBodyWrapper = style({
  maxHeight: 0,
  overflow: 'hidden',
  transition: 'max-height 0.25s cubic-bezier(0.4, 0, 0.2, 1)',

  selectors: {
    [`&.${open}`]: {
      maxHeight: '1000px',
    },
  },

  '@media': {
    print: {
      selectors: {
        '&&': {
          maxHeight: 'none',
          overflow: 'visible',
        },
      },
    },
  },
});

export const achBody = style({
  padding: '0 20px 20px',

  '@media': {
    '(max-width: 640px)': {
      padding: '0 16px 16px',
    },
  },
});

export const achDesc = style({
  fontSize: '0.9375rem',
  color: 'var(--color-main)',
  lineHeight: 1.6,
  borderTop: '1px solid var(--color-bg-subdivider)',
  paddingTop: '16px',
  overflowWrap: 'anywhere',
});

globalStyle(`${achDesc} strong`, {
  color: 'var(--color-bold)',
  fontWeight: 700,
});

globalStyle(`${achDesc} code`, {
  background: 'var(--color-code-bg)',
  color: 'var(--color-inline-code)',
  padding: '2px 5px',
  borderRadius: '4px',
  overflowWrap: 'anywhere',
  wordBreak: 'break-word',
});

globalStyle(`${achDesc} img`, {
  width: '100%',
  marginTop: '12px',
  borderRadius: '8px',
});

globalStyle(`${achDesc} table`, {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '0.875rem',
  marginTop: '0.75rem',
});

globalStyle(`${achDesc} td, ${achDesc} th`, {
  padding: '6px 8px',
  borderBottom: '1px solid var(--color-bg-divider)',
  textAlign: 'left',
});
