import { describe, expect, it } from 'vitest';

import { formatDateTime } from '@/lib/utils/date';

describe('formatDateTime', () => {
  it('returns a dash for null or empty timestamps', () => {
    expect(formatDateTime(null)).toBe('-');
    expect(formatDateTime('')).toBe('-');
  });

  it('renders an ISO timestamp down to minutes without seconds or zone', () => {
    expect(formatDateTime('2026-01-02T03:04:05Z')).toBe('2026-01-02 03:04');
    expect(formatDateTime('2026-01-02T03:04')).toBe('2026-01-02 03:04');
  });

  it('leaves a date-only value unchanged', () => {
    expect(formatDateTime('2026-01-02')).toBe('2026-01-02');
  });

  it('keeps a value shorter than the minute window intact', () => {
    expect(formatDateTime('2026')).toBe('2026');
  });
});
