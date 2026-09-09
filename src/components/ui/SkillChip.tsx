import { skillChip } from './SkillChip.css';

interface Props {
  skill: string;
}

export default function SkillChip({ skill }: Props) {
  return <span className={skillChip}>{skill}</span>;
}
