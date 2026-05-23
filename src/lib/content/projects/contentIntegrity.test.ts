import { describe, expect, it } from 'vitest';

import { detailProjectCatalog, projectCatalog } from '$lib/content/projects';

const detailModules = import.meta.glob('/src/lib/content/projects/*/detail.*.svx');
const detailPaths = Object.keys(detailModules);

const findDuplicates = (values: string[]): string[] => {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  values.forEach((value) => {
    if (seen.has(value)) {
      duplicates.add(value);
      return;
    }

    seen.add(value);
  });

  return [...duplicates];
};

const getMetadataKeys = (slug: string, locale: 'en' | 'ko'): string[] => {
  const metadata = projectCatalog.find((project) => project.slug === slug)?.content[locale]
    .detailMetadata;

  return Object.keys(metadata ?? {}).sort();
};

describe('project content catalog integrity', () => {
  it('keeps every project bilingual', () => {
    projectCatalog.forEach((project) => {
      expect(project.content.en.title, `${project.id} English title`).toBeTruthy();
      expect(project.content.ko.title, `${project.id} Korean title`).toBeTruthy();
      expect(project.content.en.description, `${project.id} English description`).toBeTruthy();
      expect(project.content.ko.description, `${project.id} Korean description`).toBeTruthy();
      expect(Array.isArray(project.content.en.summaryDetails)).toBe(true);
      expect(Array.isArray(project.content.ko.summaryDetails)).toBe(true);
    });
  });

  it('keeps ids, slugs, and detail paths unique', () => {
    expect(findDuplicates(projectCatalog.map((project) => project.id))).toEqual([]);
    expect(findDuplicates(projectCatalog.map((project) => project.slug))).toEqual([]);
    expect(findDuplicates(detailProjectCatalog.map((project) => project.detailPath ?? ''))).toEqual(
      [],
    );
  });

  it('keeps detail files paired for every detail project', () => {
    detailProjectCatalog.forEach((project) => {
      expect(detailPaths).toContain(`/src/lib/content/projects/${project.slug}/detail.en.svx`);
      expect(detailPaths).toContain(`/src/lib/content/projects/${project.slug}/detail.ko.svx`);
    });
  });

  it('keeps detail metadata shape synced between English and Korean', () => {
    detailProjectCatalog.forEach((project) => {
      expect(getMetadataKeys(project.slug, 'ko')).toEqual(getMetadataKeys(project.slug, 'en'));
    });
  });

  it('does not leave orphan detail files outside the catalog', () => {
    const knownSlugs = new Set(detailProjectCatalog.map((project) => project.slug));
    const orphanSlugs = detailPaths.flatMap((path) => {
      const match = path.match(/\/projects\/([^/]+)\/detail\.(en|ko)\.svx$/);

      if (!match || knownSlugs.has(match[1])) return [];

      return [match[1]];
    });

    expect([...new Set(orphanSlugs)]).toEqual([]);
  });
});
