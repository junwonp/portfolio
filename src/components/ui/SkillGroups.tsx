import { segmentSkillsByCategory } from '@/lib/portfolio/techStack';

import SkillChip from './SkillChip';
import * as styles from './SkillGroups.css';

interface SkillGroupsProps {
  skills: readonly string[];
}

export default function SkillGroups({ skills }: SkillGroupsProps) {
  const segments = segmentSkillsByCategory(skills);

  if (segments.length === 0) {
    return null;
  }

  return (
    <>
      {segments.map((segment, index) => {
        const isLast = index === segments.length - 1;
        const nextSegment = segments[index + 1];
        const showDivider =
          !isLast && !(segment.category === 'default' && nextSegment?.category === 'default');

        const nonLastSkills = segment.skills.slice(0, -1);
        const lastSkill = segment.skills[segment.skills.length - 1];

        return (
          <span key={`${segment.category}-${segment.skills[0]}`} className={styles.skillGroup}>
            {nonLastSkills.map((skill) => (
              <SkillChip key={skill} skill={skill} />
            ))}
            <span className={styles.lastChipWrapper}>
              <SkillChip skill={lastSkill} />
              {showDivider && (
                <span className={styles.divider} aria-hidden="true">
                  /
                </span>
              )}
            </span>
          </span>
        );
      })}
    </>
  );
}
