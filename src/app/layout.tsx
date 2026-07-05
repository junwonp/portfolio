import "./globals.css";

import type { ReactNode } from "react";
import type { Metadata } from "next";
import { headers } from "next/headers";

import { PORTFOLIO_URL } from "@/lib/data/constants";
import { resolvePortfolioLocale } from "@/lib/server/portfolioLocale";

export const metadata: Metadata = {
  metadataBase: new URL(PORTFOLIO_URL),
};

const themeInitializerScript = `
(function () {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark');
  }
})();
`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const headerList = await headers();
  const nonce = headerList.get("x-nonce") ?? undefined;
  const locale = resolvePortfolioLocale(headerList.get("x-locale"));

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          nonce={nonce}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: themeInitializerScript }}
        />
        <link
          rel="preload"
          href="/fonts/WantedSansVariable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
