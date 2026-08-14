import { globalStyle, style } from '@vanilla-extract/css';

export const mobile = style({});
export const dragging = style({});

export const imageGallery = style({
  display: 'block',
  columns: 2,
  columnGap: '1rem',
  margin: '2rem 0',

  selectors: {
    [`&.${mobile}`]: {
      display: 'flex',
      overflow: 'hidden',
      flexWrap: 'nowrap',
      justifyContent: 'flex-start',
      alignItems: 'center',
      padding: 0,
      margin: '2rem 0',
      position: 'relative',
      touchAction: 'none',
      width: '100%',
      maxHeight: '60vh',
    },
    [`&.${mobile}:focus`]: {
      outline: '2px solid var(--color-primary)',
      outlineOffset: '2px',
    },
  },

  '@media': {
    '(max-width: 576px)': {
      selectors: {
        [`&.${mobile}`]: {
          margin: '2rem 0',
        },
      },
    },
  },
});

export const sliderContainer = style({
  selectors: {
    [`${imageGallery}.${mobile} &`]: {
      display: 'flex',
      flexDirection: 'row',
      gap: 0,
      transition: 'transform 0.3s var(--ease-standard)',
      willChange: 'transform',
      padding: 0,
      touchAction: 'none',
      width: '100%',
    },
    [`${imageGallery}.${mobile} &.${dragging}`]: {
      transition: 'none',
    },
  },
});

export const pager = style({
  selectors: {
    [`${imageGallery}.${mobile} &`]: {
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

globalStyle(`${imageGallery}.${mobile} ${sliderContainer} figure`, {
  flex: '0 0 100%',
  maxWidth: '100%',
  margin: 0,
  scrollSnapAlign: 'start',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

globalStyle(`${imageGallery}.${mobile} ${sliderContainer} img, ${imageGallery}.${mobile} ${sliderContainer} video`, {
  userSelect: 'none',
  pointerEvents: 'none',
});

globalStyle(`${imageGallery} figure`, {
  margin: '0 0 1rem 0',
  display: 'block',
  width: '100%',
  breakInside: 'avoid-column',
  pageBreakInside: 'avoid',
});

globalStyle(`${imageGallery} figure img, ${imageGallery} figure video`, {
  display: 'block',
  width: '100%',
  height: 'auto',
  borderRadius: '8px',
  border: '1px solid var(--color-bg-divider)',
});

globalStyle(`${imageGallery}.${mobile} figure img, ${imageGallery}.${mobile} figure video`, {
  maxWidth: '100%',
  maxHeight: '60vh',
  objectFit: 'contain',
});
