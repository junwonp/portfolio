# Portfolio Content Catalog Implementation Plan

> **Historical / superseded:** This plan predates removal of the D1 content-override path. Use [2026-07-13-local-content-only-management.md](2026-07-13-local-content-only-management.md) as the current execution plan.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make centralized catalog identities and localized MDX/typed content the base data for the portfolio while preserving safe D1 runtime overrides.

**Architecture:** A catalog module owns all stable project and career identities, routes, sections, and one-way career ownership. Localized MDX modules export display metadata and `ProjectDetailBlock[]`; a compact typed credentials module holds education and certificates. The home and detail routes consume the assembled model, then apply D1 overrides that cannot modify catalog relationships.

**Tech Stack:** TypeScript, Next.js 16 App Router through vinext, MDX, Vitest, Cloudflare D1.

## Global Constraints

- Keep existing canonical project IDs, slugs, routes, application-link behavior, and registered skill names.
- Each work project has exactly one valid `careerId`; `other`, `archive`, and `standalone` projects have none.
- Keep `skills.ts` as the only skill registry and runtime validation source.
- MDX is the source-controlled base; D1 is a runtime override and cannot change IDs, sections, routes, or career ownership.
- Run `pnpm exec tsc --noEmit --pretty false` and `pnpm exec vitest run` after changes, then lint, vinext check, build, and browser verification.

---

### Task 1: Define catalog contracts with failing integrity tests

**Files:**

- Create: `src/lib/content/portfolioCatalog.test.ts`
- Create: `src/lib/content/portfolioCatalog.ts`
- Modify: `src/lib/content/projects/types.ts`
- Modify: `src/lib/content/projects/catalogIntegrity.test.ts`

**Interfaces:**

- Produces `careerCatalog`, `projectCatalog`, `getProjectsBySection`, and `getProjectsByCareerId`.
- Replaces `ProjectContentEntry.parentId` with `careerId?: CareerId`.

- [ ] **Step 1: Write failing catalog tests**

```ts
test('groups every work project under exactly one registered career', () => {
  for (const project of projectCatalog.filter((item) => item.section === 'work')) {
    expect(project.careerId).toBeDefined();
    expect(careerCatalog.some((career) => career.id === project.careerId)).toBe(true);
  }
});

test('does not assign a career to non-work projects', () => {
  expect(
    projectCatalog.filter((item) => item.section !== 'work').every((item) => !item.careerId),
  ).toBe(true);
});
```

- [ ] **Step 2: Run the focused test and confirm it fails because `portfolioCatalog` does not exist**

Run: `pnpm exec vitest run src/lib/content/portfolioCatalog.test.ts`

- [ ] **Step 3: Add the catalog types and initial static registry**

```ts
export interface CareerCatalogEntry {
  id: CareerId;
  content: Record<Language, CareerLocaleContent>;
}

export interface ProjectCatalogEntry extends ProjectContentEntry {
  careerId?: CareerId;
}

export const getProjectsByCareerId = (careerId: CareerId): ProjectCatalogEntry[] =>
  projectCatalog.filter((project) => project.careerId === careerId);
```

Keep all current IDs and routes in this module. Do not leave `id`, `slug`, `section`, `detailPath`, or a parent relationship in individual project files.

- [ ] **Step 4: Re-run the focused test and confirm it passes**

Run: `pnpm exec vitest run src/lib/content/portfolioCatalog.test.ts`

### Task 2: Move project metadata and detail blocks into MDX modules

**Files:**

- Modify: every `src/lib/content/projects/*/detail.{ko,en}.mdx`
- Create: localized MDX metadata modules for `day-planner`, `mnd-dashboard`, and `campus-town`
- Modify: `src/env.d.ts`
- Modify: `vitest.config.ts`
- Delete: `src/lib/content/projects/detailContent/*.ts`
- Delete: project-specific `src/lib/content/projects/*/index.ts`

**Interfaces:**

- Each detailed MDX module exports `frontmatter: PostMetadata` and `blocks: ProjectDetailBlock[]`.
- Each project is imported only by `portfolioCatalog.ts`.

- [ ] **Step 1: Write a failing import test for MDX detail blocks**

```ts
test('loads aira detail blocks from its Korean MDX module', async () => {
  const module = await import('@/lib/content/projects/aira/detail.ko.mdx');
  expect(module.blocks[0]).toMatchObject({ id: 'aira-ko-01', type: 'markdown' });
});
```

- [ ] **Step 2: Run the test and confirm the missing `blocks` export fails**

Run: `pnpm exec vitest run src/lib/content/portfolioCatalog.test.ts`

- [ ] **Step 3: Move each existing `detailContent` locale array into the matching MDX `blocks` export**

