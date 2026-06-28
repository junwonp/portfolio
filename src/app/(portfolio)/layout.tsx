import type { ReactNode } from "react";
import type { Metadata } from "next";

import PortfolioShell from "@/app/(portfolio)/PortfolioShell";
import { GITHUB_USERNAME, PORTFOLIO_URL } from "@/lib/data/constants";
import { getPortfolioLocale } from "@/lib/server/portfolioLocale";
import { getMetadata } from "@/lib/utils/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getPortfolioLocale();
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

export default async function PortfolioLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const locale = await getPortfolioLocale();

  return <PortfolioShell locale={locale}>{children}</PortfolioShell>;
}
