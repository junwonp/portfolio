import { globalStyle, style, styleVariants } from '@vanilla-extract/css';

export const iconLink = style({
  alignItems: 'center',
  alignSelf: 'center',
  borderRadius: 'var(--radius-circle)',
  color: 'var(--color-main)',
  display: 'flex',
  justifyContent: 'center',
  padding: 'var(--space-xs)',
  textDecoration: 'none',
  transition: 'background 0.2s, color 0.2s, transform 0.1s',

  ':active': {
    transform: 'scale(0.9)',
  },
});

globalStyle(`${iconLink} svg`, {
  pointerEvents: 'none',
});

export const typeVariants = styleVariants({
  github: {
    ':hover': {
      background: '#24292e',
      color: '#ffffff',
    },
  },
  linkedin: {
    ':hover': {
      background: '#0077b5',
      color: '#ffffff',
    },
  },
  normal: {
    ':hover': {
      background: 'var(--color-bg-divider)',
      color: 'var(--color-primary)',
    },
  },
});
