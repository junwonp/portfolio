import { getResumeData } from '@/lib/data/resume';
import type { SkillId } from '@/lib/data/skills';
import type { Language } from '@/lib/utils/language';

export interface ProjectTechStackGroup {
  id: SkillId | 'uncategorized';
  skills: string[];
  title: string;
}

const uncategorizedTitle: Record<Language, string> = {
  en: 'Other',
  ko: '기타',
};

export const getProjectTechStackGroups = (
  techStack: string[],
  locale: Language,
): ProjectTechStackGroup[] => {
  const categorizedSkills = new Set<string>();
  const resumeData = getResumeData(locale);

  const categorizedGroups = resumeData.skills
    .map((category) => {
      const skills = category.list.filter((skill) => techStack.includes(skill));

      for (const skill of skills) {
        categorizedSkills.add(skill);
      }

      return {
        id: category.id as SkillId,
        title: category.title,
        skills,
      } satisfies ProjectTechStackGroup;
    })
    .filter((group) => group.skills.length > 0);

  const uncategorizedSkills = techStack.filter((skill) => !categorizedSkills.has(skill));

  if (uncategorizedSkills.length === 0) {
    return categorizedGroups;
  }

  return [
    ...categorizedGroups,
    {
      id: 'uncategorized',
      title: uncategorizedTitle[locale],
      skills: uncategorizedSkills,
    },
  ];
};
