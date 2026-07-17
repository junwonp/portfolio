# Local-Only Portfolio Content Management Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make local MDX and TypeScript files the only source for portfolio copy and structure, while retaining D1 exclusively for analytics metrics and application short URLs.

**Architecture:** Localized prose is loaded from project, career, and profile MDX. Stable IDs, project-to-career foreign keys, education, certificates, skill registration, and tailored-view configuration remain in typed TypeScript. Public routes assemble this repository model without reading D1 content overrides or checking admin edit state. The `portfolio_db` binding, analytics tables, and application-link tables remain active for runtime product data.

**Tech Stack:** TypeScript, React 19, Next.js 16 App Router through vinext, MDX, Vitest, Cloudflare Workers, and Cloudflare D1.

## Global Constraints

- Remove only the `content_overrides` content-management path; keep D1 analytics, Web Vitals, application links, short-URL redirects, and `/a` authentication.
- Audit local and remote published `content_overrides` rows before disconnecting reads; migrate visible copy into canonical local files and never silently discard it.
- Do not execute `DROP TABLE` against local or remote D1. The historical `content_overrides` table may remain unused and must not be part of active schema bootstrap.
- Keep one-way data flow: MDX/TS catalog -> validated portfolio model -> public pages. No public route may read or write portfolio copy in D1.
- Use `PROJECT_ID` and `CAREER_ID` as the only internal identity sources.
- A work project has exactly one registered `careerId`; a non-work project has none. Careers do not maintain a second reverse project list.
- Preserve public content, route status, analytics behavior, short-link behavior, and `/a` behavior except for removing editor controls and content-override endpoints.
- Use TDD order for code changes: failing test -> RED run -> smallest implementation -> GREEN run -> refactor.
- Final gates are lint, TypeScript, Vitest, vinext compatibility/build, HTTP smoke tests, and authenticated `/a` checks.
- Do not commit automatically. If a commit is later requested, follow the repository approval process.

## Dependency Order

1. Strengthen catalog identity and source-boundary tests.
2. Move remaining visible profile preset copy into MDX and consolidate skill registry data.
3. Audit published D1 content overrides and migrate active values into local sources.
4. Extract public project block types and Markdown rendering from editor-specific code.
5. Remove editor rendering and all D1 content reads from public routes.
6. Remove the content-override API/storage/schema bootstrap and update documentation.
7. Run full static, build, route, browser, analytics, and short-link verification.

---

### Task 1: Strengthen the Local Catalog and Foreign-Key Contracts

**Files:**

- Modify: `src/lib/content/portfolioCatalog.ts`
- Modify: `src/lib/content/projects/types.ts`
- Modify: `src/lib/content/projects/index.ts`
- Modify: `src/lib/content/portfolioCatalog.test.ts`
- Modify: `src/lib/content/projects/catalogIntegrity.test.ts`
- Modify: `src/lib/data/resume.ts`
- Modify: `src/lib/server/homePageData.ts`

**Interfaces:**

