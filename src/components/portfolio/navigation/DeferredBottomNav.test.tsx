// @vitest-environment jsdom
// @module-tag dom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mobileViewport = vi.hoisted(() => ({ value: false }));
vi.mock('@/lib/hooks/useMediaQuery', () => ({
  useMediaQuery: () => mobileViewport.value,
}));

const deferredRender = vi.hoisted(() => ({ value: false }));
vi.mock('@/lib/hooks/useDeferredClientRender', () => ({
  useDeferredClientRender: () => deferredRender.value,
}));

vi.mock('./BottomNav', () => ({
  default: ({ isProject }: { isProject?: boolean }) => (
    <div data-testid="bottom-nav" data-project={String(Boolean(isProject))} />
  ),
}));

import DeferredBottomNav from './DeferredBottomNav';

beforeEach(() => {
  mobileViewport.value = false;
  deferredRender.value = false;
});

afterEach(() => {
  cleanup();
});

describe('DeferredBottomNav', () => {
  it('renders the bottom navigation once the viewport matches and the client render is due', async () => {
    mobileViewport.value = true;
    deferredRender.value = true;

    render(<DeferredBottomNav isProject />);

    const nav = await screen.findByTestId('bottom-nav');
    expect(nav).toHaveAttribute('data-project', 'true');
  });

  it('leaves the project flag off by default', async () => {
    mobileViewport.value = true;
    deferredRender.value = true;

    render(<DeferredBottomNav />);

    const nav = await screen.findByTestId('bottom-nav');
    expect(nav).toHaveAttribute('data-project', 'false');
  });

  it('renders nothing on a desktop viewport even when the client render is due', () => {
    mobileViewport.value = false;
    deferredRender.value = true;

    const { container } = render(<DeferredBottomNav />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing while the deferred client render is still pending', () => {
    mobileViewport.value = true;
    deferredRender.value = false;

    const { container } = render(<DeferredBottomNav />);

    expect(container).toBeEmptyDOMElement();
  });
});
