import { globalStyle, style } from '@vanilla-extract/css';

export const imageGallery = style({
  position: 'relative',
  margin: '2rem 0',
});

export const sliderContainer = style({
  columns: 2,
  columnGap: '1rem',
  ':focus-visible': {
    outline: '2px solid var(--color-primary)',
    outlineOffset: '2px',
  },
  '@media': {
    '(max-width: 767px)': {
      display: 'flex',
      columns: 'auto',
      gap: 0,
      overflowX: 'auto',
      scrollSnapType: 'x mandatory',
      overscrollBehaviorX: 'contain',
      scrollbarWidth: 'none',
      width: '100%',
    },
  },
});

export const pager = style({
  display: 'none',
  pointerEvents: 'none',
  '@media': {
    '(max-width: 767px)': {
      display: 'block',
      position: 'absolute',
      bottom: '0.5rem',
      right: '0.75rem',
      padding: '0.25rem 0.5rem',
      borderRadius: 'var(--radius-full)',
      background: 'rgba(0, 0, 0, 0.55)',
      color: '#fff',
      fontSize: '0.75rem',
      lineHeight: 1,
    },
  },
});

globalStyle(`${sliderContainer} > *`, {
  '@media': {
    '(max-width: 767px)': {
      flex: '0 0 100%',
      minWidth: 0,
      maxWidth: '100%',
      margin: 0,
      scrollSnapAlign: 'start',
    },
  },
});

globalStyle(`${sliderContainer} figure`, {
  margin: '0 0 1rem 0',
  display: 'block',
  width: '100%',
  breakInside: 'avoid-column',
  '@media': {
    '(max-width: 767px)': {
      margin: 0,
      alignSelf: 'center',
    },
  },
});

globalStyle(`${sliderContainer} figure img, ${sliderContainer} figure video`, {
  display: 'block',
  width: '100%',
  height: 'auto',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--color-bg-divider)',
  '@media': {
    '(max-width: 767px)': {
      maxHeight: '60vh',
      objectFit: 'contain',
    },
  },
});
