import { fromStorageKey } from './storage-observable';

describe('fromStorageKey', () => {
  let store: Map<string, string>;
  let storageListeners: Set<(e: StorageEvent) => void>;

  beforeEach(() => {
    store = new Map();
    storageListeners = new Set();

    const mockStorage: Storage = {
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
      key: vi.fn((index: number) => [...store.keys()][index] ?? null),
    };

    Object.defineProperty(globalThis, 'localStorage', {
      value: mockStorage,
      writable: true,
      configurable: true,
    });

    Object.defineProperty(globalThis, 'window', {
      value: {
        addEventListener: vi.fn((event: string, fn: (e: StorageEvent) => void) => {
          if (event === 'storage') storageListeners.add(fn);
        }),
        removeEventListener: vi.fn((event: string, fn: (e: StorageEvent) => void) => {
          if (event === 'storage') storageListeners.delete(fn);
        }),
      } as unknown as Window & typeof globalThis,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('emits null when the key does not exist', () => {
    const values: Array<string | null> = [];
    const sub = fromStorageKey<string>('missing-key').subscribe((v) => values.push(v));
    expect(values).toEqual([null]);
    sub.unsubscribe();
  });

  it('emits the stored value on subscribe', () => {
    store.set('prefs', JSON.stringify({ _value: { theme: 'dark' } }));

    const values: Array<{ theme: string } | null> = [];
    const sub = fromStorageKey<{ theme: string }>('prefs').subscribe((v) => values.push(v));
    expect(values).toEqual([{ theme: 'dark' }]);
    sub.unsubscribe();
  });

  it('supports flat values (non-envelope format)', () => {
    store.set('token', JSON.stringify('abc-123'));

    const values: Array<string | null> = [];
    const sub = fromStorageKey<string>('token').subscribe((v) => values.push(v));
    expect(values).toEqual(['abc-123']);
    sub.unsubscribe();
  });

  it('emits null when a cross-tab StorageEvent removes the key', () => {
    store.set('prefs', JSON.stringify({ _value: 'data' }));

    const values: Array<string | null> = [];
    const sub = fromStorageKey<string>('prefs').subscribe((v) => values.push(v));

    // Simulate cross-tab removal
    const event = { key: 'prefs', newValue: null, storageArea: localStorage } as StorageEvent;
    storageListeners.forEach((fn) => fn(event));

    expect(values).toEqual(['data', null]);
    sub.unsubscribe();
  });

  it('emits the new value on cross-tab update', () => {
    store.set('prefs', JSON.stringify({ _value: 'old' }));

    const values: Array<string | null> = [];
    const sub = fromStorageKey<string>('prefs').subscribe((v) => values.push(v));

    // Simulate cross-tab update
    store.set('prefs', JSON.stringify({ _value: 'new' }));
    const event = {
      key: 'prefs',
      newValue: JSON.stringify({ _value: 'new' }),
      storageArea: localStorage,
    } as StorageEvent;
    storageListeners.forEach((fn) => fn(event));

    expect(values).toEqual(['old', 'new']);
    sub.unsubscribe();
  });

  it('ignores storage events for other keys', () => {
    store.set('prefs', JSON.stringify({ _value: 'data' }));

    const values: Array<string | null> = [];
    const sub = fromStorageKey<string>('prefs').subscribe((v) => values.push(v));

    const event = {
      key: 'other-key',
      newValue: JSON.stringify('ignored'),
      storageArea: localStorage,
    } as StorageEvent;
    storageListeners.forEach((fn) => fn(event));

    expect(values).toEqual(['data']); // No additional emission
    sub.unsubscribe();
  });

  it('handles session storage', () => {
    const values: Array<string | null> = [];
    const sub = fromStorageKey<string>('key', 'session').subscribe((v) => values.push(v));
    expect(values).toEqual([null]);
    sub.unsubscribe();
  });
});
