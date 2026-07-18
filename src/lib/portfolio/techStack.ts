import { skillGroups, skillGroupTitles, type SkillId } from '@/lib/portfolio/skills';
import type { Language } from '@/lib/utils/language';

export interface ProjectTechStackGroup {
  id: SkillId;
  skills: string[];
  title: string;
}

export const getProjectTechStackGroups = (
  techStack: string[],
  locale: Language,
): ProjectTechStackGroup[] => {
  const techStackSet = new Set(techStack);
  return skillGroups.flatMap((category) => {
    const skills = category.list.filter((skill) => techStackSet.has(skill));
    if (skills.length > 0) {
      return [
        {
          id: category.id,
          title: skillGroupTitles[locale][category.id],
          skills,
        } satisfies ProjectTechStackGroup,
      ];
    }
    return [];
  });
};
