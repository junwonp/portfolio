import { globalStyle, style } from '@vanilla-extract/css';

export const imageDescription = style({
  margin: '2rem 0',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

export const mediaWrapper = style({
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 'var(--radius-sm)',
  overflow: 'hidden',
  maxWidth: '100%',
});

globalStyle(`${imageDescription} img, ${imageDescription} video`, {
  display: 'block',
  maxWidth: '100%',
  maxHeight: '60vh',
  height: 'auto',
  objectFit: 'contain',
});

export const figcaption = style({
  marginTop: '0.5rem',
  fontSize: '0.9rem',
  color: 'var(--color-sub)',
  lineHeight: 1.6,
});
