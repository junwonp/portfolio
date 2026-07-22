import React, { useEffect, useRef, useState } from "react";

import * as styles from "./BottomNav.css";

interface NavTab {
  id: string;
  label: string;
}

interface UseBottomNavDragProps {
  tabBarRef: React.RefObject<HTMLElement | null>;
  activeIndex: number;
  activeId: string | null;
  tabs: NavTab[];
  windowWidth: number;
  scrollToTarget: (id: string) => void;
}

export function useBottomNavDrag({
  tabBarRef,
  activeIndex,
  activeId,
  tabs,
  windowWidth,
  scrollToTarget,
}: UseBottomNavDragProps) {
  const [pillLeft, setPillLeft] = useState(0);
  const [pillWidth, setPillWidth] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [dragHoveredId, setDragHoveredId] = useState<string | null>(null);

  const dragStartXRef = useRef(0);
  const pillLeftBeforeDragRef = useRef(0);

  useEffect(() => {
    if (isDragging || windowWidth <= 0 || !tabBarRef.current || activeIndex < 0) return;

    const el = tabBarRef.current;
    const tid = requestAnimationFrame(() => {
      const tabEls = el.querySelectorAll<HTMLElement>("." + styles.tab);
      const activeEl = tabEls[activeIndex] as HTMLElement | undefined;
      if (activeEl) {
        const left = activeEl.offsetLeft;
        const width = activeEl.offsetWidth;
        setPillLeft(left);
        setPillWidth(width);
      }
    });

    return () => cancelAnimationFrame(tid);
  }, [activeIndex, windowWidth, isDragging, tabBarRef]);

  const canDragFromTarget = (target: HTMLElement | null): boolean => {
    if (!target) return false;
    return Boolean(
      target.classList.contains(styles.activeBg) ||
      target.classList.contains(styles.active) ||
      target.closest("." + styles.active)
    );
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLElement>) => {
    const target = e.target as HTMLElement;

    if (canDragFromTarget(target) && tabBarRef.current) {
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

    if (targetId !== null && targetId !== activeId) {
      scrollToTarget(targetId);
    }
  };

  return {
    pillLeft,
    pillWidth,
    isDragging,
    dragOffset,
    dragHoveredId,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}
