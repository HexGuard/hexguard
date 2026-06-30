import { TestBed } from '@angular/core/testing';

import { injectStorage } from './storage';
import type { StorageMeta } from './storage';

describe('injectStorage', () => {
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

    Object.defineProperty(globalThis, 'sessionStorage', {
      value: {
        ...mockStorage,
        getItem: vi.fn((key: string) => store.get(key) ?? null),
        setItem: vi.fn((key: string, value: string) => {
          store.set(key, value);
        }),
        removeItem: vi.fn((key: string) => {
          store.delete(key);
        }),
      } as Storage,
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

  describe('initialization', () => {
    it('returns default value when key is missing', () => {
      TestBed.runInInjectionContext(() => {
        const s = injectStorage('missing-key', { defaultValue: 'fallback' });
        expect(s.value()).toBe('fallback');
        expect(s.meta()).toBe('missing');
      });
    });

    it('reads existing value from storage', () => {
      store.set('theme', JSON.stringify({ _value: 'dark', _v: 1 }));

      TestBed.runInInjectionContext(() => {
        const s = injectStorage('theme', { defaultValue: 'light' });
        expect(s.value()).toBe('dark');
        expect(s.meta()).toBe('stored');
      });
    });

    it('treats version mismatch as missing', () => {
      store.set('prefs', JSON.stringify({ _value: { x: 1 }, _v: 1 }));

      TestBed.runInInjectionContext(() => {
        const s = injectStorage('prefs', { defaultValue: { x: 0 }, version: 2 });
        expect(s.value()).toEqual({ x: 0 });
        expect(s.meta()).toBe('versionMismatch');
      });
    });

    it('calls onUpgrade to migrate on version mismatch', () => {
      store.set('prefs', JSON.stringify({ _value: { oldField: 'hello' }, _v: 1 }));

      TestBed.runInInjectionContext(() => {
        const s = injectStorage('prefs', {
          defaultValue: { newField: '' },
          version: 2,
          onUpgrade(raw, fromVersion) {
            return { newField: `${(raw as Record<string, unknown>)['oldField']} (migrated from v${fromVersion})` };
          },
        });
        expect(s.value()).toEqual({ newField: 'hello (migrated from v1)' });
        expect(s.meta()).toBe('stored');
      });
    });

    it('treats expired TTL value as expired', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-06-18T00:00:00Z'));

      store.set(
        'session',
        JSON.stringify({
          _value: 'old',
          _v: 1,
          _ts: new Date('2026-06-18T00:00:00Z').getTime(),
        }),
      );

      TestBed.runInInjectionContext(() => {
        const s = injectStorage('session', { defaultValue: 'fresh', ttlMs: 86_400_000 });
        expect(s.value()).toBe('old');
        expect(s.meta()).toBe('stored');
      });

      // Advance past TTL
      vi.setSystemTime(new Date('2026-06-19T00:00:01Z'));

      TestBed.runInInjectionContext(() => {
        const s = injectStorage('session', { defaultValue: 'fresh', ttlMs: 86_400_000 });
        expect(s.value()).toBe('fresh');
        expect(s.meta()).toBe('expired');
      });

      vi.useRealTimers();
    });

    it('handles malformed JSON gracefully', () => {
      store.set('bad', 'not-json');

      TestBed.runInInjectionContext(() => {
        const s = injectStorage('bad', { defaultValue: 'ok' });
        expect(s.value()).toBe('ok');
        expect(s.meta()).toBe('missing');
      });
    });
  });

  describe('set / persist', () => {
    it('persists to storage and updates signal', () => {
      TestBed.runInInjectionContext(() => {
        const s = injectStorage('my-key', { defaultValue: 0 });
        s.set(42);

        expect(s.value()).toBe(42);
        expect(s.meta()).toBe('stored');

        const raw = store.get('my-key');
        expect(raw).toBeTruthy();
        const parsed = JSON.parse(raw!);
        expect(parsed._value).toBe(42);
        expect(parsed._v).toBe(1);
      });
    });

    it('includes timestamp when TTL is configured', () => {
      TestBed.runInInjectionContext(() => {
        const s = injectStorage('ttl-key', { defaultValue: '', ttlMs: 5000 });
        s.set('hello');

        const raw = store.get('ttl-key');
        const parsed = JSON.parse(raw!);
        expect(parsed._ts).toBeTypeOf('number');
      });
    });
  });

  describe('patch', () => {
    it('shallow-merges partial object', () => {
      TestBed.runInInjectionContext(() => {
        const s = injectStorage<{ a: number; b: number }>('obj', { defaultValue: { a: 1, b: 2 } });
        s.patch({ a: 10 });

        expect(s.value()).toEqual({ a: 10, b: 2 });
      });
    });
  });

  describe('clear', () => {
    it('removes key and resets to default', () => {
      store.set('temp', JSON.stringify({ _value: 'data', _v: 1 }));

      TestBed.runInInjectionContext(() => {
        const s = injectStorage('temp', { defaultValue: 'default' });
        expect(s.value()).toBe('data');

        s.clear();
        expect(s.value()).toBe('default');
        expect(s.meta()).toBe('missing');
        expect(store.has('temp')).toBe(false);
      });
    });
  });

  describe('cross-tab synchronization', () => {
    it('updates value on storage event from another tab', () => {
      TestBed.runInInjectionContext(() => {
        const s = injectStorage('shared', { defaultValue: '' });

        // Simulate storage event from another tab using plain object
        storageListeners.forEach((fn) =>
          fn({
            key: 'shared',
            newValue: JSON.stringify({ _value: 'from-other-tab', _v: 1 }),
            storageArea: localStorage,
          } as StorageEvent),
        );

        expect(s.value()).toBe('from-other-tab');
        expect(s.meta()).toBe('stored');
      });
    });

    it('resets to default when key is removed in another tab', () => {
      TestBed.runInInjectionContext(() => {
        store.set('shared', JSON.stringify({ _value: 'data', _v: 1 }));
        const s = injectStorage('shared', { defaultValue: 'default' });
        expect(s.value()).toBe('data');

        storageListeners.forEach((fn) =>
          fn({
            key: 'shared',
            newValue: null,
            storageArea: localStorage,
          } as StorageEvent),
        );

        expect(s.value()).toBe('default');
        expect(s.meta()).toBe('missing');
      });
    });
  });

  describe('graceful fallback', () => {
    it('keeps in-memory signal when storage is unavailable', () => {
      // Make localStorage throw
      const originalStorage = globalThis.localStorage;
      Object.defineProperty(globalThis, 'localStorage', {
        get: () => {
          throw new Error('Storage unavailable');
        },
        configurable: true,
      });

      TestBed.runInInjectionContext(() => {
        const s = injectStorage('test', { defaultValue: 'mem' });
        expect(s.value()).toBe('mem');

        s.set('updated');
        expect(s.value()).toBe('updated');
        expect(s.meta()).toBe('stored'); // in-memory
      });

      Object.defineProperty(globalThis, 'localStorage', {
        value: originalStorage,
        configurable: true,
      });
    });
  });

  describe('session storage', () => {
    it('uses sessionStorage when specified', () => {
      TestBed.runInInjectionContext(() => {
        const s = injectStorage('session-key', { defaultValue: '', storage: 'session' });
        s.set('session-value');

        expect(store.get('session-key')).toBeTruthy();
        const parsed = JSON.parse(store.get('session-key')!);
        expect(parsed._value).toBe('session-value');
      });
    });
  });
});
