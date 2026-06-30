# TODO

## Tailored Portfolio Showcase

- [ ] Fix mobile overflow in the tailored home view before changing the section design.
- [ ] Replace the current `Role-Fit Projects` list with a short-link-specific showcase section.
- [ ] Make the showcase read as a job-fit evidence board, not as another resume list.
- [ ] Create one shared project-card component for the showcase instead of one-off UI per project.
- [ ] Keep the original project content as the source of truth for title, description, metrics, skills, and detail links.
- [ ] Add lightweight role-fit metadata only for priority projects and roles.
- [ ] Reference existing metric, skill, and project identifiers from showcase metadata instead of duplicating long project copy.
- [ ] Define fallback behavior for projects without role-fit metadata.
- [ ] Keep the admin short-link flow centered on role preset, project selection, and project ordering.
- [ ] Defer per-link custom copy overrides until the metadata-based flow proves insufficient.

## Priority Project Content

- [ ] Review the source content for projects most likely to appear in short-link showcases.
- [ ] Confirm each priority project has a strong one-line summary, concrete proof, key metrics, and a valid detail link.
- [ ] `Today’s Weather`: add screenshots for web, mobile, widget, and recommendation output.
- [ ] `SvelteKit Portfolio`: refresh Lighthouse/performance evidence after mobile overflow is fixed.
- [ ] `Election Aggregator`: keep as archive and add team size/responsibility details only if needed.

## Verification

- [ ] Check default home and tailored short-link pages at desktop and mobile widths.
- [ ] Verify the showcase does not introduce horizontal overflow at 375px and 390px.
- [ ] Run `pnpm lint` after implementation.
- [ ] Run focused tests for tailored-view data and short-link rendering after implementation.
- [ ] Run a production build before using the redesigned flow in applications.
