import {
  isValidContentOverrideArea,
  isValidContentOverrideLocale,
  isValidContentOverridePayload,
  isValidContentOverrideTargetKey,
} from '@/lib/server/contentOverrideValidation';
import type { ContentOverrideArea } from '@/lib/server/editableContentStore';
import type { Language } from '@/lib/utils/language';

interface ContentOverrideRequestBody {
  area: ContentOverrideArea;
  locale: Language;
  payload: unknown;
  targetKey: string;
}

type ParseContentOverrideRequestResult =
  | { ok: true; value: ContentOverrideRequestBody }
  | { error: string; ok: false };

const MAX_JSON_PAYLOAD_LENGTH = 100_000;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export const parseContentOverrideRequest = (body: unknown): ParseContentOverrideRequestResult => {
  if (!isRecord(body)) {
    return { error: 'Invalid request body', ok: false };
  }

  const { area, locale, payload, targetKey } = body;

  if (!isValidContentOverrideArea(area)) {
    return { error: 'Invalid content area', ok: false };
  }

  if (!isValidContentOverrideLocale(locale)) {
    return { error: 'Invalid locale', ok: false };
  }

  if (!isValidContentOverrideTargetKey(targetKey)) {
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

  if (!isValidContentOverridePayload(area, targetKey, payload)) {
    return { error: 'Invalid content override payload', ok: false };
  }

  return {
    ok: true,
    value: {
      area,
      locale,
      payload,
      targetKey,
    },
  };
};
