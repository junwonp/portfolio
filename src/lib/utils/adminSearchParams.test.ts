import { describe, expect, it } from 'vitest';

import { mergeAdminSearchParams } from '@/lib/utils/adminSearchParams';

describe('mergeAdminSearchParams', () => {
  it('preserves unrelated filters when the traffic range changes', () => {
    const current = new URLSearchParams('tab=analytics&timeRange=7d&classification=human');

    const params = new URLSearchParams(mergeAdminSearchParams(current, { range: '30d' }));

    expect(params.get('range')).toBe('30d');
    expect(params.get('timeRange')).toBe('7d');
    expect(params.get('classification')).toBe('human');
    expect(params.get('tab')).toBe('analytics');
  });

  it('preserves the session period when the application link filter changes', () => {
    const current = new URLSearchParams('timeRange=30d&classification=bot');

    const params = new URLSearchParams(
      mergeAdminSearchParams(current, { linkId: '42', tab: 'analytics' }),
    );

    expect(params.get('linkId')).toBe('42');
    expect(params.get('timeRange')).toBe('30d');
    expect(params.get('classification')).toBe('bot');
  });

  it('removes a filter when the update value is empty or null', () => {
    const current = new URLSearchParams('timeRange=7d&classification=human');

    const params = new URLSearchParams(mergeAdminSearchParams(current, { classification: null }));

    expect(params.has('classification')).toBe(false);
    expect(params.get('timeRange')).toBe('7d');
  });

  it('leaves a filter untouched when the update value is undefined', () => {
    const current = new URLSearchParams('timeRange=7d&range=30d');

    const params = new URLSearchParams(mergeAdminSearchParams(current, { range: undefined }));

    expect(params.get('timeRange')).toBe('7d');
    expect(params.get('range')).toBe('30d');
  });
});
