import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import HomePage from '@/components/portfolio/home/HomePage';
import {
  createHomePageData,
  resolveHomeTailoredViewFromSearchParams,
} from '@/lib/portfolio/homePage';
import { getHomeMetadata } from '@/lib/portfolio/metadata';
import { isValidLanguage } from '@/lib/utils/language';

interface HomePageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isValidLanguage(locale)) {
    notFound();
  }

  return getHomeMetadata(locale);
}

export default async function Home({ params, searchParams }: HomePageProps) {
  const [{ locale }, resolvedSearchParams] = await Promise.all([params, searchParams]);

  if (!isValidLanguage(locale)) {
    notFound();
  }

  const tailoredView = resolveHomeTailoredViewFromSearchParams(resolvedSearchParams);
  const data = createHomePageData({ locale, tailoredView });

  return <HomePage data={data} />;
}
