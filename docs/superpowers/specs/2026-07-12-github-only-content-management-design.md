# GitHub-Only Portfolio Content Management Design

## Completed Goal

Repository files are the only active source of portfolio content. The public and administrator-facing content editing feature has been removed while analytics metrics, application short URLs, and the rest of the `/a` administration surface remain.

## Completed Scope

Removed:

- inline home content editing;
- inline project-detail editing;
- content-editing client components and editor models;
- the content override API;
- D1 content override reads and writes;
- admin-editor flags and localized editor payloads used only by content editing.

Retained:

- `/a` authentication required by retained administrator tools;
- analytics collection and metrics dashboards;
- application-link and short-URL creation, ordering, and deletion;
- project selection and tailored portfolio URLs;
- existing analytics, application-link, and asset D1 tables;
- public home, project, resume, and short-link pages.

The migration does not drop historical `content_overrides` D1 rows or the table. Database deletion is destructive and remains a separate, explicitly approved cleanup task. The completed removal leaves no active readers, writers, or schema bootstrap for content overrides.

## Source Boundaries

| Data                                                           | Canonical source                   | Reason                                                         |
| -------------------------------------------------------------- | ---------------------------------- | -------------------------------------------------------------- |
| Profile copy and tailored summary presets                      | Localized MDX                      | Multilingual and prose-heavy                                   |
| Career display content                                         | Localized MDX                      | Multilingual career copy and highlights                        |
| Project card metadata and detail blocks                        | One localized MDX pair per project | Keeps every visible project field in its project folder        |
| Project and career IDs, slugs, sections, routes, and ownership | Typed TypeScript catalog           | Stable relational identity and compile-time foreign-key checks |
| Education and certificates                                     | Typed TypeScript data module       | Compact structured records                                     |
| Skill labels, chip values, categories, and ordering            | Typed TypeScript skill catalog     | Shared registry for rendering and validation                   |
| Analytics and application short URLs                           | D1                                 | Runtime product data rather than portfolio copy                |

MDX is not used for compact relational or registry data. TypeScript is not used for localized prose that belongs to profile, career, or project content.

## Canonical Relationship Model

The catalog exports literal `CAREER_ID` and `PROJECT_ID` constants with derived `CareerId` and `ProjectId` unions. All internal project selections use typed references instead of repeated raw strings.

Each project owns at most one `careerId`. A work project must reference one registered career. Non-work projects must not reference a career. Careers never maintain a reverse project array. Home work sections are derived by filtering projects on `project.careerId`.

Integrity checks reject:

- duplicate career IDs;
- duplicate project IDs, slugs, or detail routes;
- unknown career references;
- work projects without a career;
- non-work projects with a career;
- English/Korean shared-field drift;
- unregistered skill chips.

## Repository Layout

```text
src/lib/content/
  home/
    profile.default.en.mdx
    profile.default.ko.mdx
    profile-presets/
      ops-data.en.mdx
      ops-data.ko.mdx
      web.en.mdx
      web.ko.mdx
      rn.en.mdx
      rn.ko.mdx
      web-rn.en.mdx
      web-rn.ko.mdx
      ai.en.mdx
      ai.ko.mdx
    credentials.ts
  careers/{career-slug}/
    career.en.mdx
    career.ko.mdx
  projects/{project-slug}/
    detail.en.mdx
    detail.ko.mdx
  portfolioCatalog.ts
  skillCatalog.ts
```

Preset routing and selection remain typed application configuration. Preset tagline, metrics, and pillars live in localized MDX.

## One-Way Data Flow

```text
GitHub repository MDX and typed catalogs
  -> validated portfolio model
  -> home, project detail, resume, and short-link rendering
```

Portfolio rendering never reads server-side content overrides. AI and human edits use the same repository files, and deployment publishes that reviewed repository revision.

Analytics and short URLs have a separate runtime flow:

```text
visitor/admin event
  -> authenticated or validated server action/API
  -> analytics/application-link D1 tables
  -> /a dashboard or short-link redirect
```

These D1 records do not contain portfolio copy and do not participate in content assembly.

## Completed Override Audit

The local and configured remote D1 audit completed before removal. Both environments had zero published `content_overrides` rows, so no visible copy required migration into repository files.

Historical `content_overrides` rows and the remote table remain untouched. The completed removal has no active content-override readers, writers, API route, or `content_overrides` schema bootstrap.

## Code Removal Boundaries

The implementation removed content-editing code after checking every consumer. Shared rendering, Markdown sanitization, project block types, and admin authorization utilities remain where public content or retained `/a` features use them.

The public home and project routes always render their non-editable components. `HomePageData` no longer carries `isAdminEditor`, content override values, or duplicate localized edit models.

The content override API route and storage helpers are removed. The `content_overrides` table and lookup-index statements are removed from schema bootstrap; D1 schema statements for analytics and application links are preserved.

## Security

- Retained `/a` actions keep their existing authentication and production write gates.
- Removing the editor must not weaken analytics or short-link authorization.
- No content is written to D1 or an arbitrary filesystem path.
- MDX continues through the existing trusted repository build pipeline.
- Historical D1 content rows are not exposed through a new endpoint.

## Verification

Automated coverage verifies:

- catalog uniqueness and project-career foreign-key integrity;
- profile presets load from MDX;
- no internal project selection uses untyped raw IDs;
- public home and project pages no longer request content overrides;
- content override API and editor-only bundles are absent;
- analytics tracking and `/a` metrics still work;
- application short-URL creation, normalization, ordering, and redirect behavior still work;
- public home, English home, resume, project detail, and short-link rendering remain unchanged apart from editor controls.

Final verification uses ESLint, TypeScript, the full Vitest suite, vinext compatibility, production build, HTTP route smoke tests, authenticated `/a` checks, and browser verification when the configured browser runtime is available.

## Completed Rollout

1. Added catalog and source-boundary integrity tests.
2. Moved profile presets to localized MDX and consolidated typed IDs and skill data.
3. Audited local and remote D1 content overrides and found zero published rows.
4. Kept the repository content as-is because no published override values required migration.
5. Removed editor UI, editor-only page data, API routes, and active D1 override reads/writes.
6. Preserved analytics metrics and short URLs for final public-route validation.

## Non-Goals

- Removing `/a` or administrator authentication.
- Removing analytics or application-link D1 data.
- Dropping the historical `content_overrides` table.
- Building a replacement CMS or GitHub editor.
- Automatic bidirectional synchronization between Git and D1.
