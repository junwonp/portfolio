import { createVar, style } from '@vanilla-extract/css';

export const skillGroupPillVar = createVar();

export const skillGroupPill = style({
  vars: {
    [skillGroupPillVar]: 'var(--color-primary)',
  },
  // Chips inside carry their own padding, so the pill adds only border + tint
  display: 'inline-flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: '0.4rem',
  padding: 0,
  border: `1px solid color-mix(in srgb, ${skillGroupPillVar} 18%, transparent)`,
  background: `color-mix(in srgb, ${skillGroupPillVar} 8%, transparent)`,
  borderRadius: 'var(--radius-xs)',
});
