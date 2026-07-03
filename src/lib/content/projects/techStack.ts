import { getResumeData } from '@/lib/data/resume';
import type { SkillId } from '@/lib/data/skills';
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
  const resumeData = getResumeData(locale);

  return resumeData.skills
    .map((category) => {
      const skills = category.list.filter((skill) => techStack.includes(skill));

      return {
        id: category.id as SkillId,
        title: category.title,
        skills,
      } satisfies ProjectTechStackGroup;
    })
    .filter((group) => group.skills.length > 0);
};
