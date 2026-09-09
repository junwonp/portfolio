import type { CSSProperties } from 'react';

import { segmentSkillsByCategory } from '@/lib/portfolio/techStack';

import { skillChip } from './SkillChip.css';
import { skillGroupPill, skillGroupPillVar } from './SkillGroupPills.css';

interface SkillGroupPillsProps {
  skills: readonly string[];
}

const MIN_GROUP_SIZE = 2;

export default function SkillGroupPills({ skills }: SkillGroupPillsProps) {
  const segments = segmentSkillsByCategory(skills);

  return (
    <>
      {segments.map((segment) => {
        const categoryColorVar =
          segment.category === 'default' ? null : `var(--color-cat-${segment.category})`;

        if (!categoryColorVar || segment.skills.length < MIN_GROUP_SIZE) {
          return segment.skills.map((skill) => (
            <span key={skill} className={skillChip}>
              {skill}
            </span>
          ));
        }

        const variableName = String(skillGroupPillVar).replace(/^var\(|\)$/g, '');

        return (
          <span
            key={segment.category}
            className={skillGroupPill}
            style={{ [variableName]: categoryColorVar } as CSSProperties}
          >
            {segment.skills.map((skill) => (
              <span key={skill} className={skillChip}>
                {skill}
              </span>
            ))}
          </span>
        );
      })}
    </>
  );
}
