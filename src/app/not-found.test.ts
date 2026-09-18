import Link from 'next/link';
import { Children, isValidElement, type ReactNode } from 'react';
import { describe, expect, it } from 'vitest';

import NotFound, { metadata } from './not-found';
import * as styles from './not-found.css';

describe('not found metadata', () => {
  it('exports its own metadata because layout metadata does not reach the 404 boundary', () => {
    expect(metadata.title).toBe('페이지를 찾을 수 없습니다 | 박준원');
    expect(metadata.description).toBe('요청한 페이지를 찾을 수 없습니다.');
  });
});

describe('NotFound', () => {
  const renderNotFound = () => {
    const element = NotFound();

    if (!isValidElement<{ children?: ReactNode; className?: string }>(element)) {
      throw new Error('expected the not found page to render a <main> element');
    }

    return element;
  };

  it('renders the 404 heading and message inside the page-level main container', () => {
    const element = renderNotFound();
    const [heading, description] = Children.toArray(element.props.children);

    expect(element.type).toBe('main');
    expect(element.props.className).toBe(styles.container);

    if (!isValidElement<{ children?: ReactNode; className?: string }>(heading)) {
      throw new Error('expected the not found page to render an <h1> element');
    }

    expect(heading.type).toBe('h1');
    expect(heading.props.children).toBe('404');
    expect(heading.props.className).toBe(styles.title);

    if (!isValidElement<{ children?: ReactNode; className?: string }>(description)) {
      throw new Error('expected the not found page to render a <p> element');
    }

    expect(description.type).toBe('p');
    expect(description.props.children).toBe('페이지를 찾을 수 없습니다.');
    expect(description.props.className).toBe(styles.description);
  });

  it('links back to the home page', () => {
    const element = renderNotFound();
    const homeLink = Children.toArray(element.props.children)[2];

    if (!isValidElement<{ children?: ReactNode; className?: string; href?: string }>(homeLink)) {
      throw new Error('expected the not found page to render a link element');
    }

    expect(homeLink.type).toBe(Link);
    expect(homeLink.props.href).toBe('/');
    expect(homeLink.props.children).toBe('홈으로 돌아가기');
  });
});
