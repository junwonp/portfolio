import { skillChip } from './SkillChip.css';

interface ReadonlySkillChipProps {
  skill: string;
}

export default function ReadonlySkillChip({ skill }: ReadonlySkillChipProps) {
  return <span className={skillChip}>{skill}</span>;
}
