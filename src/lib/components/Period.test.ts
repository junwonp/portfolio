import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

import Period from '$lib/components/Period.svelte';

describe('Period', () => {
  describe('dateFrom formatting', () => {
    it('renders YYYY-MM as "YYYY. MM"', () => {
      const { container } = render(Period, { dateFrom: '2024-03' });
      const times = container.querySelectorAll('time');
      expect(times[0].textContent).toBe('2024. 03');
    });

    it('sets datetime attribute to the raw dateFrom value', () => {
      const { container } = render(Period, { dateFrom: '2024-03' });
      const times = container.querySelectorAll('time');
      expect(times[0].getAttribute('datetime')).toBe('2024-03');
    });

    it('renders year-only dateFrom without trailing dot or month', () => {
      const { container } = render(Period, { dateFrom: '2024' });
      const times = container.querySelectorAll('time');
      expect(times[0].textContent).toBe('2024. ');
    });
  });

  describe('~ separator', () => {
    it('shows ~ when dateFrom contains a dash and dateTo is absent (ongoing)', () => {
      const { container } = render(Period, { dateFrom: '2024-03' });
      expect(container.textContent).toContain('~');
    });

    it('shows ~ when dateFrom and dateTo are different months', () => {
      const { container } = render(Period, { dateFrom: '2022-01', dateTo: '2024-03' });
      expect(container.textContent).toContain('~');
    });

    it('does not show ~ when dateFrom has no dash', () => {
      const { container } = render(Period, { dateFrom: '2024' });
      expect(container.textContent).not.toContain('~');
    });

    it('does not show ~ when dateFrom equals dateTo (single-point project)', () => {
      const { container } = render(Period, { dateFrom: '2021-04', dateTo: '2021-04' });
      expect(container.textContent).not.toContain('~');
    });
  });

  describe('dateTo', () => {
    it('renders dateTo when provided and different from dateFrom', () => {
      const { container } = render(Period, { dateFrom: '2022-01', dateTo: '2024-03' });
      const times = container.querySelectorAll('time');
      expect(times).toHaveLength(2);
      expect(times[1].textContent).toBe('2024. 03');
      expect(times[1].getAttribute('datetime')).toBe('2024-03');
    });

    it('renders only one <time> when dateTo is not provided', () => {
      const { container } = render(Period, { dateFrom: '2022-01' });
      const times = container.querySelectorAll('time');
      expect(times).toHaveLength(1);
    });

    it('renders only one <time> when dateTo equals dateFrom', () => {
      const { container } = render(Period, { dateFrom: '2021-04', dateTo: '2021-04' });
      const times = container.querySelectorAll('time');
      expect(times).toHaveLength(1);
    });
  });
});
