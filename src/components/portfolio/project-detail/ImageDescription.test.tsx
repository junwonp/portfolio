import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import ImageDescription from './ImageDescription';

describe('native project media', () => {
  it('renders a looping, controllable video that autoplays from script', () => {
    const html = renderToStaticMarkup(
      <ImageDescription
        src="/images/aira/chat_flashlist.mp4"
        alt="Demo"
        width={1170}
        height={2532}
      />,
    );
    expect(html).toContain('src="/images/aira/chat_flashlist.mp4"');
    expect(html).toContain('loop=""');
    expect(html).toContain('muted=""');
    expect(html).toContain('preload="metadata"');
    expect(html).toContain('width="1170"');
    // GIF-like: no visible controls; autoplay is driven by the effect, not the attribute.
    expect(html).not.toContain('controls');
    expect(html).not.toContain('autoPlay');
  });

  it('renders images with a browser-selected responsive source and intrinsic size', () => {
    const html = renderToStaticMarkup(<ImageDescription src="/images/aira/icon.webp" alt="Aira" />);
    expect(html).toContain('srcSet=');
    expect(html).toMatch(/width="\d+"/);
    expect(html).toMatch(/height="\d+"/);
    expect(html).toContain('loading="lazy"');
  });
});
