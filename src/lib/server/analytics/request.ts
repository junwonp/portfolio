const MAX_ANALYTICS_BODY_BYTES = 8192;
const ANALYTICS_HOSTS = new Set(['junwon.dev', 'www.junwon.dev', 'resume.junwon.dev']);

export function shouldCollectAnalytics(appEnv: string | undefined, url: string): boolean {
  return appEnv === 'production' && ANALYTICS_HOSTS.has(new URL(url).hostname);
}

export class AnalyticsBodyTooLargeError extends Error {
  constructor() {
    super('Payload too large');
  }
}

export async function readAnalyticsBody(request: Request): Promise<unknown> {
  if (Number(request.headers.get('content-length')) > MAX_ANALYTICS_BODY_BYTES) {
    throw new AnalyticsBodyTooLargeError();
  }
  const reader = request.body?.getReader();
  if (!reader) return null;
  const decoder = new TextDecoder();
  let text = '';
  let bytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_ANALYTICS_BODY_BYTES) {
        await reader.cancel();
        throw new AnalyticsBodyTooLargeError();
      }
      text += decoder.decode(value, { stream: true });
    }
    return JSON.parse(text + decoder.decode()) as unknown;
  } finally {
    reader.releaseLock();
  }
}
