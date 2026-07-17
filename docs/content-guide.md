# Content Editing Guide

The portfolio uses MDX for long-form project details and TypeScript for compact home content. Stable identifiers and relationships live in one catalog so a project cannot accidentally be shown under the wrong career.

```text
Repository MDX and TypeScript data
  -> portfolio catalog validation
  -> public pages
```

D1 only supports analytics and application short URLs; it is not used for portfolio copy.

## Content Locations

```text
src/content/
  home/
    index.ts
    profile.ts
    careers.ts
    credentials.ts
  projects/{project-slug}/
    detail.en.mdx
    detail.ko.mdx
  privacy/
    privacy.en.mdx
    privacy.ko.mdx

src/lib/portfolio/
  catalog.ts
  homePage.ts
  metadata.ts
  skills.ts
  types.ts
```

- Project metadata, homepage card copy, and detail-page prose belong in the corresponding `detail.en.mdx` and `detail.ko.mdx` files.
- Default and tailored home profiles belong in `src/content/home/profile.ts`.
- Career display copy belongs in `src/content/home/careers.ts`.
- Education and certificates stay in `src/content/home/credentials.ts`, because they are compact structured records rather than articles.
- `src/lib/portfolio/catalog.ts` owns stable project and career identifiers, project slugs, sections, detail paths, project-to-career relationships, and static MDX registration.
- `src/lib/portfolio/skills.ts` is the only allowed source for registered skill-chip names, group order, localized group titles, and skill lookup helpers.

## Add a Project

1. Create `detail.en.mdx` and `detail.ko.mdx` under `src/content/projects/{project-slug}/`.
2. Put all localized project metadata in the YAML frontmatter of both files, including card copy, dates, links, metrics, and `techStack`.
3. Write the case study as normal MDX below the frontmatter. Import only the interactive components that the article uses. A project without a detail page does not need a body.
4. Import both MDX modules in `src/lib/portfolio/catalog.ts` and add one structural entry with the canonical `id`, `slug`, `section`, optional `careerId`, and optional `detailPath`.
5. For a work project, point `careerId` to an existing entry in `careerCatalog`. A project can have exactly one such parent.

## Add a Career, Education, or Certificate

- Add localized career display content and its stable ID to `src/content/home/careers.ts`.
- Add education and certificates to the typed arrays in `src/content/home/credentials.ts`.
- Never create a second project array inside a career file or the resume data layer. The home page obtains work projects through the catalog's `careerId` relationship.

## Editing Rules

- Keep English and Korean frontmatter structurally aligned.
- `techStack` values must exactly match registered names in `src/lib/portfolio/skills.ts`.
- Do not create project-specific `index.ts` data modules or hardcode project metadata in page components.
- Images live under `public/images/` and are referenced as `/images/...`.

## Safety Checks

Run the content tests and static checks after a content or catalog change:

```bash
pnpm lint
pnpm exec vitest run
pnpm exec tsc --noEmit --pretty false
```
