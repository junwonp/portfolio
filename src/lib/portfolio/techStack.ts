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
  return skillGroups
    .map((category) => {
      const skills = category.list.filter((skill) => techStack.includes(skill));

      return {
        id: category.id,
        title: skillGroupTitles[locale][category.id],
        skills,
      } satisfies ProjectTechStackGroup;
    })
    .filter((group) => group.skills.length > 0);
};
