# Skill Group Pills — Design Spec (2026-09-09)

## Background

Skill chips currently mark category (languages, frameworks, ui, state, performance, backend, devops) with a 5px colored dot (`SkillChip.css.ts` `::before`). Two problems reported:

1. The dot reads as decoration, not information — the reason for the color is not legible, and the dot itself looks like a generic "AI-designed" pattern.
2. The original intent — making same-category skills visually cohere so a project's stack is easy to scan — is not achieved. In mixed rows (home project rows, project detail) several category colors interleave with no visible grouping.

The bento skill cards are exempt: each card is already a category container, so chips inside it do not need to carry category.

## Decision

**Tinted group pills.** Because chips are already sorted by canonical category order (`sortSkills` in `src/lib/utils/skills.ts`), consecutive same-category runs can be rendered as one connected pill. Grouping is carried by structure (container), color is carried by a faint category tint on that container. Color is therefore never the only channel.

Rejected alternatives:

- **Monochrome group pills** — cleanest, but loses at-a-glance category recognition the palette was built for.
- **Colored chip text** — reintroduces the rainbow noise in mixed rows (the reported problem).
- **Per-chip fills** — the previous "too colorful" iteration.

## Components

### 1. `SkillGroupPills` (new — `src/components/ui/SkillGroupPills.tsx` + `.css.ts`)

- Props: `{ skills: string[] }` — the already-visible (sliced) skill list.
- Segments the list into consecutive runs by `getSkillCategory()` (`src/lib/portfolio/skills.ts:160`, returns `SkillId | 'default'`).
- Run of **2+ skills** → one tinted pill (background + border in category color). 
- Run of **1 skill** → flat chip (no tint), same as today minus the dot.
- `'default'` category (unregistered skills) → flat chips, one per skill (never grouped).
- Pills are flex items and wrap as whole units; inner chips wrap inside the pill if the pill alone exceeds the line (inner `flex-wrap: wrap`, `gap: 0.4rem`).

### 2. `SkillChip` (modified — `src/components/ui/SkillChip.css.ts`)

- Remove the `::before` dot and `catColorVar` wiring from the chip style.
- The chip becomes a plain text span (current padding/gap/typography preserved).
- Remaining consumer: bento cards.

### 3. `ReadonlySkillChip` (removed)

- Used only by `ProjectTechStack`; superseded by `SkillGroupPills`. Delete the file.

### 4. Segmentation utility (new — `src/lib/portfolio/techStack.ts`)

- `segmentSkillsByCategory(skills: string[]): { category: SkillId | 'default'; skills: string[] }[]` — pure function, consecutive runs.

## Visual rules

- Pill background: `color-mix(in srgb, var(--color-cat-<id>) 8%, transparent)`
- Pill border: `1px solid color-mix(in srgb, var(--color-cat-<id>) 18%, transparent)`
- Pill radius: `var(--radius-xs)` (4px), consistent with existing chip/badge radius
- Pill padding: matches current chip padding (`0.15rem 0.25rem`) so flat and grouped chips share line rhythm
- Text inside pills stays `--color-sub` (light) / `--color-bold` (dark) — same as current chips; contrast is untouched because tint lives on background/border only
- `color-mix` against `transparent` (not a surface token) so pills work on both page background and `cardSurface`
- `moreChip` (+N) stays outside groups, flat, rendered by the parent
- Dark mode needs no special-casing: category tokens are fixed at 62% lightness and the tint percentages are shared

## Application surface

| Surface | Change |
|---|---|
| `ProjectContent` spotlight skills row | `<SkillChip>` loop → `<SkillGroupPills skills={visibleSkills} />`; `moreChip` kept in parent |
| `ProjectContent` resume skills row | same |
| `ProjectTechStack` (project detail) | per-category section keeps its `categoryTitle`; `ReadonlySkillChip` loop → `<SkillGroupPills skills={group.skills} />`; `ReadonlySkillChip` deleted |
| `BentoSkills` | unchanged — `SkillChip` flat, no dot |

## Edge cases

- Empty skill list → parent already guards; `SkillGroupPills` renders nothing
- Single-skill category → flat chip (chosen option: only 2+ runs group)
- `'default'` skills → always flat, ungrouped
- `skillLimit`/featured ordering → parent keeps its existing slicing; segmentation preserves input order
- Narrow screens → pills wrap as units; long pills wrap internally

## Testing (TDD)

1. `segmentSkillsByCategory` unit tests: single-category run, multiple runs, single-skill category, `'default'` skills, order preservation.
2. `SkillGroupPills` render tests (`renderToStaticMarkup`, existing repo pattern): groups 2+ runs into one container, leaves singles flat, ungrouped for `'default'`, empty list renders nothing.
3. Gates: `pnpm exec vitest run`, `pnpm exec tsc --noEmit`, `biome check`, browser spot-check (home rows + detail, light/dark).

## Out of scope

- Bento card restyle
- Palette changes (`--color-cat-*` tokens stay as-is)
- Detail page structure beyond the chip swap
