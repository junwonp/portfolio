"use client";

import React from "react";

import ArrowLink from "@/components/ui/ArrowLink";
import SkillChip from "@/components/ui/SkillChip";
import { cardSurface } from "@/components/ui/surface.css";
import type { SkillProps } from "@/lib/portfolio/homeTypes";
import { getLabels } from "@/lib/portfolio/labels";
import type { Language } from "@/lib/utils/language";

import * as styles from "./BentoSkills.css";

export default function BentoSkills({
  locale,
  skills,
}: {
  locale: Language;
  skills: SkillProps[];
}) {
  const labels = getLabels(locale);

  return (
    <div className={styles.bentoGrid}>
      {skills.map((skill) => {
        const isSpan2 = skill.id === "ui";

        return (
          <div
            key={skill.title}
            className={`${styles.card} ${cardSurface} ${isSpan2 ? styles.span2 : ""}`}
            style={
              {
                "--cat-color": `var(--color-cat-${skill.id})`,
              } as React.CSSProperties
            }
          >
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>{skill.title}</h3>
            </div>
            <div className={styles.tagList}>
              {skill.list.map((item) => (
                <SkillChip key={item} skill={item} />
              ))}
            </div>
            {skill.detailLink && (
              <div className={styles.cardFooter}>
                {skill.description && (
                  <div className={styles.cardProse}>
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
