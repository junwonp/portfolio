# Audit Remediation Implementation Plan

> **For agentic workers:** Use subagent-driven-development to implement independent tasks with review gates. User authorization covers implementation; commits require a separate requested approval workflow.

**Goal:** Correct the audited failures and reduce browser work using native web behavior.

**Architecture:** Keep the current vinext/Cloudflare architecture and MDX metadata contracts. Divide work into server boundaries, native interactions, and static media delivery; integrate only after subsystem regressions pass.

**Tech Stack:** TypeScript, React, vinext, Cloudflare Workers/D1, Vitest, vanilla-extract.

## Global Constraints

- Source changes are limited to the audit findings.
- Do not commit or deploy.
- Preserve locale alignment and existing public interfaces where practical.
- Run `pnpm exec tsc --noEmit --pretty false` and `pnpm exec vitest run` after changes.

## Task 1: Application link and administrator correctness

Files: `src/lib/server/application-links/store.ts`, `src/lib/utils/applicationSlug.ts`, `src/lib/server/admin/request.ts`, their existing tests and mutation callers.

- [ ] Add failing regressions for deleted link lookup, reserved route slugs, and asynchronous write checks.
- [ ] Require `deleted_at IS NULL` for live link resolution; invalidate affected locale routes when deletion succeeds.
- [ ] Reserve existing application routes and await the write-mode guard.
- [ ] Run targeted tests and inspect authorization failure behavior.

## Task 2: Analytics boundary protection

Files: `src/app/api/analytics/track/route.ts`, `wrangler.preview.jsonc`, related analytics validation/storage modules and tests.

- [ ] Add failing cases for oversized bodies, repeated submissions, and disabled preview collection.
- [ ] Bound parsing before JSON allocation, reject excessive submissions with 429, and fail closed when collection is disabled.
- [ ] Disable preview writes without altering production collection or remote resources.
- [ ] Verify malformed payloads, missing bindings, identity handling, and regular collection.

## Task 3: Native interactions

Files: `src/components/portfolio/project-detail/ImageGallery.tsx`, `ProjectLightbox.tsx`, `useLightboxDrag.ts`, associated styles; `src/components/ui/Collapse.tsx` and callers.

- [ ] Reproduce rapid mixed navigation and hidden-focus regressions in tests.
- [ ] Use a single bounded navigation state transition and remove obsolete transition timers.
- [ ] Use native horizontal overflow with scroll snapping for the gallery.
- [ ] Use a native modal dialog and disclosure behavior, preserving focus restoration and reduced motion.
- [ ] Verify touch scrolling, arrows, Escape, close/reopen, and keyboard tab order.

## Task 4: Static media and font delivery

Files: `src/lib/utils/image.ts`, media callers, `src/app/layout.tsx`, font assets/styles.

- [ ] Add image URL and sizing behavior regressions.
- [ ] Connect requested dimensions to actual responsive image delivery and reserve intrinsic space.
- [ ] Reduce font preloading and serve subsets while retaining fallback glyph coverage.
- [ ] Verify actual browser image/font requests and layout before claiming performance improvement.

## Task 5: Static diagrams

Files: `src/components/portfolio/project-detail/MermaidDiagram.tsx`, `MermaidDiagram.css.ts`, repository diagram generation tooling and generated assets.

- [ ] Enumerate all chart sources in locale MDX files and add freshness/coverage checks.
- [ ] Render deterministic SVG during development/build preparation using local Mermaid tooling; reject stale sources.
- [ ] Replace client effects and dynamic import with dimensioned static output; preserve theme colors with CSS or separate theme assets.
- [ ] Verify all four authored diagrams and inspect client output for absence of Mermaid runtime chunks.

## Task 6: Integration review

- [ ] Run TypeScript, Vitest, Biome check, `pnpm build`, `pnpm exec vinext check`, and Wrangler dry run.
- [ ] Inspect Korean/English main flows at mobile and desktop widths in both themes.
- [ ] Review changed code for security, correctness, and TypeScript issues; fix actionable findings and rerun affected checks.
- [ ] Report completed work, measured evidence, and external verification limits without claiming zero possible errors.

## Execution status

Implementation and local verification are complete. The original checklist above is retained as the planning record; see `/TASKS.md` for verified outcomes and remaining deployment/device/network checks. All 265 tests and the production build pass. No commit or deployment was performed.
