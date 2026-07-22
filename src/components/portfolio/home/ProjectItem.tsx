'use client';

import React from 'react';

import ProjectContent from '@/components/portfolio/home/ProjectContent';
import type { ProjectItem as ProjectItemType } from '@/lib/portfolio/homeTypes';
import type { Labels } from '@/lib/portfolio/labels';
import { useAccordionState } from '@/lib/states/accordion';

import * as ProjectItemStyles from './ProjectItem.css';
import type { ProjectDetailsMode } from './projectItemDisplay';
import { shouldForceProjectContentOpen, shouldRenderProjectDetails } from './projectItemDisplay';

interface Props {
  companyName: string;
  detailsMode?: ProjectDetailsMode;
  isFiltered: boolean;
  labels: Labels;
  project: ProjectItemType;
}

export default function ProjectItem({
  companyName,
  detailsMode,
  isFiltered,
  labels,
  project,
}: Props) {
  const { isProjectOpen, toggleProject } = useAccordionState();

  const isCompact = detailsMode === 'compact';
  const isOpen =
    shouldForceProjectContentOpen(detailsMode) ||
    isProjectOpen(companyName, project.title) ||
    isFiltered;

  const handleToggle = () => {
    if (isCompact) return;
    if (!isFiltered) toggleProject(companyName, project.title);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isCompact) return;
    if (!isFiltered && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      toggleProject(companyName, project.title);
    }
  };

  const containerClassName =
    `project-item ${ProjectItemStyles.projectItem}`.trim();

  const headerProps = isCompact
    ? {
        style: { cursor: 'default' },
      }
    : {
        role: 'button',
        tabIndex: 0,
        onClick: handleToggle,
        onKeyDown: handleKeyDown,
        'aria-expanded': isOpen,
      };

  const content = (
    <ProjectContent
      project={project}
      variant="resume"
      showBody={isOpen}
      showDetails={
        isOpen &&
        shouldRenderProjectDetails(detailsMode, project.detail, Boolean(project.detailLink))
      }
      isLinkWrapped={false}
      headerProps={headerProps}
      labels={labels}
    />
  );

  return (
    <div className={containerClassName} data-project-surface="resume">
      {content}
    </div>
  );
}
