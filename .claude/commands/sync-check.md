Check whether `src/lib/data/resume.en.ts` and `src/lib/data/resume.ko.ts` are structurally in sync.

Read both files and compare:

1. **Top-level exports** — both files must export the same named constants (e.g. `introduction`, `workExperiences`, `otherExperiences`, `education`, `skills`, `archives`, `certificates`).

2. **Array lengths** — each array (workExperiences, otherExperiences, etc.) must have the same number of entries.

3. **Project entries** — for each experience, the nested `project` array must have the same number of items and the same `title` values (titles can differ in language but count must match).

4. **Field presence** — for each entry, both files must have the same optional fields present (e.g. if `detailLink` exists in EN it must exist in KO).

5. **detailLink consistency** — all `detailLink` values must match exactly between EN and KO (they're paths, not translatable).

Report any mismatches clearly, grouped by section. If everything is in sync, confirm with a short summary.