```mdx
---
title: 아이라 (aira)
description: 글로벌 AI 캐릭터 채팅 플랫폼.
---

export const blocks = [
  {
    id: 'aira-ko-01',
    type: 'markdown',
    markdown:
      '## 프로젝트 소개\n\n**"2.3만 명이 사용한 AI 캐릭터 채팅 서비스"**\n\n아이라는 사용자가 다양한 AI 캐릭터와 자유롭게 대화할 수 있는 채팅 앱입니다.',
  },
  { id: 'aira-ko-02', type: 'techStack' },
];
```

Retain all block IDs and values. Remove the equivalent MDX JSX body and the old TS block module in the same task. Add empty `blocks` exports only for projects without a detail route.

- [ ] **Step 4: Extend the MDX declaration and Vitest MDX mock**

```ts
declare module '*.mdx' {
  export const blocks: import('./lib/content/editableContent').ProjectDetailBlock[];
  export const frontmatter: import('./lib/types/post').PostMetadata;
}
```

The test transform must evaluate only the trusted local `export const blocks =` expression and return it together with `frontmatter`.

- [ ] **Step 5: Re-run MDX import and existing detail integrity tests**

Run: `pnpm exec vitest run src/lib/content/portfolioCatalog.test.ts src/lib/content/projects/catalogIntegrity.test.ts`

### Task 3: Assemble the centralized project catalog and update detail rendering

**Files:**

- Modify: `src/lib/content/projects/index.ts`
- Modify: `src/app/(portfolio)/portfolioRouteViews.tsx`
- Modify: `src/lib/content/projects/techStack.test.ts`
- Modify: `src/lib/content/projects/catalogIntegrity.test.ts`

**Interfaces:**

- `getProjectMetadata(slug, locale)` and `getProjectDetailBlocks(slug, locale)` read the catalog's MDX module data.
- Detail rendering continues to receive `ProjectDetailBlock[]` and `PostMetadata`.

- [ ] **Step 1: Write a failing route-data test asserting catalog-sourced metadata and blocks agree**

```ts
test('uses the same catalog record for aira metadata and detail blocks', () => {
  expect(getProjectMetadata('aira', 'ko')?.title).toBe('아이라 (aira)');
  expect(getProjectDetailBlocks('aira', 'ko')?.[0]?.id).toBe('aira-ko-01');
});
```

- [ ] **Step 2: Run the test and confirm the old detail-content import prevents the new API**

Run: `pnpm exec vitest run src/lib/content/projects/catalogIntegrity.test.ts`

- [ ] **Step 3: Read all project MDX modules in `portfolioCatalog.ts` and remove the legacy per-project indexes**

```ts
const getLocalizedProjectContent = (module: ProjectMdxModule): ProjectLocaleContent => ({
  title: module.frontmatter.title ?? '',
  description: module.frontmatter.description ?? '',
  metrics: module.frontmatter.metrics,
  summaryDetails: module.frontmatter.summaryDetails ?? [],
  detailMetadata: module.frontmatter,
});
```

Keep the existing catalog identifier normalization APIs and derive detail slugs from `detailPath`.

- [ ] **Step 4: Update `renderProjectDetailRoute` to read catalog blocks instead of `detailContent`**

Remove the `detailContent` import while preserving D1 override application and the current 404 condition when a route has no metadata or blocks.

- [ ] **Step 5: Re-run catalog and route-focused tests**

Run: `pnpm exec vitest run src/lib/content/projects/catalogIntegrity.test.ts src/lib/content/projects/techStack.test.ts src/lib/server/analyticsPayload.test.ts`

### Task 4: Move home profile and career display content to MDX and credentials to typed data

**Files:**

- Create: `src/lib/content/home/profile.ko.mdx`
- Create: `src/lib/content/home/profile.en.mdx`
- Create: `src/lib/content/careers/orca-ai/career.ko.mdx`
- Create: `src/lib/content/careers/orca-ai/career.en.mdx`
- Create: `src/lib/content/careers/vault-micro/career.ko.mdx`
- Create: `src/lib/content/careers/vault-micro/career.en.mdx`
- Create: `src/lib/content/careers/mnd/career.ko.mdx`
- Create: `src/lib/content/careers/mnd/career.en.mdx`
- Create: `src/lib/content/home/credentials.ts`
- Modify: `src/lib/data/resume.ts`
- Delete: `src/lib/data/resume.i18n.ts`
- Delete: `src/lib/data/resume.shared.ts`
- Test: `src/lib/data/resume.test.ts`

**Interfaces:**

- `getResumeData(locale)` obtains careers by `careerCatalog` and projects by `careerId`.
- `credentials` exports localized education and certificate records with stable item IDs.

- [ ] **Step 1: Write failing resume tests for the catalog relationship and compact credentials**

