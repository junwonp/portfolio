import {
  extractApplicationSlugFromPath,
  normalizeApplicationSlug,
} from '@/lib/utils/applicationSlug';

export interface AnalyticsPayload {
  applicationSlug?: string;
  eventType: 'page';
  activeTime: number;
  articleProgress: number;
  dwellTime: number;
  isInitial: boolean;
  maxVisibleSectionId?: string;
  maxVisibleSectionLabel?: string;
  pageViewId?: string;
  path?: string;
  previousPath?: string;
  referrer: string;
  scrollDepth: number;
  sessionId: string;
  userAgent: string;
}

export interface WebVitalAnalyticsPayload {
  applicationSlug?: string;
  eventType: 'web-vital';
  metricDelta: number;
  metricId: string;
  metricName: string;
  metricRating: 'good' | 'needs-improvement' | 'poor' | 'unknown';
  metricValue: number;
  navigationType: string;
  path?: string;
  referrer: string;
  sessionId: string;
  userAgent: string;
}

export interface InteractionPayload {
  applicationSlug?: string;
  eventType: 'interaction';
  interactionType: string;
  interactionLabel: string;
  action: 'open' | 'close';
  path?: string;
  referrer: string;
  sessionId: string;
  userAgent: string;
}

export type AnalyticsPayloadBody = AnalyticsPayload | WebVitalAnalyticsPayload | InteractionPayload;

const MAX_DWELL_TIME_SECONDS = 60 * 60 * 24;
const MAX_METRIC_ID_LENGTH = 128;
const MAX_METRIC_NAME_LENGTH = 64;
const MAX_METRIC_VALUE = 60 * 60 * 1000;
const MAX_NAVIGATION_TYPE_LENGTH = 64;
const MAX_PAGE_VIEW_ID_LENGTH = 128;
const MAX_REFERRER_LENGTH = 500;
const MAX_SECTION_ID_LENGTH = 256;
const MAX_SECTION_LABEL_LENGTH = 240;
const MAX_SESSION_ID_LENGTH = 128;
const MAX_URL_PATH_LENGTH = 2048;
const MAX_USER_AGENT_LENGTH = 500;

const getClampedInteger = (value: unknown, min: number, max: number): number => {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return min;
  }
  return Math.min(Math.max(Math.round(value), min), max);
};

const getClampedNumber = (value: unknown, min: number, max: number): number | null => {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return null;
  }
  return Math.min(Math.max(value, min), max);
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

const getOptionalString = (value: unknown, maxLength: number): string | undefined => {
  if (typeof value !== 'string') {
    return undefined;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }
  return trimmed.slice(0, maxLength);
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

const getMetricRating = (value: unknown): WebVitalAnalyticsPayload['metricRating'] => {
  if (value === 'good' || value === 'needs-improvement' || value === 'poor') {
    return value;
  }

  return 'unknown';
};

export const parseAnalyticsPayloadBody = (rawBody: unknown): AnalyticsPayloadBody | null => {
  if (typeof rawBody !== 'object' || rawBody === null) {
    return null;
  }

  const body = rawBody as Record<string, unknown>;
  const sessionId = getRequiredString(body.sessionId, MAX_SESSION_ID_LENGTH);

  if (!sessionId) {
    return null;
  }

  const path = getOptionalPath(body.path);
  const applicationSlug =
    getOptionalSlug(body.applicationSlug) ?? extractApplicationSlugFromPath(path);
  const referrer = getStringOrFallback(body.referrer, 'direct', MAX_REFERRER_LENGTH);
  const userAgent = getStringOrFallback(body.userAgent, 'unknown', MAX_USER_AGENT_LENGTH);

  if (body.eventType === 'web-vital') {
    const metricId = getRequiredString(body.metricId, MAX_METRIC_ID_LENGTH);
    const metricName = getRequiredString(body.metricName, MAX_METRIC_NAME_LENGTH);
    const metricValue = getClampedNumber(body.metricValue, 0, MAX_METRIC_VALUE);
    const metricDelta = getClampedNumber(body.metricDelta, 0, MAX_METRIC_VALUE);

    if (!metricId || !metricName || metricValue === null || metricDelta === null) {
      return null;
    }

    return {
      applicationSlug,
      eventType: 'web-vital',
      metricDelta,
      metricId,
      metricName,
      metricRating: getMetricRating(body.metricRating),
      metricValue,
      navigationType: getStringOrFallback(
        body.navigationType,
        'unknown',
        MAX_NAVIGATION_TYPE_LENGTH,
      ),
      path,
      referrer,
      sessionId,
      userAgent,
    };
  }

  if (body.eventType === 'interaction') {
    const interactionType = getOptionalString(body.interactionType, 100);
    const interactionLabel = getOptionalString(body.interactionLabel, 500);
    const action = body.action === 'open' || body.action === 'close' ? (body.action as 'open' | 'close') : null;

    if (!interactionType || !interactionLabel || !action) {
      return null;
    }

    return {
      applicationSlug,
      eventType: 'interaction',
      interactionType,
      interactionLabel,
      action,
      path,
      referrer,
      sessionId,
      userAgent,
    };
  }

  return {
    applicationSlug,
    activeTime: getClampedInteger(body.activeTime, 0, MAX_DWELL_TIME_SECONDS),
    articleProgress: getClampedInteger(body.articleProgress, 0, 100),
    dwellTime: getClampedInteger(body.dwellTime, 0, MAX_DWELL_TIME_SECONDS),
    eventType: 'page',
    isInitial: body.isInitial === true,
    maxVisibleSectionId: getOptionalString(body.maxVisibleSectionId, MAX_SECTION_ID_LENGTH),
    maxVisibleSectionLabel: getOptionalString(
      body.maxVisibleSectionLabel,
      MAX_SECTION_LABEL_LENGTH,
    ),
    pageViewId: getOptionalString(body.pageViewId, MAX_PAGE_VIEW_ID_LENGTH),
    path,
    previousPath: getOptionalPath(body.previousPath),
    referrer,
    scrollDepth: getClampedInteger(body.scrollDepth, 0, 100),
    sessionId,
    userAgent,
  };
};
