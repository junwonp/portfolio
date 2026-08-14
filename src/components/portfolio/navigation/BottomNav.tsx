"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";

import Github from "@/components/ui/Icon/Github";
import Globe from "@/components/ui/Icon/Globe";
import { circleButton, pillButton } from "@/components/ui/surface.css";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { getPageScrollY, scrollPageTo, useScrollSpy } from "@/lib/hooks/useScrollSpy";
import { useProjectNavLinks } from "@/lib/stores/bottomNav";
import { parseHeading, slugify } from "@/lib/utils/markdown";

import * as styles from "./BottomNav.css";
import { useBottomNavDrag } from "./useBottomNavDrag";

interface NavTab {
  id: string;
  label: string;
}

interface Props {
  isProject?: boolean;
}

// Pure helper function at module scope to avoid reallocation on render
function getGithubHref(githubLink: string | null | undefined): string {
  if (!githubLink) return "";
  return githubLink.startsWith("http")
    ? githubLink
    : `https://github.com/${githubLink}`;
}

export default function BottomNav({ isProject = false }: Props) {
  const { labels } = useLocale();
  const navLinks = useProjectNavLinks();

  const [windowWidth, setWindowWidth] = useState(() =>
    typeof window === "undefined" ? 1024 : window.innerWidth
  );
  
  const [tabs, setTabs] = useState<NavTab[]>(() => {
    if (!isProject) {
      return [
        { id: "section-intro", label: labels.tabIntro },
        { id: "section-work", label: labels.tabWork },
        { id: "section-skills", label: labels.tabSkills },
        { id: "section-projects", label: labels.tabProjects },
        { id: "section-education", label: labels.tabEducation },
      ];
    }
    return [];
  });
  
  const tabBarRef = useRef<HTMLElement | null>(null);

  const tabIds = tabs.map((t) => t.id);
  
  // Sync tabs when labels changes (e.g. language switch)
  const [prevLabels, setPrevLabels] = useState(labels);
  if (labels !== prevLabels) {
    setPrevLabels(labels);
    if (!isProject) {
      setTabs([
        { id: "section-intro", label: labels.tabIntro },
        { id: "section-work", label: labels.tabWork },
        { id: "section-skills", label: labels.tabSkills },
        { id: "section-projects", label: labels.tabProjects },
        { id: "section-education", label: labels.tabEducation },
      ]);
    }
  }

  useEffect(() => {
    if (typeof window === "undefined" || !isProject) return;

    const setupProjectTabs = () => {
      const headings = Array.from(document.querySelectorAll<HTMLElement>(".project-article h2"));
      if (headings.length > 0) {
        const parsedTabs = headings.map((el, i) => {
          if (!el.id) el.id = slugify(el.textContent || "", i);
          const { main } = parseHeading(el.textContent || "");
          return { id: el.id, label: main };
        });
        setTabs(parsedTabs);
        return true;
      }
      return false;
    };

    if (!setupProjectTabs()) {
      const article = document.querySelector(".project-article");
      if (article) {
        const mutObs = new MutationObserver(() => {
          if (setupProjectTabs()) mutObs.disconnect();
        });
        mutObs.observe(article, { childList: true, subtree: true });
        return () => {
          mutObs.disconnect();
        };
      }
    }
  }, [isProject]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [activeIdManual, setActiveIdManual] = useState<string | null>(null);

  const scrollToTarget = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    let offset = 80;
    if (!isProject) {
      const header = document.querySelector(".sticky-header");
      const headerHeight =
        header instanceof HTMLElement && getComputedStyle(header).display !== "none"
          ? header.offsetHeight
          : 0;
      offset = headerHeight;
    }

    const top = el.getBoundingClientRect().top + getPageScrollY() - offset;

    setIsScrolling(true);
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
      setActiveIdManual(null);
    }, 800);

    scrollPageTo(top);
    setActiveIdManual(id);
  };

  const tabIdsGetter = () => tabIds;
  
  const activeIdFromSpy = useScrollSpy(
    tabIdsGetter,
    {
      threshold: () => (isProject ? 120 : 100),
      isDisabled: () => isDragging || isScrolling,
    },
  );

  const activeId = activeIdManual !== null ? activeIdManual : activeIdFromSpy;
  const activeIndex = tabs.findIndex((t) => t.id === activeId);

  const {
    pillLeft,
    pillWidth,
    isDragging,
    dragOffset,
    dragHoveredId,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  } = useBottomNavDrag({
    tabBarRef,
    activeIndex,
    activeId,
    tabs,
    windowWidth,
    scrollToTarget,
  });

  const resolvedGithubHref = getGithubHref(navLinks?.githubLink);

  if (!isProject) {
    return (
      <nav
        ref={tabBarRef}
        className={`${styles.tabBar} glass-effect`}
        aria-label={labels.navAriaLabel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div
          className={`${styles.activeBg} ${isDragging ? styles.dragging : ""}`}
          style={{
            transform: `translateX(${pillLeft + (isDragging ? dragOffset : 0)}px)`,
            width: `${pillWidth}px`,
          }}
        />

        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${pillButton} ${
              (isDragging ? dragHoveredId === tab.id : activeId === tab.id) ? styles.active : ""
            }`}
            onClick={() => {
              if (!isDragging) scrollToTarget(tab.id);
            }}
            aria-current={activeId === tab.id ? "location" : undefined}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    );
  }

  return (
    <div className={styles.projectNav}>
      <div className={`${styles.islandSlot} ${styles.left}`}>
        <button
          className={`${styles.island} ${styles.circle} ${circleButton} ${styles.backBtn} glass-effect`}
          aria-label="Go back"
          onClick={() => {
            if (typeof window !== "undefined") history.back();
          }}
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>
      </div>

      <div className={`${styles.islandSlot} ${styles.center}`}>
        {tabs.length > 0 && (
          <nav
            ref={tabBarRef}
            className={`${styles.tabBar} ${styles.island} glass-effect`}
            aria-label="Project navigation"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <div
              className={`${styles.activeBg} ${isDragging ? styles.dragging : ""}`}
              style={{
                transform: `translateX(${pillLeft + (isDragging ? dragOffset : 0)}px)`,
                width: `${pillWidth}px`,
              }}
            />

            {tabs.map((section) => (
              <button
                key={section.id}
                className={`${styles.tab} ${pillButton} ${
                  (isDragging ? dragHoveredId === section.id : activeId === section.id)
                    ? styles.active
                    : ""
                }`}
                onClick={() => {
                  if (!isDragging) scrollToTarget(section.id);
                }}
                aria-current={activeId === section.id ? "location" : undefined}
              >
                {section.label}
              </button>
            ))}
          </nav>
        )}
      </div>

      <div className={`${styles.islandSlot} ${styles.right}`}>
        {(resolvedGithubHref || navLinks?.productLink) && (
          <div className={`${styles.island} ${styles.linksPill} glass-effect`}>
            {resolvedGithubHref && (
              <a
                href={resolvedGithubHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className={styles.linkItem}
              >
                <Github width={20} height={20} />
              </a>
            )}
            {navLinks?.productLink && (
              <a
                href={navLinks.productLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit site"
                className={styles.linkItem}
              >
                <Globe width={20} height={20} />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
