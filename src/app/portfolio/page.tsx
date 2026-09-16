import type { Metadata } from 'next';

import PortfolioDocument from '@/components/portfolio-document/PortfolioDocument';
import { buildPortfolioDocument } from '@/lib/portfolio/documentProjection';
import { DEFAULT_LANGUAGE, isValidLanguage } from '@/lib/utils/language';

export const metadata: Metadata = {
  title: '박준원 포트폴리오',
  description: '박준원의 프로젝트 경력과 성과를 정리한 인쇄용 포트폴리오 문서입니다.',
  robots: {
    index: false,
    follow: false,
  },
};

interface PortfolioPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PortfolioPage({ searchParams }: PortfolioPageProps) {
  const resolvedSearchParams = await searchParams;
  const lang = isValidLanguage(resolvedSearchParams.lang)
    ? resolvedSearchParams.lang
    : DEFAULT_LANGUAGE;

  return <PortfolioDocument document={buildPortfolioDocument(lang)} />;
}
