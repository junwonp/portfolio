import type { ReactNode } from 'react';
import React from 'react';

import styles from './PortfolioContentLayout.module.css';

interface PortfolioContentLayoutProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  desktopHeader?: ReactNode;
  mobileHeader?: ReactNode;
  sideNav?: ReactNode;
}

function cx(...classNames: Array<string | false | null | undefined>): string {
  return classNames.filter(Boolean).join(' ');
}

export default function PortfolioContentLayout({
  children,
  className,
  contentClassName,
  desktopHeader,
  mobileHeader,
  sideNav,
}: PortfolioContentLayoutProps) {
  const hasDesktopHeader =
    desktopHeader !== null && desktopHeader !== undefined && desktopHeader !== false;
  const hasMobileHeader =
    mobileHeader !== null && mobileHeader !== undefined && mobileHeader !== false;
  const hasSideNav = sideNav !== null && sideNav !== undefined && sideNav !== false;

  return (
    <article
      className={cx(styles.surface, hasDesktopHeader && styles['has-desktop-header'], className)}
      data-portfolio-layout="true"
    >
      {hasMobileHeader && (
        <div className={styles['mobile-header-slot']} data-layout-slot="mobile-header">
          {mobileHeader}
        </div>
      )}

      {hasDesktopHeader && (
        <header className={styles['desktop-header']} data-layout-slot="desktop-header">
          {desktopHeader}
        </header>
      )}

      <div className={styles.layout}>
        {hasSideNav && (
          <aside className={styles['nav-wrapper']} data-layout-slot="side-nav">
            {sideNav}
          </aside>
        )}

        <div className={styles['main-content']} data-layout-slot="main-content">
          <div className={cx(styles.content, contentClassName)}>{children}</div>
        </div>
      </div>
    </article>
  );
}
