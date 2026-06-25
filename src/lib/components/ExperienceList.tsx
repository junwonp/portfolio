"use client";

import React from "react";

import ArrowLink from "@/lib/components/ArrowLink";
import Badge from "@/lib/components/Badge";
import RichText from "@/lib/components/RichText";
import SkillChip from "@/lib/components/SkillChip";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { skillState } from "@/lib/states/skills";
import type { OtherExperienceProps } from "@/lib/types/about";
import { parseMarkdown } from "@/lib/utils/markdown";

import styles from "./ExperienceList.module.css";

interface Props {
  experiences: OtherExperienceProps[];
  skillLimit?: number;
}

export default function ExperienceList({ experiences, skillLimit }: Props) {
  const { labels } = useLocale();

  const formatDate = (dateFrom?: string, dateTo?: string) => {
    if (!dateFrom) return "";
    if (dateFrom.length === 4) return dateFrom; // e.g. 2024
    const formatted = dateFrom.replace("-", ".");
    const isOngoing = !dateTo || dateTo !== dateFrom;
    return isOngoing ? `${formatted} ~` : formatted;
  };

  return (
    <div className={styles["experience-list"]}>
      {experiences.map((exp) => {
        const project = exp.project[0];
        if (!project) return null;

        const featuredSkills = project.featuredSkills ?? [];
        const remainingSkills = skillState
          .sort(project.skills ?? [])
          .filter((skill) => !featuredSkills.includes(skill));
        const sortedSkills = skillLimit
          ? [...featuredSkills, ...remainingSkills]
          : skillState.sort(project.skills ?? []);
        const visibleSkills = skillLimit
          ? sortedSkills.slice(0, skillLimit)
          : sortedSkills;
        const hiddenSkillCount = sortedSkills.length - visibleSkills.length;
        const metricCount = project.metrics
          ? Math.min(project.metrics.length, 4)
          : 0;

        return (
          <div
            key={project.title}
            className={styles["item-wrapper"]}
          >
            <div className={styles.item}>
              <div className={styles.content}>
                <div className={styles.header}>
                  <h3 className={styles.title}>{project.title}</h3>
                  {exp.titleBadge && <Badge text={exp.titleBadge} />}
                </div>
                <p className={styles.description}>
                  <RichText parts={parseMarkdown(project.description)} />
                </p>

                {project.metrics && project.metrics.length > 0 && (
                  <dl
                    className={`${styles["metric-strip"]} ${
                      metricCount === 4 ? styles["has-four-metrics"] : ""
                    }`}
                    style={{ "--metric-count": metricCount } as React.CSSProperties}
                  >
                    {project.metrics.map((metric) => (
                      <div key={metric.label} className={styles["metric-item"]}>
                        <dt>{metric.label}</dt>
                        <dd>{metric.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}

                {project.detailLink && (
                  <div className={styles["link-wrapper"]}>
                    <ArrowLink
                      href={project.detailLink}
                      label={labels.viewProjectDetails}
                      reload
                    />
                  </div>
                )}

                {project.skills && project.skills.length > 0 && (
                  <div className={styles["tag-list"]}>
                    {visibleSkills.map((skill) => (
                      <SkillChip key={skill} skill={skill} />
                    ))}
                    {hiddenSkillCount > 0 && (
                      <span
                        className={styles["more-chip"]}
                        title={sortedSkills.slice(skillLimit).join(", ")}
                      >
                        +{hiddenSkillCount}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className={styles["date-wrapper"]}>
                <span className={styles.date}>
                  {formatDate(project.dateFrom, project.dateTo)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
