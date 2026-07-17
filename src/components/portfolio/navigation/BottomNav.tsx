"use client";

import React, { useCallback,useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";

import Github from "@/components/ui/Icon/Github";
import Globe from "@/components/ui/Icon/Globe";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { getPageScrollY, scrollPageTo,useScrollSpy } from "@/lib/hooks/useScrollSpy";
import { useProjectNavLinks } from "@/lib/stores/bottomNav";
import { parseHeading, slugify } from "@/lib/utils/markdown";

import styles from "./BottomNav.module.css";

interface NavTab {
  id: string;
  label: string;
}

interface Props {
  isProject?: boolean;
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

  const tabIds = useMemo(() => tabs.map((t) => t.id), [tabs]);
  const activeIdFromSpy = useScrollSpy(
    useCallback(() => tabIds, [tabIds]),
    {
      threshold: () => (isProject ? 120 : 100),
      isDisabled: () => isDragging || isScrolling,
    },
  );

  const [activeIdManual, setActiveIdManual] = useState<string | null>(null);
  const activeId = activeIdManual !== null ? activeIdManual : activeIdFromSpy;

  const activeIndex = useMemo(() => tabs.findIndex((t) => t.id === activeId), [tabs, activeId]);

  const [pillLeft, setPillLeft] = useState(0);
  const [pillWidth, setPillWidth] = useState(0);

  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [dragHoveredId, setDragHoveredId] = useState<string | null>(null);

  const dragStartXRef = useRef(0);
  const pillLeftBeforeDragRef = useRef(0);

  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  useEffect(() => {
    if (isDragging || windowWidth <= 0 || !tabBarRef.current || activeIndex < 0) return;

    const el = tabBarRef.current;
    const tid = requestAnimationFrame(() => {
      const tabEls = el.querySelectorAll<HTMLElement>("." + styles.tab);
      const activeEl = tabEls[activeIndex] as HTMLElement | undefined;
      if (!activeEl) return;
      setPillLeft(activeEl.offsetLeft);
      setPillWidth(activeEl.offsetWidth);
    });

    return () => {
      cancelAnimationFrame(tid);
    };
  }, [activeIndex, isDragging, windowWidth, tabs]);

  const scrollToTarget = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    let offset = 80;
    if (!isProject) {
      const header = document.querySelector(".sticky-header");
      const headerHeight =
        header instanceof HTMLElement && header.classList.contains("visible")
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
  }, [isProject, setIsScrolling, setActiveIdManual]);

  const handlePointerDown = (e: React.PointerEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;
    const isActiveArea =
      target.classList.contains(styles["active-bg"]) ||
      target.classList.contains(styles.active) ||
      target.closest("." + styles.active);

    if (isActiveArea && tabBarRef.current) {
      e.preventDefault();
      setIsDragging(true);
      dragStartXRef.current = e.clientX;
      pillLeftBeforeDragRef.current = pillLeft;
      setDragOffset(0);
      setDragHoveredId(activeId);
      tabBarRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!isDragging || !tabBarRef.current) return;

    const rawOffset = e.clientX - dragStartXRef.current;
    const newLeft = pillLeftBeforeDragRef.current + rawOffset;
    const minLeft = 4;
    const maxLeftAllowed = tabBarRef.current.offsetWidth - pillWidth - 4;

    let finalOffset = rawOffset;
    if (newLeft < minLeft) finalOffset = minLeft - pillLeftBeforeDragRef.current;
    else if (newLeft > maxLeftAllowed) finalOffset = maxLeftAllowed - pillLeftBeforeDragRef.current;

    setDragOffset(finalOffset);

    const currentPillCenter = pillLeftBeforeDragRef.current + finalOffset + pillWidth / 2;
    let closestId = activeId;
    let minDistance = Infinity;
    const tabEls = Array.from(tabBarRef.current.querySelectorAll<HTMLElement>("." + styles.tab));

    tabEls.forEach((el, i) => {
      const center = el.offsetLeft + el.offsetWidth / 2;
      const dist = Math.abs(center - currentPillCenter);
      if (dist < minDistance) {
        minDistance = dist;
        closestId = tabs[i].id;
      }
    });
    setDragHoveredId(closestId);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLElement>) => {
    if (!isDragging) return;
    setIsDragging(false);

    if (tabBarRef.current && tabBarRef.current.hasPointerCapture(e.pointerId)) {
      tabBarRef.current.releasePointerCapture(e.pointerId);
    }

    const finalRawOffset = e.clientX - dragStartXRef.current;
    setDragHoveredId(null);

    if (!tabBarRef.current) {
      setDragOffset(0);
      return;
    }

    if (Math.abs(finalRawOffset) > 5) {
      const captureClick = (evt: MouseEvent) => {
        evt.stopPropagation();
      };
      tabBarRef.current.addEventListener("click", captureClick, { capture: true, once: true });
    }

    const currentLeft = pillLeftBeforeDragRef.current + dragOffset;
    const pillCenter = currentLeft + pillWidth / 2;
    const tabEls = Array.from(tabBarRef.current.querySelectorAll<HTMLElement>("." + styles.tab));
    let targetId = activeId;
    let targetIdx = activeIndex;
    let minDist = Infinity;

    tabEls.forEach((el, i) => {
      const center = el.offsetLeft + el.offsetWidth / 2;
      const dist = Math.abs(center - pillCenter);
      if (dist < minDist) {
        minDist = dist;
        targetId = tabs[i].id;
        targetIdx = i;
      }
    });

    const targetEl = tabEls[targetIdx];
    if (targetEl) {
      setPillLeft(targetEl.offsetLeft);
      setPillWidth(targetEl.offsetWidth);
    }
    setDragOffset(0);

    if (targetId !== activeId) {
      scrollToTarget(targetId);
    }
  };

  const resolvedGithubHref = useMemo(() => {
    if (!navLinks?.githubLink) return "";
    return navLinks.githubLink.startsWith("http")
      ? navLinks.githubLink
      : `https://github.com/${navLinks.githubLink}`;
  }, [navLinks]);

  if (!isProject) {
    return (
      <nav
        ref={tabBarRef}
        className={`${styles["tab-bar"]} glass-effect`}
        aria-label={labels.navAriaLabel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div
          className={`${styles["active-bg"]} ${isDragging ? styles.dragging : ""}`}
          style={{
            transform: `translateX(${pillLeft + (isDragging ? dragOffset : 0)}px)`,
            width: `${pillWidth}px`,
          }}
        />

        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${
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
    <div className={styles["project-nav"]}>
      <div className={`${styles["island-slot"]} ${styles.left}`}>
        <button
          className={`${styles.island} ${styles.circle} ${styles["back-btn"]} glass-effect`}
          aria-label="Go back"
          onClick={() => {
            if (typeof window !== "undefined") history.back();
          }}
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>
      </div>

      <div className={`${styles["island-slot"]} ${styles.center}`}>
        {tabs.length > 0 && (
          <nav
            ref={tabBarRef}
            className={`${styles["tab-bar"]} ${styles.island} glass-effect`}
            aria-label="Project navigation"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <div
              className={`${styles["active-bg"]} ${isDragging ? styles.dragging : ""}`}
              style={{
                transform: `translateX(${pillLeft + (isDragging ? dragOffset : 0)}px)`,
                width: `${pillWidth}px`,
              }}
            />

            {tabs.map((section) => (
              <button
                key={section.id}
                className={`${styles.tab} ${
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

      <div className={`${styles["island-slot"]} ${styles.right}`}>
        {(resolvedGithubHref || navLinks?.productLink) && (
          <div className={`${styles.island} ${styles["links-pill"]} glass-effect`}>
            {resolvedGithubHref && (
              <a
                href={resolvedGithubHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className={styles["link-item"]}
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
                className={styles["link-item"]}
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
