import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import ProjectLightbox from './ProjectLightbox';

describe('ProjectLightbox previews', () => {
  it('provides responsive previews before hydration', () => {
    const html = renderToStaticMarkup(
      <ProjectLightbox
        images={[{ src: '/desktop.webp', mobileSrc: '/mobile.webp', alt: 'Project screenshot' }]}
      />,
    );
    expect(html).toContain('<picture>');
    expect(html).toContain('media="(max-width: 640px)"');
    expect(html).toContain('/mobile.webp');
  });

  it('renders safely with no images', () => {
    const html = renderToStaticMarkup(<ProjectLightbox images={[]} />);
    expect(html).not.toContain('<button');
  });
});
