Add a new project to the portfolio. Follow these steps:

1. Ask the user for the project slug (e.g. `my-project`), and whether they want to fill in details now or use placeholders.

2. Create `src/lib/posts/$SLUG.en.svx` with this frontmatter template:

```
---
title: ''
description: ''
role: ''
date: ''
image: ''
githubLink: ''
productLink: ''
---
```

3. Create `src/lib/posts/$SLUG.ko.svx` with the same frontmatter template in Korean content.

4. Add a new project entry to `src/lib/data/resume.en.ts` under the appropriate section (workExperiences, otherExperiences, or archives) with `detailLink: '/projects/$SLUG'`.

5. Mirror the exact same entry structure in `src/lib/data/resume.ko.ts`.

6. Run `pnpm check` to verify no type errors.

7. Show a summary of all created/modified files.
