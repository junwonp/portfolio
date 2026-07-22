import { createVar, style } from '@vanilla-extract/css';

export const catColorVar = createVar();

export const skillChip = style({
  vars: {
    [catColorVar]: 'var(--color-primary)',
  },
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.375rem',
  color: 'var(--color-sub)',
  fontSize: '0.8125rem',
  fontWeight: 550,
  lineHeight: 1.4,
  whiteSpace: 'nowrap',
  padding: '0.15rem 0.25rem',
  fontFamily: 'inherit',

  selectors: {
    'html.dark &': {
      color: 'var(--color-bold)',
    },
  },

  '::before': {
    content: '""',
    display: 'inline-block',
    width: '5px',
    height: '5px',
    borderRadius: '50%',
    backgroundColor: catColorVar,
    opacity: 0.8,
    flexShrink: 0,
  },
});
