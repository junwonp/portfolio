import { createVar, style } from '@vanilla-extract/css';

export const linkColorVar = createVar();
export const linkBgHoverVar = createVar();

export const arrowLink = style({
  fontSize: '0.875rem',
  fontWeight: 600,
  textDecoration: 'none',
  color: linkColorVar,
  display: 'inline-flex',
  alignItems: 'center',
  padding: '0.25rem 0.5rem',
  marginLeft: '-0.5rem',
  borderRadius: '4px',
  width: 'fit-content',
  transition: 'background-color 0.2s, transform 0.2s',

  ':hover': {
    backgroundColor: linkBgHoverVar,
    textDecoration: 'underline',
    transform: 'translateX(2px)',
  },
});
