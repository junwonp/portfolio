# GitHub-Only Content Management Implementation Plan

> Superseded by docs/superpowers/plans/2026-07-13-local-content-only-management.md. The newer plan clarifies that only the D1 content-override path is removed; analytics and application short URLs remain on D1.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove portfolio content editing and D1 content overrides while making repository MDX and typed catalogs the only content source, without changing analytics metrics or application short URLs.

**Architecture:** Localized prose is loaded from MDX, while stable IDs and compact registries remain typed TypeScript data. Public routes assemble this repository data directly without an administrator-dependent branch or D1 override. Analytics and application-link D1 flows remain isolated and unchanged.

**Tech Stack:** TypeScript, React 19, Next.js 16 App Router through vinext, MDX, Vitest, Cloudflare Workers and D1.

## Global Constraints

- Preserve `/a` authentication, analytics metrics, application-link creation, ordering, deletion, and redirects.
- Do not drop or delete the remote `content_overrides` table.
- Audit published local and remote overrides before removing active reads.
- Keep project block rendering and Markdown sanitization after editor code is deleted.
- Use `CAREER_ID` and `PROJECT_ID` references for internal selections instead of raw project ID strings.
- A work project has exactly one registered `careerId`; a non-work project has none.
- Run `pnpm exec tsc --noEmit --pretty false` and `pnpm exec vitest run` after changes, followed by lint, vinext check, build, HTTP smoke, and authenticated `/a` verification.
- Do not commit automatically. Follow the repository commit process and present logical groups for approval if the user asks to commit.

---

### Task 1: Strengthen the Catalog and Foreign-Key Contracts

**Files:**
- Modify: `src/lib/content/portfolioCatalog.ts`
- Modify: `src/lib/content/projects/types.ts`
- Modify: `src/lib/content/portfolioCatalog.test.ts`
- Modify: `src/lib/content/projects/catalogIntegrity.test.ts`
- Modify: `src/lib/data/resume.ts`
- Modify: `src/lib/server/homePageData.ts`

**Interfaces:**
- Produces: `CAREER_ID`, `CareerId`, `PROJECT_ID`, `ProjectId`, and catalog entries with typed identity and ownership.
- Consumers: role presets, selected-project defaults, identifier normalization, home grouping, application-link options.

- [ ] **Step 1: Write failing catalog integrity tests**

Add tests that require unique identities and valid foreign keys:

```ts
const expectUnique = (values: readonly string[]): void => {
  expect(new Set(values).size).toBe(values.length);
};

it('keeps project identities, slugs, and detail routes unique', () => {
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
```

- [ ] **Step 2: Run the focused tests and verify RED**

Run: `./node_modules/.bin/vitest run src/lib/content/portfolioCatalog.test.ts src/lib/content/projects/catalogIntegrity.test.ts`

Expected: FAIL because typed ID constants and the complete uniqueness/parity contract are not implemented.

- [ ] **Step 3: Add literal identity constants and typed catalog entries**

Define constants before catalog records:

```ts
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
```

Use `ProjectId` for project definitions and `CareerId` for career IDs and `careerId`. Export a `ProjectCatalogEntry` that preserves these types for consumers.

- [ ] **Step 4: Replace internal raw project selections**

Change role and default selections to typed references:

```ts
const rolePresets: Record<
  RolePresetId,
  { projectIds: readonly ProjectId[]; summary: SummaryPresetId }
> = {
  web: {
    summary: 'web',
    projectIds: [
      PROJECT_ID.camerafiStudio,
      PROJECT_ID.todayWeather,
      PROJECT_ID.webViewer,
      PROJECT_ID.adminDashboard,
    ],
  },
  mobile: {
    summary: 'rn',
    projectIds: [
      PROJECT_ID.aira,
      PROJECT_ID.onelineBank,
      PROJECT_ID.todayWeather,
      PROJECT_ID.dayPlanner,
    ],
  },
  ai: {
    summary: 'ai',
    projectIds: [
      PROJECT_ID.aira,
      PROJECT_ID.nextjsPortfolio,
      PROJECT_ID.agenticWorkflow,
      PROJECT_ID.todayWeather,
    ],
  },
};
```

