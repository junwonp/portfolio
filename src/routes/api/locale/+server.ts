import { json } from '@sveltejs/kit';

import type { Language } from '$lib/utils/language';

import type { RequestHandler } from './$types';

const LANGUAGE_COOKIE = 'preferred-language';

export const POST: RequestHandler = async ({ request, cookies, url }) => {
  const body = (await request.json()) as { locale?: unknown };

  if (!body.locale || (body.locale !== 'ko' && body.locale !== 'en')) {
    return json({ error: 'Invalid locale' }, { status: 400 });
  }

  const locale = body.locale as Language;

  cookies.set(LANGUAGE_COOKIE, locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    secure: url.protocol === 'https:',
  });

  return json({ success: true, locale });
};
