import { describe, expect, it } from 'vitest';

import {
  applicationProjectCatalog,
  detailProjectSlugs,
  getProjectMetadata,
  normalizeApplicationProjectIdentifiers,
  normalizeProjectIdentifiers,
  projectCatalog,
  resolveProjectIdentifier,
} from '@/lib/content/projects';
import {
  projectDetailContentMap,
  projectDetailContentSlugs,
} from '@/lib/content/projects/detailContent';
import { isValidProjectDetailOverridePayload } from '@/lib/server/contentOverrideValidation';

describe('project detail catalog integrity', () => {
  it('keeps detail project routes backed by structured detail content', () => {
    expect([...projectDetailContentSlugs].sort()).toEqual([...detailProjectSlugs].sort());
  });

  it('documents the B2B admin dashboard as a detail case study', () => {
    expect(detailProjectSlugs).toContain('admin-dashboard');
    expect(projectDetailContentSlugs).toContain('admin-dashboard');
    expect(getProjectMetadata('admin-dashboard', 'ko')?.title).toBe('B2B 통합 관리자 대시보드');
  });

  it('keeps the defense resource dashboard as an inline career project', () => {
    expect(detailProjectSlugs).not.toContain('mnd-dashboard');
    expect(projectDetailContentSlugs).not.toContain('mnd-dashboard');
    expect(getProjectMetadata('mnd-dashboard', 'ko')).toBeUndefined();
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

  it('resolves every project id and slug to a canonical project id', () => {
    for (const project of projectCatalog) {
      expect(resolveProjectIdentifier(project.id), `${project.id} resolves by id`).toBe(project.id);
      expect(resolveProjectIdentifier(project.slug), `${project.slug} resolves by slug`).toBe(
        project.id,
      );
    }

    expect(
      normalizeProjectIdentifiers(['today-weather', 'today_weather', 'aira', 'missing']),
    ).toEqual(['today_weather', 'aira']);
  });

  it('keeps application-link project normalization aligned with dashboard options', () => {
    const selectableProjectIds = applicationProjectCatalog.map((project) => project.id);
    const selectableProjectSlugs = applicationProjectCatalog.map((project) => project.slug);

    expect(normalizeApplicationProjectIdentifiers(selectableProjectSlugs)).toEqual(
      selectableProjectIds,
    );
    expect(
      normalizeApplicationProjectIdentifiers([
        'non-existent-standalone',
        'missing',
        ...selectableProjectIds,
      ]),
    ).toEqual(selectableProjectIds);
  });
});
