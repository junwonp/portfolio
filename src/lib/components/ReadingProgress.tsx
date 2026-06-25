"use client";

import React, { useEffect,useState } from "react";

import { getPageScrollElement, getPageScrollHeight, getPageScrollY } from "@/lib/hooks/useScrollSpy";

import styles from "./ReadingProgress.module.css";

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    function update() {
      const scrollEl = getPageScrollElement();
      // clientHeight might not be available on empty or SSR elements immediately
      const clientHeight = scrollEl.clientHeight || window.innerHeight;
      const maxScrollY = getPageScrollHeight() - clientHeight;
      setProgress(maxScrollY > 0 ? (getPageScrollY() / maxScrollY) * 100 : 0);
    }

    const scrollElement = getPageScrollElement();

    // Check if element has addEventListener method
    if (scrollElement && typeof scrollElement.addEventListener === "function") {
      scrollElement.addEventListener("scroll", update, { passive: true });
    }
    window.addEventListener("scroll", update, { passive: true });
    update();

    return () => {
      if (scrollElement && typeof scrollElement.removeEventListener === "function") {
        scrollElement.removeEventListener("scroll", update);
      }
      window.removeEventListener("scroll", update);
    };
  }, []);

  return (
    <div className={styles["progress-bar"]} style={{ width: `${progress}%` }} />
  );
}
