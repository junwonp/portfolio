import { style } from '@vanilla-extract/css';

// Shared surface primitives. Backgrounds and borders stay per-component on
// purpose — card surfaces differ deliberately (tinted metrics, borderless
// masonry, dark variant swaps), so only the common core is extracted:
// the resting radius and elevation.

export const cardSurface = style({
  borderRadius: 'var(--radius-lg)',
  boxShadow: 'var(--shadow-card)',
});

// Structural button primitives — sizing, display, press scale, and colors
// remain per-button; these only carry the shape and interaction posture.

export const pillButton = style({
  alignItems: 'center',
  borderRadius: 'var(--radius-full)',
  cursor: 'pointer',
  fontFamily: 'inherit',
  justifyContent: 'center',
});

export const circleButton = style({
  alignItems: 'center',
  borderRadius: 'var(--radius-circle)',
  cursor: 'pointer',
  fontFamily: 'inherit',
  justifyContent: 'center',
});
