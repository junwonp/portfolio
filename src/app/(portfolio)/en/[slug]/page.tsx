import { renderShortUrlRoute } from '../../portfolioRouteViews';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ShortUrlPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  return renderShortUrlRoute({ locale: 'en', slug });
}
