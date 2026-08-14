import { globalStyle, keyframes, style } from '@vanilla-extract/css';

const skeletonShimmer = keyframes({
  '0%': {
    backgroundPosition: '200% 0',
  },
  '100%': {
    backgroundPosition: '-200% 0',
  },
});

// M3E-style "processing" treatment: the media frame morphs between two radii
// while loading and settles once the image/video arrives
const loadingMorph = keyframes({
  '0%': {
    borderRadius: '8px',
  },
  '50%': {
    borderRadius: '20px',
  },
  '100%': {
    borderRadius: '8px',
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
  animation: `${loadingMorph} 1.5s ease-in-out infinite`,
});

export const skeleton = style({
  position: 'absolute',
  inset: 0,
  background:
    'linear-gradient(90deg, var(--color-inline-bg) 0%, var(--color-disabled-bg) 50%, var(--color-inline-bg) 100%)',
  backgroundSize: '200% 100%',
  animation: `${skeletonShimmer} 1.5s ease-in-out infinite`,
});

export const loaded = style({
  // Ends the shape morph once the media is visible
  animation: 'none',
});

globalStyle(`${imageDescription} img, ${imageDescription} video`, {
  maxWidth: '100%',
  maxHeight: '60vh',
  height: 'auto',
  objectFit: 'contain',
  opacity: 0,
  transition: 'opacity 0.3s ease',
});

globalStyle(`${imageDescription} img.${loaded}, ${imageDescription} video.${loaded}`, {
  opacity: 1,
});

export const figcaption = style({
  marginTop: '0.5rem',
  fontSize: '0.9rem',
  color: 'var(--color-sub)',
  lineHeight: 1.6,
});
