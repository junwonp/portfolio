import { json } from '@sveltejs/kit';

import { LANGUAGE_COOKIE } from '$lib/data/constants';
import { getLocaleCookieOptions, isValidLanguage } from '$lib/utils/language';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies, url }) => {
  const body: unknown = await request.json();
  const locale =
    typeof body === 'object' && body !== null
      ? (body as Record<string, unknown>).locale
      : undefined;

  if (!isValidLanguage(locale)) {
    return json({ error: 'Invalid locale' }, { status: 400 });
  }

  cookies.set(LANGUAGE_COOKIE, locale, getLocaleCookieOptions(url.protocol === 'https:'));

  return json({ success: true, locale });
};
