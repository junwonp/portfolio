"use client";

import React from "react";
import {
  CodeXml,
  Cpu,
  Database,
  Library,
  Palette,
  Server,
  Sparkles,
  Zap,
} from "lucide-react";

import ArrowLink from "@/lib/components/ArrowLink";
import SkillChip from "@/lib/components/SkillChip";
import { getLabels } from "@/lib/data/labels";
import type { SkillProps } from "@/lib/types/about";
import type { Language } from "@/lib/utils/language";

import styles from "./BentoSkills.module.css";

interface Props {
  locale: Language;
  skills: SkillProps[];
}

const categoryIcons: Record<string, typeof CodeXml> = {
  languages: CodeXml,
  frameworks: Library,
  ui: Palette,
  state: Database,
  performance: Zap,
  backend: Server,
  devops: Cpu,
  ai_workflow: Sparkles,
};

export default function BentoSkills({ locale, skills }: Props) {
  const labels = getLabels(locale);

  return (
    <div className={styles["bento-grid"]}>
      {skills.map((skill) => {
        const Icon = categoryIcons[skill.id];
        const isSpan2 = skill.id === "frameworks" || skill.id === "ai_workflow";

        return (
          <div
            key={skill.title}
            className={`${styles.card} ${isSpan2 ? styles["span-2"] : ""}`}
            style={
              {
                "--cat-color": `var(--color-cat-${skill.id})`,
              } as React.CSSProperties
            }
          >
            <div className={styles["card-header"]}>
              {Icon && (
                <Icon
                  className={styles["category-icon"]}
                  size={18}
                  strokeWidth={2.5}
                />
              )}
              <h3 className={styles["card-title"]}>{skill.title}</h3>
            </div>
            <div className={styles["tag-list"]}>
              {skill.list.map((item) => (
                <SkillChip key={item} skill={item} />
              ))}
            </div>
            {skill.detailLink && (
              <div className={styles["card-footer"]}>
                {skill.description && (
                  <div className={styles["card-prose"]}>
                    <p>{skill.description}</p>
                  </div>
                )}
                <ArrowLink
                  href={skill.detailLink}
                  label={skill.detailLabel || labels.viewProjectDetails}
                  color="var(--cat-color)"
                  reload
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
