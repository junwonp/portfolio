import { globalStyle, keyframes, style } from '@vanilla-extract/css';

const fadeSlideIn = keyframes({
  from: {
    opacity: 0,
    transform: 'translateY(10px)',
  },
  to: {
    opacity: 1,
    transform: 'translateY(0)',
  },
});

export const fadeSlideEnter = style({
  animation: `${fadeSlideIn} 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
});

export const mainContent = style({
  minWidth: 0,
  width: '100%',
  transition: 'opacity 0.3s ease, transform 0.3s ease',
});

globalStyle(`${mainContent} > section`, {
  marginBottom: 'var(--space-xl)',
});

export const sectionHeadingRow = style({
  alignItems: 'flex-start',
  display: 'flex',
  gap: 'var(--space-sm)',
  justifyContent: 'space-between',
});

globalStyle(`${sectionHeadingRow} .section-header`, {
  flex: 1,
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
