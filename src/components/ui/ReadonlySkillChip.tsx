import type { CSSProperties } from 'react';

import { getSkillCategory } from '@/lib/portfolio/skills';

import styles from './SkillChip.module.css';

interface ReadonlySkillChipProps {
  skill: string;
}

export default function ReadonlySkillChip({ skill }: ReadonlySkillChipProps) {
  const category = getSkillCategory(skill);

  const inlineStyles = {
    '--cat-color': `var(--color-cat-${category})`,
  } as CSSProperties;

  return (
    <span className={styles['skill-chip']} style={inlineStyles}>
      {skill}
    </span>
  );
}