- Produce literal `CAREER_ID`, `PROJECT_ID`, `CareerId`, and `ProjectId` values.
- Type catalog entries so project `id\) is a `ProjectId` and `careerId` is a `CareerId`.
- Make role presets, default featured projects, normalization, and work grouping consume those types.

- [ ] **Step 1: Write failing uniqueness and foreign-key tests**

Add these assertions to `src/lib/content/portfolioCatalog.test.ts`:

~~~ts
const expectUnique = (values: readonly string[]): void => {
  expect(new Set(values).size).toBe(values.length);
};

it('keeps career ids, project ids, slugs, and detail routes unique', () => {
  expectUnique(careerCatalog.map((career) => career.id));
  expectUnique(projectCatalog.map((project) => project.id));
  expectUnique(projectCatalog.map((project) => project.slug));
  expectUnique(
    projectCatalog.flatMap((project) => (project.detailPath ? [project.detailPath] : [])),
  );
});

it('enforces the project-to-career foreign key', () => {
  const careerIds = new Set(careerCatalog.map((career) => career.id));

  for (const project of projectCatalog) {
    if (project.section === 'work') {
      expect(project.careerId).toBeDefined();
      expect(careerIds.has(project.careerId!)).toBe(true);
    } else {
      expect(project.careerId).toBeUndefined();
    }
  }
});
~~~

Also assert that structural fields in the English and Korean project MDX pair match: dates, links, icon, paradigm, featured skills, and tech stack.

- [ ] **Step 2: Run focused tests and verify RED**

Run:

~~~bash
./node_modules/.bin/vitest run src/lib/content/portfolioCatalog.test.ts src/lib/content/projects/catalogIntegrity.test.ts
~~~

Expected: FAIL because identity types and the complete duplicate/parity contract are not implemented.

- [ ] **Step 3: Add literal identity constants and typed catalog entries**

Define `CAREER_ID` and `PROJECT_ID` in `portfolioCatalog.ts`:

~~~ts
export const CAREER_ID = {
  mnd: 'mnd',
  orcaAi: 'orca_ai',
  vaultMicro: 'vault_micro',
} as const;

export type CareerId = (typeof CAREER_ID)[keyof typeof CAREER_ID];

export const PROJECT_ID = {
  adminDashboard: 'admin_dashboard',
  agenticWorkflow: 'agentic_workflow',
  aira: 'aira',
  camerafiStudio: 'camerafi_studio',
  campusTown: 'campus_town',
  dayPlanner: 'day_planner',
  electionAggregator: 'election_aggregator',
  kftcPlatform: 'kftc_platform',
  mndDashboard: 'mnd_dashboard',
  nextjsPortfolio: 'nextjs_portfolio',
  onelineBank: 'onelinebank_rebuild',
  todayWeather: 'today_weather',
  webViewer: 'web_viewer',
} as const;

export type ProjectId = (typeof PROJECT_ID)[keyof typeof PROJECT_ID];
~~~

Use the constants in career/project definitions. Change public catalog types, identifier maps, and resolution helpers to use the unions. External query strings may enter at the boundary, but a resolved value must be `ProjectId | null`.

- [ ] **Step 4: Replace raw internal selections**

Change `rolePresets` in `src/lib/data/resume.ts` to `readonly ProjectId[]` and replace every literal with `PROJECT_ID.*`. Define `defaultSelectedProjectIds` in `homePageData.ts` with the same constants. Preserve order and existing URL aliases.

- [ ] **Step 5: Run catalog, resume, and home tests and verify GREEN**

Run:

~~~bash
./node_modules/.bin/vitest run \
  src/lib/content/portfolioCatalog.test.ts \
  src/lib/content/projects/catalogIntegrity.test.ts \
  src/lib/data/resume.test.ts \
  src/lib/server/homePageData.test.ts
~~~

Expected: PASS with the same project order, role presets, normalization, and career grouping.

### Task 2: Move All Remaining Visible Profile Presets to MDX

**Files:**

- Rename: `src/lib/content/home/profile.en.mdx` -> `src/lib/content/home/profile.default.en.mdx`
- Rename: `src/lib/content/home/profile.ko.mdx` -> `src/lib/content/home/profile.default.ko.mdx`
- Create: `src/lib/content/home/profile-presets/{ops-data,web,rn,web-rn,ai}.{en,ko}.mdx`
- Create: `src/lib/content/skillCatalog.ts`
- Modify: `src/lib/data/skills.ts`
- Modify: `src/lib/data/resume.ts`
- Modify: `src/lib/data/resume.test.ts`
- Modify: `docs/content-guide.md`

**Interfaces:**

- Produce localized summary preset fields from MDX frontmatter.
- Keep `resume.ts` responsible for composition and routing, not visible preset copy.
- Produce one typed skill registry for chip names, categories, ordering, and localized group labels.

- [ ] **Step 1: Write failing profile and skill-source tests**

Add:

~~~ts
it('loads the web summary preset from localized MDX', () => {
  expect(getSummaryIntroduction('ko', 'web').tagline).toBe(
    '확장 가능한 웹 제품, 재사용 UI 시스템, 빠른 반복에 집중하는 프론트엔드 엔지니어',
  );
  expect(getSummaryIntroduction('en', 'web').pillars?.[0]?.title).toBe('Product UI Systems');
});
~~~

Also assert that every skill group uses registered names and that English/Korean group titles share category IDs and order.

- [ ] **Step 2: Run focused tests and verify RED**

Run:

~~~bash
./node_modules/.bin/vitest run src/lib/data/resume.test.ts src/lib/content/projects/techStack.test.ts
~~~

Expected: FAIL because preset MDX files and the shared skill catalog do not exist.

- [ ] **Step 3: Copy current preset values into localized MDX**

Copy every current `summaryPresets` value exactly into the matching locale file’s frontmatter: `tagline`, `metrics`, and `pillars`. Keep the default profile’s localized fields in `profile.default.*.mdx`. Do not duplicate visible preset strings in `resume.ts`.

- [ ] **Step 4: Create the typed skill catalog and derive existing helpers**

Move the `SKILL` constants, `SkillId`, `SkillName`, and group definitions into `src/lib/content/skillCatalog.ts`, with one record per group:

~~~ts
export const skillCatalog = [
  {
    id: 'languages',
    title: { en: 'Languages', ko: '언어' },
    list: [SKILL.languages.typescript, SKILL.languages.javascript, SKILL.languages.swift],
  },
] as const;
~~~

Make `src/lib/data/skills.ts` re-export the registry types/constants and derive `registeredSkillNames`, `isRegisteredSkillName`, `getSkillCategory`, and existing public helpers from `skillCatalog`. Keep public exports stable for project MDX validation so existing consumers do not gain a second skill source.

- [ ] **Step 5: Replace the in-file preset table with typed MDX imports**

Assemble the imports with:

~~~ts
const summaryPresetMetadata: Record<
  Language,
  Record<SummaryPresetId, Partial<SummaryPresetContent>>
> = {
  en: {
    default: profileDefaultEn,
    'ops-data': profileOpsDataEn,
    web: profileWebEn,
    rn: profileRnEn,
    'web-rn': profileWebRnEn,
    ai: profileAiEn,
  },
  ko: {
    default: profileDefaultKo,
    'ops-data': profileOpsDataKo,
    web: profileWebKo,
    rn: profileRnKo,
    'web-rn': profileWebRnKo,
    ai: profileAiKo,
  },
};
~~~

Delete `summaryPresets` after all imports and tests pass. Keep the returned introduction shape unchanged.

- [ ] **Step 6: Run focused tests and verify GREEN**

Run:

~~~bash
./node_modules/.bin/vitest run src/lib/data/resume.test.ts src/lib/content/projects/techStack.test.ts
~~~

Expected: PASS with unchanged localized profile output and registered skill-chip validation.

### Task 3: Audit and Migrate Published D1 Content Overrides

**Files:**

- Read: `wrangler.jsonc`
- Read: `wrangler.preview.jsonc`
- Read only through Wrangler: local and remote `portfolio-db`
- Modify only the canonical MDX/TS file identified by an active row
- Add or modify the closest focused test when a row requires migration

**Interfaces:**

- Consume published `content_overrides` rows without mutation.
- Produce a row-by-row decision: already represented locally, migrated to a canonical file, or explicitly reported as an unmappable structural conflict.

- [ ] **Step 1: Query local published rows**

Run:

~~~bash
pnpm exec wrangler d1 execute portfolio-db --local --config wrangler.jsonc --command "SELECT id, area, locale, target_key, payload, status, updated_at FROM content_overrides WHERE status = 'published' ORDER BY area, locale, target_key" --json
~~~

Do not add database dumps to git.

- [ ] **Step 2: Query remote published rows**

Run:

~~~bash
pnpm exec wrangler d1 execute portfolio-db --remote --config wrangler.jsonc --command "SELECT id, area, locale, target_key, payload, status, updated_at FROM content_overrides WHERE status = 'published' ORDER BY area, locale, target_key" --json
~~~

If authentication or network access blocks the query, stop before removing the content path and report the audit blocker. Do not assume the table is empty.

- [ ] **Step 3: Map each row by stable identity**

Resolve `home` rows through profile, career, credentials, or skill sources. Resolve `project-detail` rows through `projectCatalog` by slug and target key. Never match by array position, company name, or localized title.

- [ ] **Step 4: Migrate active visible differences**

For each visible difference, write a failing focused assertion first, then copy the value into the correct MDX frontmatter/body or typed TS record. Preserve catalog identity, order, membership, career ownership, slugs, and routes. Report rows that attempt structural changes instead of changing the catalog implicitly.

- [ ] **Step 5: Verify migrated sources**

Run:

~~~bash
./node_modules/.bin/vitest run \
  src/lib/data/resume.test.ts \
  src/lib/content/portfolioCatalog.test.ts \
  src/lib/content/projects/catalogIntegrity.test.ts
~~~

Expected: PASS, with every published row represented locally or reported as a structural conflict. Do not delete or update D1 rows.

### Task 4: Extract Public Project Content Types and Markdown Rendering

**Files:**

- Create: `src/lib/content/projectDetailContent.ts`
- Create: `src/lib/content/projectDetailContent.test.ts`
- Modify: `src/lib/content/portfolioCatalog.ts`
- Modify: `src/lib/components/ProjectDetailBlocks.tsx`
- Retain temporarily: `src/lib/content/editableContent.ts` and `src/lib/content/editableContent.test.ts` until Task 6 removes the override store/API path.
- Retain temporarily: `src/lib/content/projectDetailSections.ts` and `src/lib/content/projectDetailSections.test.ts` until Task 5 removes its editor consumers.

**Interfaces:**

- Produce `ProjectDetailBlock`, `ProjectDetailAchievement`, `ProjectDetailImage`, `ProjectDetailContent`, and `renderProjectMarkdown(markdown: string): string`.
- Remove home/project override types and merge functions from the public content module.

- [ ] **Step 1: Write the failing public renderer test**

Create `projectDetailContent.test.ts`:

~~~ts
import { renderProjectMarkdown } from '@/lib/content/projectDetailContent';

it('escapes unsupported html while preserving safe local images', () => {
  expect(
    renderProjectMarkdown('<script>alert(1)</script>\\n\\n![Chart](/images/chart.webp)'),
  ).toBe('<p>&lt;script&gt;alert(1)&lt;/script&gt;</p><p><img src="/images/chart.webp" alt="Chart">');
});
~~~

- [ ] **Step 2: Run the new test and verify RED**

Run: `./node_modules/.bin/vitest run src/lib/content/projectDetailContent.test.ts`

Expected: FAIL because the new public module does not exist.

- [ ] **Step 3: Move public unions and renderer without behavior changes**

Move the block unions and current escaping/table/list renderer to `projectDetailContent.ts`. Rename only the public function to `renderProjectMarkdown`. Keep the local-image allowlist and HTML escaping unchanged. Update `portfolioCatalog.ts` and `ProjectDetailBlocks.tsx`.

- [ ] **Step 4: Leave only temporary override compatibility code in `editableContent`**

Remove every public block type and Markdown renderer export from `editableContent`, but retain `HomeContentOverride`, `ProjectDetailContentOverride`, `applyHomeContentOverride`, and `applyProjectDetailContentOverride` until Tasks 5 and 6 delete their remaining editor/store consumers. Remove editor-only section parsing in Task 5, after its components are gone.

- [ ] **Step 5: Run public content tests and verify GREEN**

Run:

~~~bash
./node_modules/.bin/vitest run \
  src/lib/content/projectDetailContent.test.ts \
  src/lib/content/projects/catalogIntegrity.test.ts
~~~

Expected: PASS with identical rendered HTML and valid catalog MDX blocks.

### Task 5: Remove Editor Rendering and D1 Content Reads from Public Routes

**Files:**

- Modify: `src/lib/components/HomePage.tsx`
- Modify: `src/lib/components/HomePageClient.tsx`
- Modify: `src/lib/components/ProjectDetailPage.tsx`
- Modify: `src/app/(portfolio)/portfolioRouteViews.tsx`
- Modify: `src/lib/server/homePageData.ts`
- Modify: `src/lib/server/homePageData.test.ts`
- Delete: `src/lib/components/EditableHomePage.tsx`
- Delete: `src/lib/components/EditableHomePageClient.tsx`
- Delete: `src/lib/components/EditableWorkAccordion.tsx`
- Delete: `src/lib/components/EditableCompanyCard.tsx`
- Delete: `src/lib/components/HomeEditableSections.tsx`
- Delete: `src/lib/components/ProjectDetailEditableRegions.tsx`
- Delete: `src/lib/components/EditableContentButton.tsx`
- Delete: `src/lib/components/EditableContentButton.module.css`
- Delete: `src/lib/components/editableContentEditorModel.ts`
- Delete: `src/lib/components/editableContentEditorModel.test.ts`

**Interfaces:**

- Produce one public rendering path independent of admin state and content D1.
- Reduce `HomePageData` to the fields consumed by public components: featured projects, mode, labels, locale, nav sections, current-locale resume data, and current-locale summary introduction.
- Make `createHomePageData` accept only `{ locale, tailoredView }`; remove D1/admin inputs and override payloads. Remove `getHomePageData` after updating both home and short-link routes to call `createHomePageData` directly.

- [ ] **Step 1: Update home contract tests first**

Use this setup:

~~~ts
const data = createHomePageData({
  locale: 'ko',
  tailoredView: { summaryPreset: 'default', projectIds: [] },
});

expect(data).not.toHaveProperty('isAdminEditor');
expect(data).not.toHaveProperty('homeContentOverride');
expect(data).not.toHaveProperty('resumeDataByLocale');
expect(data.resumeData.introduction.tagline).toBeDefined();
~~~

Keep query alias, default project ordering, and role-fit assertions; delete tests that only prove D1 override merging or localized editor payloads.

- [ ] **Step 2: Run focused home tests and verify RED**

Run: `./node_modules/.bin/vitest run src/lib/server/homePageData.test.ts`

Expected: FAIL because `homePageData.ts` still requires override and admin fields.

- [ ] **Step 3: Make home data repository-only**

Remove D1, admin permission, override imports, `resumeDataByLocale`, `summaryIntroductionByLocale`, and override application. Build current-locale data directly from `getResumeData(locale)` and `getSummaryIntroduction(locale, tailoredView.summaryPreset)`. Preserve navigation, labels, and featured project ordering. Delete `getHomePageData` once its two route consumers are updated.

- [ ] **Step 4: Make home and project components non-editable**

`HomePage.tsx` always renders `HomePageClient`. `HomePageClient.tsx` renders `WorkAccordion` and existing project/skill sections directly. `ProjectDetailPage.tsx` renders hero and article directly from `metadata` and `detailBlocks`, without `projectContentByLocale` or `isAdminEditor`.

- [ ] **Step 5: Remove D1 reads from route composition**

Keep `getDb()` in `renderShortUrlRoute` because application-link lookup is retained. Home and project-detail routes must not read D1. Project detail must read catalog metadata/blocks for the requested locale and pass them directly to `ProjectDetailPage`.

- [ ] **Step 6: Delete editor-only components after import search is empty**

Run:

~~~bash
rg -n "EditableContentButton|EditableHomePage|EditableCompanyCard|EditableWorkAccordion|ProjectDetailEditableRegions|editableContentEditorModel|isAdminEditor|homeContentOverride|projectContentByLocale" src
~~~

Expected after deletion: no matches.

- [ ] **Step 7: Run home, resume, and project tests and verify GREEN**

Run:

~~~bash
./node_modules/.bin/vitest run \
  src/lib/server/homePageData.test.ts \
  src/lib/data/resume.test.ts \
  src/lib/content/projectDetailContent.test.ts \
  src/lib/content/projects/catalogIntegrity.test.ts
~~~

Expected: PASS with public content unchanged apart from editor controls being absent.

### Task 6: Remove the Content-Override API and Storage Path

**Files:**

- Delete: `src/app/api/admin/content-overrides/route.ts`
- Delete: `src/lib/server/contentOverrideRequest.ts`
- Delete: `src/lib/server/contentOverrideRequest.test.ts`
- Delete: `src/lib/server/contentOverrideValidation.ts`
- Delete: `src/lib/server/editableContentStore.ts`
- Delete: `src/lib/server/editableContentStore.test.ts`
- Delete: `src/lib/content/editableContent.ts`
- Delete: `src/lib/content/editableContent.test.ts`
- Modify: `schema.sql`
- Modify: `docs/content-guide.md`
- Modify: `docs/superpowers/specs/2026-07-12-github-only-content-management-design.md` only if it still describes overrides as active

**Interfaces:**

- Remove active content-override HTTP, validation, and D1 storage code.
- Preserve analytics, Web Vitals, application links, short-link redirects, and `/a` data access.

- [ ] **Step 1: Run retained-D1 regression tests before deletion**

Run:

~~~bash
./node_modules/.bin/vitest run \
  src/lib/server/adminAccess.test.ts \
  src/lib/server/adminDashboardData.test.ts \
  src/lib/server/adminSession.test.ts \
  src/lib/server/analyticsTracking.test.ts \
  src/lib/server/applicationLinkStore.test.ts
~~~

Expected: PASS before any content storage file is deleted.

- [ ] **Step 2: Delete override API and store after consumer search is empty**

Remove only the listed content files. Do not change analytics stores, application-link stores, or `/a` actions except for imports proven to be editor-only.

- [ ] **Step 3: Remove only content-override schema bootstrap**

Delete `CREATE TABLE content_overrides` and its lookup index from `schema.sql`. Keep `user_sessions`, `page_views`, `web_vitals`, `application_links`, `application_link_visits`, `tags`, and `revalidations` unchanged. Do not drop the historical table from any database.

- [ ] **Step 4: Document the local editing model**

Update `docs/content-guide.md` to show:

~~~text
MDX/TS in this repository -> catalog validation -> public pages
~~~

Remove browser-editor and D1-override instructions. State explicitly that D1 is used only for analytics and application short URLs.

- [ ] **Step 5: Prove obsolete references are absent**

Run:

~~~bash
rg -n "content-overrides|contentOverride|editableContentStore|getPublishedHomeOverride|getProjectDetailContentOverride|isAdminEditor|EditableHomePage|ProjectDetailEditableRegions" src docs schema.sql
~~~

Expected: no active application or current-operation documentation references.

- [ ] **Step 6: Re-run retained-D1 regression tests**

Run the exact command from Step 1. Expected: PASS with analytics and application-link behavior unchanged.

### Task 7: Full Verification and Runtime Smoke Tests

**Files:**

- Review: every changed file
- No new committed artifacts

**Interfaces:**

- Produce evidence that portfolio copy is repository-only.
- Produce evidence that retained D1 analytics and short-link products did not regress.

- [ ] **Step 1: Run static and unit gates individually**

Run:

~~~bash
pnpm lint
./node_modules/.bin/tsc --noEmit --pretty false
./node_modules/.bin/vitest run
./node_modules/.bin/vinext check
./node_modules/.bin/vinext build
~~~

Expected: every command exits 0. Accept the known Wrangler log-path `EPERM` diagnostic only when `vinext build` exits 0 and creates `dist/standalone/`.

- [ ] **Step 2: Verify public HTTP routes**

With the local server running, check `/`, `/en`, `/resume`, every `detailPath` in `detailProjectCatalog`, representative tailored home query URLs, and projects without `detailPath`.

Expected: current 200/404 status behavior, meaningful HTML, no framework error markers, and no editor controls.

- [ ] **Step 3: Verify the removed content endpoint**

Request `POST /api/admin/content-overrides` locally and expect 404. Inspect home and project pages in authenticated admin context and expect no edit/add/save controls.

- [ ] **Step 4: Verify retained `/a` and short-link behavior**

Use the established local admin flow to load `/a`, confirm metrics render, create one disposable local application short URL, resolve it, and confirm its selected project IDs and summary preset produce the same tailored home view. Do not delete existing links or write to remote D1.

- [ ] **Step 5: Inspect rendered HTML and source boundaries**

Confirm ordinary home/project content no longer imports `getDb()` and all visible profile, career, and project copy resolves from MDX or typed catalog data. Confirm no project-specific `index.ts` or `detailContent/*.ts` files were recreated.

- [ ] **Step 6: Review the diff before handoff**

Run:

~~~bash
git diff --check
git diff --stat
git status --short
~~~

Read every changed file, group changes into catalog/content, editor removal, and documentation/verification units, and report proposed English commit messages without committing.
