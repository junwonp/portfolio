import { globalStyle, style } from '@vanilla-extract/css';

export const mainContent = style({
  minWidth: 0,
  width: '100%',
});

globalStyle(`${mainContent} > section`, {
  marginBottom: 'var(--space-xl)',
});

export const contentWrapper = style({
  display: 'flex',
  flexDirection: 'column',
});

globalStyle(`${contentWrapper} > section`, {
  marginBottom: 'var(--space-xl)',
});

globalStyle(`${contentWrapper} > section:last-child`, {
  marginBottom: 0,
});
