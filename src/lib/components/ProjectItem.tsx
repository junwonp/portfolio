"use client";

import React, { useMemo } from "react";
import { ChevronDown } from "lucide-react";

import type { Labels } from "@/lib/data/labels";
import { useAccordionState } from "@/lib/states/accordion";
import { useSkillState } from "@/lib/states/skills";
import type { ProjectItem as ProjectItemType } from "@/lib/types/about";
import { parseMarkdown } from "@/lib/utils/markdown";

import ArrowLink from "./ArrowLink";
import Period from "./Period";
import ProjectItemStyles from "./ProjectItem.module.css";
import RichText from "./RichText";
import SkillChip from "./SkillChip";

interface Props {
  companyName: string;
  isFiltered: boolean;
  labels: Labels;
  project: ProjectItemType;
}

export default function ProjectItem({ companyName, isFiltered, labels, project }: Props) {
  const { isProjectOpen, toggleProject } = useAccordionState();
  const { sort } = useSkillState();

  const isOpen = isProjectOpen(companyName, project.title) || isFiltered;

  const sortedSkills = useMemo(() => {
    return project.skills ? sort(project.skills) : [];
  }, [project.skills, sort]);

  const mainSkillsLabel = useMemo(() => {
    return sortedSkills.slice(0, 2).join(", ");
  }, [sortedSkills]);

  function parseDetailLine(line: string) {
    const match = line.match(/^\*\*\[(.*?)\]\*\*(.*)$/);
    if (match) {
      return { label: match[1], content: match[2].trim() };
    }
    return { label: null, content: line };
  }

  const metricCount = project.metrics ? Math.min(project.metrics.length, 4) : 0;

  return (
    <div className={`${ProjectItemStyles["project-item"]} ${isOpen ? ProjectItemStyles["is-open"] : ""}`}>
      <button
        className={ProjectItemStyles["project-header"]}
        onClick={() => {
          if (!isFiltered) toggleProject(companyName, project.title);
        }}
        aria-expanded={isOpen}
      >
        <div className={ProjectItemStyles["project-title-area"]}>
          <div className={ProjectItemStyles["project-title-row"]}>
            <span className={ProjectItemStyles["project-title"]}>{project.title}</span>
            <span className={`${ProjectItemStyles["project-period"]} ${ProjectItemStyles["mobile-only"]}`}>
              <Period dateFrom={project.dateFrom} dateTo={project.dateTo} />
            </span>
          </div>
          <div className={ProjectItemStyles["project-desc-line"]}>
            <span className={ProjectItemStyles["project-description-short"]}>{project.description}</span>
            {project.skills && project.skills.length > 0 && (
              <>
                <span className={ProjectItemStyles["desc-separator"]}>·</span>
                <span className={ProjectItemStyles["main-skills"]}>{mainSkillsLabel}</span>
              </>
            )}
          </div>
        </div>
        <div className={ProjectItemStyles["project-header-right"]}>
          <span className={`${ProjectItemStyles["project-period"]} ${ProjectItemStyles["pc-only"]}`}>
            <Period dateFrom={project.dateFrom} dateTo={project.dateTo} />
          </span>
          <ChevronDown
            size={20}
            strokeWidth={2}
            className={`${ProjectItemStyles["project-chevron"]} ${isOpen ? ProjectItemStyles.open : ""}`}
          />
        </div>
      </button>

      {isOpen && (
        <div className={ProjectItemStyles["project-content"]}>
          {project.metrics && project.metrics.length > 0 && (
            <div
              className={`${ProjectItemStyles["project-metrics"]} ${
                metricCount === 4 ? ProjectItemStyles["has-four-metrics"] : ""
              }`}
              style={{ "--metric-count": metricCount } as React.CSSProperties}
            >
              {project.metrics.map((metric) => (
                <div className={ProjectItemStyles["metric-item"]} key={metric.label}>
                  <span className={ProjectItemStyles["metric-value"]}>{metric.value}</span>
                  <span className={ProjectItemStyles["metric-label"]}>{metric.label}</span>
                </div>
              ))}
            </div>
          )}

          {project.detail.length > 0 && (
            <div className={ProjectItemStyles["detail-grid"]}>
              {project.detail.map((line) => {
                const parsed = parseDetailLine(line);
                return (
                  <div className={ProjectItemStyles["detail-row"]} key={line}>
                    {parsed.label && (
                      <div className={ProjectItemStyles["detail-label"]}>
                        <span className={ProjectItemStyles["label-pill"]}>{parsed.label}</span>
                      </div>
                    )}
                    <div className={ProjectItemStyles["detail-text"]}>
                      <RichText parts={parseMarkdown(parsed.content)} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {project.detailLink && (
            <div className={ProjectItemStyles["project-links"]}>
              <ArrowLink href={project.detailLink} label={labels.viewProjectDetails} />
            </div>
          )}

          {project.skills && project.skills.length > 0 && (
            <div className={ProjectItemStyles["skill-tags"]}>
              {sortedSkills.map((skill) => (
                <SkillChip key={skill} skill={skill} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
