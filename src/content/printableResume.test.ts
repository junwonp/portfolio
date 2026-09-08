import { describe, expect, it } from 'vitest';

import {
  getPrintableResume,
  parseResumeVariant,
  printableResume,
  resolveResumeVariant,
} from '@/content/printableResume';

describe('printableResume', () => {
  it('does not expose a phone number in public resume contact content', () => {
    const contactText = printableResume.contactItems.map((item) => item.value).join(' ');

    expect(contactText).not.toContain('10-5713-3565');
    expect(contactText).not.toMatch(/\+82|010-\d{4}-\d{4}/);
  });

  it('keeps the public portfolio URL aligned to the custom domain', () => {
    const portfolioContact = printableResume.contactItems.find(
      (item) => item.label === 'Portfolio',
    );

    expect(portfolioContact?.value).toBe('https://junwon.dev');
  });

  it('resolves the resume variant from link positioning', () => {
    expect(resolveResumeVariant('web', 'web')).toBe('web');
    expect(resolveResumeVariant('web', 'ops-data')).toBe('ops-data');
    expect(resolveResumeVariant('web', 'web-rn')).toBe('web-rn');
    expect(resolveResumeVariant('ai', 'ai')).toBe('web-rn');
    expect(resolveResumeVariant('mobile', null)).toBe('web-rn');
    expect(resolveResumeVariant(null, null)).toBe('web');
  });

  it('parses variant query parameter values', () => {
    expect(parseResumeVariant('web')).toBe('web');
    expect(parseResumeVariant('ops-data')).toBe('ops-data');
    expect(parseResumeVariant('opsData')).toBe('ops-data');
    expect(parseResumeVariant('web-rn')).toBe('web-rn');
    expect(parseResumeVariant('rn')).toBe('web-rn');
    expect(parseResumeVariant('mobile')).toBe('web-rn');
    expect(parseResumeVariant('ai')).toBe('web-rn');
    expect(parseResumeVariant('invalid')).toBeNull();
    expect(parseResumeVariant(null)).toBeNull();
  });

  it('embeds the short portfolio URL into the resume contact item', () => {
    const resume = getPrintableResume('web', 'https://junwon.dev/p48r');

    const portfolio = resume.contactItems.find((item) => item.label === 'Portfolio');

    expect(portfolio?.href).toBe('https://junwon.dev/p48r');
    expect(portfolio?.value).toBe('https://junwon.dev/p48r');
  });

  it('orders companies in strict reverse-chronological order across all variants', () => {
    for (const variant of ['web', 'ops-data', 'web-rn'] as const) {
      const resume = getPrintableResume(variant);
      const firstPageWork = resume.pages[0]?.sections.find((section) => section.type === 'work');
      if (firstPageWork?.type !== 'work') {
        throw new Error('first page should start with a work section');
      }

      expect(firstPageWork.entries[0]?.companyName).toContain('오르카에이아이');
      expect(firstPageWork.entries[0]?.projects[0]?.title).toBe(
        '아이라 - 글로벌 AI 캐릭터 채팅 플랫폼',
      );
      expect(firstPageWork.entries[1]?.companyName).toContain('볼트마이크로');
      expect(firstPageWork.entries[1]?.projects[0]?.title).toBe(
        'CameraFi Studio - 웹 오버레이 스코어보드',
      );
    }
  });

  it('states total experience years in the resume headline', () => {
    expect(printableResume.role).toContain('5년 차');
    expect(printableResume.summaryTitle).toContain('5년 차');
  });

  it('exposes scannable hero metrics and tech keywords for every variant', () => {
    for (const variant of ['web', 'web-rn', 'ops-data'] as const) {
      const resume = getPrintableResume(variant);

      expect(resume.heroMetrics.length).toBeGreaterThanOrEqual(4);
      for (const metric of resume.heroMetrics) {
        expect(metric.value.trim()).not.toBe('');
        expect(metric.label.trim()).not.toBe('');
      }

      expect(resume.techKeywords.length).toBeGreaterThanOrEqual(6);
      for (const keyword of resume.techKeywords) {
        expect(keyword.trim()).not.toBe('');
      }
    }
  });

  it('keeps summary bullets short enough for a quick scan', () => {
    for (const variant of ['web', 'web-rn', 'ops-data'] as const) {
      const resume = getPrintableResume(variant);

      for (const bullet of resume.summaryBullets) {
        const text = bullet.map((part) => (typeof part === 'string' ? part : part.text)).join('');
        expect(text.length).toBeLessThanOrEqual(60);
      }
    }
  });

  it('marks SDK snippets with a code part for monospace rendering', () => {
    const resume = getPrintableResume('web');
    const allParts = resume.pages.flatMap((page) =>
      page.sections.flatMap((section) =>
        section.type === 'work'
          ? section.entries.flatMap((entry) => entry.projects.flatMap((project) => project.bullets))
          : [],
      ),
    );
    const codeParts = allParts.flat().filter((part) => typeof part !== 'string' && 'code' in part);

    expect(codeParts).toEqual([{ code: true, text: 'orca.setup(websiteId)' }]);
  });
});
