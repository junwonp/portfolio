import { getHomeMetadata, renderHomeRoute } from '../portfolioRouteViews';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const metadata = getHomeMetadata('en');

export default async function Home({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  return renderHomeRoute({ locale: 'en', searchParams: resolvedParams });
}
