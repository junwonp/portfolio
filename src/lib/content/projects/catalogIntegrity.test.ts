import { describe, expect, it } from 'vitest';

import {
  detailProjectSlugs,
  getProjectMetadata,
  projectCatalog,
} from '@/lib/content/projects';
import { projectMdxSlugs } from '@/lib/content/projects/detailMdx';

describe('project detail catalog integrity', () => {
  it('keeps detail project routes backed by an MDX component', () => {
    expect([...projectMdxSlugs].sort()).toEqual([...detailProjectSlugs].sort());
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
