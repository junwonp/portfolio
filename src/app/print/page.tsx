import type { Metadata } from 'next';

import PrintablePortfolio from '@/components/print/PrintablePortfolio';

export const metadata: Metadata = {
  title: '박준원 포트폴리오',
  description: '박준원 포트폴리오 PDF 안내 문서입니다.',
  robots: {
    index: false,
    follow: false,
  },
};

interface PrintPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PrintPage({ searchParams }: PrintPageProps) {
  const resolvedSearchParams = await searchParams;
  const slug = typeof resolvedSearchParams.slug === 'string' ? resolvedSearchParams.slug : undefined;

  return <PrintablePortfolio slug={slug} />;
}
