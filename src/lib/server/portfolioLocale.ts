import { cache } from 'react';
import { headers } from 'next/headers';

import { isValidLanguage } from '@/lib/utils/language';

export const resolvePortfolioLocale = (value: unknown) => {
  return isValidLanguage(value) ? value : 'ko';
};