Use the same constants for `defaultSelectedProjectIds` in `homePageData.ts`.

- [ ] **Step 5: Re-run catalog, resume, and home tests and verify GREEN**

Run: `./node_modules/.bin/vitest run src/lib/content/portfolioCatalog.test.ts src/lib/content/projects/catalogIntegrity.test.ts src/lib/data/resume.test.ts src/lib/server/homePageData.test.ts`

Expected: PASS with all project selections and career relationships preserved.

### Task 2: Move Remaining Profile Copy to MDX and Consolidate Skill Data

**Files:**
- Rename: `src/lib/content/home/profile.en.mdx` to `src/lib/content/home/profile.default.en.mdx`
- Rename: `src/lib/content/home/profile.ko.mdx` to `src/lib/content/home/profile.default.ko.mdx`
- Create: `src/lib/content/home/profile-presets/{ops-data,web,rn,web-rn,ai}.{en,ko}.mdx`
- Create: `src/lib/content/skillCatalog.ts`
- Modify: `src/lib/data/skills.ts`
- Modify: `src/lib/data/resume.ts`
- Modify: `src/lib/data/resume.test.ts`

**Interfaces:**
- Produces: localized `IntroductionProps` for every `SummaryPresetId` from MDX.
- Produces: one typed skill catalog containing localized group titles, order, and allowed chip values.

- [ ] **Step 1: Write failing profile-preset and skill-catalog tests**

Add tests proving visible preset copy is imported rather than declared in `resume.ts`:

```ts
it('loads the web summary preset from localized MDX', () => {
  expect(getSummaryIntroduction('ko', 'web').tagline).toBe(
    '확장 가능한 웹 제품, 재사용 UI 시스템, 빠른 반복에 집중하는 프론트엔드 엔지니어',
  );
  expect(getSummaryIntroduction('en', 'web').pillars?.[0]?.title).toBe('Product UI Systems');
});
```

Add a skill test that requires localized titles to come from the same group record as its list.

- [ ] **Step 2: Run the focused tests and verify RED**

Run: `./node_modules/.bin/vitest run src/lib/data/resume.test.ts src/lib/content/projects/techStack.test.ts`

Expected: FAIL because preset imports and `skillCatalog` do not exist.

- [ ] **Step 3: Create localized preset MDX files**

Each file contains only visible preset fields:

```mdx
---
tagline: 확장 가능한 웹 제품, 재사용 UI 시스템, 빠른 반복에 집중하는 프론트엔드 엔지니어
metrics: []
pillars:
  [
    { index: '01', title: '제품형 UI 시스템', description: '고객용 웹 제품에 맞는 재사용 가능한 인터페이스와 예측 가능한 상호작용을 설계합니다.' },
    { index: '02', title: '데이터 기반 화면 설계', description: '복잡한 테이블, 필터, 대시보드를 운영 흐름으로 읽기 쉬운 구조로 바꿉니다.' },
    { index: '03', title: '성능 오너십', description: '기능이 늘어나도 번들, 렌더링, 인터랙션이 느려지지 않도록 관리합니다.' },
  ]
---
```

Copy every existing preset value exactly before deleting `summaryPresets` from `resume.ts`.

- [ ] **Step 4: Create the typed skill catalog**

Move `SKILL`, group ordering, and localized group titles into one data module:

```ts
export const skillCatalog = [
  {
    id: 'languages',
    title: { en: 'Languages', ko: '언어' },
    list: [SKILL.languages.typescript, SKILL.languages.javascript, SKILL.languages.swift],
  },
] as const satisfies readonly SkillCatalogEntry[];
```

Keep `skills.ts` as the public helper boundary that derives `registeredSkillNames`, `isRegisteredSkillName`, and `getSkillCategory` from `skillCatalog`.

- [ ] **Step 5: Assemble profile presets from MDX**

Replace the in-file copy table with imports and a typed mapping:

```ts
const summaryPresetMetadata: Record<
  Language,
  Record<SummaryPresetId, Partial<IntroductionProps>>
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
```

