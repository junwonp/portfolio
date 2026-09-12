'use client';

import { useEffect, useRef, useState } from 'react';

import { getPageScrollY, scrollPageTo, useScrollSpy } from '@/lib/hooks/useScrollSpy';

import { useBottomNavDrag } from './useBottomNavDrag';

export interface NavTab {
  id: string;
  label: string;
}

interface UseNavPillOptions {
  isProject: boolean;
  tabs: NavTab[];
}

export function useNavPill({ isProject, tabs }: UseNavPillOptions) {
  const [windowWidth, setWindowWidth] = useState(() =>
    typeof window === 'undefined' ? 1024 : window.innerWidth,
  );

  const tabBarRef = useRef<HTMLElement | null>(null);

  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [activeIdManual, setActiveIdManual] = useState<string | null>(null);

  const scrollToTarget = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    let offset = 80;
    if (!isProject) {
      const header = document.querySelector('.sticky-header');
      const headerHeight =
        header instanceof HTMLElement && getComputedStyle(header).display !== 'none'
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

  const tabIds = tabs.map((tab) => tab.id);

  const activeIdFromSpy = useScrollSpy(() => tabIds, {
    threshold: () => (isProject ? 120 : 100),
    isDisabled: () => isDragging || isScrolling,
  });

  const activeId = activeIdManual !== null ? activeIdManual : activeIdFromSpy;
  const activeIndex = tabs.findIndex((tab) => tab.id === activeId);

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

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(
    () => () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    },
    [],
  );

  return {
    tabBarRef,
    activeId,
    scrollToTarget,
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
