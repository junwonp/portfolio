# Skill Group Pills Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render same-category skill runs as one tinted pill so a project's tech stack reads as groups instead of scattered colored dots.

**Architecture:** A pure segmentation utility splits an already-category-sorted skill list into consecutive runs; a new `SkillGroupPills` component renders runs of 2+ as a tinted container (category color at 8% background / 18% border via `color-mix` against `transparent`) and singles/unknown skills as flat chips. The dot is removed from `SkillChip` everywhere.

**Tech Stack:** React 19, Next.js (vinext) App Router, vanilla-extract, Vitest (node env, `renderToStaticMarkup` pattern), TypeScript strict.

## Global Constraints

- Repo is vinext on Cloudflare Workers — run `pnpm exec vitest run`, `pnpm exec tsc --noEmit --pretty false`, `pnpm exec biome check <files>` after every task.
- TDD: every code change starts with a failing test that fails for the right reason.
- Immutability: never mutate — use spreads/reduce, never `push` into shared arrays.
- Skill names must match registered names in `src/lib/portfolio/skills.ts` (`getSkillCategory` returns `SkillId | 'default'`).
- Commit messages: `<type>: <description>`, imperative mood, no agent traces.
- Files < 800 lines, functions < 50 lines, no deep nesting.

---

### Task 1: Skill category segmentation utility

**Files:**
- Modify: `src/lib/portfolio/techStack.ts`
- Test: `src/lib/portfolio/techStack.test.ts` (append new describe block)

**Interfaces:**
- Produces: `SkillCategorySegment { category: SkillId | 'default'; skills: string[] }` and `segmentSkillsByCategory(skills: readonly string[]): SkillCategorySegment[]` — consecutive same-category runs; `'default'` skills never merge with anything.

- [ ] **Step 1: Write the failing test**

Append to `src/lib/portfolio/techStack.test.ts` (add `segmentSkillsByCategory` to the existing import from `@/lib/portfolio/techStack`):

```ts
describe('segmentSkillsByCategory', () => {
  it('groups consecutive skills of the same category into one segment', () => {
    expect(segmentSkillsByCategory(['React', 'Expo', 'TypeScript'])).toEqual([
      { category: 'frameworks', skills: ['React', 'Expo'] },
      { category: 'languages', skills: ['TypeScript'] },
    ]);
  });

  it('keeps a single-skill category as its own segment', () => {
    expect(segmentSkillsByCategory(['TypeScript'])).toEqual([
      { category: 'languages', skills: ['TypeScript'] },
    ]);
  });

  it('never merges unregistered skills, even when consecutive', () => {
    expect(segmentSkillsByCategory(['React', 'Unknown A', 'Unknown B'])).toEqual([
      { category: 'frameworks', skills: ['React'] },
      { category: 'default', skills: ['Unknown A'] },
      { category: 'default', skills: ['Unknown B'] },
    ]);
  });

  it('preserves input order across segments', () => {
    expect(segmentSkillsByCategory(['Expo', 'TypeScript', 'React'])).toEqual([
      { category: 'frameworks', skills: ['Expo'] },
      { category: 'languages', skills: ['TypeScript'] },
      { category: 'frameworks', skills: ['React'] },
    ]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run src/lib/portfolio/techStack.test.ts`
Expected: FAIL — `segmentSkillsByCategory is not exported` / ReferenceError.

- [ ] **Step 3: Write minimal implementation**

Add to `src/lib/portfolio/techStack.ts` (import `getSkillCategory` and `type SkillId` from `@/lib/portfolio/skills`; extend the existing import line):

```ts
export interface SkillCategorySegment {
  category: SkillId | 'default';
  skills: string[];
}

export const segmentSkillsByCategory = (skills: readonly string[]): SkillCategorySegment[] =>
  skills.reduce<SkillCategorySegment[]>((segments, skill) => {
    const category = getSkillCategory(skill);
    const previous = segments[segments.length - 1];
    const shouldExtend = previous && previous.category === category && category !== 'default';

    if (shouldExtend) {
      return [...segments.slice(0, -1), { category, skills: [...previous.skills, skill] }];
    }

    return [...segments, { category, skills: [skill] }];
  }, []);
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest run src/lib/portfolio/techStack.test.ts`
Expected: PASS (all tests in file).

