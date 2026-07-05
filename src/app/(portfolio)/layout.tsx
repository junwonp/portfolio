import type { ReactNode } from "react";
import type { Metadata } from "next";

import PortfolioShell from "@/app/(portfolio)/PortfolioShell";
import { PORTFOLIO_URL } from "@/lib/data/constants";
import { getPortfolioLocale } from "@/lib/server/portfolioLocale";

export const metadata: Metadata = {
  metadataBase: new URL(PORTFOLIO_URL),
  authors: [{ name: "Junwon Park" }],
};

export default async function PortfolioLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const locale = await getPortfolioLocale();

  return <PortfolioShell locale={locale}>{children}</PortfolioShell>;
}
