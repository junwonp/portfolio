import { PORTFOLIO_URL } from '@/config/site';
import { getApplicationLinkPathname } from '@/lib/utils/applicationSlug';

// Deployment-dependent, so it stays out of the pure slug utility that client
// components import.
export const getApplicationLinkUrl = (slug: string): string =>
  `${PORTFOLIO_URL}${getApplicationLinkPathname(slug)}`;
