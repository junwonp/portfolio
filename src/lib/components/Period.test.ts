import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

import Period from './Period.svelte';

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
    it('shows ~ when dateFrom contains a dash', () => {
      const { container } = render(Period, { dateFrom: '2024-03' });
      expect(container.textContent).toContain('~');
    });

    it('does not show ~ when dateFrom has no dash', () => {
      const { container } = render(Period, { dateFrom: '2024' });
      expect(container.textContent).not.toContain('~');
    });
  });

  describe('dateTo', () => {
    it('renders dateTo when provided', () => {
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
  });
});
