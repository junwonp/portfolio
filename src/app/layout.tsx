import "./globals.css";

import type { ReactNode } from "react";
import type { Metadata } from "next";

import { THEME_INITIALIZER_SCRIPT } from "@/lib/security/themeInitializer";

export const metadata: Metadata = {
  metadataBase: new URL("https://junwonpark.dev"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href="/fonts/WantedSansVariable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/GeistMono[wght].woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <script
          id="theme-initializer"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: THEME_INITIALIZER_SCRIPT,
          }}
        />
        {children}
      </body>
    </html>
  );
}
