'use client';

import BaseSideNav from '@/components/portfolio/navigation/BaseSideNav';
import { useArticleSections } from '@/lib/hooks/useArticleSections';
import { getPageScrollY, scrollPageTo, useScrollSpy } from '@/lib/hooks/useScrollSpy';

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  const top = el.getBoundingClientRect().top + getPageScrollY() - 80;
  scrollPageTo(top);
}

export default function ProjectToc() {
  const sections = useArticleSections();

  const sectionIds = sections.map((section) => section.id);
  const activeId = useScrollSpy(() => sectionIds);

  if (sections.length === 0) return null;

  return (
    <BaseSideNav
      sections={sections}
      activeId={activeId}
      onselect={scrollToSection}
      ariaLabel="Project sections"
    />
  );
}
