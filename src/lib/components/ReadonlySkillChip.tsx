import type { CSSProperties } from "react";

import { getSkillCategory } from "@/lib/data/skills";

import styles from "./SkillChip.module.css";

interface ReadonlySkillChipProps {
  skill: string;
}

export default function ReadonlySkillChip({
  skill,
}: ReadonlySkillChipProps) {
  const category = getSkillCategory(skill);

  const inlineStyles = {
    "--cat-color": `var(--color-cat-${category})`,
    "--cat-text-hover":
      category === "ai_workflow"
        ? "var(--color-cat-ai_workflow-text, white)"
        : "white",
  } as CSSProperties;

  return (
    <span
      className={`${styles["skill-chip"]} ${styles.readonly}`}
      style={inlineStyles}
    >
      {skill}
    </span>
  );
}
