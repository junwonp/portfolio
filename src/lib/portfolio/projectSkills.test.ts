import { describe, expect, it } from 'vitest';

import { resolveProjectSkills } from '@/lib/portfolio/projectSkills';

// Registry order: TypeScript(0) < React(3) < GraphQL(17) < AWS(25); unregistered names sort last.
describe('resolveProjectSkills', () => {
  it('returns every sorted skill and hides nothing when no limit is given', () => {
    const resolved = resolveProjectSkills({ skills: ['TypeScript', 'AWS'] });

    expect(resolved).toEqual({
      hiddenSkillCount: 0,
      hiddenSkillsSummary: '',
      visibleSkills: ['TypeScript', 'AWS'],
    });
  });

  it('truncates to the limit and reports the hidden skill', () => {
    const resolved = resolveProjectSkills({ skills: ['TypeScript', 'AWS', 'React'] }, 2);

    expect(resolved).toEqual({
      hiddenSkillCount: 1,
      hiddenSkillsSummary: 'AWS',
      visibleSkills: ['TypeScript', 'React'],
    });
  });

  it('promotes a featured skill into the visible window ahead of earlier ones', () => {
    const resolved = resolveProjectSkills(
      { featuredSkills: ['AWS'], skills: ['TypeScript', 'AWS', 'React'] },
      2,
    );

    expect(resolved.visibleSkills).toEqual(['TypeScript', 'AWS']);
    expect(resolved.hiddenSkillCount).toBe(1);
    expect(resolved.hiddenSkillsSummary).toBe('React');
  });

  it('sorts the hidden-skills summary by the registry order', () => {
    const resolved = resolveProjectSkills({ skills: ['TypeScript', 'AWS', 'Expo', 'React'] }, 2);

    expect(resolved.visibleSkills).toEqual(['TypeScript', 'React']);
    expect(resolved.hiddenSkillsSummary).toBe('Expo, AWS');
    expect(resolved.hiddenSkillCount).toBe(2);
  });

  it('reports nothing hidden when the limit exceeds the skill list', () => {
    const resolved = resolveProjectSkills({ skills: ['TypeScript'] }, 5);

    expect(resolved).toEqual({
      hiddenSkillCount: 0,
      hiddenSkillsSummary: '',
      visibleSkills: ['TypeScript'],
    });
  });

  it('sorts unregistered skills after registered ones', () => {
    const resolved = resolveProjectSkills({ skills: ['Zeta', 'AWS', 'Alpha'] }, 3);

    expect(resolved.visibleSkills).toEqual(['AWS', 'Zeta', 'Alpha']);
    expect(resolved.hiddenSkillCount).toBe(0);
  });

  it('prioritizes a featured skill the project skill list does not contain', () => {
    const resolved = resolveProjectSkills(
      { featuredSkills: ['GraphQL'], skills: ['TypeScript', 'AWS'] },
      2,
    );

    expect(resolved.visibleSkills).toEqual(['TypeScript', 'GraphQL']);
    expect(resolved.hiddenSkillsSummary).toBe('AWS');
  });

  it('hides every skill for a limit of zero', () => {
    const resolved = resolveProjectSkills({ skills: ['TypeScript', 'AWS'] }, 0);

    expect(resolved).toEqual({
      hiddenSkillCount: 2,
      hiddenSkillsSummary: 'TypeScript, AWS',
      visibleSkills: [],
    });
  });

  it('treats a project without skills or featured skills as an empty list', () => {
    const resolved = resolveProjectSkills({}, 2);

    expect(resolved).toEqual({
      hiddenSkillCount: 0,
      hiddenSkillsSummary: '',
      visibleSkills: [],
    });
  });

  it('uses featured skills when the project skill list is missing', () => {
    const resolved = resolveProjectSkills({ featuredSkills: ['TypeScript'] }, 1);

    expect(resolved).toEqual({
      hiddenSkillCount: 0,
      hiddenSkillsSummary: '',
      visibleSkills: ['TypeScript'],
    });
  });
});
