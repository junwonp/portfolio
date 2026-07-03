import { describe, expect, it } from 'vitest';

import { projectCatalog } from '@/lib/content/projects';
import { getProjectTechStackGroups } from '@/lib/content/projects/techStack';
import { registeredSkillNames } from '@/lib/data/skills';

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
