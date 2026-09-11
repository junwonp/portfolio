import { globalStyle, style } from '@vanilla-extract/css';

// Merges the two duplicated sectionHeadingRow definitions (HomePage.css.ts and
// admin.css.ts): identical flex core, plus the admin responsive column collapse
// at the 768px tablet breakpoint. Raw media query string matches the rest of the
// codebase's `.css.ts` convention (TS imports into `.css.ts` break at runtime).
export const row = style({
  alignItems: 'flex-start',
  display: 'flex',
  gap: 'var(--space-sm)',
  justifyContent: 'space-between',

  '@media': {
    '(max-width: 768px)': {
      alignItems: 'stretch',
      flexDirection: 'column',
    },
  },
});

export const heading = style({
  flex: 1,
  marginBottom: 'var(--space-sm)',
  minWidth: 0,
});

// The global h2 is tuned for prose flow (large top/bottom margins between
// markdown blocks); a section heading is a component, so reset the flow
// margins and restore the previous home heading weight/tracking. h3 keeps the
// global styles — they carry no flow margins, so level-3 consumers are unaffected.
globalStyle(`${heading} h2`, {
  fontWeight: 800,
  letterSpacing: '-0.02em',
  margin: 0,
});

export const subtitle = style({
  color: 'var(--color-sub)',
  opacity: 0.8,
  fontSize: '0.85rem',
  margin: '0.25rem 0 0',
});

export const action = style({
  flexShrink: 0,
});
