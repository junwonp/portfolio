import type { ContentOverrideArea } from '@/lib/server/editableContentStore';
import type { Language } from '@/lib/utils/language';
import { isValidLanguage } from '@/lib/utils/language';

interface ContentOverrideRequestBody {
  area: ContentOverrideArea;
  locale: Language;
  payload: unknown;
  targetKey: string;
}

type ParseContentOverrideRequestResult =
  | { ok: true; value: ContentOverrideRequestBody }
  | { error: string; ok: false };

const VALID_AREAS = new Set<ContentOverrideArea>(['home', 'project-detail']);
const TARGET_KEY_PATTERN = /^[a-zA-Z0-9:_-]{1,160}$/;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

export const parseContentOverrideRequest = (body: unknown): ParseContentOverrideRequestResult => {
  if (!isRecord(body)) {
    return { error: 'Invalid request body', ok: false };
  }

  const { area, locale, payload, targetKey } = body;

  if (typeof area !== 'string' || !VALID_AREAS.has(area as ContentOverrideArea)) {
    return { error: 'Invalid content area', ok: false };
  }

  if (!isValidLanguage(locale)) {
    return { error: 'Invalid locale', ok: false };
  }

  if (typeof targetKey !== 'string' || !TARGET_KEY_PATTERN.test(targetKey)) {
    return { error: 'Invalid target key', ok: false };
  }

  return {
    ok: true,
    value: {
      area: area as ContentOverrideArea,
      locale,
      payload,
      targetKey,
    },
  };
};
