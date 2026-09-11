import { useId } from 'react';

import SkillChip from '@/components/ui/SkillChip';
import { getLabels } from '@/lib/portfolio/labels';
import { getProjectTechStackGroups } from '@/lib/portfolio/techStack';
import type { Language } from '@/lib/utils/language';

import * as styles from './ProjectTechStack.css';

interface Props {
  techStack: string[];
  locale: Language;
}

export default function ProjectTechStack({ techStack, locale }: Props) {
  const labels = getLabels(locale);
  const headingId = useId();
  const techStackByCategory = getProjectTechStackGroups(techStack, locale);

  return (
    <section className={styles.projectTechStack} aria-labelledby={headingId}>
      <h2 id={headingId} className={styles.visuallyHidden}>
        {labels.techStack}
      </h2>
      <ul className={styles.techCategoryGrid}>
        {techStackByCategory.map((group) => (
          <li key={group.id} className={styles.techCategory}>
            <h3 className={styles.categoryTitle}>{group.title}</h3>
            <ul className={styles.techGrid}>
              {group.skills.map((tech) => (
                <li key={tech}>
                  <SkillChip skill={tech} />
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}
