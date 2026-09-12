'use client';

import type { HTMLAttributes } from 'react';

import type { ProjectItem } from '@/lib/portfolio/homeTypes';
import type { Labels } from '@/lib/portfolio/labels';
import { resolveProjectSkills } from '@/lib/portfolio/projectSkills';

import ResumeProjectContent from './ResumeProjectContent';
import SpotlightProjectContent from './SpotlightProjectContent';

export interface ProjectContentProps {
  headerProps?: HTMLAttributes<HTMLDivElement>;
  isLinkWrapped?: boolean;
  labels: Labels;
  project: ProjectItem;
  reloadDetailLink?: boolean;
  showBody?: boolean;
  showDetails?: boolean;
  skillLimit?: number;
  titleBadge?: string;
  titleLevel?: 3 | 4;
  toggle?: { expanded: boolean; onToggle: () => void };
  variant: 'spotlight' | 'resume';
}

export default function ProjectContent({
  project,
  titleBadge,
  variant,
  skillLimit,
  showBody = true,
  showDetails = false,
  isLinkWrapped = false,
  reloadDetailLink = false,
  headerProps,
  toggle,
  titleLevel = 3,
  labels,
}: ProjectContentProps) {
  const resolvedSkills = resolveProjectSkills(project, skillLimit);

  if (variant === 'spotlight') {
    return (
      <SpotlightProjectContent
        project={project}
        titleBadge={titleBadge}
        labels={labels}
        resolvedSkills={resolvedSkills}
      />
    );
  }

  return (
    <ResumeProjectContent
      project={project}
      titleBadge={titleBadge}
      labels={labels}
      resolvedSkills={resolvedSkills}
      showBody={showBody}
      showDetails={showDetails}
      isLinkWrapped={isLinkWrapped}
      reloadDetailLink={reloadDetailLink}
      headerProps={headerProps}
      toggle={toggle}
      titleLevel={titleLevel}
    />
  );
}
