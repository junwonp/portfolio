import HomePage from '@/lib/components/HomePage';
import { getDb } from '@/lib/server/db';
import {
  getHomePageData,
  resolveHomeTailoredViewFromSearchParams,
} from '@/lib/server/homePageData';
import { getPortfolioLocale } from '@/lib/server/portfolioLocale';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const locale = await getPortfolioLocale();
  const db = getDb();
  const tailoredView = resolveHomeTailoredViewFromSearchParams(resolvedParams);
  const data = await getHomePageData({ db, locale, tailoredView });

  return (
    <HomePage
      data={data}
    />
  );
}
