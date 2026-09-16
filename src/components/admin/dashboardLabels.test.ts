import { describe, expect, it } from 'vitest';

import {
  formatAcceptLanguage,
  formatLocaleSwitchLabel,
  formatOutboundLinkLabel,
  formatThemeToggleLabel,
} from './dashboardLabels';

describe('formatOutboundLinkLabel', () => {
  it('maps the fixed destinations to readable labels', () => {
    expect(formatOutboundLinkLabel('github')).toBe('GitHub');
    expect(formatOutboundLinkLabel('linkedin')).toBe('LinkedIn');
    expect(formatOutboundLinkLabel('email')).toBe('이메일');
    expect(formatOutboundLinkLabel('resume')).toBe('이력서');
  });

  it('keeps the domain of external destinations recognisable', () => {
    expect(formatOutboundLinkLabel('external:camerafi.com')).toBe('camerafi.com');
    expect(formatOutboundLinkLabel('external:example.co.uk')).toBe('example.co.uk');
  });

  it('falls back to the raw value for unrecognised labels', () => {
    expect(formatOutboundLinkLabel('newsletter')).toBe('newsletter');
    expect(formatOutboundLinkLabel('external:')).toBe('external:');
  });
});

describe('formatThemeToggleLabel', () => {
  it('maps the toggle directions', () => {
    expect(formatThemeToggleLabel('light')).toBe('라이트');
    expect(formatThemeToggleLabel('dark')).toBe('다크');
  });

  it('falls back to the raw value for unrecognised labels', () => {
    expect(formatThemeToggleLabel('auto')).toBe('auto');
  });
});

describe('formatLocaleSwitchLabel', () => {
  it('maps the switched-to locales', () => {
    expect(formatLocaleSwitchLabel('ko')).toBe('한국어');
    expect(formatLocaleSwitchLabel('en')).toBe('영어');
  });

  it('falls back to the raw value for unrecognised labels', () => {
    expect(formatLocaleSwitchLabel('ja')).toBe('ja');
  });
});

describe('formatAcceptLanguage', () => {
  it('renders the browser language tag as provided', () => {
    expect(formatAcceptLanguage('ko-kr')).toBe('ko-kr');
    expect(formatAcceptLanguage('en-US')).toBe('en-US');
  });

  it('labels missing or unknown values', () => {
    expect(formatAcceptLanguage('unknown')).toBe('알 수 없음');
    expect(formatAcceptLanguage('')).toBe('알 수 없음');
  });
});
