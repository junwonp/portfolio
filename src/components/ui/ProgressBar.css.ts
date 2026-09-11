import { style, styleVariants } from '@vanilla-extract/css';

export const track = style({
  backgroundColor: 'var(--color-disabled-bg)',
  borderRadius: 'var(--radius-full)',
  height: '0.375rem',
  overflow: 'hidden',
});

export const fill = style({
  height: '100%',
  borderRadius: 'var(--radius-full)',
  transition: 'width 0.3s var(--ease-standard)',
});

export const tone = styleVariants({
  primary: {
    backgroundColor: 'var(--color-primary)',
  },
  success: {
    backgroundColor: 'var(--color-success)',
  },
  warning: {
    backgroundColor: 'var(--color-warning)',
  },
});
