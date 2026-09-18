import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import IconLink from '@/components/ui/IconLink';
import * as styles from '@/components/ui/IconLink.css';
import Github from '@/components/ui/icon/Github';

const renderIconLink = (
  props: Partial<Parameters<typeof IconLink>[0]> &
    Pick<Parameters<typeof IconLink>[0], 'href' | 'title'>,
): string => renderToStaticMarkup(<IconLink {...props}>{<Github width={20} />}</IconLink>);

describe('IconLink', () => {
  it('defaults to the github variant and uses the title as the accessible name', () => {
    const html = renderIconLink({
      href: 'https://github.com/junwon',
      title: 'GitHub',
      type: 'github',
    });

    expect(html).toContain('href="https://github.com/junwon"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain('aria-label="GitHub"');
    expect(html).toContain('title="GitHub"');
    expect(html).toContain(styles.iconLink);
    expect(html).toContain(styles.typeVariants.github);
  });

  it('prefers an explicit aria label and keeps the caller class', () => {
    const html = renderIconLink({
      ariaLabel: 'GitHub 프로필',
      className: 'header-icon',
      href: 'https://github.com/junwon',
      title: 'GitHub',
      type: 'linkedin',
    });

    expect(html).toContain('aria-label="GitHub 프로필"');
    expect(html).toContain('header-icon');
    expect(html).toContain(styles.typeVariants.linkedin);
    expect(html).not.toContain(styles.typeVariants.github);
  });

  it('falls back to the normal variant when no type is given', () => {
    const html = renderIconLink({ href: 'https://example.com', title: 'Example' });

    expect(html).toContain(styles.typeVariants.normal);
    expect(html).not.toContain(styles.typeVariants.github);
    expect(html).not.toContain(styles.typeVariants.linkedin);
  });

  it('renders the caller icon inside the anchor', () => {
    const html = renderIconLink({ href: 'https://example.com', title: 'Example' });

    expect(html).toContain('<svg');
    expect(html).toContain('width="20"');
    expect(html).toContain('aria-hidden="true"');
  });
});
