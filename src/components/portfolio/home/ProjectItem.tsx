'use client';

import ProjectContent from '@/components/portfolio/home/ProjectContent';
import { reportInteraction } from '@/lib/analytics/analyticsTransport';
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
    if (!isFiltered) {
      reportInteraction({
        interactionType: 'accordion_project',
        interactionLabel: `${companyName}::${project.title}`,
        action: isOpen ? 'close' : 'open',
      });
      toggleProject(companyName, project.title);
    }
  };

  const containerClassName = `project-item ${ProjectItemStyles.projectItem}`.trim();

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
      headerProps={isCompact ? { style: { cursor: 'default' } } : undefined}
      toggle={isCompact ? undefined : { expanded: isOpen, onToggle: handleToggle }}
      titleLevel={isCompact ? 4 : 3}
      labels={labels}
    />
  );

  return (
    <li className={containerClassName} data-project-surface="resume">
      {content}
    </li>
  );
}
