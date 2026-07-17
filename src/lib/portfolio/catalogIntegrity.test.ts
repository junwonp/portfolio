import { describe, expect, expectTypeOf, it } from 'vitest';

import {
  applicationProjectCatalog,
  detailProjectSlugs,
  getProjectDetailComponent,
  getProjectMetadata,
  normalizeApplicationProjectIdentifiers,
  normalizeProjectIdentifiers,
  projectCatalog,
  type ProjectId,
  resolveProjectIdentifier,
} from '@/lib/portfolio/catalog';
import { isRegisteredSkillName } from '@/lib/portfolio/skills';

const sharedMetadataFields = [
  'dateFrom',
  'dateTo',
  'githubLink',
  'productLink',
  'icon',
  'paradigm',
  'featuredSkills',
  'techStack',
] as const;

describe('project detail catalog integrity', () => {
  it('keeps resolved project identifiers narrowed to the catalog union', () => {
    expectTypeOf(resolveProjectIdentifier).returns.toEqualTypeOf<ProjectId | null>();
    expectTypeOf(normalizeProjectIdentifiers).returns.toEqualTypeOf<ProjectId[]>();
    expectTypeOf(normalizeApplicationProjectIdentifiers).returns.toEqualTypeOf<ProjectId[]>();
  });

  it('keeps shared project metadata structurally aligned across locales', () => {
    for (const project of projectCatalog) {
      const englishMetadata = project.content.en.detailMetadata;
      const koreanMetadata = project.content.ko.detailMetadata;

      expect(englishMetadata, `${project.slug}/en has metadata`).toBeDefined();
      expect(koreanMetadata, `${project.slug}/ko has metadata`).toBeDefined();

      for (const field of sharedMetadataFields) {
        expect(englishMetadata?.[field], `${project.slug} has matching ${field}`).toEqual(
          koreanMetadata?.[field],
        );
      }
    }
  });

  it('uses only registered skills in localized project metadata', () => {
    for (const project of projectCatalog) {
      for (const locale of ['en', 'ko'] as const) {
        const metadata = project.content[locale].detailMetadata;
        const skills = [...(metadata?.techStack ?? []), ...(metadata?.featuredSkills ?? [])];

        expect(
          skills.every(isRegisteredSkillName),
          `${project.slug}/${locale} uses registered skills`,
        ).toBe(true);
      }
    }
  });

  it('keeps detail project routes backed by localized MDX components', () => {
    expect(
      detailProjectSlugs.every(
        (slug) =>
          getProjectDetailComponent(slug, 'en') !== undefined &&
          getProjectDetailComponent(slug, 'ko') !== undefined,
      ),
    ).toBe(true);
  });

  it('documents the B2B admin dashboard as a detail case study', () => {
    expect(detailProjectSlugs).toContain('admin-dashboard');
    expect(getProjectDetailComponent('admin-dashboard', 'ko')).toBeDefined();
    expect(getProjectMetadata('admin-dashboard', 'ko')?.title).toBe('B2B 통합 관리자 대시보드');
  });

  it('keeps the defense resource dashboard as an inline career project', () => {
    expect(detailProjectSlugs).not.toContain('mnd-dashboard');
    expect(getProjectDetailComponent('mnd-dashboard', 'ko')).toBeUndefined();
    expect(getProjectMetadata('mnd-dashboard', 'ko')).toBeUndefined();
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
