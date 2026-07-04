'use client';

import React from 'react';

import ProjectContent from '@/lib/components/ProjectContent';
import type { Labels } from '@/lib/data/labels';
import { useAccordionState } from '@/lib/states/accordion';
import type { ProjectItem as ProjectItemType } from '@/lib/types/about';

import ProjectItemStyles from './ProjectItem.module.css';
import type { ProjectDetailsMode } from './projectItemDisplay';
import { shouldForceProjectContentOpen, shouldRenderProjectDetails } from './projectItemDisplay';

interface Props {
  companyName: string;
  detailsMode?: ProjectDetailsMode;
  editor?: React.ReactNode;
  editTrigger?: React.ReactNode;
  isEditing?: boolean;
  isFiltered: boolean;
  labels: Labels;
  project: ProjectItemType;
}

export default function ProjectItem({
  companyName,
  detailsMode,
  editor,
  editTrigger,
  isEditing = false,
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

  if (isEditing) {
    return (
      <div className={`project-item ${ProjectItemStyles['project-item']} ${ProjectItemStyles['is-open']}`}>
        <div className={ProjectItemStyles['project-editor-slot']}>{editor}</div>
      </div>
    );
  }

  const containerClassName = `project-item ${ProjectItemStyles['project-item']} ${isOpen ? ProjectItemStyles['is-open'] : ''}`.trim();

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
      editTrigger={editTrigger}
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
