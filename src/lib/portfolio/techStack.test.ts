import { describe, expect, it } from 'vitest';

import { projectCatalog } from '@/lib/portfolio/catalog';
import { registeredSkillNames } from '@/lib/portfolio/skills';
import { getProjectTechStackGroups, segmentSkillsByCategory } from '@/lib/portfolio/techStack';

const registeredSkillNameSet: ReadonlySet<string> = new Set(registeredSkillNames);

const getUnregisteredProjectTechStackItems = (): string[] =>
  projectCatalog.flatMap((project) =>
    Object.entries(project.content).flatMap(([locale, content]) =>
      (content.detailMetadata?.techStack ?? [])
        .filter((skill) => !registeredSkillNameSet.has(skill))
        .map((skill) => `${project.slug}/${locale}: ${skill}`),
    ),
  );

describe('getProjectTechStackGroups', () => {
  it('renders only registered skill chips', () => {
    const groups = getProjectTechStackGroups(['React', 'Unknown Runtime'], 'en');

    expect(groups).toEqual([
      {
        id: 'frameworks',
        title: 'Frameworks',
        skills: ['React'],
      },
    ]);
  });

  it('keeps project detail tech stacks aligned with the registered skill chips', () => {
    expect(getUnregisteredProjectTechStackItems()).toEqual([]);
  });
});

describe('segmentSkillsByCategory', () => {
  it('returns no segments for an empty input', () => {
    expect(segmentSkillsByCategory([])).toEqual([]);
  });

  it('groups consecutive skills of the same category into one segment', () => {
    expect(segmentSkillsByCategory(['React', 'Expo', 'TypeScript'])).toEqual([
      { category: 'frameworks', skills: ['React', 'Expo'] },
      { category: 'languages', skills: ['TypeScript'] },
    ]);
  });

  it('keeps a single-skill category as its own segment', () => {
    expect(segmentSkillsByCategory(['TypeScript'])).toEqual([
      { category: 'languages', skills: ['TypeScript'] },
    ]);
  });

  it('never merges unregistered skills, even when consecutive', () => {
    expect(segmentSkillsByCategory(['React', 'Unknown A', 'Unknown B'])).toEqual([
      { category: 'frameworks', skills: ['React'] },
      { category: 'default', skills: ['Unknown A'] },
      { category: 'default', skills: ['Unknown B'] },
    ]);
  });

  it('preserves input order across segments', () => {
    expect(segmentSkillsByCategory(['Expo', 'TypeScript', 'React'])).toEqual([
      { category: 'frameworks', skills: ['Expo'] },
      { category: 'languages', skills: ['TypeScript'] },
      { category: 'frameworks', skills: ['React'] },
    ]);
  });
});
