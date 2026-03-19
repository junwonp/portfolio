import { page } from '$app/state';
import { getLabels, type Labels } from '$lib/data/labels';
import type { Language } from '$lib/utils/language';

export const getPageLocale = (): Language => (page.data.locale as Language | undefined) ?? 'en';

export const getPageLabels = (): Labels => getLabels(getPageLocale());