- [ ] **Step 6: Re-run focused tests and verify GREEN**

Run: `./node_modules/.bin/vitest run src/lib/data/resume.test.ts src/lib/content/projects/techStack.test.ts`

Expected: PASS with unchanged visible profile and skill values.

### Task 3: Audit Published D1 Content Overrides

**Files:**
- Read: `wrangler.jsonc`
- Read: `.wrangler/state/` through Wrangler only
- Modify only if needed: the canonical MDX or typed data file identified by an active override

**Interfaces:**
- Consumes: current `content_overrides` rows.
- Produces: a verified decision that every active row is already represented locally or has been migrated.

- [ ] **Step 1: Query local published overrides without mutation**

Run:

```bash
pnpm exec wrangler d1 execute portfolio-db --local --config wrangler.jsonc --command "SELECT id, area, locale, target_key, payload, status, updated_at FROM content_overrides WHERE status = 'published' ORDER BY area, locale, target_key" --json
```

Expected: a JSON result set or a missing-table result that proves local state has no active content to preserve.

- [ ] **Step 2: Query remote published overrides without mutation**

Run:

```bash
pnpm exec wrangler d1 execute portfolio-db --remote --config wrangler.jsonc --command "SELECT id, area, locale, target_key, payload, status, updated_at FROM content_overrides WHERE status = 'published' ORDER BY area, locale, target_key" --json
```

Expected: a JSON result set. If authentication or network access blocks the query, stop before Task 5 and report the audit blocker.

- [ ] **Step 3: Compare each row to canonical local content**

For every row, resolve the target through `portfolioCatalog`, the profile preset map, `credentials`, or `skillCatalog`. Never use array position or company name to infer identity.

Expected: either the row matches local content, or its visible fields are copied into the canonical file with a focused failing test written before the migration edit.

- [ ] **Step 4: Verify migrated content**

Run the closest focused test for every changed entity, followed by:

`./node_modules/.bin/vitest run src/lib/data/resume.test.ts src/lib/content/projects/catalogIntegrity.test.ts`

Expected: PASS. Do not delete or update D1 rows.

### Task 4: Extract Public Project Content Types from Editor Code

**Files:**
- Create: `src/lib/content/projectDetailContent.ts`
- Create: `src/lib/content/projectDetailContent.test.ts`
- Modify: `src/env.d.ts`
- Modify: `src/lib/content/portfolioCatalog.ts`
- Modify: `src/lib/content/projectDetailSections.ts`
- Modify: `src/lib/components/ProjectDetailBlocks.tsx`
- Modify: `src/lib/components/ProjectDetailPage.tsx`
- Delete after migration: `src/lib/content/editableContent.ts`
- Delete after migration: `src/lib/content/editableContent.test.ts`

**Interfaces:**
- Produces: `ProjectDetailBlock`, `ProjectDetailAchievement`, `ProjectDetailImage`, and `renderProjectMarkdown(markdown: string): string` for public rendering.
- Removes: home and project override merge types from the public content module.

- [ ] **Step 1: Write failing public rendering tests against the new module**

Move the existing Markdown assertions to `projectDetailContent.test.ts` and import the wished-for API:

```ts
import { renderProjectMarkdown } from '@/lib/content/projectDetailContent';

it('escapes unsupported html while preserving safe local images', () => {
  expect(renderProjectMarkdown('<script>alert(1)</script>\n\n![Chart](/images/chart.webp)')).toBe(
    '<p>&lt;script&gt;alert(1)&lt;/script&gt;</p><p><img src="/images/chart.webp" alt="Chart"></p>',
  );
});
```

- [ ] **Step 2: Run the new test and verify RED**

Run: `./node_modules/.bin/vitest run src/lib/content/projectDetailContent.test.ts`

Expected: FAIL because the new module does not exist.

- [ ] **Step 3: Move public types and Markdown rendering**

Copy the block unions and renderer without behavior changes, rename only `renderEditableMarkdown` to `renderProjectMarkdown`, and update all retained public imports.

- [ ] **Step 4: Delete override-only exports and tests**

