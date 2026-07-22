import { getSkillCategory } from '@/lib/portfolio/skills';

import { catColorVar, skillChip } from './SkillChip.css';

interface ReadonlySkillChipProps {
  skill: string;
}

export default function ReadonlySkillChip({ skill }: ReadonlySkillChipProps) {
  const category = getSkillCategory(skill);
  const variableName = String(catColorVar).replace(/^var\(|\)$/g, '');

  return (
    <span
      className={skillChip}
      style={{
        [variableName]: `var(--color-cat-${category})`,
      }}
    >
      {skill}
    </span>
  );
}
