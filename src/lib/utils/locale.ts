import { page } from '$app/state';
import type { Language } from '$lib/utils/language';

export const getPageLocale = (): Language => (page.data.locale as Language | undefined) ?? 'en';
