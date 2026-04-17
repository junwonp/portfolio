# AGENTS.md

This file contains comprehensive guidelines and commands for AI agents (such as Claude Code) working in this repository.

## Core Instructions

(The contents of CLAUDE.md have been integrated below.)

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev           # Start development server
pnpm build         # Production build (outputs to build/)
pnpm preview       # Preview production build locally
pnpm check         # Type-check with svelte-check (run after any edits)
pnpm lint          # Prettier check + ESLint
pnpm format        # Auto-format all files
```

Run `pnpm check` after every edit to `.svelte` or `.ts` files. Run `pnpm lint` before committing.

## Architecture

SvelteKit 2 + Svelte 5 personal portfolio site with bilingual support (Korean/English). Deployed to **Cloudflare Pages** using the Cloudflare adapter (`svelte.config.js`).

### i18n System

Language is resolved server-side in `src/hooks.server.ts`:

1. Check `preferred-language` cookie (persisted 1 year)
2. Fall back to `Accept-Language` header via `src/lib/utils/language.ts`
3. Stored in `event.locals.locale` and injected into `%lang%` in `app.html`

Language is switched via `POST /api/locale` which updates the cookie. All page server loads pass `locale` through `data`. Components call `getLabels(locale)` and `getResume(locale)` directly with the locale from `$props()`.

Resume content is in `src/lib/data/resume.en.ts` and `resume.ko.ts` — both must be kept structurally in sync. UI strings for both languages are in `src/lib/data/labels.ts`.

**Bilingual sync rule:** Any change to `resume.en.ts` must be mirrored in `resume.ko.ts` and vice versa. This includes adding/removing entries, changing field names, and updating data structure. Never modify one without the other.

### Project Detail Pages

Route: `src/routes/projects/[slug]/`

- `+page.server.ts` — validates slug, returns `{ slug, locale }`
- `+page.ts` — uses `import.meta.glob` to lazily load `src/lib/posts/${slug}.${locale}.svx`
- mdsvex (`.svx`) files support embedded Svelte components, preprocessed via `mdsvex()` in `svelte.config.js`

To add a new project: create `src/lib/posts/[slug].en.svx` and `src/lib/posts/[slug].ko.svx`, then add a `detailLink: '/projects/[slug]'` entry to both resume data files.

Each `.svx` file should include a frontmatter block at the top with these fields (all from `PostMetadata`):

```yaml
---
title: '' # Project name shown in page title and header
description: '' # Short summary (used in meta tags and tagline)
role: '' # Your role in the project
date: '' # YYYY-MM format
image: '' # OG image path (optional)
githubLink: '' # Repo name (auto-prefixed with GITHUB_PROFILE) or full URL (optional)
productLink: '' # Live product URL (optional)
---
```

### Svelte 5 Runes

All components use Svelte 5 runes exclusively — do not use Svelte 4 patterns:

| Svelte 4       | Svelte 5                  |
| -------------- | ------------------------- |
| `export let x` | `let { x } = $props()`    |
| `$: x = ...`   | `const x = $derived(...)` |
| `$: { ... }`   | `$effect(() => { ... })`  |
| `onMount(...)` | `$effect(...)`            |
| `<slot>`       | `{@render children()}`    |
| `on:click`     | `onclick`                 |

### Types

All types live in `src/lib/types/`. `about.ts` defines resume data types — `WorkExperienceProps` and `OtherExperienceProps` extend `ProjectProps`, which contains an inline array of project objects. `post.ts` defines post-related types. Dates are `YYYY-MM` strings; absent `dateTo` means present/ongoing.

## Code Style

- Always add an empty line between sibling declarations (interfaces, exported constants, functions).
- Do NOT add empty lines between properties inside the same object literal or type definition.
- Use `$lib` absolute imports throughout — no relative paths like `../../types/...`.

### Component Props

Always declare an explicit `interface Props` before using `$props()`:

```ts
interface Props {
  title: string;
  date?: string;
}

