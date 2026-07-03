"use client";

import React, { useMemo } from "react";
import { ChevronDown } from "lucide-react";

import type { Labels } from "@/lib/data/labels";
import { getSkillCategory } from "@/lib/data/skills";
import { useAccordionState } from "@/lib/states/accordion";
import type { ProjectItem as ProjectItemType } from "@/lib/types/about";
import { parseMarkdown } from "@/lib/utils/markdown";
import { sortSkills } from "@/lib/utils/skills";

import ArrowLink from "./ArrowLink";
import MetricCard from "./MetricCard";
import Period from "./Period";
import ProjectItemStyles from "./ProjectItem.module.css";
import type { ProjectDetailsMode } from "./projectItemDisplay";
import {
  shouldForceProjectContentOpen,
  shouldRenderProjectDetails,
} from "./projectItemDisplay";
import RichText from "./RichText";
import SkillChip from "./SkillChip";


interface Props {
  companyName: string;
  editTrigger?: React.ReactNode;
  editor?: React.ReactNode;
  isEditing?: boolean;
  isFiltered: boolean;
  labels: Labels;
  project: ProjectItemType;
  detailsMode?: ProjectDetailsMode;
}

export default function ProjectItem({
  companyName,
  detailsMode,
  editTrigger,
  editor,
  isEditing = false,
  isFiltered,
  labels,
  project,
}: Props) {
  const { isProjectOpen, toggleProject } = useAccordionState();

  const isCompact = detailsMode === "compact";
  const isOpen =
    shouldForceProjectContentOpen(detailsMode) ||
    isProjectOpen(companyName, project.title) ||
    isFiltered;

  const sortedSkills = useMemo(() => {
    return project.skills ? sortSkills(project.skills) : [];
  }, [project.skills]);

  const mainSkillsLabel = useMemo(() => {
    const language = sortedSkills.find((skill) => getSkillCategory(skill) === "languages");
    const framework = sortedSkills.find((skill) => getSkillCategory(skill) === "frameworks");
    return [language, framework].filter(Boolean).join(", ");
  }, [sortedSkills]);

  function parseDetailLine(line: string) {
    const match = line.match(/^\*\*\[(.*?)\]\*\*(.*)$/);
    if (match) {
      return { label: match[1], content: match[2].trim() };
    }
    return { label: null, content: line };
  }

  const metricCount = project.metrics ? Math.min(project.metrics.length, 4) : 0;
  const hasDetailRows = shouldRenderProjectDetails(
    detailsMode,
    project.detail,
    Boolean(project.detailLink),
  );

  const handleToggle = () => {
    if (isCompact) return;
    if (!isFiltered) toggleProject(companyName, project.title);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (isCompact) return;
    if (!isFiltered && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      toggleProject(companyName, project.title);
    }
  };

  if (isEditing) {
    return (
      <div className={`${ProjectItemStyles["project-item"]} ${ProjectItemStyles["is-open"]}`}>
        <div className={ProjectItemStyles["project-editor-slot"]}>{editor}</div>
      </div>
    );
  }

  return (
    <div className={`${ProjectItemStyles["project-item"]} ${isOpen ? ProjectItemStyles["is-open"] : ""}`}>
      <div
        className={ProjectItemStyles["project-header"]}
        onClick={isCompact ? undefined : handleToggle}
        onKeyDown={isCompact ? undefined : handleKeyDown}
        aria-expanded={isCompact ? undefined : isOpen}
        role={isCompact ? undefined : "button"}
        tabIndex={isCompact ? undefined : 0}
      >
        <div className={ProjectItemStyles["project-title-area"]}>
          <div className={ProjectItemStyles["project-title-row"]}>
            <span className={ProjectItemStyles["project-title"]}>{project.title}</span>
            {editTrigger && (
              <span
                className={ProjectItemStyles["project-edit-action"]}
                onClick={(event) => event.stopPropagation()}
                onKeyDown={(event) => event.stopPropagation()}
              >
                {editTrigger}
              </span>
            )}
            <span className={`${ProjectItemStyles["project-period"]} ${ProjectItemStyles["mobile-only"]}`}>
              <Period dateFrom={project.dateFrom} dateTo={project.dateTo} />
            </span>
          </div>
          <div className={ProjectItemStyles["project-desc-line"]}>
            <span className={ProjectItemStyles["project-description-short"]}>{project.description}</span>
            {mainSkillsLabel && (
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
          {!isCompact && (
            <ChevronDown
              size={20}
              strokeWidth={2}
              className={`${ProjectItemStyles["project-chevron"]} ${isOpen ? ProjectItemStyles.open : ""}`}
            />
          )}
        </div>
      </div>

      {isOpen && (
        <div className={ProjectItemStyles["project-content"]}>
          {project.metrics && project.metrics.length > 0 && (
            <dl
              className={`${ProjectItemStyles["project-metrics"]} ${
                metricCount === 4 ? ProjectItemStyles["has-four-metrics"] : ""
              }`}
              style={{ "--metric-count": metricCount } as React.CSSProperties}
            >
              {project.metrics.map((metric) => (
                <MetricCard
                  key={metric.label}
                  value={metric.value}
                  label={metric.label}
                />
              ))}
            </dl>
          )}

          {hasDetailRows && (
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
