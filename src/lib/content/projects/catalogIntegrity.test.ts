import { describe, expect, it } from 'vitest';

import { detailProjectSlugs, getProjectMetadata, projectCatalog } from '@/lib/content/projects';
import {
  projectDetailContentMap,
  projectDetailContentSlugs,
} from '@/lib/content/projects/detailContent';
import { isValidProjectDetailOverridePayload } from '@/lib/server/contentOverrideValidation';

describe('project detail catalog integrity', () => {
  it('keeps detail project routes backed by structured detail content', () => {
    expect([...projectDetailContentSlugs].sort()).toEqual([...detailProjectSlugs].sort());
  });

  it('keeps structured detail blocks compatible with override validation', () => {
    for (const [slug, localizedContent] of Object.entries(projectDetailContentMap)) {
      for (const [locale, blocks] of Object.entries(localizedContent)) {
        expect(blocks.length, `${slug}/${locale} has blocks`).toBeGreaterThan(0);
        expect(
          isValidProjectDetailOverridePayload(`${slug}::blocks`, { blocks }),
          `${slug}/${locale} blocks are valid`,
        ).toBe(true);
      }
    }
  });

  it('does not expose detail metadata for projects without a detail route', () => {
    const nonDetailSlugs = projectCatalog
      .filter((project) => !project.detailPath)
      .map((project) => project.slug);

    expect(nonDetailSlugs).toContain('day-planner');
    expect(getProjectMetadata('day-planner', 'ko')).toBeUndefined();
    expect(getProjectMetadata('day-planner', 'en')).toBeUndefined();
  });
});
