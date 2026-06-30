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
  overrides: ContentOverrideWriteInput[];
  targetKey: string;
}

interface ContentOverrideWriteInput {
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

  const { area, locale, payload, payloadByLocale, targetKey } = body;

  if (!isValidContentOverrideArea(area)) {
    return { error: 'Invalid content area', ok: false };
  }

  if (!isValidContentOverrideLocale(locale)) {
    return { error: 'Invalid locale', ok: false };
  }

  if (!isValidContentOverrideTargetKey(targetKey)) {
    return { error: 'Invalid target key', ok: false };
  }

  let serializedPayload: string | undefined;
  try {
    serializedPayload = JSON.stringify(payloadByLocale ?? payload);
  } catch {
    return { error: 'Payload must be serializable JSON', ok: false };
  }

  if (typeof serializedPayload !== 'string') {
    return { error: 'Payload is required', ok: false };
  }

  if (serializedPayload.length > MAX_JSON_PAYLOAD_LENGTH) {
    return { error: 'Payload is too large', ok: false };
  }

  if (payloadByLocale !== undefined) {
    if (!isRecord(payloadByLocale)) {
      return { error: 'Localized payload must be an object', ok: false };
    }

    const overrides: ContentOverrideWriteInput[] = [];

    for (const [payloadLocale, localizedPayload] of Object.entries(payloadByLocale)) {
      if (!isValidContentOverrideLocale(payloadLocale)) {
        return { error: 'Invalid localized payload locale', ok: false };
      }

      if (!isValidContentOverridePayload(area, targetKey, localizedPayload)) {
        return { error: 'Invalid localized content override payload', ok: false };
      }

      overrides.push({
        area,
        locale: payloadLocale,
        payload: localizedPayload,
        targetKey,
      });
    }

    if (overrides.length === 0) {
      return { error: 'Localized payload cannot be empty', ok: false };
    }

    const currentLocalePayload =
      overrides.find((override) => override.locale === locale)?.payload ?? overrides[0]?.payload;

    return {
      ok: true,
      value: {
        area,
        locale,
        payload: currentLocalePayload,
        overrides,
        targetKey,
      },
    };
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
      overrides: [
        {
          area,
          locale,
          payload,
          targetKey,
        },
      ],
      targetKey,
    },
  };
};
