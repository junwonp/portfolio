"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

import AnalyticsTracker from "@/lib/components/AnalyticsTracker";
import BottomNav from "@/lib/components/BottomNav";
import Footer from "@/lib/components/Footer";
import { LocaleProvider } from "@/lib/contexts/LocaleContext";
import type { Language } from "@/lib/utils/language";
import { getMetadata } from "@/lib/utils/metadata";

export default function PortfolioShell({
  children,
  locale,
}: {
  children: ReactNode;
  locale: Language;
}) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");
  const isProjectPage = pathname.startsWith("/projects/");
  const metadata = getMetadata(locale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <LocaleProvider initialLocale={locale}>
      <AnalyticsTracker />
      {!isAdminPage && (
        <>
          <BottomNav isProject={isProjectPage} />
        </>
      )}

      <a href="#main-content" className="skip-link">
        {metadata.skipLink}
      </a>

      <div className={`wrapper ${isAdminPage ? "is-admin" : ""}`}>
        <div className="content-wrapper">
          <main
            id="main-content"
            className={`content ${isProjectPage ? "is-project" : ""}`}
            tabIndex={-1}
          >
            {children}
          </main>
        </div>
        {!isAdminPage && (
          <div className="footer-wrapper">
            <Footer />
          </div>
        )}
      </div>
    </LocaleProvider>
  );
}
