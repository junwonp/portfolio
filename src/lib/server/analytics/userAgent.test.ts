import { describe, expect, it } from 'vitest';

import { parseUserAgent } from '@/lib/server/analytics/userAgent';

const CHROME_WINDOWS_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) ' +
  'Chrome/120.0.0.0 Safari/537.36';

const SAFARI_IOS_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) ' +
  'Version/17.0 Mobile/15E148 Safari/604.1';

const CHROME_ANDROID_UA =
  'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) ' +
  'Chrome/120.0.0.0 Mobile Safari/537.36';

const EDGE_WINDOWS_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) ' +
  'Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0';

const SAFARI_IPAD_UA =
  'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) ' +
  'Version/17.0 Mobile/15E148 Safari/604.1';

describe('parseUserAgent', () => {
  it('parses Chrome on Windows as a desktop browser', () => {
    expect(parseUserAgent(CHROME_WINDOWS_UA)).toEqual({
      browser: 'Chrome',
      deviceType: 'desktop',
      isBot: 0,
      os: 'Windows',
    });
  });

  it('parses Safari on iOS as a mobile browser without falling into macOS', () => {
    expect(parseUserAgent(SAFARI_IOS_UA)).toEqual({
      browser: 'Safari',
      deviceType: 'mobile',
      isBot: 0,
      os: 'iOS',
    });
  });

  it('parses Chrome on Android as a mobile browser', () => {
    expect(parseUserAgent(CHROME_ANDROID_UA)).toEqual({
      browser: 'Chrome',
      deviceType: 'mobile',
      isBot: 0,
      os: 'Android',
    });
  });

  it('parses iPad Safari as a tablet', () => {
    expect(parseUserAgent(SAFARI_IPAD_UA)).toEqual({
      browser: 'Safari',
      deviceType: 'tablet',
      isBot: 0,
      os: 'iOS',
    });
  });

  it('flags a Googlebot user agent as a bot', () => {
    expect(
      parseUserAgent('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'),
    ).toEqual({
      browser: 'Unknown',
      deviceType: 'bot',
      isBot: 1,
      os: 'Unknown',
    });
  });

  it('flags an empty user agent as a bot', () => {
    expect(parseUserAgent('')).toEqual({
      browser: 'Unknown',
      deviceType: 'bot',
      isBot: 1,
      os: 'Unknown',
    });
  });

  it('flags a blank user agent as a bot', () => {
    expect(parseUserAgent('   ')).toEqual({
      browser: 'Unknown',
      deviceType: 'bot',
      isBot: 1,
      os: 'Unknown',
    });
  });

  it('flags a scripted client user agent as a bot', () => {
    expect(parseUserAgent('curl/8.4.0')).toEqual({
      browser: 'Unknown',
      deviceType: 'bot',
      isBot: 1,
      os: 'Unknown',
    });
  });

  it('reports Edge instead of Chrome for the shared Chrome token', () => {
    expect(parseUserAgent(EDGE_WINDOWS_UA)).toMatchObject({ browser: 'Edge' });
  });

  it('falls back to unknown for an unrecognized client', () => {
    expect(parseUserAgent('Vitest')).toEqual({
      browser: 'Unknown',
      deviceType: 'unknown',
      isBot: 0,
      os: 'Unknown',
    });
  });
});
