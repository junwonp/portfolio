import { describe, expect, it } from 'vitest';

import { printableResume } from '@/content/printableResume';

describe('printableResume', () => {
  it('does not expose a phone number in public resume contact content', () => {
    const contactText = printableResume.contactItems.map((item) => item.value).join(' ');

    expect(contactText).not.toContain('10-5713-3565');
    expect(contactText).not.toMatch(/\+82|010-\d{4}-\d{4}/);
  });

  it('keeps the public portfolio URL aligned to the custom domain', () => {
    const portfolioContact = printableResume.contactItems.find((item) => item.label === 'Portfolio');

    expect(portfolioContact?.value).toBe('https://junwon.dev');
  });
});
