'use client';

import { ArrowLeft } from 'lucide-react';

import Github from '@/components/ui/icon/Github';
import Globe from '@/components/ui/icon/Globe';
import { circleButton, pillButton } from '@/components/ui/surface.css';
import { getGithubHref } from '@/lib/utils/github';

import * as styles from './BottomNav.css';
import { type NavTab, useNavPill } from './useNavPill';

interface Props {
  githubLink?: string | null;
  productLink?: string | null;
  tabs: NavTab[];
}

export default function ProjectNav({ githubLink, productLink, tabs }: Props) {
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
  } = useNavPill({ isProject: true, tabs });

  const resolvedGithubHref = getGithubHref(githubLink);

  return (
    <div className={styles.projectNav}>
      <div className={`${styles.islandSlot} ${styles.left}`}>
        <button
          className={`${styles.island} ${styles.circle} ${circleButton} ${styles.backBtn} glass-effect`}
          type="button"
          aria-label="Go back"
          onClick={() => {
            if (typeof window !== 'undefined') history.back();
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
              className={`${styles.activeBg} ${isDragging ? styles.dragging : ''}`}
              aria-hidden="true"
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
                    : ''
                }`}
                type="button"
                onClick={() => {
                  if (!isDragging) scrollToTarget(section.id);
                }}
                aria-current={activeId === section.id ? 'location' : undefined}
              >
                {section.label}
              </button>
            ))}
          </nav>
        )}
      </div>

      <div className={`${styles.islandSlot} ${styles.right}`}>
        {(resolvedGithubHref || productLink) && (
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
            {productLink && (
              <a
                href={productLink}
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
