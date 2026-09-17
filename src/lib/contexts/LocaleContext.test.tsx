// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Component, type ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const routerPush = vi.hoisted(() => vi.fn());
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: routerPush }),
}));

import { LocaleProvider, useLocale } from '@/lib/contexts/LocaleContext';
import { getLabels } from '@/lib/portfolio/labels';
import type { Language } from '@/lib/utils/language';

interface ErrorBoundaryState {
  message: string | null;
}

class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { message: null };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return { message: error instanceof Error ? error.message : String(error) };
  }

  render() {
    if (this.state.message !== null) {
      return <span data-testid="error">{this.state.message}</span>;
    }

    return this.props.children;
  }
}

function LocaleProbe({ targetLocale = 'en' }: { targetLocale?: Language }) {
  const { locale, labels, setLocale } = useLocale();

  return (
    <div>
      <span data-testid="locale">{locale}</span>
      <span data-testid="labels">{JSON.stringify(labels)}</span>
      <button type="button" onClick={() => setLocale(targetLocale)}>
        switch
      </button>
    </div>
  );
}

afterEach(() => {
  // Vitest globals are off, so RTL's auto-cleanup never registers; unmount explicitly.
  cleanup();
  vi.restoreAllMocks();
});

describe('useLocale', () => {
  it('throws the exact error message when rendered outside a LocaleProvider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <LocaleProbe />
      </ErrorBoundary>,
    );

    expect(screen.getByTestId('error').textContent).toBe(
      'useLocale must be used within a LocaleProvider',
    );
  });
});

describe('LocaleProvider', () => {
  it('exposes the initial locale to children', () => {
    render(
      <LocaleProvider initialLocale="en">
        <LocaleProbe />
      </LocaleProvider>,
    );

    expect(screen.getByTestId('locale').textContent).toBe('en');
  });

  it('exposes the labels for the active locale', () => {
    render(
      <LocaleProvider initialLocale="ko">
        <LocaleProbe />
      </LocaleProvider>,
    );

    expect(screen.getByTestId('labels').textContent).toBe(JSON.stringify(getLabels('ko')));
  });

  it('pushes the localized pathname with the current search and hash when the locale changes', () => {
    window.history.pushState({}, '', '/foo?page=2#details');

    render(
      <LocaleProvider initialLocale="ko">
        <LocaleProbe targetLocale="en" />
      </LocaleProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'switch' }));

    expect(routerPush).toHaveBeenCalledWith('/en/foo?page=2#details');
    expect(screen.getByTestId('locale').textContent).toBe('en');
  });

  it('pushes the default-locale pathname when switching back to Korean', () => {
    window.history.pushState({}, '', '/en/foo');

    render(
      <LocaleProvider initialLocale="en">
        <LocaleProbe targetLocale="ko" />
      </LocaleProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'switch' }));

    expect(routerPush).toHaveBeenCalledWith('/foo');
  });

  it('does not push when the localized pathname already matches the current one', () => {
    window.history.pushState({}, '', '/en/foo?page=2');

    render(
      <LocaleProvider initialLocale="en">
        <LocaleProbe targetLocale="en" />
      </LocaleProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'switch' }));

    expect(routerPush).not.toHaveBeenCalled();
  });

  it('switches the locale and re-renders the labels from a real user click', async () => {
    const user = userEvent.setup();
    window.history.pushState({}, '', '/ko/foo');

    render(
      <LocaleProvider initialLocale="ko">
        <LocaleProbe targetLocale="en" />
      </LocaleProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'switch' }));

    expect(routerPush).toHaveBeenCalledWith('/en/foo');
    expect(screen.getByTestId('locale').textContent).toBe('en');
    expect(screen.getByTestId('labels').textContent).toBe(JSON.stringify(getLabels('en')));
  });

  it('resets the active locale when the initialLocale prop changes', () => {
    const { rerender } = render(
      <LocaleProvider initialLocale="ko">
        <LocaleProbe />
      </LocaleProvider>,
    );
    expect(screen.getByTestId('locale').textContent).toBe('ko');

    rerender(
      <LocaleProvider initialLocale="en">
        <LocaleProbe />
      </LocaleProvider>,
    );

    expect(screen.getByTestId('locale').textContent).toBe('en');
  });
});
