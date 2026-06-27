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
const MAX_JSON_PAYLOAD_LENGTH = 100_000;
const HOME_TARGET_KEYS = new Set([
  'archives',
  'education',
  'introduction',
  'otherExperiences',
  'skills',
  'workExperiences',
]);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string');

const isHomePayloadValid = (targetKey: string, payload: unknown): boolean => {
  if (!HOME_TARGET_KEYS.has(targetKey)) {
    return false;
  }

  if (targetKey === 'introduction') {
    return isRecord(payload);
  }

  return Array.isArray(payload);
};

const isProjectDetailPayloadValid = (targetKey: string, payload: unknown): boolean => {
  if (!isRecord(payload)) {
    return false;
  }

  if (targetKey.endsWith('::techStack')) {
    return isStringArray(payload.list);
  }

  return typeof payload.markdown === 'string' && payload.markdown.trim().length > 0;
};

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

  let serializedPayload: string;
  try {
    serializedPayload = JSON.stringify(payload);
  } catch {
    return { error: 'Payload must be serializable JSON', ok: false };
  }

  if (serializedPayload.length > MAX_JSON_PAYLOAD_LENGTH) {
    return { error: 'Payload is too large', ok: false };
  }

  if (area === 'home' && !isHomePayloadValid(targetKey, payload)) {
    return { error: 'Invalid home override payload', ok: false };
  }

  if (area === 'project-detail' && !isProjectDetailPayloadValid(targetKey, payload)) {
    return { error: 'Invalid project detail payload', ok: false };
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
