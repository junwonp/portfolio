import { globalStyle, style } from '@vanilla-extract/css';

export const applicationLinkCard = style({
  display: 'block',
  padding: 'var(--space-sm)',
  position: 'relative',
  zIndex: 'var(--z-base)',

  selectors: {
    '&:first-of-type': {
      zIndex: 2,
    },
  },
});

export const applicationLinkPanel = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
});

export const linkTable = style({
  width: '100%',
});

globalStyle(`${linkTable} th`, {
  borderBottom: '1.5px solid var(--color-bg-divider)',
  color: 'var(--color-sub)',
  fontWeight: 600,
  fontSize: '0.82rem',
  padding: '0.6rem 0.75rem',
  textAlign: 'left',
  whiteSpace: 'nowrap',
});

globalStyle(`${linkTable} td`, {
  borderBottom: '0.5px solid var(--color-bg-subdivider)',
  fontSize: '0.85rem',
  padding: '0.6rem 0.75rem',
});

globalStyle(`${linkTable} tbody tr:hover`, {
  background: 'var(--color-surface-hover)',
});
