"use client";

import type { CSSProperties, KeyboardEvent, MouseEvent } from "react";

import { getSkillCategory } from "@/lib/data/skills";
import { useSkillState } from "@/lib/states/skills";

import styles from "./SkillChip.module.css";

interface Props {
  skill: string;
  readonly?: boolean;
}

export default function SkillChip({ skill, readonly = false }: Props) {
  const { has, toggle } = useSkillState();

  const category = getSkillCategory(skill);
  const isActive = !readonly && has(skill);

  const inlineStyles = {
    "--cat-color": `var(--color-cat-${category})`,
    "--cat-text-hover": category === "ai_workflow"
      ? "var(--color-cat-ai_workflow-text, white)"
      : "white",
  } as CSSProperties;

  const combinedClass = [
    styles["skill-chip"],
    isActive && styles.active,
    readonly && styles.readonly,
  ]
    .filter(Boolean)
    .join(" ");

  const handleClick = (e: MouseEvent | KeyboardEvent) => {
    if (readonly) return;
    if ("key" in e && e.key !== "Enter" && e.key !== " ") return;
    toggle(skill);
  };

  return (
    <button
      className={combinedClass}
      style={inlineStyles}
      onClick={handleClick}
      onKeyDown={handleClick}
      aria-pressed={!readonly ? isActive : undefined}
    >
      {skill}
    </button>
  );
}
