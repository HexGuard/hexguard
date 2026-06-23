import { watchFormDraft } from './form-drafts-observable';

describe('watchFormDraft', () => {
  let store: Map<string, string>;

  beforeEach(() => {
    vi.useFakeTimers();
    store = new Map();

    Object.defineProperty(globalThis, 'localStorage', {
      value: {
        getItem: vi.fn((key: string) => store.get(key) ?? null),
        setItem: vi.fn((key: string, value: string) => {
          store.set(key, value);
        }),
        removeItem: vi.fn((key: string) => {
          store.delete(key);
        }),
        clear: vi.fn(() => store.clear()),
        get length(): number {
          return store.size;
        },
        key: vi.fn((i: number) => [...store.keys()][i] ?? null),
      },
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('starts with no draft when key is missing', () => {
    const draft = watchFormDraft<{ title: string }>('missing');
    const values: Array<{ title: string } | null> = [];
    draft.draft$.subscribe((d: { data: { title: string } } | null) => values.push(d?.data ?? null));
    expect(values).toEqual([null]);
  });

  it('hasDraft$ is false initially when no draft exists', () => {
    const draft = watchFormDraft<{ title: string }>('missing');
    const values: boolean[] = [];
    draft.hasDraft$.subscribe((v) => values.push(v));
    expect(values).toEqual([false]);
  });

  it('hasDraft$ becomes true after debounced save', () => {
    const draft = watchFormDraft<{ title: string }>('test', { debounceMs: 500 });
    const values: boolean[] = [];
    draft.hasDraft$.subscribe((v) => values.push(v));

    draft.save({ title: 'Hello' });
    // Still no draft before debounce
    expect(values[values.length - 1]).toBe(false);

    vi.advanceTimersByTime(500);
    expect(values[values.length - 1]).toBe(true);
    expect(store.has('hexguard:draft:test')).toBe(true);
  });

  it('draft$ emits the saved data after debounce', () => {
    const draft = watchFormDraft<{ title: string }>('test', { debounceMs: 500 });
    const values: Array<{ title: string } | null> = [];
    draft.draft$.subscribe((d) => values.push(d?.data ?? null));

    draft.save({ title: 'Hello' });
    vi.advanceTimersByTime(500);

    expect(values[values.length - 1]).toEqual({ title: 'Hello' });
  });

  it('reads existing draft from localStorage on creation', () => {
    const existingDraft = {
      data: { title: 'Existing' },
      meta: {
        savedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 86_400_000).toISOString(),
      },
    };
    store.set('hexguard:draft:existing', JSON.stringify(existingDraft));

    const draft = watchFormDraft<{ title: string }>('existing');
    const values: Array<{ title: string } | null> = [];
    draft.draft$.subscribe((d: { data: { title: string } } | null) => values.push(d?.data ?? null));
    expect(values[0]).toEqual({ title: 'Existing' });
  });

  it('clear removes the draft from storage', () => {
    const draft = watchFormDraft<{ title: string }>('test', { debounceMs: 500 });
    draft.save({ title: 'Hello' });
    vi.advanceTimersByTime(500);

    const values: Array<{ title: string } | null> = [];
    draft.draft$.subscribe((d: { data: { title: string } } | null) => values.push(d?.data ?? null));

    draft.clear();
    expect(values[values.length - 1]).toBeNull();
    expect(store.has('hexguard:draft:test')).toBe(false);
  });
});
