import SkillGroups from '@/components/portfolio/SkillGroups';

import * as styles from './ProjectContent.css';

interface Props {
  hiddenSkillCount: number;
  hiddenSkillsSummary: string;
  visibleSkills: string[];
}

export default function ProjectSkillChips({
  hiddenSkillCount,
  hiddenSkillsSummary,
  visibleSkills,
}: Props) {
  if (visibleSkills.length === 0) {
    return null;
  }

  return (
    <div className={styles.skills}>
      <SkillGroups skills={visibleSkills} />
      {hiddenSkillCount > 0 && (
        <span className={styles.moreChip} title={hiddenSkillsSummary}>
          +{hiddenSkillCount}
        </span>
      )}
    </div>
  );
}
