# MDX Prose Project Details Design

> **Supersedes:** the `blocks`-based project-detail-body decision in the earlier portfolio catalog plans. It does not change the catalog identity model, localized frontmatter, or home and career content model.

## Goal

Keep each project's localized metadata and its human-authored case study in the same MDX file. The frontmatter supplies home-card and detail-hero metadata; the body remains ordinary Markdown/MDX prose with interactive portfolio components embedded where needed.

## Boundaries

| Concern | Owner |
| --- | --- |
| Titles, descriptions, dates, metrics, links, skills, and localized case-study prose | `projects/*/detail.{locale}.mdx` |
| Stable ID, slug, section, route, and career relationship | `portfolioCatalog.ts` |
| Registered skill names and ordering | `skillCatalog.ts` |
| Detail-page shell, TOC, and client interaction islands | React components |

The catalog is static because the Cloudflare Worker cannot discover MDX files from a runtime filesystem. It imports every MDX module at build time, but retains the module's default component as a server-only value.

## Rendering flow

```text
static MDX module registry
  -> route selects default MDX component and frontmatter by slug and locale
  -> server component renders <DetailMdx metadata locale />
  -> ProjectDetailPage receives the rendered node as children
  -> MDX-rendered client islands hydrate independently
```

No component function crosses a client-component prop boundary. `ProjectDetailPage` remains a server component; only its existing TOC, lightbox, gallery, and accordion components are client islands.

## TOC and MDX props

The existing `ProjectToc` is already a client-side DOM collector. After mount it reads `h2` elements inside `.project-article`, preserves or derives their IDs, and observes the article for updates. Direct MDX keeps that article boundary and the configured heading-ID plugin, so no block-string parser or new remark TOC export is needed. The current navigation intentionally shows `h2` sections only; adding nested `h3` entries is a separate information-architecture decision.

Every project MDX module receives explicit `metadata` and `locale` props from the server route. The shared `ProjectDetailMdxProps` type is used by both the server-only registry and the ambient MDX declaration, so expressions such as `props.metadata.techStack` remain typed and no implicit global context is required.

## Authoring model

```mdx
---
title: Example project
description: Card and detail hero copy.
techStack: ['TypeScript', 'Next.js']
---

## Project overview

Human-readable case-study prose goes here.

<ProjectTechStack techStack={props.metadata.techStack} locale={props.locale} />

## Key work

<ProjectAchievements achievements={achievementCards} />
```

Arrays remain appropriate only as props for intrinsically repeated UI such as achievement cards or gallery images. The document itself must not be a serialized block array.

## Migration and validation

Restore the direct MDX bodies from the repository baseline while preserving the current frontmatter de-duplication. Remove the obsolete `blocks` union, renderer, custom Markdown-to-HTML parser, and pre-migration `detailContent` source files. Replace block-oriented tests with registry/component availability tests, then use the real vinext build and rendered project routes to validate MDX compilation, TOC headings, and client islands.
