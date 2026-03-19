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
- MDSvex (`.svx`) files support embedded Svelte components, preprocessed via `mdsvex()` in `svelte.config.js`

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

## Commit Process

When asked to commit, always follow these steps in order:

1. **Run `pnpm lint` and `pnpm check`** — fix any errors before proceeding.
2. **Review all diffs** — check for errors, typos, and style violations.
3. **Group diffs by logical task** — split into atomic units (one concern per commit).
4. **Present groups and proposed commit messages** — wait for approval.
5. **Commit each group separately**.

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

### Caching (hooks.server.ts)

- `/fonts/`, `/images/`, `/certificates/`: `public, max-age=31536000, immutable`
- HTML pages: `private, no-cache, no-store, must-revalidate` with `Vary: Accept-Language, Cookie`
