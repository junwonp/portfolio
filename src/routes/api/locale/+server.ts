import { json } from '@sveltejs/kit';

import { isValidLanguage } from '$lib/utils/language';

import type { RequestHandler } from './$types';

const LANGUAGE_COOKIE = 'preferred-language';

export const POST: RequestHandler = async ({ request, cookies, url }) => {
  const body: unknown = await request.json();
  const locale = typeof body === 'object' && body !== null ? (body as Record<string, unknown>).locale : undefined;

  if (!isValidLanguage(locale)) {
    return json({ error: 'Invalid locale' }, { status: 400 });
  }

  cookies.set(LANGUAGE_COOKIE, locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
    secure: url.protocol === 'https:',
  });

  return json({ success: true, locale });
};
