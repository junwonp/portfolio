"use client";

import React, { useCallback,useEffect, useMemo, useState } from "react";

import BaseSideNav from "@/lib/components/BaseSideNav";
import { getPageScrollY, scrollPageTo,useScrollSpy } from "@/lib/hooks/useScrollSpy";
import { parseHeading, slugify } from "@/lib/utils/markdown";

interface NavSection {
  id: string;
  label: string;
}

export default function ProjectToc() {
  const [sections, setSections] = useState<NavSection[]>([]);

  const sectionIds = useMemo(() => sections.map((s) => s.id), [sections]);

  const activeId = useScrollSpy(
    useCallback(() => sectionIds, [sectionIds])
  );

  const parseHeader = (text: string) => {
    const { main } = parseHeading(text);
    return { label: main };
  };

  useEffect(() => {
    const setup = (): boolean => {
      const headings = Array.from(
        document.querySelectorAll<HTMLElement>(".project-article h2")
      );
      if (headings.length === 0) {
        setSections([]);
        return false;
      }

      const parsed: NavSection[] = headings.map((el, i) => {
        if (!el.id) {
          el.id = slugify(el.textContent || "", i);
        }
        const { label } = parseHeader(el.textContent || "");
        return { id: el.id, label };
      });

      setSections(parsed);
      return true;
    };

    if (!setup()) {
      const article = document.querySelector(".project-article");
      if (article) {
        const mutObs = new MutationObserver(() => {
          if (document.querySelectorAll(".project-article h2").length > 0) {
            mutObs.disconnect();
            setup();
          }
        });
        mutObs.observe(article, { childList: true, subtree: true });
        return () => {
          mutObs.disconnect();
        };
      }
    }
  }, []);

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
