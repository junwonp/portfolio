"use client";

import React from "react";

import ArrowLink from "@/components/ui/ArrowLink";
import SkillChip from "@/components/ui/SkillChip";
import type { SkillProps } from "@/lib/portfolio/homeTypes";
import { getLabels } from "@/lib/portfolio/labels";
import type { Language } from "@/lib/utils/language";

import styles from "./BentoSkills.module.css";

export default function BentoSkills({
  locale,
  skills,
}: {
  locale: Language;
  skills: SkillProps[];
}) {
  const labels = getLabels(locale);

  return (
    <div className={styles["bento-grid"]}>
      {skills.map((skill) => {
        const isSpan2 = skill.id === "ui";

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
