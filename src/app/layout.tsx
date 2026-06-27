import "./globals.css";

import type { ReactNode } from "react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL("https://junwonpark.dev"),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const nonce = (await headers()).get("x-nonce");

  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <Script
          src="/theme-initializer.js"
          strategy="beforeInteractive"
          nonce={nonce ?? undefined}
        />
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
        {children}
      </body>
    </html>
  );
}