- [ ] **Step 5: Run gates and commit**

Run: `pnpm exec tsc --noEmit --pretty false` and `pnpm exec biome check src/lib/portfolio/techStack.ts src/lib/portfolio/techStack.test.ts`
Expected: clean.

```bash
git add src/lib/portfolio/techStack.ts src/lib/portfolio/techStack.test.ts
git commit -m "feat(portfolio): add skill category segmentation utility"
```

---

### Task 2: Remove the category dot from skill chips

**Files:**
- Modify: `src/components/ui/SkillChip.css.ts` (remove dot, `createVar`, `catColorVar`)
- Modify: `src/components/ui/SkillChip.tsx` (remove inline var wiring)
- Modify: `src/components/ui/ReadonlySkillChip.tsx` (same simplification — still consumed by ProjectTechStack until Task 5)
- Test: `src/components/ui/SkillChip.test.tsx` (new)

**Interfaces:**
- Produces: `skillChip` style class (flat text span) and flat `SkillChip`/`ReadonlySkillChip` components. No other file imports `catColorVar` (verified: only these two components did).

- [ ] **Step 1: Write the failing test**

Create `src/components/ui/SkillChip.test.tsx`:

```tsx
import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import SkillChip from '@/components/ui/SkillChip';

const skillChipStyles = readFileSync(new URL('./SkillChip.css.ts', import.meta.url), 'utf8');

describe('SkillChip', () => {
  it('drops the category dot so grouping carries category instead', () => {
    expect(skillChipStyles).not.toContain('::before');
    expect(skillChipStyles).not.toContain('createVar');
  });

  it('renders the skill name as plain text', () => {
    const html = renderToStaticMarkup(<SkillChip skill="TypeScript" />);

    expect(html).toContain('TypeScript');
    expect(html).not.toContain('--color-cat-');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run src/components/ui/SkillChip.test.tsx`
Expected: FAIL — `::before` and `createVar` still present in `SkillChip.css.ts`.

- [ ] **Step 3: Write minimal implementation**

Replace `src/components/ui/SkillChip.css.ts` with:

```ts
import { style } from '@vanilla-extract/css';

export const skillChip = style({
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
});
```

Replace `src/components/ui/SkillChip.tsx` with:

```tsx
import { skillChip } from './SkillChip.css';

interface Props {
  skill: string;
}

export default function SkillChip({ skill }: Props) {
  return <span className={skillChip}>{skill}</span>;
}
```

Replace `src/components/ui/ReadonlySkillChip.tsx` with:

```tsx
import { skillChip } from './SkillChip.css';

interface ReadonlySkillChipProps {
  skill: string;
}

export default function ReadonlySkillChip({ skill }: ReadonlySkillChipProps) {
  return <span className={skillChip}>{skill}</span>;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest run src/components/ui/SkillChip.test.tsx`
Expected: PASS.

- [ ] **Step 5: Run gates and commit**

Run: `pnpm exec tsc --noEmit --pretty false` and `pnpm exec biome check src/components/ui/SkillChip.css.ts src/components/ui/SkillChip.tsx src/components/ui/ReadonlySkillChip.tsx src/components/ui/SkillChip.test.tsx`
Expected: clean. (BentoSkills keeps working — it only uses `SkillChip`.)

```bash
git add src/components/ui/SkillChip.css.ts src/components/ui/SkillChip.tsx src/components/ui/ReadonlySkillChip.tsx src/components/ui/SkillChip.test.tsx
git commit -m "refactor(ui): remove category dot from skill chips"
```

---

### Task 3: SkillGroupPills component

**Files:**
- Create: `src/components/ui/SkillGroupPills.tsx`
- Create: `src/components/ui/SkillGroupPills.css.ts`
- Test: `src/components/ui/SkillGroupPills.test.tsx` (new)

