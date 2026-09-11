import { globalStyle, style } from '@vanilla-extract/css';

export const phonePreview = style({});
export const prev = style({});
export const next = style({});
export const active = style({});

export const lightboxMasonry = style({
  columns: 2,
  columnGap: '24px',
  marginBottom: '48px',

  selectors: {
    [`&.${phonePreview}`]: {
      display: 'flex',
      justifyContent: 'center',
    },
  },

  '@media': {
    '(max-width: 640px)': {
      columns: 1,
      gap: '16px',
    },
  },
});

export const masonryItem = style({
  display: 'block',
  width: '100%',
  breakInside: 'avoid',
  marginBottom: '24px',
  position: 'relative',
  overflow: 'hidden',
  background: 'var(--color-disabled-bg)',
  cursor: 'zoom-in',
  padding: 0,
  transition: 'transform 0.2s var(--ease-emphasized), box-shadow 0.2s ease',
  border: 'none',

  ':hover': {
    transform: 'translateY(-3px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)',
  },

  selectors: {
    'html.dark &': {
      // 0.05 ≠ --color-border-subtle dark (0.06); kept to preserve the dark hairline
      border: '0.5px solid rgba(255, 255, 255, 0.05)',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
    },
    'html.dark &:hover': {
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
    },
  },

  '@media': {
    '(max-width: 640px)': {
      selectors: {
        '&:not(:first-child)': { display: 'none' },
        [`.${phonePreview} &`]: {
          maxWidth: 'min(100%, 340px)',
        },
      },
    },
  },
});

globalStyle(`${masonryItem} img`, {
  width: '100% !important',
  height: 'auto !important',
  maxHeight: 'none !important',
  display: 'block',
  objectFit: 'cover',
  transition: 'transform 0.3s ease',
});

// Portrait screenshots render at their natural ratio — cropping them into a
// capped landscape frame hid most of the image
globalStyle(`.${phonePreview} ${masonryItem} img`, {
  maxHeight: 'none !important',
  objectFit: 'contain',
});

globalStyle(`.${phonePreview} ${masonryItem} img`, {
  '@media': {
    '(max-width: 640px)': {
      maxHeight: 'none !important',
    },
  },
});

globalStyle(`${masonryItem}:hover img`, {
  transform: 'scale(1.02)',
});

export const zoomHint = style({
  position: 'absolute',
  bottom: '12px',
  right: '12px',
  // 0.6 matches no scrim token (0.55/0.65, 0.45/0.55); kept
  background: 'rgba(0, 0, 0, 0.6)',
  color: '#fff',
  borderRadius: 'var(--radius-sm)',
  padding: '6px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0,
  transition: 'opacity 0.2s',
  pointerEvents: 'none',
  backdropFilter: 'blur(4px)',

  selectors: {
    [`${masonryItem}:hover &`]: {
      opacity: 1,
    },
  },
});

export const moreIndicator = style({
  '@media': { '(min-width: 641px)': { display: 'none' } },
  position: 'absolute',
  inset: 0,
  // Base/hover match --color-scrim-soft/--color-scrim in light mode only; the
  // dark token values (0.55/0.65) would deepen the dark-mode scrim, so literals stay
  background: 'rgba(0, 0, 0, 0.45)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backdropFilter: 'blur(4px)',
  WebkitBackdropFilter: 'blur(4px)',
  transition: 'background 0.3s ease',

  selectors: {
    [`${masonryItem}:hover &`]: {
      background: 'rgba(0, 0, 0, 0.55)',
    },
  },
});

export const indicatorContent = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.75rem',
  color: '#fff',
  padding: '20px',
});

globalStyle(`${indicatorContent} svg`, {
  filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
  opacity: 0.9,
});

export const label = style({
  selectors: {
    [`${indicatorContent} &`]: {
      fontSize: '0.95rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
      textShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
    },
  },
});

export const overlay = style({
  position: 'fixed',
  inset: 0,
  zIndex: 'var(--z-overlay)',
  // Near-opaque lightbox curtain; the scrim tokens (0.55/0.65) are far lighter
  background: 'rgba(0, 0, 0, 0.92)',
  backdropFilter: 'blur(8px)',
  overflow: 'hidden',
  margin: 0,
  padding: 0,
  border: 0,
  width: '100vw',
  height: '100dvh',
  maxWidth: 'none',
  maxHeight: 'none',
  color: '#fff',
});

