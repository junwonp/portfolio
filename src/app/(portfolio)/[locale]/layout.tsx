import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PortfolioClientShell } from '@/app/(portfolio)/_components/PortfolioClientShell';
import { PORTFOLIO_URL } from '@/config/site';
import { isValidLanguage } from '@/lib/utils/language';

export const metadata: Metadata = {
  metadataBase: new URL(PORTFOLIO_URL),
  authors: [{ name: 'Junwon Park' }],
};

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
