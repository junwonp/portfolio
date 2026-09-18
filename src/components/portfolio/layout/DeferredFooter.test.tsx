// @vitest-environment jsdom
// @module-tag dom
import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

import DeferredFooter from '@/components/portfolio/layout/DeferredFooter';
import { LocaleProvider } from '@/lib/contexts/LocaleContext';
import { labelsMap } from '@/lib/portfolio/labels';

const renderDeferredFooter = () =>
  render(
    <LocaleProvider initialLocale="ko">
      <DeferredFooter />
    </LocaleProvider>,
  );

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('DeferredFooter', () => {
  it('renders nothing and keeps a pending timeout before the deferral elapses', () => {
    vi.useFakeTimers();

    const { container } = renderDeferredFooter();

    expect(container.querySelector('footer')).toBeNull();
    expect(vi.getTimerCount()).toBe(1);

    act(() => {
      vi.advanceTimersByTime(1599);
    });

    expect(container.querySelector('footer')).toBeNull();
  });

  it('mounts the lazy footer with the locale link after the deferral timeout', async () => {
    vi.useFakeTimers();

    renderDeferredFooter();

    await act(async () => {
      vi.advanceTimersByTime(1600);
    });

    // The lazy footer chunk resolves asynchronously; waitFor advances the fake timers while it settles.
    await vi.waitFor(() => {
      expect(document.querySelector('footer')).not.toBeNull();
    });

    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: labelsMap.ko.privacyPolicy })).toHaveAttribute(
      'href',
      '/privacy',
    );
    expect(vi.getTimerCount()).toBe(0);
  });

  it('cancels the pending deferral when unmounted before the timeout', () => {
    vi.useFakeTimers();

    const { unmount } = renderDeferredFooter();
    expect(vi.getTimerCount()).toBe(1);

    unmount();

    expect(vi.getTimerCount()).toBe(0);
  });
});
