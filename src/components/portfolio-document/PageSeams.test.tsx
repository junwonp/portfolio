import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import PageSeams from './PageSeams';

const hooks = vi.hoisted(() => ({
  effect: undefined as (() => (() => void) | undefined) | undefined,
  dependencies: undefined as readonly unknown[] | undefined,
  layer: {} as object,
  layout: {} as object,
  setCalls: 0,
}));

vi.mock('react', async (original) => ({
  ...(await original<typeof import('react')>()),
  useEffect: (effect: typeof hooks.effect, dependencies: readonly unknown[]) => {
    hooks.effect = effect;
    hooks.dependencies = dependencies;
  },
  useRef: (initial: unknown) => ({ current: initial ?? hooks.layer }),
  useState: (initial: object) => [
    initial,
    (layout: object) => {
      hooks.layout = layout;
      hooks.setCalls += 1;
    },
  ],
}));

class ImageStub extends EventTarget {
  complete = false;
}

class ElementStub {
  readonly classList = { add: vi.fn(), remove: vi.fn() };
  readonly style = { setProperty: vi.fn(), removeProperty: vi.fn() };
  constructor(
    readonly tagName: string,
    readonly top: number,
    public height: number,
    readonly children: ElementStub[] = [],
    readonly images: ImageStub[] = [],
  ) {}
  getBoundingClientRect() {
    return {
      top: this.top,
      bottom: this.top + this.height,
      height: this.height,
      left: 0,
      width: 794,
    };
  }
  querySelectorAll(selector: string) {
    return selector === 'img' ? this.images : this.children;
  }
}

const mount = (items: ElementStub[], contentKey = 'ko', images: ImageStub[] = []) => {
  const sheet = new ElementStub('ARTICLE', 0, 2000, items, images);
  hooks.layer = {
    parentElement: { querySelector: () => sheet },
    getBoundingClientRect: () => ({ top: 0, left: 0 }),
  };
  renderToStaticMarkup(<PageSeams contentKey={contentKey} />);
  return { cleanup: hooks.effect?.(), sheet };
};

const flush = async () => {
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
};

describe('PageSeams caller', () => {
  beforeEach(() => {
    vi.stubGlobal('document', { fonts: { ready: Promise.resolve() } });
    vi.stubGlobal('window', new EventTarget());
    vi.stubGlobal('requestAnimationFrame', (callback: () => void) => {
      callback();
      return 1;
    });
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
    hooks.layout = {};
    hooks.setCalls = 0;
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it.each([false, true])(
    'refuses spacing for an oversized item or heading group (%s)',
    async (group) => {
      const first = group
        ? new ElementStub('SECTION', 0, 1500, [
            new ElementStub('H2', 0, 50),
            new ElementStub('ARTICLE', 50, 1450),
          ])
        : new ElementStub('HEADER', 0, 1500);
      const next = new ElementStub('ARTICLE', 1500, 100);
      const { cleanup, sheet } = mount([first, next]);
      await flush();
      expect(next.style.setProperty).not.toHaveBeenCalled();
      expect(sheet.style.setProperty).not.toHaveBeenCalled();
      expect(hooks.layout).toMatchObject({ pageCount: 0, issue: 'oversized' });
      cleanup?.();
    },
  );

  it('refuses spacing when block geometry is invalid', async () => {
    const invalid = new ElementStub('ARTICLE', 0, 0);
    const next = new ElementStub('ARTICLE', 0, 900);
    const { cleanup, sheet } = mount([invalid, next]);
    await flush();
    expect(next.style.setProperty).not.toHaveBeenCalled();
    expect(sheet.style.setProperty).not.toHaveBeenCalled();
    expect(hooks.layout).toMatchObject({ pageCount: 0, issue: 'invalid' });
    cleanup?.();
  });

  it('re-measures on resize once fonts and images have settled', async () => {
    const next = new ElementStub('ARTICLE', 400, 400);
    const { cleanup } = mount([new ElementStub('HEADER', 0, 400), next]);
    await flush();
    expect(hooks.layout).toMatchObject({ pageCount: 1 });
    next.height = 900;
    window.dispatchEvent(new Event('resize'));
    expect(hooks.setCalls).toBe(2);
    expect(hooks.layout).toMatchObject({ pageCount: 2 });
    cleanup?.();
  });

  it('does not let resize bypass font readiness', async () => {
    const ready = Promise.withResolvers<void>();
    vi.stubGlobal('document', { fonts: { ready: ready.promise } });
    const next = new ElementStub('ARTICLE', 800, 800);
    const { cleanup } = mount([new ElementStub('HEADER', 0, 800), next]);
    window.dispatchEvent(new Event('resize'));
    await flush();
    expect(next.style.setProperty).not.toHaveBeenCalled();
    ready.resolve();
    await flush();
    expect(next.style.setProperty).toHaveBeenCalled();
    cleanup?.();
  });

  it('waits for images even after fonts settle and releases both image listeners', async () => {
    const image = new ImageStub();
    const remove = vi.spyOn(image, 'removeEventListener');
    const next = new ElementStub('ARTICLE', 800, 800);
    const { cleanup } = mount([new ElementStub('HEADER', 0, 800), next], 'ko', [image]);
    await flush();
    window.dispatchEvent(new Event('resize'));
    expect(next.style.setProperty).not.toHaveBeenCalled();
    image.dispatchEvent(new Event('load'));
    await flush();
    expect(next.style.setProperty).toHaveBeenCalled();
    expect(remove.mock.calls.map(([type]) => type)).toEqual(['error', 'load']);
    cleanup?.();
  });

  it('releases pending image listeners on unmount without applying spacing', async () => {
    const image = new ImageStub();
    const remove = vi.spyOn(image, 'removeEventListener');
    const next = new ElementStub('ARTICLE', 800, 800);
    const { cleanup } = mount([new ElementStub('HEADER', 0, 800), next], 'ko', [image]);
    await flush();
    cleanup?.();
    await flush();
    window.dispatchEvent(new Event('resize'));
    expect(next.style.setProperty).not.toHaveBeenCalled();
    expect(remove.mock.calls.map(([type]) => type)).toEqual(['error', 'load']);
  });

  it('keys measurement to content and cancels a pending old measurement', async () => {
    const ready = Promise.withResolvers<void>();
    vi.stubGlobal('document', { fonts: { ready: ready.promise } });
    const oldItem = new ElementStub('ARTICLE', 800, 800);
    const old = mount([new ElementStub('HEADER', 0, 800), oldItem]);
    expect(hooks.dependencies).toContain('ko');
    old.cleanup?.();
    const next = mount([new ElementStub('HEADER', 0, 100)], 'en');
    expect(hooks.dependencies).toContain('en');
    ready.resolve();
    await flush();
    expect(oldItem.style.setProperty).not.toHaveBeenCalled();
    expect(hooks.layout).toMatchObject({ pageCount: 1 });
    next.cleanup?.();
  });
});
