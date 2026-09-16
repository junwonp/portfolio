import { describe, expect, it } from 'vitest';

import {
  bodyImages,
  extractDeclaredImages,
  extractProjectImages,
  frontmatterImage,
  MAX_PROJECT_IMAGES,
} from './projectImages.mjs';

const project = (frontmatter, body = '') => `---\n${frontmatter}\n---\n\n${body}\n`;

describe('frontmatterImage', () => {
  it('reads the quoted representative screenshot', () => {
    expect(frontmatterImage(project("image: '/images/aira/v2_main.webp'"))).toBe(
      '/images/aira/v2_main.webp',
    );
  });

  it('reads an unquoted representative screenshot', () => {
    expect(frontmatterImage(project('image: /images/aira/v2_main.webp'))).toBe(
      '/images/aira/v2_main.webp',
    );
  });

  it('treats a null or absent image as no screenshot', () => {
    expect(frontmatterImage(project('image: null'))).toBeUndefined();
    expect(frontmatterImage(project('title: 아이라'))).toBeUndefined();
  });

  it('ignores the icon declaration', () => {
    const source = project('icon: /images/aira/icon.webp');

    expect(frontmatterImage(source)).toBeUndefined();
    expect(bodyImages(source)).toEqual([]);
  });
});

describe('bodyImages', () => {
  it('reads a double-quoted JSX attribute', () => {
    const body = '<ImageDescription src="/images/aira/desktop_main.webp" alt="main" />';

    expect(bodyImages(project("image: '/images/aira/v2_main.webp'", body))).toEqual([
      '/images/aira/desktop_main.webp',
    ]);
  });

  it('reads a single-quoted object property', () => {
    const body = "<ProjectLightbox images={[{ src: '/images/aira/home_ads.webp' }]} />";

    expect(bodyImages(project('', body))).toEqual(['/images/aira/home_ads.webp']);
  });

  /** The audit's first false result: a renderable expression form was missed. */
  it('reads the expression-container form', () => {
    const body = '<ImageDescription src={"/images/example.webp"} />';

    expect(bodyImages(project('', body))).toEqual(['/images/example.webp']);
  });

  it('reads the single-quoted expression-container form', () => {
    const body = "<ImageDescription src={'/images/example.webp'} />";

    expect(bodyImages(project('', body))).toEqual(['/images/example.webp']);
  });

  /** The audit's second false result: a retired figure came back. */
  it('ignores a commented-out figure', () => {
    const body = '{/* <ImageDescription src="/images/removed.webp" /> */}';

    expect(bodyImages(project('', body))).toEqual([]);
  });

  it('ignores a multi-line commented-out figure beside a live one', () => {
    const body = [
      '{/*',
      '  <ImageDescription src="/images/removed.webp" />',
      '*/}',
      '<ImageDescription src="/images/kept.webp" />',
    ].join('\n');

    expect(bodyImages(project('', body))).toEqual(['/images/kept.webp']);
  });

  it('ignores a figure inside a fenced code block', () => {
    const body = ['```mdx', '<ImageDescription src="/images/sample.webp" />', '```'].join('\n');

    expect(bodyImages(project('', body))).toEqual([]);
  });

  it('ignores mobile crops, videos, and non-printable paths', () => {
    const body = [
      "<ProjectLightbox images={[{ src: '/images/aira/desktop_main.webp', mobileSrc: '/images/aira/desktop_main_mobile.jpg' }]} />",
      '<ImageDescription src="/images/aira/v2_home.mp4" />',
      '<ImageDescription src="./relative.webp" />',
      '<ImageDescription src="/assets/other.webp" />',
      '<ImageDescription src="https://example.com/remote.webp" />',
    ].join('\n');

    expect(bodyImages(project('', body))).toEqual(['/images/aira/desktop_main.webp']);
  });
});

describe('extractDeclaredImages', () => {
  it('keeps the representative shot first, then body order, de-duplicated', () => {
    const body = [
      '<ImageDescription src="/images/aira/v2_main.webp" />',
      '<ImageDescription src="/images/aira/desktop_chat.webp" />',
    ].join('\n');

    expect(extractDeclaredImages(project("image: '/images/aira/v2_main.webp'", body))).toEqual([
      '/images/aira/v2_main.webp',
      '/images/aira/desktop_chat.webp',
    ]);
  });
});

describe('extractProjectImages', () => {
  it('caps the manifest list at the document figure budget', () => {
    const body = [1, 2, 3, 4, 5]
      .map((index) => `<ImageDescription src="/images/project/${index}.webp" />`)
      .join('\n');

    const images = extractProjectImages(project('', body));

    expect(MAX_PROJECT_IMAGES).toBe(3);
    expect(images).toEqual([
      '/images/project/1.webp',
      '/images/project/2.webp',
      '/images/project/3.webp',
    ]);
  });
});
