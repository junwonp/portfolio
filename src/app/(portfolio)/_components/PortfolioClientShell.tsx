'use client';

import type { ReactNode } from 'react';
import { useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';

import AnalyticsTracker from '@/components/analytics/AnalyticsTracker';
import WebVitalsTracker from '@/components/analytics/WebVitalsTracker';
import DeferredFooter from '@/components/portfolio/layout/DeferredFooter';
import DeferredBottomNav from '@/components/portfolio/navigation/DeferredBottomNav';
import { LocaleProvider } from '@/lib/contexts/LocaleContext';
import type { Language } from '@/lib/utils/language';
import { stripLocalePathPrefix } from '@/lib/utils/language';
import { getMetadata } from '@/lib/utils/metadata';

interface PortfolioClientShellProps {
  children: ReactNode;
  locale: Language;
}

const subscribeToHydration = () => () => {};

export function PortfolioClientShell({ children, locale }: PortfolioClientShellProps) {
  const pathname = usePathname();
  const isHydrated = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );
  const clientPathname = isHydrated ? pathname : '';
  const canonicalPathname = stripLocalePathPrefix(clientPathname);
  const isProjectPage = canonicalPathname.startsWith('/projects/');
  const metadata = getMetadata(locale);

  return (
    <LocaleProvider initialLocale={locale}>
      <AnalyticsTracker />
      <WebVitalsTracker />
      <DeferredBottomNav isProject={isProjectPage} />

      <a href="#main-content" className="skip-link">
        {metadata.skipLink}
      </a>

      <div className="wrapper">
        <div className="content-wrapper">
          <main
            id="main-content"
            className={`content ${isProjectPage ? 'is-project' : ''}`}
            tabIndex={-1}
          >
            {children}
          </main>
        </div>
        <div className="footer-wrapper">
          <DeferredFooter />
        </div>
      </div>
    </LocaleProvider>
  );
}
