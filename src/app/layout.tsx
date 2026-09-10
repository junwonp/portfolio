import '@/lib/styles/theme.css';
import '@/lib/styles/fonts.generated.css';
import '@/lib/styles/typography.css';
import '@/lib/styles/prism.css';
import './globals.css';

import type { Metadata } from 'next';
import { headers } from 'next/headers';
import type { ReactNode } from 'react';

import { PORTFOLIO_URL } from '@/config/site';
import { resolvePortfolioLocale } from '@/lib/server/portfolioLocale';

export const metadata: Metadata = {
  metadataBase: new URL(PORTFOLIO_URL),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  // The proxy resolves the request locale and forwards it; this keeps SSR
  // <html lang> correct per locale (crawlers/screen readers) without blocking
  // prerendering of the static project pages.
  const headerList = await headers();
  const locale = resolvePortfolioLocale(headerList.get('x-locale'));

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script src="/theme-initializer.js" />
      </head>
      <body>{children}</body>
    </html>
  );
}
