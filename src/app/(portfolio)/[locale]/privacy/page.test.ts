import { Children, isValidElement, type ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  notFound: vi.fn(() => {
    throw new Error('NEXT_NOT_FOUND');
  }),
  privacyEn: vi.fn(() => null),
  privacyKo: vi.fn(() => null),
}));
vi.mock('next/navigation', () => ({ notFound: mocks.notFound }));
vi.mock('@/content/privacy/privacy.en.mdx', () => ({ default: mocks.privacyEn }));
vi.mock('@/content/privacy/privacy.ko.mdx', () => ({ default: mocks.privacyKo }));

import { PORTFOLIO_URL } from '@/config/site';

import PrivacyPage, { generateMetadata } from './page';
import * as styles from './privacy.css';

const params = (locale: string) => ({ params: Promise.resolve({ locale }) });

const renderPrivacyPage = async (locale: string) => {
  const element = await PrivacyPage(params(locale));

  if (!isValidElement<{ children?: ReactNode; className?: string }>(element)) {
    throw new Error('expected the privacy route to render an <article> element');
  }

  return element;
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('privacy route metadata', () => {
  it('serves the Korean privacy policy metadata at the Korean canonical URL', async () => {
    const metadata = await generateMetadata(params('ko'));

    expect(metadata.title).toBe('개인정보 처리방침 | 박준원 포트폴리오');
    expect(metadata.description).toBe('박준원의 개인 포트폴리오 웹사이트 개인정보 처리방침입니다.');
    expect(metadata.alternates?.canonical).toBe(`${PORTFOLIO_URL}/privacy`);
  });

  it('serves the English privacy policy metadata at the localized canonical URL', async () => {
    const metadata = await generateMetadata(params('en'));

    expect(metadata.title).toBe("Privacy Policy | Junwon's Portfolio");
    expect(metadata.alternates?.canonical).toBe(`${PORTFOLIO_URL}/en/privacy`);
    expect(mocks.notFound).not.toHaveBeenCalled();
  });

  it('returns not found from generateMetadata for an unsupported locale', async () => {
    await expect(generateMetadata(params('fr'))).rejects.toThrow('NEXT_NOT_FOUND');

    expect(mocks.notFound).toHaveBeenCalledTimes(1);
  });
});

describe('PrivacyPage', () => {
  it('renders the Korean MDX content inside the privacy article for the Korean locale', async () => {
    const element = await renderPrivacyPage('ko');
    const [content] = Children.toArray(element.props.children);

    expect(element.type).toBe('article');
    expect(element.props.className).toBe(styles.privacyContent);
    expect(isValidElement(content)).toBe(true);
    expect(content).toHaveProperty('type', mocks.privacyKo);
  });

  it('renders the English MDX content for the English locale', async () => {
    const element = await renderPrivacyPage('en');
    const [content] = Children.toArray(element.props.children);

    expect(content).toHaveProperty('type', mocks.privacyEn);
  });

  it('returns not found without rendering content for an unsupported locale', async () => {
    await expect(renderPrivacyPage('fr')).rejects.toThrow('NEXT_NOT_FOUND');

    expect(mocks.notFound).toHaveBeenCalledTimes(1);
  });
});
