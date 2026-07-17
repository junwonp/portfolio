# MDX Prose Project Details Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render each project detail as the default component of its localized MDX module while retaining frontmatter as the single source for all home-card and detail-hero metadata.

**Architecture:** `portfolioCatalog.ts` statically imports each localized MDX module's default component and frontmatter. The server route selects the component, renders it with `metadata` and `locale`, and passes the resulting React node into the server-rendered `ProjectDetailPage` article slot. No component function is passed through a client boundary.

**Tech Stack:** Next.js App Router through vinext, React Server Components, MDX, Cloudflare Workers, TypeScript, Vitest.

## Global Constraints

- Preserve every current canonical project ID, slug, section, route, career relationship, frontmatter field, and registered skill name.
- Keep `portfolioCatalog.ts` as the static Worker-safe module registry; do not add request-time dynamic imports.
- Keep `ProjectDetailPage` as a server component and do not pass an MDX component function to a client component.
- Preserve current user-authored, unrelated worktree changes outside the project-detail content path.
- Run `pnpm exec tsc --noEmit --pretty false`, `pnpm exec vitest run`, `pnpm lint`, `pnpm build`, `pnpm exec vinext check`, and a rendered project-route/browser smoke check before completion.

---

### Task 1: Replace block-oriented integrity expectations with an MDX component registry contract

**Files:**

- Modify: `src/lib/content/portfolioCatalog.test.ts`
- Modify: `src/lib/content/projects/catalogIntegrity.test.ts`
- Delete: `src/lib/content/projectDetailContent.test.ts`

**Interfaces:**

- Produces `getProjectDetailComponent(slug: string, locale: Language): ProjectDetailMdxComponent | undefined`.
- Each slug with a `detailPath` has a component in both supported locales; a project without a detail route returns `undefined`.

- [ ] **Step 1: Write failing registry tests**

```ts
import { getProjectDetailComponent } from '@/lib/content/projects';

it('keeps detail routes backed by localized MDX components', () => {
  expect(getProjectDetailComponent('aira', 'ko')).toBeDefined();
  expect(getProjectDetailComponent('aira', 'en')).toBeDefined();
});

it('does not expose a component for projects without a detail route', () => {
  expect(getProjectDetailComponent('mnd-dashboard', 'ko')).toBeUndefined();
});
```

- [ ] **Step 2: Run the focused tests and observe the missing-export failure**

Run: `pnpm exec vitest run src/lib/content/portfolioCatalog.test.ts src/lib/content/projects/catalogIntegrity.test.ts`

Expected: FAIL because `getProjectDetailComponent` is not exported.

- [ ] **Step 3: Remove tests that assert `blocks` IDs or array lengths**

Delete `getProjectDetailBlocks` imports and assertions. Retain locale metadata alignment, skill validation, canonical identifier, route, and career-topology coverage.

### Task 2: Add the server-only MDX component registry and article slot

**Files:**

- Modify: `src/env.d.ts`
- Modify: `src/lib/types/post.ts`
- Modify: `src/lib/content/portfolioCatalog.ts`
- Modify: `src/lib/content/projects/index.ts`
- Modify: `src/app/(portfolio)/portfolioRouteViews.tsx`
- Modify: `src/lib/components/ProjectDetailPage.tsx`

**Interfaces:**

```ts
export interface ProjectDetailMdxProps {
  locale: Language;
  metadata: PostMetadata;
}

export type ProjectDetailMdxComponent = React.ComponentType<ProjectDetailMdxProps>;
```

- [ ] **Step 1: Make the focused test fail for the new API**

Run: `pnpm exec vitest run src/lib/content/portfolioCatalog.test.ts src/lib/content/projects/catalogIntegrity.test.ts`

Expected: FAIL because the new registry function has not been implemented.

- [ ] **Step 2: Change static imports from `blocks` exports to default MDX components**

```ts
import AiraKo, { frontmatter as airaKoMetadata } from '@/lib/content/projects/aira/detail.ko.mdx';

interface ProjectMdxModule {
  Component: ProjectDetailMdxComponent;
  frontmatter: PostMetadata;
}
```

Store `{ Component: AiraKo, frontmatter: airaKoMetadata }` for each localized module. Add `getProjectDetailComponent` and export it through `content/projects/index.ts`.

