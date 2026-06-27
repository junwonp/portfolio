import "./globals.css";

import type { Metadata } from "next";
import { headers } from "next/headers";

import { LocaleProvider } from "@/lib/contexts/LocaleContext";
import { GITHUB_USERNAME,PORTFOLIO_URL } from "@/lib/data/constants";
import { isValidLanguage } from "@/lib/utils/language";
import { getMetadata } from "@/lib/utils/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const localeHeader = headersList.get("x-locale");
  const locale = isValidLanguage(localeHeader) ? localeHeader : "ko";
  const data = getMetadata(locale);

  return {
    metadataBase: new URL(PORTFOLIO_URL),
    title: data.title,
    description: data.description,
    authors: [{ name: "Junwon Park" }],
    alternates: {
      canonical: PORTFOLIO_URL,
      languages: {
        "ko-KR": PORTFOLIO_URL,
        "en-US": PORTFOLIO_URL,
      },
    },
    openGraph: {
      type: "website",
      url: PORTFOLIO_URL,
      title: data.ogTitle,
      description: data.ogDescription,
      images: [
        {
          url: `${PORTFOLIO_URL}/images/preview.webp`,
          width: 2400,
          height: 1260,
          type: "image/webp",
          alt: data.imageAlt,
        },
      ],
      siteName: data.siteName,
      locale: data.locale,
    },
    twitter: {
      card: "summary_large_image",
      title: data.twitterTitle,
      description: data.twitterDescription,
      images: [`${PORTFOLIO_URL}/images/preview.webp`],
      site: `@${GITHUB_USERNAME}`,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const localeHeader = headersList.get("x-locale");
  const cspNonce = headersList.get("x-csp-nonce") ?? undefined;
  const locale = isValidLanguage(localeHeader) ? localeHeader : "ko";

  return (
    <html lang={locale} suppressHydrationWarning>
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
          nonce={cspNonce}
          dangerouslySetInnerHTML={{
            __html: `
              if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.classList.add('dark');
              }
            `,
          }}
        />
        <LocaleProvider initialLocale={locale}>
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
