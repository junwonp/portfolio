import { extractApplicationSlugFromPath } from '@/lib/utils/applicationSlug';

export const ANALYTICS_SESSION_KEY = 'junuuon_analytics_session_id';

export interface AnalyticsSessionInfo {
  id: string;
  isNew: boolean;
}

export function getOrInitializeAnalyticsSession(): AnalyticsSessionInfo {
  if (typeof window === 'undefined') return { id: '', isNew: false };

  let id = sessionStorage.getItem(ANALYTICS_SESSION_KEY);
  let isNew = false;

  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(ANALYTICS_SESSION_KEY, id);
    isNew = true;
  }

  return { id, isNew };
}

export function sendAnalyticsPayload(
  data: Record<string, unknown>,
  currentSessionId: string,
): void {
  if (typeof window === 'undefined' || !currentSessionId) return;

  if (localStorage.getItem('junuuon_analytics_ignore') === 'true') {
    return;
  }

  const currentPath = window.location.pathname;
  const applicationSlug = extractApplicationSlugFromPath(currentPath);
  const payload = JSON.stringify({
    ...(applicationSlug ? { applicationSlug } : {}),
    sessionId: currentSessionId,
    userAgent: navigator.userAgent,
    ...data,
  });

  if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
    navigator.sendBeacon('/api/analytics/track', payload);
    return;
  }

  void fetch('/api/analytics/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload,
    keepalive: true,
  });
}
