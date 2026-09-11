import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import * as buttonStyles from '@/components/ui/Button.css';
import ButtonGroup from '@/components/ui/ButtonGroup';
import * as styles from '@/components/ui/ButtonGroup.css';

const options = [
  { value: '7d', label: '7일' },
  { value: '30d', label: '30일' },
  { value: '1y', label: '1년' },
];

function countOccurrences(html: string, needle: string): number {
  return html.split(needle).length - 1;
}

describe('ButtonGroup', () => {
  it('renders every option as a type=button control', () => {
    const html = renderToStaticMarkup(
      <ButtonGroup options={options} value="30d" onChange={() => {}} />,
    );

    expect(html).toContain('7일');
    expect(html).toContain('30일');
    expect(html).toContain('1년');
    expect((html.match(/<button/g) ?? []).length).toBe(3);
    expect(html).toContain('type="button"');
  });

  it('marks exactly the selected option as pressed', () => {
    const html = renderToStaticMarkup(
      <ButtonGroup options={options} value="30d" onChange={() => {}} />,
    );

    expect((html.match(/aria-pressed="true"/g) ?? []).length).toBe(1);
    expect((html.match(/aria-pressed="false"/g) ?? []).length).toBe(2);
  });

  it('expresses selection through the primary variant, not an appended active class', () => {
    const html = renderToStaticMarkup(
      <ButtonGroup options={options} value="30d" onChange={() => {}} />,
    );

    expect(countOccurrences(html, buttonStyles.variant.primary)).toBe(1);
    expect(countOccurrences(html, buttonStyles.variant.ghost)).toBe(2);
  });

  it('renders a labelled group container', () => {
    const html = renderToStaticMarkup(
      <ButtonGroup options={options} value="7d" onChange={() => {}} ariaLabel="기간 선택" />,
    );

    expect(html).toContain('role="group"');
    expect(html).toContain('aria-label="기간 선택"');
    expect(html).toContain(styles.base);
  });
});
