import { describe, expect, it } from 'vitest';

import { projectCatalog } from '@/lib/portfolio/catalog';
import { registeredSkillNames } from '@/lib/portfolio/skills';
import { getProjectTechStackGroups } from '@/lib/portfolio/techStack';

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
