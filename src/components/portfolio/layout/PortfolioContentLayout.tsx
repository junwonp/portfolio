import type { ReactNode } from 'react';
import React from 'react';

import * as styles from './PortfolioContentLayout.css';

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
      className={cx(styles.surface, hasDesktopHeader && styles.hasDesktopHeader, className)}
      data-portfolio-layout="true"
    >
      {hasMobileHeader && (
        <div className={styles.mobileHeaderSlot} data-layout-slot="mobile-header">
          {mobileHeader}
        </div>
      )}

      {hasDesktopHeader && (
        <header className={styles.desktopHeader} data-layout-slot="desktop-header">
          {desktopHeader}
        </header>
      )}

      <div className={styles.layout}>
        {hasSideNav && (
          <aside className={styles.navWrapper} data-layout-slot="side-nav">
            {sideNav}
          </aside>
        )}

        <div className={styles.mainContent} data-layout-slot="main-content">
          <div className={cx(styles.content, contentClassName)}>{children}</div>
        </div>
      </div>
    </article>
  );
}
