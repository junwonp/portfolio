import { style } from '@vanilla-extract/css';

export const spotlightList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-md)',
});

export const isLink = style({});
export const hasThumbnail = style({});

export const card = style({
  alignItems: 'start',
  background: 'var(--color-basic-bg)',
  border: '0.5px solid color-mix(in srgb, var(--color-bg-divider) 40%, transparent)',
  borderRadius: '12px',
  display: 'grid',
  gap: '1.25rem',
  minWidth: 0,
  overflow: 'hidden',
  padding: '1rem',
  textDecoration: 'none',
  color: 'inherit',
  boxShadow: 'var(--shadow-card)',
  transition:
    'box-shadow 0.2s ease, transform 0.2s var(--ease-emphasized), border-color 0.2s ease',

  selectors: {
    [`&.${isLink}`]: {
      cursor: 'pointer',
    },
    [`&.${isLink}:hover`]: {
      borderColor: 'color-mix(in srgb, var(--color-primary) 18%, transparent)',
      boxShadow: 'var(--shadow-card-lifted)',
      transform: 'translateY(-2px)',
    },
    [`&:not(.${isLink})`]: {
      cursor: 'default',
    },
    'html.dark &': {
      borderColor: 'rgba(255, 255, 255, 0.04)',
      boxShadow: 'var(--shadow-card)',
    },
    [`html.dark &.${isLink}:hover`]: {
      borderColor: 'color-mix(in srgb, var(--color-primary) 30%, transparent)',
      boxShadow: 'var(--shadow-card-lifted)',
    },
    [`&.${hasThumbnail}`]: {
      gridTemplateColumns: 'minmax(7rem, 9rem) minmax(0, 1fr)',
    },
  },

  '@media': {
    '(max-width: 768px)': {
      selectors: {
        [`&:not(.${hasThumbnail})`]: {
          gridTemplateColumns: '1fr',
        },
        [`&.${hasThumbnail}`]: {
          gridTemplateColumns: '5.5rem minmax(0, 1fr)',
        },
      },
    },
    '(max-width: 560px)': {
      selectors: {
        [`&.${hasThumbnail}`]: {
          gridTemplateColumns: '1fr',
        },
      },
    },
  },
});

export const thumbnailFrame = style({
  alignSelf: 'start',
  aspectRatio: '1',
  background: 'var(--color-surface-hover)',
  borderRadius: '8px',
  overflow: 'hidden',
  position: 'relative',
  width: '100%',

  '@media': {
    '(max-width: 768px)': {
      width: '5.5rem',
    },
  },
});

export const thumbnailFrameIcon = style({
  borderRadius: 'var(--radius-squircle)',
  boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.08), 0 10px 24px rgba(0, 0, 0, 0.12)',
});

export const thumbnailFrameScreenshot = style({
  borderRadius: '8px',
});

export const thumbnail = style({
  background: 'var(--color-surface-hover)',
});

export const thumbnailIcon = style({
  objectFit: 'contain',
});

export const thumbnailScreenshot = style({
  objectFit: 'cover',
});

export const body = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.85rem',
  minWidth: 0,
});

export const resumeList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
});

export const resumeRow = style({
  borderBottom: 'none',
  paddingTop: '0.75rem',
  paddingBottom: '0.75rem',

  selectors: {
    '&:first-child': {
      paddingTop: 0,
    },
    '&:last-child': {
      paddingBottom: 0,
    },
  },
});
