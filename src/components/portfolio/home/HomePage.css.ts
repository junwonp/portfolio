import { globalStyle, keyframes, style } from '@vanilla-extract/css';

const fadeSlideIn = keyframes({
  from: {
    opacity: 0,
    transform: 'translateY(14px)',
  },
  // Slight overshoot that settles back — a spring-like landing instead of a
  // plain decelerating stop
  '70%': {
    opacity: 1,
    transform: 'translateY(-2px)',
  },
  '85%': {
    transform: 'translateY(1px)',
  },
  to: {
    opacity: 1,
    transform: 'translateY(0)',
  },
});

export const fadeSlideEnter = style({
  animation: `${fadeSlideIn} 0.55s var(--ease-emphasized) both`,
  // Sections enter in sequence — each section passes its own --enter-delay
  animationDelay: 'var(--enter-delay, 0ms)',
});

export const mainContent = style({
  minWidth: 0,
  width: '100%',
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
