export type Language = 'ko' | 'en';

export const DEFAULT_LANGUAGE: Language = 'ko';

export const SUPPORTED_LANGUAGES: Language[] = ['ko', 'en'];

export const isValidLanguage = (value: unknown): value is Language => {
  return value === 'ko' || value === 'en';
};

const localePathPrefixPattern = /^\/(ko|en)(?=\/|$)/;

const normalizePathname = (pathname: string): string => {
  if (!pathname) return '/';

  return pathname.startsWith('/') ? pathname : `/${pathname}`;
};

export const resolveLocaleFromPathname = (pathname: string): Language => {
  const normalizedPathname = normalizePathname(pathname);
  const locale = normalizedPathname.match(localePathPrefixPattern)?.[1];

  return isValidLanguage(locale) ? locale : DEFAULT_LANGUAGE;
};

export const stripLocalePathPrefix = (pathname: string): string => {
  const normalizedPathname = normalizePathname(pathname);
  const strippedPathname = normalizedPathname.replace(localePathPrefixPattern, '');

  return strippedPathname || '/';
};

export const getLocalizedPathname = (pathname: string, locale: Language): string => {
  const strippedPathname = stripLocalePathPrefix(pathname);

  if (locale === DEFAULT_LANGUAGE) {
    return strippedPathname;
  }

  return strippedPathname === '/' ? `/${locale}` : `/${locale}${strippedPathname}`;
};
