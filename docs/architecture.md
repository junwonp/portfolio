# Architecture: Component Layers and Import Rules

This document is the agent- and human-facing map for **where components live and how they may depend on each other**.
It is intentionally small. Follow it when adding or moving files so the codebase keeps a clear, reuse-oriented shape.

Related: `AGENTS.md` (project + verification rules), `biome.json` (enforced import boundaries), `.omo/plans/design-system-foundation.md` (design-system extraction history).

---

## Layers

Four layers, from most reusable to most application-specific. Dependencies flow **downward only**.

| Layer | Location | Role | Reusability |
|---|---|---|---|
| **Shared infra** | `src/lib/**`, `src/config/**` | Non-UI logic: hooks, utils, styles/tokens, stores, server, domain data models | Reused anywhere, never imports UI |
| **Primitives (`ui`)** | `src/components/ui/**` | Domain-agnostic building blocks: `Button`, `ButtonGroup`, `Card`, `SectionHeading`, `ProgressBar`, `EmptyState`, `Badge`, `SkillChip`, `Select`, `Collapse`, `ui/icon/*`, … | Reused across all domains |
| **Domain / feature** | `src/components/portfolio/**`, `src/components/resume/**`, `src/components/print/**`, `src/components/analytics/**`, `src/components/admin/**` | Composed UI owned by one product area (home, navigation, layout, project-detail, resume, print, admin). Domain-aware grouping such as `portfolio/SkillGroups` lives here, not in `ui`. | Reused within that area |
| **Route / app** | `src/app/**` route files and co-located `_components/` (e.g. `src/app/(portfolio)/_components/`) | Page-specific composition, data wiring, route shells | Not reused elsewhere |

Non-UI logic that several domains share lives in `src/lib/**` (e.g. `lib/analytics/*` for engagement/transport, `lib/server/admin/actions.ts` for admin server actions).

`src/components/ui/` is the design-system root (see the plan for the primitive catalog and tokens in `src/lib/styles/theme.css.ts`).

## Import direction (unidirectional)

```
lib/config  →  components/ui  →  components/<domain>  →  app/**
```

Allowed:
- `ui/*` imports `lib/**`, other `ui/*`, `react`, `lucide-react`, theme tokens.
- `components/<domain>/*` imports `ui/*` and `lib/**`.
- `app/**` imports `components/<domain>/*`, `ui/*`, `lib/**`.

Forbidden:
- `ui/*` importing **any** domain component, route, domain data (`lib/portfolio`), routing (`next/navigation`), or analytics.
- `components/<domain>/*` importing `app/**`.
- `app/**` importing another app route's internals.
- Cross-domain deep imports (e.g. `portfolio/home` reaching into `portfolio/project-detail` internals) — move the shared piece to `ui/` or `lib/` instead.

The rule of thumb: **a lower layer must never know about a higher one.**

## Where does a new component go?

1. Domain-agnostic, used by 2+ unrelated areas? → `src/components/ui/`
2. Owned by one product area (home, resume, admin, …)? → `src/components/<domain>/`
3. Used by a single route/page? → that route's `_components/` folder
4. No JSX (data, hooks, helpers)? → `src/lib/**` (or `src/config/**`)

Prefer moving a component **down** a layer only when it becomes genuinely reused; avoid speculative extraction.

## Conventions

- **Styling**: vanilla-extract only. Co-locate `X.tsx` with `X.css.ts`. Reference tokens via `var(--...)`; never hardcode colors/px in components.
- **No TS imports inside `.css.ts`**: importing JS/TS modules (e.g. `@/...`) in a `.css.ts` file breaks the vinext worker resolver. Use raw `var(--...)` strings and raw media-query strings.
- **Exports**: keep a folder internally consistent. `src/components/ui/*` uses `default export`; `src/components/admin/*` and route `_components/*` use `named exports`. Do not mix within the same folder.
- **No barrels (`index.ts`)**: they can defeat Vite tree-shaking. Import files directly.
- **`'use client'`**: add only when a component uses hooks, events, or browser APIs; otherwise keep it server-compatible.
- **Verification**: run `pnpm exec tsc --noEmit --pretty false` and `pnpm exec vitest run` (and `pnpm exec biome check`) after changes.

## Why not Atomic Design or full FSD?

- **Atomic Design** (atoms/molecules/organisms/…) is a **UI taxonomy** for design systems, not a dependency architecture. In application code it tends to produce ambiguous boundaries and "organism inflation" (domain logic leaking into shared UI).
- **Feature-Sliced Design** is a full topology (layers × slices × segments) with significant ceremony — more than a solo portfolio needs.
- This project uses the **pragmatic middle** that is now common: `components/ui` primitives + domain folders + App Router colocation + a shared `lib/`. That is the structure documented above.

## Enforcement

The import direction is enforced by **Biome** via `noRestrictedImports` overrides in `biome.json`:

- `src/components/ui/**` may not import any `components/<domain>/**`, `@/lib/portfolio/**`, `@/app/**`, or `next/navigation`.
- `src/components/{portfolio,resume,print,analytics,admin}/**` and `src/lib/**` may not import `@/app/**`.
- `src/lib/**` may not import `@/components/**`.

Run `pnpm exec biome check` to verify. These rules are path-scoped; if a legitimate exception appears, prefer relocating the dependency over widening the rule.