export const overlayClose = style({
  position: 'absolute',
  top: '16px',
  right: '16px',
  zIndex: 'var(--z-elevated)',
  // Control-surface translucency, deliberately lighter than the curtain scrims
  background: 'rgba(0, 0, 0, 0.3)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  color: '#fff',
  borderRadius: 'var(--radius-circle)',
  padding: '10px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background 0.2s, transform 0.2s, opacity 0.3s ease',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',

  ':hover': {
    background: 'rgba(0, 0, 0, 0.5)',
    transform: 'scale(1.1)',
  },
});

globalStyle(`${overlayClose} svg`, {
  filter: 'drop-shadow(0 0 2px rgba(0, 0, 0, 0.5))',
});

export const carouselTrack = style({
  display: 'flex',
  width: '100%',
  height: '100%',
  overflowX: 'auto',
  scrollSnapType: 'x mandatory',
  overscrollBehaviorX: 'contain',
  scrollbarWidth: 'none',
});

export const carouselSlide = style({
  flex: '0 0 100%',
  minWidth: 0,
  scrollSnapAlign: 'start',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box',
  padding: '60px 0 80px',
});

globalStyle(`${carouselSlide} img`, {
  maxWidth: '100%',
  maxHeight: '100%',
  objectFit: 'contain',
  display: 'block',
  borderRadius: 'var(--radius-xs)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
  pointerEvents: 'none',
  userSelect: 'none',
});

export const overlayFooter = style({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: '80px',
  zIndex: 'var(--z-elevated)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 'var(--space-xs)',
  padding: '8px 24px',
  // Gradient fade; the scrim tokens are flat colors
  background:
    'linear-gradient(to top, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.2) 60%, transparent 100%)',
  backdropFilter: 'blur(4px)',
  WebkitBackdropFilter: 'blur(4px)',
  transition: 'opacity 0.3s ease',
});

export const overlayCaption = style({
  fontSize: '13px',
  fontWeight: 500,
  color: 'rgba(255, 255, 255, 0.8)',
  textAlign: 'center',
  margin: 0,
  lineHeight: 1.4,
  textShadow: '0 1px 3px rgba(0, 0, 0, 0.4)',
  maxWidth: '560px',
  overflow: 'hidden',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
});

export const overlayNav = style({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 'var(--z-elevated)',
  // Control-surface translucency, deliberately lighter than the curtain scrims
  background: 'rgba(0, 0, 0, 0.35)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  color: '#fff',
  borderRadius: 'var(--radius-circle)',
  padding: '16px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background 0.2s, transform 0.2s, opacity 0.3s ease',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',

  ':hover': {
    background: 'rgba(0, 0, 0, 0.5)',
    transform: 'translateY(-50%) scale(1.1)',
  },

  selectors: {
    [`&.${prev}`]: {
      left: '12px',
    },
    [`&.${next}`]: {
      right: '12px',
    },
  },

  '@media': {
    '(max-width: 640px)': {
      padding: '12px',
    },
  },
});

globalStyle(`${overlayNav} svg`, {
  filter: 'drop-shadow(0 0 2px rgba(0, 0, 0, 0.5))',
});

export const overlayDots = style({
  display: 'flex',
  gap: 'var(--space-xs)',
  alignItems: 'center',
  flexShrink: 0,
});

export const dot = style({
  width: '24px',
  height: '24px',
  borderRadius: 'var(--radius-circle)',
  background: 'transparent',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  display: 'grid',
  placeItems: 'center',
  transition: 'background-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease',
  '::after': {
    content: '""',
    width: '8px',
    height: '8px',
    borderRadius: 'var(--radius-circle)',
    background: 'rgba(255, 255, 255, 0.2)',
  },
  selectors: {
    [`&.${active}::after`]: {
      background: 'var(--color-primary)',
      transform: 'scale(1.4)',
      boxShadow: '0 0 10px var(--color-primary)',
    },
  },
});

globalStyle(`${carouselSlide} picture`, {
  display: 'flex',
  width: '100%',
  height: '100%',
  alignItems: 'center',
  justifyContent: 'center',
});

globalStyle(`${overlay} button:focus-visible, ${masonryItem}:focus-visible`, {
  outline: '2px solid var(--color-primary)',
  outlineOffset: '4px',
});

globalStyle(`${overlayNav}:disabled`, {
  opacity: 0.3,
  cursor: 'default',
});

globalStyle(`${overlay} button, ${masonryItem}, ${masonryItem} img`, {
  '@media': {
    '(prefers-reduced-motion: reduce)': { transition: 'none' },
  },
});
