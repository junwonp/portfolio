"use client";

import React from "react";
import { usePathname } from "next/navigation";

import AnalyticsTracker from "@/lib/components/AnalyticsTracker";
import BottomNav from "@/lib/components/BottomNav";
import Footer from "@/lib/components/Footer";
import ReadingProgress from "@/lib/components/ReadingProgress";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { getMetadata } from "@/lib/utils/metadata";

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { locale } = useLocale();

  const isAdminPage = pathname.startsWith("/admin");
  const isProjectPage = pathname.startsWith("/projects/");
  const metadata = getMetadata(locale);

  return (
    <>
      <AnalyticsTracker />
      {!isAdminPage && (
        <>
          <ReadingProgress />
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
    </>
  );
}
