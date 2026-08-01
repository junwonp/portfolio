import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PortfolioClientShell } from '@/app/(portfolio)/_components/PortfolioClientShell';
import { PORTFOLIO_URL } from '@/config/site';
import { isValidLanguage } from '@/lib/utils/language';
import { metadataMap } from '@/lib/utils/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  if (!isValidLanguage(locale)) {
    return {};
  }

  const content = metadataMap[locale];
  return {
    metadataBase: new URL(PORTFOLIO_URL),
    authors: [{ name: content.authorName }],
  };
}

interface PortfolioLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function PortfolioLayout({ children, params }: PortfolioLayoutProps) {
  const { locale } = await params;

  if (!isValidLanguage(locale)) {
    notFound();
  }

  return <PortfolioClientShell locale={locale}>{children}</PortfolioClientShell>;
}
