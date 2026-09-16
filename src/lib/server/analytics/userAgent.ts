export type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'bot' | 'unknown';

export interface ParsedUserAgent {
  browser: string;
  deviceType: DeviceType;
  isBot: 0 | 1;
  os: string;
}

// Mirrors the bot keyword list in classifySession (src/lib/server/admin/dashboardData.ts):
// the UA-derived flag and the dashboard classifier must agree on what counts as a bot.
const BOT_KEYWORDS = [
  'bot',
  'spider',
  'crawler',
  'python-requests',
  'go-http-client',
  'curl',
  'wget',
  'http-client',
  'zgrab',
  'censys',
  'masscan',
  'headlesschrome',
  'http_request',
  'axios',
  'node-fetch',
  'fetch',
  'java/',
  'scrip',
] as const;

const TABLET_TOKENS = /(ipad|tablet|kindle|silk|playbook)/;
const MOBILE_TOKENS = /(mobile|mobi|iphone|ipod|windows phone)/;
const DESKTOP_TOKENS = /(windows nt|macintosh|mac os x|linux|x11|cros)/;

const detectBrowser = (ua: string): string => {
  // Ordering matters: Edge, Opera, and Samsung Internet UAs all carry a Chrome token
  if (/edg/.test(ua)) return 'Edge';
  if (/opr\//.test(ua)) return 'Opera';
  if (/samsungbrowser/.test(ua)) return 'Samsung Internet';
  if (/chrome|crios/.test(ua)) return 'Chrome';
  if (/firefox|fxios/.test(ua)) return 'Firefox';
  if (/safari/.test(ua)) return 'Safari';
  return 'Unknown';
};

const detectOs = (ua: string): string => {
  // Ordering matters: iPad UAs carry "like Mac OS X" and Android UAs carry Linux
  if (/(iphone|ipad|ipod)/.test(ua)) return 'iOS';
  if (/android/.test(ua)) return 'Android';
  if (/windows/.test(ua)) return 'Windows';
  if (/(macintosh|mac os x)/.test(ua)) return 'macOS';
  if (/linux/.test(ua)) return 'Linux';
  return 'Unknown';
};

const detectDeviceType = (ua: string): DeviceType => {
  if (TABLET_TOKENS.test(ua)) return 'tablet';
  if (MOBILE_TOKENS.test(ua)) return 'mobile';
  // Android without mobile tokens is a tablet (Android tablet UAs also carry Linux)
  if (/android/.test(ua)) return 'tablet';
  if (DESKTOP_TOKENS.test(ua)) return 'desktop';
  return 'unknown';
};

export const parseUserAgent = (ua: string): ParsedUserAgent => {
  const normalized = ua.trim().toLowerCase();
  const isBot = !normalized || BOT_KEYWORDS.some((keyword) => normalized.includes(keyword));

  if (isBot) {
    return { browser: 'Unknown', deviceType: 'bot', isBot: 1, os: 'Unknown' };
  }

  return {
    browser: detectBrowser(normalized),
    deviceType: detectDeviceType(normalized),
    isBot: 0,
    os: detectOs(normalized),
  };
};
