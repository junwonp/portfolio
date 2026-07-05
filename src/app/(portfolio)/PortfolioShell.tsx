'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

import AnalyticsTracker from '@/lib/components/AnalyticsTracker';
import DeferredBottomNav from '@/lib/components/DeferredBottomNav';
import DeferredFooter from '@/lib/components/DeferredFooter';
import WebVitalsTracker from '@/lib/components/WebVitalsTracker';
import { LocaleProvider } from '@/lib/contexts/LocaleContext';
import type { Language } from '@/lib/utils/language';
import { stripLocalePathPrefix } from '@/lib/utils/language';
import { getMetadata } from '@/lib/utils/metadata';

export default function PortfolioShell({
  children,
  locale,
}: {
  children: ReactNode;
  locale: Language;
}) {
  const pathname = usePathname();
  const canonicalPathname = stripLocalePathPrefix(pathname);
  const isAdminPage = canonicalPathname.startsWith('/admin');
  const isProjectPage = canonicalPathname.startsWith('/projects/');
  const metadata = getMetadata(locale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <LocaleProvider initialLocale={locale}>
      <AnalyticsTracker />
      <WebVitalsTracker />
      {!isAdminPage && (
        <>
          <DeferredBottomNav isProject={isProjectPage} />
        </>
      )}

      <a href="#main-content" className="skip-link">
        {metadata.skipLink}
      </a>

      <div className={`wrapper ${isAdminPage ? 'is-admin' : ''}`}>
        <div className="content-wrapper">
          <main
            id="main-content"
            className={`content ${isProjectPage ? 'is-project' : ''}`}
            tabIndex={-1}
          >
            {children}
          </main>
        </div>
        {!isAdminPage && (
          <div className="footer-wrapper">
            <DeferredFooter />
          </div>
        )}
      </div>
    </LocaleProvider>
  );
}
