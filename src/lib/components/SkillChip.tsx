import type { CSSProperties } from 'react';

import { getSkillCategory } from '@/lib/data/skills';

import styles from './SkillChip.module.css';

interface Props {
  skill: string;
}

export default function SkillChip({ skill }: Props) {
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
