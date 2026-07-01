import type { ReactNode } from "react";
import type { Metadata } from "next";

import PortfolioShell from "@/app/(portfolio)/PortfolioShell";
import { GITHUB_USERNAME, PORTFOLIO_URL } from "@/lib/data/constants";
import { getPortfolioLocale } from "@/lib/server/portfolioLocale";
import { metadataMap } from "@/lib/utils/metadata";

const defaultMetadata = metadataMap.en;

export const metadata: Metadata = {
  metadataBase: new URL(PORTFOLIO_URL),
  title: defaultMetadata.title,
  description: defaultMetadata.description,
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
    title: defaultMetadata.ogTitle,
    description: defaultMetadata.ogDescription,
    images: [
      {
        url: `${PORTFOLIO_URL}/images/preview.webp`,
        width: 2400,
        height: 1260,
        type: "image/webp",
        alt: defaultMetadata.imageAlt,
      },
    ],
    siteName: defaultMetadata.siteName,
    locale: defaultMetadata.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: defaultMetadata.twitterTitle,
    description: defaultMetadata.twitterDescription,
    images: [`${PORTFOLIO_URL}/images/preview.webp`],
    site: `@${GITHUB_USERNAME}`,
  },
};

export default async function PortfolioLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const locale = await getPortfolioLocale();

  return <PortfolioShell locale={locale}>{children}</PortfolioShell>;
}
