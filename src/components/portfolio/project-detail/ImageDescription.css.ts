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
    borderRadius: 'var(--radius-sm)',
  },
  '50%': {
    borderRadius: 'var(--radius-xl)',
  },
  '100%': {
    borderRadius: 'var(--radius-sm)',
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
  borderRadius: 'var(--radius-sm)',
  overflow: 'hidden',
  maxWidth: '100%',
  maxHeight: '60vh',
  animation: `${loadingMorph} 1.5s ease-in-out infinite`,
});

// Hidden state is applied only after hydration (no-JS stays visible) and
// resolves with a gentle rise once the media enters the viewport
export const preReveal = style({
  opacity: 0,
  transform: 'translateY(14px)',
});

export const revealed = style({
  opacity: 1,
  transform: 'translateY(0)',
  transition:
    'opacity 0.5s var(--ease-emphasized), transform 0.5s var(--ease-emphasized)',
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
