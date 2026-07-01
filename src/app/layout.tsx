import "./globals.css";

import type { ReactNode } from "react";
import type { Metadata } from "next";
import { headers } from "next/headers";

import { PORTFOLIO_URL } from "@/lib/data/constants";

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
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <html lang="ko" suppressHydrationWarning>
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
