"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";

import BaseSideNav from "@/lib/components/BaseSideNav";
import { getPageScrollY, scrollPageTo, useScrollSpy } from "@/lib/hooks/useScrollSpy";
import { parseHeading, slugify } from "@/lib/utils/markdown";

interface NavSection {
  id: string;
  label: string;
}

function areNavSectionsEqual(
  current: NavSection[],
  next: NavSection[]
): boolean {
  if (current.length !== next.length) {
    return false;
  }

  return current.every((section, index) => {
    const other = next[index];
    return section.id === other.id && section.label === other.label;
  });
}

export default function ProjectToc() {
  const [sections, setSections] = useState<NavSection[]>([]);

  const parseHeader = useCallback((text: string) => {
    const { main } = parseHeading(text);
    return { label: main };
  }, []);

  useEffect(() => {
    const article = document.querySelector(".project-article");
    if (!article) {
      return;
    }

    const syncSections = () => {
      const headings = Array.from(
        article.querySelectorAll<HTMLElement>("h2")
      );

      const nextSections = headings.map((el, i) => {
        if (!el.id) {
          el.id = slugify(el.textContent || "", i);
        }

        const { label } = parseHeader(el.textContent || "");
        return { id: el.id, label };
      });

      setSections((current) =>
        areNavSectionsEqual(current, nextSections) ? current : nextSections
      );
    };

    syncSections();

    const observer = new MutationObserver(() => {
      syncSections();
    });
    observer.observe(article, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, [parseHeader]);

  const sectionIds = useMemo(() => sections.map((s) => s.id), [sections]);

  const activeId = useScrollSpy(useCallback(() => sectionIds, [sectionIds]));

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    const top = el.getBoundingClientRect().top + getPageScrollY() - 80;
    scrollPageTo(top);
  }, []);

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
