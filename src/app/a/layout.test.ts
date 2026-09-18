import { Children, isValidElement, type ReactNode } from 'react';
import { describe, expect, it } from 'vitest';

import AdminLayout, { metadata } from './layout';

const renderLayout = (children: ReactNode = 'dashboard content') => {
  const element = AdminLayout({ children });

  if (!isValidElement<{ children?: ReactNode; className?: string }>(element)) {
    throw new Error('expected the admin layout to render the wrapper div');
  }

  return element;
};

describe('admin layout metadata', () => {
  it('titles the dashboard and keeps the admin surface out of search indexes', () => {
    expect(metadata.title).toBe('관리자 대시보드 | 박준원');
    expect(metadata.description).toBe(
      '포트폴리오 방문자 분석, 세션 추적, 지원 링크 관리 대시보드입니다.',
    );
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });
});

describe('AdminLayout', () => {
  it('renders the admin wrapper around a content column', () => {
    const element = renderLayout();

    expect(element.type).toBe('div');
    expect(element.props.className).toBe('wrapper is-admin');

    const [contentWrapper] = Children.toArray(element.props.children);

    if (!isValidElement<{ children?: ReactNode; className?: string }>(contentWrapper)) {
      throw new Error('expected the admin layout to render a content wrapper');
    }

    expect(contentWrapper.props.className).toBe('content-wrapper');
  });

  it('renders a skip link that targets the main content region', () => {
    const element = renderLayout();
    const [contentWrapper] = Children.toArray(element.props.children);

    if (!isValidElement<{ children?: ReactNode }>(contentWrapper)) {
      throw new Error('expected the admin layout to render a content wrapper');
    }

    const [skipLink] = Children.toArray(contentWrapper.props.children);

    if (!isValidElement<{ children?: ReactNode; className?: string; href?: string }>(skipLink)) {
      throw new Error('expected the admin layout to render a skip link');
    }

    expect(skipLink.type).toBe('a');
    expect(skipLink.props.href).toBe('#main-content');
    expect(skipLink.props.className).toBe('skip-link');
    expect(skipLink.props.children).toBe('본문으로 건너뛰기');
  });

  it('renders the children inside the focusable main content region', () => {
    const element = renderLayout('session table');
    const [contentWrapper] = Children.toArray(element.props.children);

    if (!isValidElement<{ children?: ReactNode }>(contentWrapper)) {
      throw new Error('expected the admin layout to render a content wrapper');
    }

    const [, main] = Children.toArray(contentWrapper.props.children);

    if (
      !isValidElement<{ children?: ReactNode; className?: string; id?: string; tabIndex?: number }>(
        main,
      )
    ) {
      throw new Error('expected the admin layout to render a main element');
    }

    expect(main.type).toBe('main');
    expect(main.props.id).toBe('main-content');
    expect(main.props.className).toBe('content');
    expect(main.props.tabIndex).toBe(-1);
    expect(main.props.children).toBe('session table');
  });
});
