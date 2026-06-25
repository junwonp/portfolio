"use client";

import React, { useEffect, useMemo,useRef, useState } from "react";

import styles from "./BaseSideNav.module.css";

interface NavSection {
  id: string;
  label: string;
}

interface Props {
  sections: NavSection[];
  activeId: string | null;
  onselect: (id: string) => void;
  ariaLabel?: string;
}

export default function BaseSideNav({
  sections,
  activeId,
  onselect,
  ariaLabel = "Page sections",
}: Props) {
  const [windowWidth, setWindowWidth] = useState(() =>
    typeof window === "undefined" ? 0 : window.innerWidth
  );
  const [activeTop, setActiveTop] = useState(0);
  const [activeHeight, setActiveHeight] = useState(0);

  const itemRefs = useRef<(HTMLElement | null)[]>([]);

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

  const activeIndex = useMemo(() => sections.findIndex((s) => s.id === activeId), [sections, activeId]);

  useEffect(() => {
    if (windowWidth > 960 && activeIndex >= 0 && itemRefs.current[activeIndex]) {
      setActiveTop(itemRefs.current[activeIndex]!.offsetTop);
      setActiveHeight(itemRefs.current[activeIndex]!.offsetHeight);
    } else {
      setActiveTop(0);
      setActiveHeight(0);
    }
  }, [windowWidth, activeIndex, sections]);

  return (
    <nav className={styles["side-nav"]} aria-label={ariaLabel}>
      <div className={styles["nav-list-wrapper"]}>
        <div
          className={styles["active-bg"]}
          style={{
            transform: `translateY(${activeTop}px)`,
            height: `${activeHeight}px`,
            opacity: activeId ? 1 : 0,
          }}
        />
        <ul className={styles["nav-list"]}>
          {sections.map((section, i) => (
            <li
              key={section.id}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
            >
              <button
                className={`${styles["nav-item"]} ${activeId === section.id ? styles.active : ""}`}
                onClick={() => {
                  onselect(section.id);
                }}
                aria-current={activeId === section.id ? "location" : undefined}
              >
                <span className={styles["nav-label"]}>{section.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
