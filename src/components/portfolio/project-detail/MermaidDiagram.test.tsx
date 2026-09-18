import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import diagrams from '@/generated/diagrams.json';

import MermaidDiagram from './MermaidDiagram';
import * as styles from './MermaidDiagram.css';

interface DiagramAsset {
  light: string;
  dark: string;
  width: number;
  height: number;
}

const assets = diagrams as Record<string, DiagramAsset>;

// The first authored chart stands in for all four entries because the component
// treats every manifest entry identically.
const chart = Object.keys(assets)[0] as string;
const asset = assets[chart] as DiagramAsset;

const imgTags = (html: string): string[] => html.match(/<img[^>]*>/g) ?? [];

describe('MermaidDiagram', () => {
  it('renders the light and dark asset pair of a real chart entry', () => {
    const tags = imgTags(renderToStaticMarkup(<MermaidDiagram chart={chart} title="작업 흐름" />));

    const light = tags.find((tag) => tag.includes(`src="${asset.light}"`));
    const dark = tags.find((tag) => tag.includes(`src="${asset.dark}"`));

    expect(tags).toHaveLength(2);
    expect(light).toContain(styles.lightDiagram);
    expect(light).toContain(`width="${asset.width}"`);
    expect(light).toContain(`height="${asset.height}"`);
    expect(light).toContain('alt=""');
    expect(dark).toContain(styles.darkDiagram);
    expect(dark).toContain(`width="${asset.width}"`);
    expect(dark).toContain(`height="${asset.height}"`);
    expect(dark).toContain('alt=""');
    expect(asset.light).not.toBe(asset.dark);
  });

  it('serves the manifest assets directly instead of the optimizer', () => {
    const html = renderToStaticMarkup(<MermaidDiagram chart={chart} title="작업 흐름" />);

    expect(html).not.toContain('/_next/image');
    expect(chart.startsWith('flowchart TD')).toBe(true);
  });

  it('labels the figure with the title and defaults the eyebrow to Diagram', () => {
    const html = renderToStaticMarkup(<MermaidDiagram chart={chart} title="작업 흐름" />);

    expect(html).toContain('<figure');
    expect(html).toContain('aria-label="작업 흐름"');
    expect(html).toContain('<span>Diagram</span>');
    expect(html).toContain('<strong>작업 흐름</strong>');
  });

  it('renders a caller-supplied eyebrow instead of the default', () => {
    const html = renderToStaticMarkup(
      <MermaidDiagram chart={chart} eyebrow="아키텍처" title="작업 흐름" />,
    );

    expect(html).toContain('<span>아키텍처</span>');
    expect(html).not.toContain('<span>Diagram</span>');
  });

  it('throws the actionable generator error when the chart key is missing', () => {
    expect(() =>
      renderToStaticMarkup(<MermaidDiagram chart="flowchart TD\n  missing" title="없는 도표" />),
    ).toThrowError(new Error('Diagram asset is missing. Run the diagram generation script.'));
  });
});
