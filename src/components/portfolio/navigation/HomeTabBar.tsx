'use client';

import { pillButton } from '@/components/ui/surface.css';

import * as styles from './BottomNav.css';
import { type NavTab, useNavPill } from './useNavPill';

interface Props {
  ariaLabel: string;
  tabs: NavTab[];
}

export default function HomeTabBar({ ariaLabel, tabs }: Props) {
  const {
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
  } = useNavPill({ isProject: false, tabs });

  return (
    <nav
      ref={tabBarRef}
      className={`${styles.tabBar} glass-effect`}
      aria-label={ariaLabel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div
        className={`${styles.activeBg} ${isDragging ? styles.dragging : ''}`}
        aria-hidden="true"
        style={{
          transform: `translateX(${pillLeft + (isDragging ? dragOffset : 0)}px)`,
          width: `${pillWidth}px`,
        }}
      />

      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`${styles.tab} ${pillButton} ${
            (isDragging ? dragHoveredId === tab.id : activeId === tab.id) ? styles.active : ''
          }`}
          type="button"
          onClick={() => {
            if (!isDragging) scrollToTarget(tab.id);
          }}
          aria-current={activeId === tab.id ? 'location' : undefined}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
