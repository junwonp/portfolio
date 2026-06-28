import { cache } from 'react';
import { headers } from 'next/headers';

import { isValidLanguage } from '@/lib/utils/language';

export const resolvePortfolioLocale = (value: unknown) => {
  return isValidLanguage(value) ? value : 'ko';
};

export const getPortfolioLocale = cache(async () => {
  const headerList = await headers();
  return resolvePortfolioLocale(headerList.get('x-locale'));
});
