import { globalStyle, style } from '@vanilla-extract/css';

export const phonePreview = style({});
export const snapping = style({});
export const prev = style({});
export const next = style({});
export const active = style({});
export const chromeHidden = style({});

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

globalStyle(`.${phonePreview} ${masonryItem} img`, {
  maxHeight: '640px !important',
  objectPosition: 'top',
});

globalStyle(`.${phonePreview} ${masonryItem} img`, {
  '@media': {
    '(max-width: 640px)': {
      maxHeight: '520px !important',
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
  position: 'absolute',
  inset: 0,
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
  background: 'rgba(0, 0, 0, 0.92)',
  backdropFilter: 'blur(8px)',
  overflow: 'hidden',
  cursor: 'grab',

  ':active': {
    cursor: 'grabbing',
  },
});

export const overlayClose = style({
  position: 'absolute',
  top: '16px',
  right: '16px',
  zIndex: 'var(--z-elevated)',
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

  selectors: {
    [`.${chromeHidden} &`]: {
      opacity: 0,
      pointerEvents: 'none',
    },
  },
});

globalStyle(`${overlayClose} svg`, {
  filter: 'drop-shadow(0 0 2px rgba(0, 0, 0, 0.5))',
});

export const overlayImageArea = style({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  overflow: 'hidden',
});

export const carouselTrack = style({
  display: 'flex',
  width: '300%',
  height: '100%',
  transform: 'translateX(calc(-33.333% + var(--drag-x, 0px)))',
  willChange: 'transform',

  selectors: {
    [`&.${snapping}`]: {
      transition: 'transform 0.32s var(--ease-snap)',
    },
  },
});

export const carouselSlide = style({
  flex: '0 0 33.333%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,

  '@media': {
    '(max-width: 640px)': {
      paddingTop: 0,
    },
  },
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
  background: 'linear-gradient(to top, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.2) 60%, transparent 100%)',
  backdropFilter: 'blur(4px)',
  WebkitBackdropFilter: 'blur(4px)',
  transition: 'opacity 0.3s ease',

  selectors: {
    [`.${chromeHidden} &`]: {
      opacity: 0,
      pointerEvents: 'none',
    },
  },
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
    [`.${chromeHidden} &`]: {
      opacity: 0,
      pointerEvents: 'none',
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
  width: '8px',
  height: '8px',
  borderRadius: 'var(--radius-circle)',
  background: 'rgba(255, 255, 255, 0.2)',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  transition: 'background-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease',

  selectors: {
    [`&.${active}`]: {
      background: 'var(--color-primary)',
      transform: 'scale(1.4)',
      boxShadow: '0 0 10px var(--color-primary)',
    },
  },
});