```ts
test('places aira only in the Orca AI work experience', () => {
  const resume = getResumeData('ko');
  const orca = resume.workExperiences.find((item) => item.id === 'orca_ai');
  expect(orca?.project.map((project) => project.id)).toContain('aira');
  expect(
    resume.workExperiences.filter((item) => item.id !== 'orca_ai').flatMap((item) => item.project),
  ).not.toContainEqual(expect.objectContaining({ id: 'aira' }));
});
```

- [ ] **Step 2: Run the test and confirm `WorkExperienceProps.id` is missing**

Run: `pnpm exec vitest run src/lib/data/resume.test.ts`

- [ ] **Step 3: Add localized profile/career MDX exports and the typed credentials module**

```ts
export const credentials = {
  education: [
    {
      id: 'hanyang',
      dateFrom: '2017-03',
      dateTo: '2024-02',
      content: {
        en: { school: 'Hanyang University', major: 'B.S. in Computer Software Engineering' },
        ko: { school: '한양대학교', major: '컴퓨터소프트웨어학부 학사' },
      },
    },
  ],
  certificates: [
    {
      id: 'aws',
      link: '/certificates/aws-training.pdf',
      content: {
        en: { label: 'AWS training and certification' },
        ko: { label: 'AWS training and certification' },
      },
    },
  ],
} as const;
```

Do not put skills or structural IDs in these content files.

- [ ] **Step 4: Refactor `getResumeData` to compose profile, careers, catalog projects, credentials, and the skill registry**

```ts
project: getProjectsByCareerId(career.id).map((project) => toResumeProject(project, locale)),
```

Add `id` to `WorkExperienceProps` so overrides and tests retain stable entity identity.

- [ ] **Step 5: Re-run resume and home data tests**

Run: `pnpm exec vitest run src/lib/data/resume.test.ts src/lib/server/homePageData.test.ts`

### Task 5: Protect catalog relationships from D1 overrides

**Files:**

- Modify: `src/lib/content/editableContent.ts`
- Modify: `src/lib/server/contentOverrideValidation.ts`
- Modify: `src/lib/components/EditableCompanyCard.tsx`
- Modify: `src/lib/components/EditableWorkAccordion.tsx`
- Modify: `src/lib/server/contentOverrideRequest.test.ts`
- Modify: `src/lib/content/editableContent.test.ts`

**Interfaces:**

- Home work overrides can change localized company fields only; base project grouping always comes from the catalog.
- Existing D1 rows remain readable but cannot replace or move project arrays.

- [ ] **Step 1: Write failing override tests**

```ts
test('preserves the catalog project list when a legacy work override includes a different project', () => {
  const result = applyHomeContentOverride(baseResume, {
    workExperiences: [{ ...baseResume.workExperiences[0], project: [] }],
  });
  expect(result.workExperiences[0]?.project).toEqual(baseResume.workExperiences[0]?.project);
});

test('rejects a home override payload that contains a project array', () => {
  expect(isValidHomeOverridePayload('workExperience::orca_ai', { project: [] })).toBe(false);
});
```

- [ ] **Step 2: Run the tests and confirm the old wholesale replacement behavior fails them**

Run: `pnpm exec vitest run src/lib/content/editableContent.test.ts src/lib/server/contentOverrideRequest.test.ts`

- [ ] **Step 3: Merge legacy overrides only into matching base entity display fields and add entity-scoped write targets**

Use `WorkExperienceProps.id` to match a base career. Preserve the base `project` array in every merge. Update editor target keys to `workExperience::<careerId>` and reject immutable identity or relationship fields.

- [ ] **Step 4: Re-run override tests and the full editor model test set**

Run: `pnpm exec vitest run src/lib/content/editableContent.test.ts src/lib/server/contentOverrideRequest.test.ts src/lib/components/editableContentEditorModel.test.ts`

### Task 6: Verify the full migration and remove obsolete sources

**Files:**

- Modify: `docs/content-guide.md`
- Delete: obsolete `detailContent` and resume split-data sources after import checks pass

- [ ] **Step 1: Search for obsolete source imports**

Run: `rg -n "detailContent|resume\.shared|resume\.i18n|parentId" src`

Expected: no application imports remain; historical documentation is excluded or updated.

- [ ] **Step 2: Run static and unit verification**

Run: `pnpm exec tsc --noEmit --pretty false && pnpm exec vitest run && pnpm lint && pnpm exec vinext check && pnpm build`

Expected: every command exits with code 0. Treat a successful build with only the known Wrangler log-path warning as successful.

- [ ] **Step 3: Verify rendered public and editor paths**

Run: start `pnpm dev`, then check `/`, `/projects/aira`, and authenticated `/projects/aira` editing with the configured browser tooling at desktop and mobile widths.

- [ ] **Step 4: Review the final diff and group commits**

Proposed groups: `refactor(content): centralize portfolio catalog`, `refactor(content): move project and home content sources`, and `test(content): guard catalog relationships`.
