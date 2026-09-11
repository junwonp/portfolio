import { style } from '@vanilla-extract/css';

export const empty = style({
  alignItems: 'center',
  color: 'var(--color-sub)',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-xs)',
  justifyContent: 'center',
  padding: 'var(--space-lg) var(--space-sm)',
  textAlign: 'center',
});

export const message = style({
  fontSize: 'var(--font-h6)',
  margin: 0,
});
