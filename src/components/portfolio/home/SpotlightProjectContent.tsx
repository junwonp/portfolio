'use client';

import RichText from '@/components/ui/RichText';
import type { ProjectItem } from '@/lib/portfolio/homeTypes';
import type { Labels } from '@/lib/portfolio/labels';
import type { ResolvedProjectSkills } from '@/lib/portfolio/projectSkills';
import { parseMarkdown } from '@/lib/utils/markdown';
import * as styles from './ProjectContent.css';
import ProjectSkillChips from './ProjectSkillChips';

interface Props {
  labels: Labels;
  project: ProjectItem;
  resolvedSkills: ResolvedProjectSkills;
  titleBadge?: string;
}

export default function SpotlightProjectContent({
  labels,
  project,
  resolvedSkills,
  titleBadge,
}: Props) {
  return (
    <div className={styles.spotlightContent}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h3 className={styles.title}>{project.title}</h3>
          {titleBadge && <span className={styles.badge}>{titleBadge}</span>}
        </div>
        {project.detailLink && (
          <span className={styles.linkMock}>{labels.viewProjectDetails} →</span>
        )}
      </div>

      <p className={styles.description}>
        <RichText parts={parseMarkdown(project.description)} />
      </p>

      <ProjectSkillChips
        visibleSkills={resolvedSkills.visibleSkills}
        hiddenSkillCount={resolvedSkills.hiddenSkillCount}
        hiddenSkillsSummary={resolvedSkills.hiddenSkillsSummary}
      />
    </div>
  );
}
