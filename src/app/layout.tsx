import "@/lib/styles/theme.css";
import "@/lib/styles/typography.css";
import "@/lib/styles/prism.css";
import "./globals.css";

import type { ReactNode } from "react";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { headers } from "next/headers";

import { PORTFOLIO_URL } from "@/config/site";
import { resolvePortfolioLocale } from "@/lib/server/portfolioLocale";

export const metadata: Metadata = {
  metadataBase: new URL(PORTFOLIO_URL),
};

const themeInitializerScript = `
(function () {
  // A stored manual choice wins over the OS setting; otherwise follow the system
  var theme = null;
  try {
    theme = localStorage.getItem('theme');
  } catch (e) {}
  if (
    theme === 'dark' ||
    (theme !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    document.documentElement.classList.add('dark');
  }
})();
`;

const wantedSans = localFont({
  src: [
    {
      path: "./fonts/WantedSansVariable.woff2",
      weight: "400 800",
      style: "normal",
    },
  ],
  variable: "--font-wanted-sans",
  display: "swap",
  preload: true,
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const headerList = await headers();
  const nonce = headerList.get("x-nonce") ?? undefined;
  const locale = resolvePortfolioLocale(headerList.get("x-locale"));

  return (
    <html
      lang={locale}
      className={wantedSans.variable}
      suppressHydrationWarning
    >
      <head>
        <script
          nonce={nonce}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: themeInitializerScript }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
