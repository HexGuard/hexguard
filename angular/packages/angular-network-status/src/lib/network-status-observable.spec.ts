import { createNetworkStatusObservables } from './network-status-observable';

describe('createNetworkStatusObservables', () => {
  let onlineListeners: Set<() => void>;
  let offlineListeners: Set<() => void>;
  let connChangeListeners: Set<() => void>;
  let mockNavigator: {
    onLine: boolean;
    connection?: {
      effectiveType: string;
      addEventListener: (e: string, fn: () => void) => void;
      removeEventListener: (e: string, fn: () => void) => void;
    };
  };

  function triggerOnline(): void {
    mockNavigator.onLine = true;
    onlineListeners.forEach((fn) => fn());
  }

  function triggerOffline(): void {
    mockNavigator.onLine = false;
    offlineListeners.forEach((fn) => fn());
  }

  function triggerConnectionChange(): void {
    connChangeListeners.forEach((fn) => fn());
  }

  beforeEach(() => {
    onlineListeners = new Set();
    offlineListeners = new Set();
    connChangeListeners = new Set();

    mockNavigator = {
      onLine: true,
      connection: {
        effectiveType: '4g',
        addEventListener: (e: string, fn: () => void) => {
          connChangeListeners.add(fn);
        },
        removeEventListener: (e: string, fn: () => void) => {
          connChangeListeners.delete(fn);
        },
      },
    };

    Object.defineProperty(globalThis, 'navigator', {
      value: mockNavigator,
      writable: true,
      configurable: true,
    });

    Object.defineProperty(globalThis, 'window', {
      value: {
        addEventListener: (event: string, fn: () => void) => {
          if (event === 'online') onlineListeners.add(fn);
          if (event === 'offline') offlineListeners.add(fn);
        },
        removeEventListener: (event: string, fn: () => void) => {
          if (event === 'online') onlineListeners.delete(fn);
          if (event === 'offline') offlineListeners.delete(fn);
        },
      } as unknown as Window & typeof globalThis,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('online$', () => {
    it('does not emit initially (no replay — waits for events)', () => {
      const { online$ } = createNetworkStatusObservables();
      const values: boolean[] = [];
      const sub = online$.subscribe((v) => values.push(v));
      expect(values).toEqual([]);
      sub.unsubscribe();
    });

    it('emits true on online event', () => {
      const { online$ } = createNetworkStatusObservables();
      const values: boolean[] = [];
      const sub = online$.subscribe((v) => values.push(v));

      triggerOnline();
      expect(values).toEqual([true]);
      sub.unsubscribe();
    });

    it('emits false on offline event', () => {
      const { online$ } = createNetworkStatusObservables();
      const values: boolean[] = [];
      const sub = online$.subscribe((v) => values.push(v));

      triggerOffline();
      expect(values).toEqual([false]);
      sub.unsubscribe();
    });

    it('emits both true and false on successive events', () => {
      const { online$ } = createNetworkStatusObservables();
      const values: boolean[] = [];
      const sub = online$.subscribe((v) => values.push(v));

      triggerOffline();
      triggerOnline();
      triggerOffline();
      expect(values).toEqual([false, true, false]);
      sub.unsubscribe();
    });
  });

  describe('connectionType$', () => {
    it('emits the current connection type on subscribe', () => {
      const { connectionType$ } = createNetworkStatusObservables();
      const values: string[] = [];
      const sub = connectionType$.subscribe((v) => values.push(v));
      expect(values).toEqual(['4g']);
      sub.unsubscribe();
    });

    it('emits a new value when connection type changes', () => {
      const { connectionType$ } = createNetworkStatusObservables();
      const values: string[] = [];
      const sub = connectionType$.subscribe((v) => values.push(v));

      mockNavigator.connection!.effectiveType = '3g';
      triggerConnectionChange();
      expect(values).toEqual(['4g', '3g']);
      sub.unsubscribe();
    });

    it('handles missing Connection API gracefully', () => {
      delete mockNavigator.connection;

      const { connectionType$ } = createNetworkStatusObservables();
      const values: string[] = [];
      const sub = connectionType$.subscribe((v) => values.push(v));
      expect(values).toEqual(['unknown']);
      sub.unsubscribe();
    });
  });
});
