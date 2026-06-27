"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";

import BaseSideNav from "@/lib/components/BaseSideNav";
import { getPageScrollY, scrollPageTo, useScrollSpy } from "@/lib/hooks/useScrollSpy";
import { parseHeading } from "@/lib/utils/markdown";

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
    if (typeof window === "undefined") {
      return;
    }

    const article = document.querySelector(".project-article");
    if (!article) {
      return;
    }

    const readSections = (): NavSection[] => {
      const headings = Array.from(
        article.querySelectorAll<HTMLElement>("h2")
      );

      return headings.flatMap((el) => {
        if (!el.id) {
          return [];
        }

        const { label } = parseHeader(el.textContent || "");
        return [{ id: el.id, label }];
      });
    };

    const syncSections = () => {
      const nextSections = readSections();
      setSections((current) =>
        areNavSectionsEqual(current, nextSections) ? current : nextSections
      );
    };

    syncSections();

    let frameId: number | null = null;
    const observer = new MutationObserver(() => {
      if (frameId !== null) {
        return;
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = null;
        syncSections();
      });
    });

    observer.observe(article, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      observer.disconnect();
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [parseHeader]);

  const sectionIds = useMemo(() => sections.map((s) => s.id), [sections]);

  const activeId = useScrollSpy(
    useCallback(() => sectionIds, [sectionIds])
  );

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    const top = el.getBoundingClientRect().top + getPageScrollY() - 80;
    scrollPageTo(top);
  };

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
