import { globalStyle, keyframes, style } from '@vanilla-extract/css';

const skeletonShimmer = keyframes({
  '0%': {
    backgroundPosition: '200% 0',
  },
  '100%': {
    backgroundPosition: '-200% 0',
  },
});

export const imageDescription = style({
  margin: '2rem 0',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
});

export const mediaWrapper = style({
  position: 'relative',
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '8px',
  overflow: 'hidden',
  maxWidth: '100%',
  maxHeight: '60vh',
});

export const skeleton = style({
  position: 'absolute',
  inset: 0,
  background:
    'linear-gradient(90deg, var(--color-inline-bg) 0%, var(--color-disabled-bg) 50%, var(--color-inline-bg) 100%)',
  backgroundSize: '200% 100%',
  animation: `${skeletonShimmer} 1.5s ease-in-out infinite`,
});

globalStyle(`${imageDescription} img, ${imageDescription} video`, {
  maxWidth: '100%',
  maxHeight: '60vh',
  height: 'auto',
  objectFit: 'contain',
  opacity: 0,
  transition: 'opacity 0.3s ease',
});

globalStyle(`${imageDescription} img.loaded, ${imageDescription} video.loaded`, {
  opacity: 1,
});

export const loaded = style({});

export const figcaption = style({
  marginTop: '0.5rem',
  fontSize: '0.9rem',
  color: 'var(--color-sub)',
  lineHeight: 1.6,
});
