import {
  getSkillCategory,
  type SkillCategory,
  type SkillId,
  skillGroups,
  skillGroupTitles,
} from '@/lib/portfolio/skills';
import type { Language } from '@/lib/utils/language';

export interface ProjectTechStackGroup {
  id: SkillId;
  skills: string[];
  title: string;
}

export interface SkillCategorySegment {
  category: SkillCategory;
  skills: string[];
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

export const segmentSkillsByCategory = (skills: readonly string[]): SkillCategorySegment[] =>
  skills.reduce<SkillCategorySegment[]>((segments, skill) => {
    const category = getSkillCategory(skill);
    const previous = segments[segments.length - 1];
    const shouldExtend = previous && previous.category === category && category !== 'default';

    if (shouldExtend) {
      return [...segments.slice(0, -1), { category, skills: [...previous.skills, skill] }];
    }

    // biome-ignore lint/performance/noAccumulatingSpread: project rules forbid push/splice mutation; lists are small
    return [...segments, { category, skills: [skill] }];
  }, []);
