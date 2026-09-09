import { headers } from 'next/headers';
import { cache } from 'react';

import { isValidLanguage } from '@/lib/utils/language';

export const resolvePortfolioLocale = (value: unknown) => {
  return isValidLanguage(value) ? value : 'ko';
};
