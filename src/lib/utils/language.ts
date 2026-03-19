export type Language = 'ko' | 'en';

export const isValidLanguage = (value: unknown): value is Language => {
  return value === 'ko' || value === 'en';
};

export const detectLanguageFromHeader = (acceptLanguage: string | null): Language => {
  if (!acceptLanguage) {
    return 'en';
  }

  const languages = acceptLanguage
    .split(',')
    .map((lang) => {
      const [code, q = 'q=1'] = lang.trim().split(';');
      const quality = parseFloat(q.replace('q=', ''));
      return { code: code.toLowerCase().split('-')[0], quality };
    })
    .sort((a, b) => b.quality - a.quality);

  for (const lang of languages) {
    if (lang.code === 'ko') {
      return 'ko';
    }
  }

  return 'en';
};
