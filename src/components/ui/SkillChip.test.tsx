import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import SkillChip from '@/components/ui/SkillChip';

const skillChipStyles = readFileSync(new URL('./SkillChip.css.ts', import.meta.url), 'utf8');

describe('SkillChip', () => {
  it('drops the category dot so grouping carries category instead', () => {
    expect(skillChipStyles).not.toContain('::before');
    expect(skillChipStyles).not.toContain('createVar');
  });

  it('renders the skill name as plain text', () => {
    const html = renderToStaticMarkup(<SkillChip skill="TypeScript" />);

    expect(html).toContain('TypeScript');
    expect(html).not.toContain('--color-cat-');
  });
});
