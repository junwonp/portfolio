import { style } from '@vanilla-extract/css';

import { cardSurface } from './surface.css';

// Each (variant × radius) pair is composed into a single merged class so the
// radius never has to override cardSurface's resting radius — class merge
// order in the consumer stays irrelevant.

const radiusLg = { borderRadius: 'var(--radius-lg)' };
const radiusSm = { borderRadius: 'var(--radius-sm)' };

// Raw token references (not JS `vars`) so this file stays a plain vanilla-extract
// module — importing TS modules into `.css.ts` breaks the vinext worker resolver.
const glassSurface = {
  background: 'var(--glass-bg)',
  backdropFilter: 'var(--glass-blur)',
  WebkitBackdropFilter: 'var(--glass-blur)',
  border: 'var(--glass-border)',
  boxShadow: 'var(--shadow-glass)',
};

export const surface = style([cardSurface, radiusLg]);
export const surfaceSm = style([cardSurface, radiusSm]);
export const glass = style([glassSurface, radiusLg]);
export const glassSm = style([glassSurface, radiusSm]);