- [ ] **Step 3: Render the selected component on the server**

```tsx
const DetailMdx = getProjectDetailComponent(slug, locale);

return (
  <ProjectDetailPage slug={slug} locale={locale} metadata={metadata}>
    <DetailMdx metadata={metadata} locale={locale} />
  </ProjectDetailPage>
);
```

Make `ProjectDetailPage` accept `children: React.ReactNode` and render it inside the existing article. Do not add `'use client'` to either the route or page shell.

Keep the existing `ProjectToc` client behavior: it reads `h2` elements from `.project-article` after mount and already observes content mutations. The direct MDX body must remain inside that article. Do not introduce a second build-time TOC representation; `h3` navigation is out of scope for this migration.

- [ ] **Step 4: Widen `PostMetadata` for all current frontmatter shapes**

Add typed support for `additional`, `companyName`, `focusKeywords`, `highlights`, `linkedinLink`, and `pillars` so career and profile MDX imports type-check without casts. Reuse `IntroductionProps` types where they match.

- [ ] **Step 5: Re-run the focused tests**

Run: `pnpm exec vitest run src/lib/content/portfolioCatalog.test.ts src/lib/content/projects/catalogIntegrity.test.ts`

Expected: PASS.

### Task 3: Restore direct MDX case-study documents and remove the serialized renderer

**Files:**

- Modify: every `src/lib/content/projects/*/detail.{en,ko}.mdx`
- Delete: `src/lib/components/ProjectDetailBlocks.tsx`
- Delete: `src/lib/content/projectDetailContent.ts`
- Delete: `src/lib/content/projects/detailContent/*.ts`
- Modify: `vitest.config.ts`

**Interfaces:**

- Each detail MDX default export renders ordinary headings, prose, lists, tables, and imported project components.
- The MDX declaration exports `frontmatter` and its default component only; no `blocks` export remains.

- [ ] **Step 1: Restore each body from the direct-MDX baseline while preserving current frontmatter**

Restore imports such as `ProjectAchievements`, `ProjectLightbox`, `ProjectTechStack`, `ImageGallery`, `ImageDescription`, and `MermaidDiagram` only in files that use them. Restore ordinary MDX headings and prose below the frontmatter. Keep `id`, `slug`, section, route, and career ownership out of project frontmatter because the catalog owns them.

- [ ] **Step 2: Delete the serialized block pipeline**

Remove `ProjectDetailBlocks`, `ProjectDetailBlock`, `renderProjectMarkdown`, all `export const blocks` declarations, and every obsolete `detailContent` module. Remove the Vitest regex and `new Function` logic that evaluated the blocks export.

- [ ] **Step 3: Run the targeted suite**

Run: `pnpm exec vitest run src/lib/content/portfolioCatalog.test.ts src/lib/content/projects/catalogIntegrity.test.ts`

Expected: PASS with no `blocks`, `detailContent`, or custom Markdown renderer import errors.

### Task 4: Verify the real compilation and public project behavior

**Files:**

- Modify: `docs/content-guide.md`

- [ ] **Step 1: Update authoring guidance**

Replace instructions that require `blocks` with the frontmatter-plus-direct-MDX model. Document that the static catalog owns only IDs, slugs, sections, routes, and career relationships.

- [ ] **Step 2: Run static and production verification**

Run: `pnpm exec tsc --noEmit --pretty false && pnpm exec vitest run && pnpm lint && pnpm build && pnpm exec vinext check`

Expected: every command exits `0`.

- [ ] **Step 3: Verify actual MDX output and client islands**

Run the local vinext server, request `/projects/aira` and `/en/projects/aira`, then use the configured browser tool to confirm `h2` headings with IDs, TOC links, an achievement accordion, and a lightbox trigger. Capture desktop and mobile screenshots if layout changes are visible.

- [ ] **Step 4: Review the full diff**

Run: `git diff --check` and `git diff -- docs/content-guide.md src/env.d.ts src/lib/types/post.ts src/lib/content src/lib/components/ProjectDetailPage.tsx src/app/'(portfolio)'/portfolioRouteViews.tsx vitest.config.ts`

Expected: no whitespace errors, no restored duplicate content modules, and no unrelated changes.
