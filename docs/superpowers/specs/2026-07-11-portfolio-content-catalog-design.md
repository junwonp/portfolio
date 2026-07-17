# Portfolio Content Catalog Design

> **Historical / superseded:** This document describes the earlier catalog migration while D1 content overrides were still active. The current execution plan is [2026-07-13-local-content-only-management.md](../plans/2026-07-13-local-content-only-management.md).

## Goal

Make MDX the source-controlled base for project, career, and profile content without allowing duplicate IDs, career-project relationships, or project-detail bodies to drift. Preserve the existing D1-backed admin editor as a runtime override layer.

## Content boundaries

| Content                                                    | Source of truth                     | Reason                                                       |
| ---------------------------------------------------------- | ----------------------------------- | ------------------------------------------------------------ |
| Profile, career, project cards, and project detail blocks  | Localized MDX                       | These are user-facing, multilingual, and prose-heavy.        |
| Education and certificates                                 | One typed `credentials` data module | They are compact structured lists, not Markdown documents.   |
| Skill names, categories, and allowed values                | `skills.ts`                         | The registry drives TypeScript types and runtime validation. |
| IDs, slugs, sections, routes, and career-project ownership | One TypeScript catalog              | These are stable application identities and relationships.   |
| Browser edits                                              | D1 override records                 | They apply after the source-controlled base at runtime.      |

## Canonical catalog

A single catalog module defines each career and project identity. It owns the existing canonical IDs so application links, analytics, and D1 records keep working. A project record has at most one `careerId`; a career never stores a reverse `projectIds` array.

The catalog derives every home grouping from `project.careerId === career.id`. Projects outside employment have no `careerId` and remain in their existing `other` or `archive` section. The old nested `projects` arrays in `resume.shared.ts` are removed.

## MDX model

Each localized project MDX file supplies its display metadata and a structured `blocks` export. The export uses the existing `ProjectDetailBlock[]` shape, so the current renderer, editor, sanitization, and D1 validation continue to operate without a second TS content file. The legacy MDX body and `detailContent/<project>.ts` source are removed together, leaving one editable project document per locale.

Career and profile MDX files contain localized display fields. The catalog supplies their stable identity and structural placement. The credentials module contains localized labels with date and link fields in one typed record per item.

## Runtime flow

```text
catalog identities + localized MDX/credentials
  -> typed portfolio model
  -> D1 entity-level override
  -> home and project route rendering
```

D1 never changes IDs, slugs, sections, career ownership, or a project list. It may override display fields, metadata, skills, and detail blocks for the entity being edited. Existing stored overrides remain readable during the migration; writes move to the narrower entity-level targets.

## Validation

Tests must reject:

- unknown or duplicate career and project identities;
- work projects without a valid career, or non-work projects with one;
- duplicate slugs or routes;
- locale pairs with mismatched shared metadata or invalid block data;
- unregistered skill chips;
- D1 payloads that attempt to change catalog relationships.

Existing route, short-link, and admin editor coverage must continue to pass. Final verification includes lint, TypeScript, Vitest, vinext validation, production build, and home/project editor browser checks.
