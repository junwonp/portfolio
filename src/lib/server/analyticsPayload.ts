import {
  extractApplicationSlugFromPath,
  normalizeApplicationSlug,
} from '@/lib/utils/applicationSlug';

export interface AnalyticsPayload {
  applicationSlug?: string;
  dwellTime: number;
  isInitial: boolean;
  path?: string;
  referrer: string;
  scrollDepth: number;
  sessionId: string;
  userAgent: string;
}

const MAX_DWELL_TIME_SECONDS = 60 * 60 * 24;
const MAX_REFERRER_LENGTH = 500;
const MAX_SESSION_ID_LENGTH = 128;
const MAX_URL_PATH_LENGTH = 2048;
const MAX_USER_AGENT_LENGTH = 500;

const getClampedInteger = (value: unknown, min: number, max: number): number => {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return min;
  }
  return Math.min(Math.max(Math.round(value), min), max);
};

const getOptionalPath = (value: unknown): string | undefined => {
  if (typeof value !== 'string') {
    return undefined;
  }
  const path = value.trim();
  if (!path.startsWith('/') || path.length > MAX_URL_PATH_LENGTH) {
    return undefined;
  }
  return path;
};

const getOptionalSlug = (value: unknown): string | undefined => {
  if (typeof value !== 'string') {
    return undefined;
  }
  const slug = normalizeApplicationSlug(value);
  return slug || undefined;
};

const getRequiredString = (value: unknown, maxLength: number): string | null => {
  if (typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > maxLength) {
    return null;
  }
  return trimmed;
};

const getStringOrFallback = (value: unknown, fallback: string, maxLength: number): string => {
  if (typeof value !== 'string') {
    return fallback;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return fallback;
  }
  return trimmed.slice(0, maxLength);
};

export const parseAnalyticsPayloadBody = (rawBody: unknown): AnalyticsPayload | null => {
  if (typeof rawBody !== 'object' || rawBody === null) {
    return null;
  }

  const body = rawBody as Record<string, unknown>;
  const sessionId = getRequiredString(body.sessionId, MAX_SESSION_ID_LENGTH);

  if (!sessionId) {
    return null;
  }

  const path = getOptionalPath(body.path);
  const applicationSlug = getOptionalSlug(body.applicationSlug) ?? extractApplicationSlugFromPath(path);

  return {
    applicationSlug,
    dwellTime: getClampedInteger(body.dwellTime, 0, MAX_DWELL_TIME_SECONDS),
    isInitial: body.isInitial === true,
    path,
    referrer: getStringOrFallback(body.referrer, 'direct', MAX_REFERRER_LENGTH),
    scrollDepth: getClampedInteger(body.scrollDepth, 0, 100),
    sessionId,
    userAgent: getStringOrFallback(body.userAgent, 'unknown', MAX_USER_AGENT_LENGTH),
  };
};
