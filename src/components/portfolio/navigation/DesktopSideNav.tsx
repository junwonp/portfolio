"use client";

import React from "react";

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
  const sectionIds = sections.map((s) => s.id);

  const activeId = useScrollSpy(() => sectionIds);

  const scrollTo = (id: string): void => {
    const el = document.getElementById(id);
    if (!el) return;

    scrollPageTo(el.getBoundingClientRect().top + getPageScrollY());
  };

  return (
    <BaseSideNav
      sections={sections}
      activeId={activeId}
      onselect={scrollTo}
      ariaLabel="Page sections"
    />
  );
}
