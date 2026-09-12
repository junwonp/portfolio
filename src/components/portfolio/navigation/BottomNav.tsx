'use client';

import { useMemo } from 'react';

import { useLocale } from '@/lib/contexts/LocaleContext';
import { useArticleSections } from '@/lib/hooks/useArticleSections';
import { useProjectNavLinks } from '@/lib/stores/bottomNav';

import HomeTabBar from './HomeTabBar';
import ProjectNav from './ProjectNav';

interface Props {
  isProject?: boolean;
}

export default function BottomNav({ isProject = false }: Props) {
  const { labels } = useLocale();
  const navLinks = useProjectNavLinks();
  const articleSections = useArticleSections();

  const homeTabs = useMemo(
    () => [
      { id: 'section-intro', label: labels.tabIntro },
      { id: 'section-work', label: labels.tabWork },
      { id: 'section-skills', label: labels.tabSkills },
      { id: 'section-projects', label: labels.tabProjects },
      { id: 'section-education', label: labels.tabEducation },
    ],
    [labels],
  );

  if (isProject) {
    return (
      <ProjectNav
        tabs={articleSections}
        githubLink={navLinks?.githubLink}
        productLink={navLinks?.productLink}
      />
    );
  }

  return <HomeTabBar tabs={homeTabs} ariaLabel={labels.navAriaLabel} />;
}
