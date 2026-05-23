# Content Editing Guide

This portfolio keeps each project in one folder so English and Korean content stay easy to compare.

## Project Folder Shape

```text
src/lib/content/projects/{slug}/
  index.ts
  detail.en.svx
  detail.ko.svx
```

Use `index.ts` for short resume/card content and shared project metadata:

- Shared values: `id`, `slug`, `section`, `parentId`, dates, links, skills, `detailPath`
- English/Korean values: `content.en` and `content.ko`
- Detail page hero values: `content.{locale}.detailMetadata`

Use `detail.en.svx` and `detail.ko.svx` for the long project detail article.

## Add A New Project

1. Create `src/lib/content/projects/{slug}/index.ts`.
2. Add both `content.en` and `content.ko` in the same file.
3. If the project has a detail page, add `detailPath: '/projects/{slug}'`.
4. Create both `detail.en.svx` and `detail.ko.svx` in the same folder.
5. Export the project from `src/lib/content/projects/index.ts`.
6. Run `pnpm check`, `pnpm lint`, and `pnpm vitest --run`.

## Editing Rules

- Keep EN/KO summary content side by side in `index.ts`.
- Keep shared dates, links, skills, and image paths outside `content.en` / `content.ko`.
- If one locale has a `detailMetadata` field, the other locale must have the same field.
- Detail pages keep the public URL shape `/projects/{slug}`.
- Images still live under `static/images/` and should be referenced as `/images/...`.

## Safety Checks

`src/lib/content/projects/contentIntegrity.test.ts` verifies:

- Every project has English and Korean content.
- Project ids, slugs, and detail paths are unique.
- Every detail project has both `detail.en.svx` and `detail.ko.svx`.
- English and Korean `detailMetadata` fields stay structurally synced.
