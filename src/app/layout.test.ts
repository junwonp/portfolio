import { Children, isValidElement, type ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ headers: vi.fn() }));
vi.mock('next/headers', () => ({ headers: mocks.headers }));

import { PORTFOLIO_URL } from '@/config/site';

import RootLayout, { metadata } from './layout';

const createHeaders = (values: Record<string, string>) => ({
  get: (name: string) => values[name] ?? null,
});

const renderLayout = async () => {
  const element = await RootLayout({ children: 'page content' });

  if (
    !isValidElement<{ children?: ReactNode; lang?: string; suppressHydrationWarning?: boolean }>(
      element,
    )
  ) {
    throw new Error('expected the root layout to render an <html> element');
  }

  return element;
};

beforeEach(() => {
  mocks.headers.mockResolvedValue(createHeaders({}));
});

describe('root layout metadata', () => {
  it('anchors metadataBase at the configured portfolio URL', () => {
    expect(String(metadata.metadataBase)).toBe(new URL(PORTFOLIO_URL).href);
  });

  it('keeps the site out of search indexes', () => {
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });
});

describe('RootLayout', () => {
  it('renders an html element whose lang follows the forwarded x-locale header', async () => {
    mocks.headers.mockResolvedValue(createHeaders({ 'x-locale': 'en' }));

    const element = await renderLayout();

    expect(element.type).toBe('html');
    expect(element.props.lang).toBe('en');
    expect(element.props.suppressHydrationWarning).toBe(true);
  });

  it('falls back to the Korean locale when the x-locale header is absent', async () => {
    const element = await renderLayout();

    expect(element.props.lang).toBe('ko');
  });

  it('falls back to the Korean locale when the x-locale header is unsupported', async () => {
    mocks.headers.mockResolvedValue(createHeaders({ 'x-locale': 'fr' }));

    const element = await renderLayout();

    expect(element.props.lang).toBe('ko');
  });

  it('injects the theme initializer script into the document head', async () => {
    const element = await renderLayout();
    const [head, body] = Children.toArray(element.props.children);

    expect(head).toHaveProperty('type', 'head');
    expect(body).toHaveProperty('type', 'body');

    if (!isValidElement<{ children?: ReactNode }>(head)) {
      throw new Error('expected the root layout to render a <head> element');
    }

    const [script] = Children.toArray(head.props.children);

    if (!isValidElement<{ src?: string }>(script)) {
      throw new Error('expected the document head to contain a script element');
    }

    expect(script.type).toBe('script');
    expect(script.props.src).toBe('/theme-initializer.js');
  });

  it('renders the page children inside the document body', async () => {
    const element = await renderLayout();
    const [, body] = Children.toArray(element.props.children);

    if (!isValidElement<{ children?: ReactNode }>(body)) {
      throw new Error('expected the root layout to render a <body> element');
    }

    expect(body.props.children).toBe('page content');
  });
});
