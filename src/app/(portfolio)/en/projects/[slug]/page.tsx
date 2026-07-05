import type { Metadata } from 'next';

import {
  getProjectPageMetadata,
  renderProjectDetailRoute,
} from '../../../portfolioRouteViews';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return getProjectPageMetadata({ locale: 'en', slug });
}

export default async function ProjectDetail({ params }: PageProps) {
  const { slug } = await params;
  return renderProjectDetailRoute({ locale: 'en', slug });
}
