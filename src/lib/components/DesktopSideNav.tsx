"use client";

import React, { useCallback,useMemo } from "react";

import { getPageScrollY, scrollPageTo,useScrollSpy } from "@/lib/hooks/useScrollSpy";

import BaseSideNav from "./BaseSideNav";

interface NavSection {
  id: string;
  label: string;
}

interface Props {
  sections: NavSection[];
}

export default function DesktopSideNav({ sections }: Props) {
  const sectionIds = useMemo(() => sections.map((s) => s.id), [sections]);

  const activeId = useScrollSpy(
    useCallback(() => sectionIds, [sectionIds]),
  );

  const scrollTo = useCallback((id: string): void => {
    const el = document.getElementById(id);
    if (!el) return;

    scrollPageTo(el.getBoundingClientRect().top + getPageScrollY());
  }, []);

  return (
    <BaseSideNav
      sections={sections}
      activeId={activeId}
      onselect={scrollTo}
      ariaLabel="Page sections"
    />
  );
}