Remove `HomeContentOverride`, `ProjectDetailContentOverride`, and both apply-override functions after all imports have moved.

- [ ] **Step 5: Re-run public block tests and verify GREEN**

Run: `./node_modules/.bin/vitest run src/lib/content/projectDetailContent.test.ts src/lib/content/projects/catalogIntegrity.test.ts src/lib/content/projectDetailSections.test.ts`

Expected: PASS with identical sanitized HTML and valid MDX blocks.

### Task 5: Remove Home and Project Editor Rendering

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
- Delete: `src/lib/content/projectDetailSections.ts`
- Delete: `src/lib/content/projectDetailSections.test.ts`

**Interfaces:**
- Produces: one public rendering path independent of admin state.
- Removes: `HomePageData.isAdminEditor`, override data, `resumeDataByLocale`, and `summaryIntroductionByLocale` when no retained consumer remains.

- [ ] **Step 1: Write failing home data tests for the simplified contract**

Update the wished-for call shape:

```ts
const data = createHomePageData({
  locale: 'ko',
  tailoredView: { summaryPreset: 'default', projectIds: [] },
});

expect(data).not.toHaveProperty('isAdminEditor');
expect(data).not.toHaveProperty('homeContentOverride');
expect(data).not.toHaveProperty('resumeDataByLocale');
```

Add a project route test or source-level consumer assertion that `ProjectDetailPage` no longer receives `isAdminEditor`.

- [ ] **Step 2: Run focused tests and verify RED**

Run: `./node_modules/.bin/vitest run src/lib/server/homePageData.test.ts src/lib/content/projects/catalogIntegrity.test.ts`

Expected: FAIL because the current contract still requires override and admin fields.

- [ ] **Step 3: Simplify home composition**

Change the input and result to repository-only data:

```ts
interface CreateHomePageDataInput {
  locale: Language;
  tailoredView: ResolvedHomeTailoredView;
}

export const createHomePageData = ({ locale, tailoredView }: CreateHomePageDataInput): HomePageData => {
  const labels = getLabels(locale);
  const resumeData = getResumeData(locale);
  const featuredProjectsMode = tailoredView.projectIds.length > 0 ? 'role-fit' : 'selected';
  const featuredProjectIds =
    featuredProjectsMode === 'role-fit' ? tailoredView.projectIds : defaultSelectedProjectIds;
  const featuredWebProjects = getFeaturedWebProjects(locale, featuredProjectIds);
  const summaryIntroduction = getSummaryIntroduction(locale, tailoredView.summaryPreset);
  const navSections = [
    { id: 'section-intro', label: labels.sectionIntro },
    ...(featuredWebProjects.length > 0
      ? [{ id: 'section-featured', label: featuredProjectsMode === 'role-fit'
          ? labels.sectionFeaturedProjects
          : labels.sectionSelectedProjects }]
      : []),
    { id: 'section-work', label: labels.sectionWork },
    { id: 'section-skills', label: labels.sectionSkills },
    { id: 'section-projects', label: labels.sectionAwards },
    { id: 'section-education', label: labels.sectionEducation },
  ];

  return {
    featuredProjectsMode,
    featuredWebProjects,
    labels,
    locale,
    navSections,
    resumeData,
    summaryIntroduction,
  };
};
```

`getHomePageData` no longer needs a D1 binding or admin-content permission check.

- [ ] **Step 4: Simplify project detail composition**

Read metadata and blocks directly from the catalog and pass them to `ProjectDetailPage`. Remove locale override loading and `isAdminEditor` props. `ProjectDetailPage` always renders the existing non-editable hero and `ProjectDetailBlocks` article.

- [ ] **Step 5: Delete editor-only components after import search is empty**

Run: `rg -n "EditableContentButton|EditableHomePage|EditableCompanyCard|EditableProject|editableContentEditorModel" src`

Expected before deletion: only files scheduled for deletion. Expected after deletion: no matches.

- [ ] **Step 6: Re-run home and project tests and verify GREEN**

Run: `./node_modules/.bin/vitest run src/lib/server/homePageData.test.ts src/lib/data/resume.test.ts src/lib/content/projects/catalogIntegrity.test.ts`