let { title, date }: Props = $props();
```

### CSS Variables

Never hardcode color or spacing values. Always use CSS custom properties defined in `src/app.css`:

- Colors: `var(--color-*)` (e.g. `var(--color-primary)`, `var(--color-basic-bg)`)
- Spacing: `var(--space-*)` (e.g. `var(--space-sm)`, `var(--space-xs)`)

### Images in `.svx` files

All images referenced in `.svx` project pages must be placed under `/static/images/` and referenced as `/images/filename.ext`. Do not use relative paths inside `.svx` files.

### Import Order (enforced by ESLint)

1. Side-effect imports
2. Svelte / SvelteKit packages (`svelte`, `@sveltejs/*`) — always first among libraries
3. Other external npm packages — alphabetical
4. _(empty line)_
5. Internal `$lib`, `$app` and other `$` path aliases — alphabetical
6. Same-directory relative (`./`) — alphabetical
7. Parent-directory relative (`../`) — alphabetical

### Svelte 5 Script Section Order

**Order of declarations in `<script lang="ts">` (top to bottom):**

1. Imports (auto-sorted by ESLint, see above)
2. Interface Props (explicit type declaration)
3. Props destructuring with `$props()` — `let` keyword
4. Constants (alphabetical, `const` only)
5. Derived values (alphabetical, `let` + `$derived()`)
6. State variables (alphabetical, `let` + `$state()`)
7. Functions (alphabetical)
8. Effects (`$effect()` and `$effect.pre()`, order by dependency)

**Example:**

```ts
<script lang="ts">
  import type { Snippet } from 'svelte';
  import Component from '$lib/components/Component.svelte';

  // 1. Interface Props
  interface Props {
    children?: Snippet;
    count: number;
    title: string;
  }

  // 2. Props (let keyword)
  let { children, count, title }: Props = $props();

  // 3. Constants (alphabetical)
  const isActive = true;
  const maxValue = 100;

  // 4. Derived (alphabetical with let)
  let doubled = $derived(count * 2);
  let label = $derived(`Title: ${title}`);

  // 5. State (alphabetical with let)
  let isOpen = $state(false);
  let selected = $state<string | null>(null);

  // 6. Functions (alphabetical)
  function handleClick() { ... }
  function toggleOpen() { ... }

  // 7. Effects (dependency order)
  $effect(() => {
    console.log(count);
  });

  $effect.pre(() => {
    // Setup
  });
</script>
```

**Rules:**

- Props are declared with `let` keyword (not `const`)
- `$derived` states are declared with `let` keyword (not `const`) — they are reactive and can be reassigned (e.g., for optimistic UI)
- `$state` variables are declared with `let` keyword
- Alphabetical ordering applies within each section: consts, derived, state, and functions
- Props destructuring should also be alphabetical
- **For derived values:** when one `$derived()` references another, maintain dependency order (referenced value first)
- `$effect` ordering is determined by dependencies, not alphabetical
- Empty line between each section

### Caching (hooks.server.ts)

- `/fonts/`, `/images/`, `/certificates/`: `public, max-age=31536000, immutable`
- HTML pages: `private, no-cache, no-store, must-revalidate` with `Vary: Accept-Language, Cookie`

## Custom Commands

### Add Project

Add a new project to the portfolio. Follow these steps:

1. Ask the user for the project slug (e.g. `my-project`), and whether they want to fill in details now or use placeholders.

2. Create `src/lib/posts/$SLUG.en.svx` with this frontmatter template:

```
---
title: ''
description: ''
role: ''
date: ''
image: ''
githubLink: ''
productLink: ''
---
```

3. Create `src/lib/posts/$SLUG.ko.svx` with the same frontmatter template in Korean content.

4. Add a new project entry to `src/lib/data/resume.en.ts` under the appropriate section (workExperiences, otherExperiences, or archives) with `detailLink: '/projects/$SLUG'`.

5. Mirror the exact same entry structure in `src/lib/data/resume.ko.ts`.

6. Run `pnpm check` to verify no type errors.

7. Show a summary of all created/modified files.

### Sync Check

Check whether `src/lib/data/resume.en.ts` and `src/lib/data/resume.ko.ts` are structurally in sync.

Read both files and compare:

1. **Top-level exports** — both files must export the same named constants (e.g. `introduction`, `workExperiences`, `otherExperiences`, `education`, `skills`, `archives`, `certificates`).

2. **Array lengths** — each array (workExperiences, otherExperiences, etc.) must have the same number of entries.

3. **Project entries** — for each experience, the nested `project` array must have the same number of items and the same `title` values (titles can differ in language but count must match).

4. **Field presence** — for each entry, both files must have the same optional fields present (e.g. if `detailLink` exists in EN it must exist in KO).

5. **detailLink consistency** — all `detailLink` values must match exactly between EN and KO (they're paths, not translatable).

Report any mismatches clearly, grouped by section. If everything is in sync, confirm with a short summary.

### Translate

Translate content between Korean and English for use in this portfolio.

The user will provide text or a file path. Follow these steps:

1. **Detect direction** — if the input is Korean translate to English, if English translate to Korean. If ambiguous, ask.

2. **Context-aware translation** — this is a developer portfolio. Use appropriate technical terminology. Keep technical terms (framework names, library names, method names) in their original English form even in Korean translations.

3. **Tone** — professional and concise, suitable for a resume or portfolio. Avoid overly formal or awkward phrasing.

4. **If translating a full file** — preserve the data structure exactly (object keys, field names, array order). Only translate string values that are human-readable content. Do NOT translate: `detailLink`, `githubLink`, `productLink`, `dateFrom`, `dateTo`, `role` values that are job titles (keep in English).

5. **Output** — show the translated result ready to paste. If it's a file, show the full updated content.