**Interfaces:**
- Consumes: `segmentSkillsByCategory` from `@/lib/portfolio/techStack`, `skillChip` class from `./SkillChip.css`.
- Produces: default export `SkillGroupPills({ skills: readonly string[] })` — renders runs of 2+ registered skills as one tinted pill (`skillGroupPill` class), everything else as flat `skillChip` spans.

- [ ] **Step 1: Write the failing test**

Create `src/components/ui/SkillGroupPills.test.tsx`:

```tsx
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import SkillGroupPills from '@/components/ui/SkillGroupPills';

import * as styles from './SkillGroupPills.css';

const escapeForRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const countOccurrences = (html: string, className: string): number =>
  html.split(escapeForRegExp(className)).length - 1;

describe('SkillGroupPills', () => {
  it('groups a 2+ same-category run into one tinted pill', () => {
    const html = renderToStaticMarkup(<SkillGroupPills skills={['React', 'Expo']} />);

    expect(countOccurrences(html, styles.skillGroupPill)).toBe(1);
    expect(html).toContain('React');
    expect(html).toContain('Expo');
    expect(html).toContain('var(--color-cat-frameworks)');
  });

  it('renders a single-skill category as a flat chip', () => {
    const html = renderToStaticMarkup(<SkillGroupPills skills={['TypeScript']} />);

    expect(countOccurrences(html, styles.skillGroupPill)).toBe(0);
    expect(html).toContain('TypeScript');
  });

  it('never groups unregistered skills', () => {
    const html = renderToStaticMarkup(
      <SkillGroupPills skills={['React', 'Unknown A', 'Unknown B']} />,
    );

    expect(countOccurrences(html, styles.skillGroupPill)).toBe(0);
  });

  it('groups only the qualifying runs in a mixed list', () => {
    const html = renderToStaticMarkup(
      <SkillGroupPills skills={['TypeScript', 'React', 'Expo']} />,
    );

    expect(countOccurrences(html, styles.skillGroupPill)).toBe(1);
  });
});
```

Note: the count helper relies on the class string appearing in the markup — `split` counts it whether as `class="..."` or in the class list, so it works for both.

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run src/components/ui/SkillGroupPills.test.tsx`
Expected: FAIL — module not found (component does not exist yet).

- [ ] **Step 3: Write minimal implementation**

Create `src/components/ui/SkillGroupPills.css.ts`:

```ts
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
```

Create `src/components/ui/SkillGroupPills.tsx`:

```tsx
import type { CSSProperties } from 'react';

import { segmentSkillsByCategory } from '@/lib/portfolio/techStack';

import { skillChip } from './SkillChip.css';
import { skillGroupPill, skillGroupPillVar } from './SkillGroupPills.css';

interface SkillGroupPillsProps {
  skills: readonly string[];
}

const MIN_GROUP_SIZE = 2;

