import { style } from '@vanilla-extract/css';

// Selection lives in Button variants (primary vs ghost) — never an appended
// "active" class, which a later-emitted base rule can silently override.
export const base = style({
  background: 'var(--color-code-bg)',
  border: '0.5px solid var(--color-bg-divider)',
  borderRadius: 'var(--radius-full)',
  display: 'inline-flex',
  gap: 'var(--space-2xs)',
  padding: 'var(--space-2xs)',
});