Expected: PASS with unchanged public content and no editor contract.

### Task 6: Remove the Content Override API and Storage Path

**Files:**
- Delete: `src/app/api/admin/content-overrides/route.ts`
- Delete: `src/lib/server/contentOverrideRequest.ts`
- Delete: `src/lib/server/contentOverrideRequest.test.ts`
- Delete: `src/lib/server/contentOverrideValidation.ts`
- Delete: `src/lib/server/editableContentStore.ts`
- Delete: `src/lib/server/editableContentStore.test.ts`
- Modify: `schema.sql`
- Modify: `docs/content-guide.md`

**Interfaces:**
- Removes: all active content override HTTP and D1 access.
- Preserves: analytics and application-link schema, stores, actions, and routes.

- [ ] **Step 1: Add a regression check for retained administrator features**

Run the existing analytics and application-link suites before deletion and record the green baseline:

```bash
./node_modules/.bin/vitest run \
  src/lib/server/adminAccess.test.ts \
  src/lib/server/adminDashboardData.test.ts \
  src/lib/server/adminSession.test.ts \
  src/lib/server/analyticsTracking.test.ts \
  src/lib/server/applicationLinkStore.test.ts
```

- [ ] **Step 2: Delete override API and store files**

Remove files only after Task 3 proves active data is preserved and Tasks 4-5 remove all consumers.

- [ ] **Step 3: Remove override schema bootstrap without dropping remote data**

Delete only the `CREATE TABLE content_overrides` and `idx_content_overrides_lookup` statements from `schema.sql`. Do not execute `DROP TABLE` locally or remotely.

- [ ] **Step 4: Update content documentation**

Document repository-only editing and the source boundaries. Remove browser editor and D1 override instructions while retaining analytics and short-link operational docs.

- [ ] **Step 5: Prove obsolete references are gone**

Run:

```bash
rg -n "content-overrides|contentOverride|editableContentStore|isAdminEditor|getPublishedHomeOverride|getProjectDetailContentOverride" src docs
```

Expected: no application references. Historical design documents may describe the migration but must not be presented as current operating instructions.

- [ ] **Step 6: Re-run retained administrator tests**

Run the same analytics and application-link suites from Step 1.

Expected: PASS with no content editor route present.

### Task 7: Full Verification and Runtime Smoke Tests

**Files:**
- Review: every changed file
- No new committed artifacts

**Interfaces:**
- Produces: evidence that repository-only content works and retained D1 products did not regress.

- [ ] **Step 1: Run static and unit gates**

Run individually so failures are attributable:

```bash
pnpm lint
./node_modules/.bin/tsc --noEmit --pretty false
./node_modules/.bin/vitest run
./node_modules/.bin/vinext check
./node_modules/.bin/vinext build
```

Expected: all exit 0. The known Wrangler log-path `EPERM` diagnostic is acceptable only when vinext exits 0 and creates `dist/standalone/`.

- [ ] **Step 2: Start or reuse the local development server**

Run: `pnpm dev`

Expected: the server reports its exact local URL. Reuse an existing server for this repository instead of terminating it without approval.

- [ ] **Step 3: Verify public HTTP routes**

Check `/`, `/en`, `/resume`, every catalog detail route, and representative role/short-link views. Projects without `detailPath` must remain 404.

Expected: public routes return their current status and meaningful HTML without framework error markers.

- [ ] **Step 4: Verify retained `/a` behavior**

Use the existing local admin login flow. Confirm the metrics dashboard loads and an application short URL can be created and resolved without invoking a content editor endpoint. Do not delete existing links; create test data only through the established safe local workflow.

- [ ] **Step 5: Verify the editor is absent**

Inspect home and project pages in admin context. Expected: no edit, add, or content-save controls, and `POST /api/admin/content-overrides` returns 404.

- [ ] **Step 6: Review final diff and report commit groups**

Run: `git diff --check`, `git diff --stat`, and inspect all diffs. Report logical groups and proposed English commit messages without committing unless the user separately approves the commit process.