export default function SkillGroupPills({ skills }: SkillGroupPillsProps) {
  const segments = segmentSkillsByCategory(skills);

  return (
    <>
      {segments.map((segment) => {
        const categoryColorVar =
          segment.category === 'default' ? null : `var(--color-cat-${segment.category})`;

        if (!categoryColorVar || segment.skills.length < MIN_GROUP_SIZE) {
          return segment.skills.map((skill) => (
            <span key={skill} className={skillChip}>
              {skill}
            </span>
          ));
        }

        const variableName = String(skillGroupPillVar).replace(/^var\(|\)$/g, '');

        return (
          <span
            key={segment.category}
            className={skillGroupPill}
            style={{ [variableName]: categoryColorVar } as CSSProperties}
          >
            {segment.skills.map((skill) => (
              <span key={skill} className={skillChip}>
                {skill}
              </span>
            ))}
          </span>
        );
      })}
    </>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest run src/components/ui/SkillGroupPills.test.tsx`
Expected: PASS.

- [ ] **Step 5: Run gates and commit**

Run: `pnpm exec tsc --noEmit --pretty false` and `pnpm exec biome check src/components/ui/SkillGroupPills.tsx src/components/ui/SkillGroupPills.css.ts src/components/ui/SkillGroupPills.test.tsx`
Expected: clean.

```bash
git add src/components/ui/SkillGroupPills.tsx src/components/ui/SkillGroupPills.css.ts src/components/ui/SkillGroupPills.test.tsx
git commit -m "feat(ui): add SkillGroupPills for category-grouped skill rendering"
```

---

### Task 4: Group skill chips on home project rows

**Files:**
- Modify: `src/components/portfolio/home/ProjectContent.tsx` (both skill rows)
- Test: `src/components/portfolio/home/ProjectContent.test.tsx` (extend)

**Interfaces:**
- Consumes: `SkillGroupPills` default export from `@/components/ui/SkillGroupPills`.
- Produces: `ProjectContent` renders `visibleSkills` through `SkillGroupPills`; `moreChip` stays in the parent.

- [ ] **Step 1: Write the failing test**

Extend `src/components/portfolio/home/ProjectContent.test.tsx`. Add imports:

```tsx
import * as pillStyles from '@/components/ui/SkillGroupPills.css';
```

Add a second fixture project with two framework skills (so the run qualifies) and a test:

```tsx
const groupedProject: ProjectItem = {
  id: 'grouped',
  title: '그룹',
  dateFrom: '2022.03',
  description: 'Grouped skills.',
  detail: [],
  skills: ['React', 'Expo'],
};

const countOccurrences = (html: string, needle: string): number =>
  html.split(needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).length - 1;

it('renders same-category skills in one group pill', () => {
  const html = renderToStaticMarkup(
    <ProjectContent project={groupedProject} variant="resume" labels={labelsMap.ko} />,
  );

  expect(countOccurrences(html, pillStyles.skillGroupPill)).toBe(1);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run src/components/portfolio/home/ProjectContent.test.tsx`
Expected: FAIL — expected 1 occurrence, received 0.

- [ ] **Step 3: Write minimal implementation**

In `src/components/portfolio/home/ProjectContent.tsx`:

1. Replace the `SkillChip` import with `SkillGroupPills`:

```tsx
import SkillGroupPills from '@/components/ui/SkillGroupPills';
```

2. Replace both chip loops. The spotlight block and the resume block are identical today (each is the `visibleSkills.length > 0` block below); replace each occurrence with:

```tsx
        {visibleSkills.length > 0 && (
          <div className={styles.skills}>
            <SkillGroupPills skills={visibleSkills} />
            {hiddenSkillCount > 0 && (
              <span className={styles.moreChip} title={sortedSkills.slice(skillLimit).join(', ')}>
                +{hiddenSkillCount}
              </span>
            )}
          </div>
        )}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest run src/components/portfolio/home/ProjectContent.test.tsx`
Expected: PASS — all ProjectContent tests (existing description/chip assertions keep passing: skill names still render inside pills).

- [ ] **Step 5: Run gates and commit**

Run: `pnpm exec tsc --noEmit --pretty false` and `pnpm exec biome check src/components/portfolio/home/ProjectContent.tsx src/components/portfolio/home/ProjectContent.test.tsx`
Expected: clean.

```bash
git add src/components/portfolio/home/ProjectContent.tsx src/components/portfolio/home/ProjectContent.test.tsx
git commit -m "feat(portfolio): group project skill chips by category on home rows"
```

---

### Task 5: Group chips on the project detail tech stack

**Files:**
- Modify: `src/components/portfolio/project-detail/ProjectTechStack.tsx`
- Modify: `src/components/portfolio/project-detail/ProjectTechStack.css.ts` (remove unused `techGrid`)
- Delete: `src/components/ui/ReadonlySkillChip.tsx`
- Test: `src/components/portfolio/project-detail/ProjectTechStack.test.tsx` (new)

**Interfaces:**
- Consumes: `SkillGroupPills` from `@/components/ui/SkillGroupPills`, `getProjectTechStackGroups` from `@/lib/portfolio/techStack`.
- Produces: detail tech stack renders each category section as title + grouped pills; `ReadonlySkillChip` no longer exists.

- [ ] **Step 1: Write the failing test**

Create `src/components/portfolio/project-detail/ProjectTechStack.test.tsx`:

```tsx
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import ProjectTechStack from '@/components/portfolio/project-detail/ProjectTechStack';
import * as pillStyles from '@/components/ui/SkillGroupPills.css';

describe('ProjectTechStack', () => {
  it('renders same-category tech in a group pill under the category title', () => {
    const html = renderToStaticMarkup(
      <ProjectTechStack techStack={['React', 'Expo']} locale="ko" />,
    );

    expect(html.split(pillStyles.skillGroupPill).length - 1).toBe(1);
    expect(html).toContain('React');
    expect(html).toContain('Expo');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm exec vitest run src/components/portfolio/project-detail/ProjectTechStack.test.tsx`
Expected: FAIL — expected 1 occurrence, received 0 (current markup is flat `ReadonlySkillChip` spans).

- [ ] **Step 3: Write minimal implementation**

Replace the chip loop in `src/components/portfolio/project-detail/ProjectTechStack.tsx`:

```tsx
import SkillGroupPills from '@/components/ui/SkillGroupPills';
import { getProjectTechStackGroups } from '@/lib/portfolio/techStack';
import type { Language } from '@/lib/utils/language';

import * as styles from './ProjectTechStack.css';

interface Props {
  techStack: string[];
  locale: Language;
}

export default function ProjectTechStack({ techStack, locale }: Props) {
  const techStackByCategory = getProjectTechStackGroups(techStack, locale);

  return (
    <div className={styles.projectTechStack}>
      <div className={styles.techCategoryGrid}>
        {techStackByCategory.map((group) => (
          <div key={group.id} className={styles.techCategory}>
            <span className={styles.categoryTitle}>{group.title}</span>
            <SkillGroupPills skills={group.skills} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

Remove `techGrid` from `src/components/portfolio/project-detail/ProjectTechStack.css.ts` (only consumer was the deleted loop).

Delete `src/components/ui/ReadonlySkillChip.tsx`:

```bash
rm src/components/ui/ReadonlySkillChip.tsx
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm exec vitest run src/components/portfolio/project-detail/ProjectTechStack.test.tsx`
Expected: PASS.

- [ ] **Step 5: Run gates and commit**

Run: `pnpm exec tsc --noEmit --pretty false` and `pnpm exec biome check src/components/portfolio/project-detail/ProjectTechStack.tsx src/components/portfolio/project-detail/ProjectTechStack.css.ts src/components/portfolio/project-detail/ProjectTechStack.test.tsx`
Expected: clean.

```bash
git add src/components/portfolio/project-detail/ProjectTechStack.tsx src/components/portfolio/project-detail/ProjectTechStack.css.ts src/components/portfolio/project-detail/ProjectTechStack.test.tsx src/components/ui/ReadonlySkillChip.tsx
git commit -m "feat(portfolio): group project detail tech stack chips by category"
```

---

### Task 6: Full verification and browser check

**Files:** none

- [ ] **Step 1: Run all gates**

Run: `pnpm exec vitest run`, `pnpm exec tsc --noEmit --pretty false`, `pnpm exec biome check src docs`
Expected: all pass, no errors (pre-existing warnings allowed).

- [ ] **Step 2: Browser spot-check**

Against the dev server (localhost:3001 or `pnpm dev`):
- Home: spotlight cards and resume rows show group pills for 2+ runs; single skills flat; `+N` outside pills.
- Project detail (`/projects/aira`): each tech category shows tinted pill(s) under its title.
- Check light and dark theme.
- Confirm no layout shift or overflow at 375px width.

- [ ] **Step 3: Report results**

Summarize what changed, gates, and browser findings. No commit (nothing to commit in this task).
