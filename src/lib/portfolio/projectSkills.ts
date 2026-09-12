import type { ProjectItem } from '@/lib/portfolio/homeTypes';
import { sortSkills } from '@/lib/utils/skills';

export interface ResolvedProjectSkills {
  hiddenSkillCount: number;
  hiddenSkillsSummary: string;
  visibleSkills: string[];
}

export function resolveProjectSkills(
  project: Pick<ProjectItem, 'featuredSkills' | 'skills'>,
  skillLimit?: number,
): ResolvedProjectSkills {
  const projectSkills = sortSkills(project.skills ?? []);

  if (skillLimit === undefined) {
    return { hiddenSkillCount: 0, hiddenSkillsSummary: '', visibleSkills: projectSkills };
  }

  const featuredSkills = project.featuredSkills ?? [];
  const featuredSet = new Set(featuredSkills);
  const prioritized = [
    ...featuredSkills,
    ...projectSkills.filter((skill) => !featuredSet.has(skill)),
  ];

  const hidden = prioritized.slice(skillLimit);

  return {
    hiddenSkillCount: hidden.length,
    hiddenSkillsSummary: sortSkills(hidden).join(', '),
    visibleSkills: sortSkills(prioritized.slice(0, skillLimit)),
  };
}
