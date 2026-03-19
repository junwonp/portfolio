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

## Architecture

SvelteKit 2 + Svelte 5 personal portfolio site with bilingual support (Korean/English). Deployed to **Cloudflare Pages** using the Cloudflare adapter (`svelte.config.js`).

### i18n System

Language is resolved server-side in `src/hooks.server.ts`:

1. Check `preferred-language` cookie (persisted 1 year)
2. Fall back to `Accept-Language` header via `src/lib/utils/language.ts`
3. Stored in `event.locals.locale` and injected into `%lang%` in `app.html`

Language is switched via `POST /api/locale` which updates the cookie. All page server loads pass `locale` through `data`. Components call `getLabels(locale)` and `getResume(locale)` directly with the locale from `$props()`.

Resume content is in `src/lib/data/resume.en.ts` and `resume.ko.ts` — both must be kept structurally in sync. UI strings for both languages are in `src/lib/data/labels.ts`.

### Project Detail Pages

Route: `src/routes/projects/[slug]/`

- `+page.server.ts` — validates slug, returns `{ slug, locale }`
- `+page.ts` — uses `import.meta.glob` to lazily load `src/lib/posts/${slug}.${locale}.svx`
- MDSvex (`.svx`) files support embedded Svelte components, preprocessed via `mdsvex()` in `svelte.config.js`

To add a new project: create `src/lib/posts/[slug].en.svx` and `src/lib/posts/[slug].ko.svx`, then add a `detailLink: '/projects/[slug]'` entry to both resume data files.

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

Always import types using `$lib` absolute paths (e.g. `$lib/types/about`), never relative paths.

## Code Style

- Always add an empty line between sibling declarations (interfaces, exported constants, functions).
- Do NOT add empty lines between properties inside the same object literal or type definition.
- Use `$lib` absolute imports throughout — no relative paths like `../../types/...`.

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
