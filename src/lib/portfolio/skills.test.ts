import { describe, expect, it } from 'vitest';

import { SKILL, skillGroups, skillGroupTitles } from '@/lib/portfolio/skills';

const skillGroupIds = [
  'languages',
  'frameworks',
  'ui',
  'state',
  'performance',
  'backend',
  'devops',
] as const;

describe('skill catalog', () => {
  it('keeps ordered localized groups limited to registered skill names', () => {
    const registeredSkillNames = new Set(Object.values(SKILL).flatMap(Object.values));

    expect(skillGroups.map((group) => group.id)).toEqual(skillGroupIds);
    expect(Object.keys(skillGroupTitles.en)).toEqual(skillGroupIds);
    expect(Object.keys(skillGroupTitles.ko)).toEqual(skillGroupIds);
    expect(skillGroupTitles.en).toMatchObject({
      backend: 'Backend & Cloud',
      languages: 'Languages',
      ui: 'UI & Design System',
    });
    expect(skillGroupTitles.ko).toMatchObject({
      backend: '백엔드 및 클라우드',
      languages: '언어',
      ui: 'UI 및 디자인 시스템',
    });
    expect(
      skillGroups.every((group) => group.list.every((skill) => registeredSkillNames.has(skill))),
    ).toBe(true);
  });
});
