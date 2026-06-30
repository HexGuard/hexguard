import { DestroyRef, Injectable, inject, signal } from '@angular/core';

/** Effective connection type from the Network Information API. */
export type EffectiveConnectionType = 'slow-2g' | '2g' | '3g' | '4g' | 'unknown';

const DEFAULT_OPTS = {
  onlineDebounceMs: 1000,
  backOnlineSignalDurationMs: 3000,
};

/**
 * Singleton service that manages the app-wide network connectivity state.
 *
 * All `injectNetworkStatus()` calls share the same `online`, `connectionType`,
 * and `recentlyBackOnline` signals, avoiding duplicate event listeners.
 */
@Injectable({ providedIn: 'root' })
export class NetworkStatusService {
  readonly online = signal(typeof navigator !== 'undefined' ? navigator.onLine : true);
  readonly connectionType = signal<EffectiveConnectionType>('unknown');
  readonly recentlyBackOnline = signal(false);

  private onlineDebounceMs = DEFAULT_OPTS.onlineDebounceMs;
  private backOnlineSignalDurationMs = DEFAULT_OPTS.backOnlineSignalDurationMs;
  private onlineTimer: ReturnType<typeof setTimeout> | null = null;
  private backOnlineTimer: ReturnType<typeof setTimeout> | null = null;
  private pendingResolve: (() => void) | null = null;

  constructor() {
    const destroyRef = inject(DestroyRef);

    const handleOnline = (): void => {
      if (this.onlineTimer) clearTimeout(this.onlineTimer);
      this.onlineTimer = setTimeout(() => {
        this.online.set(true);
        this.recentlyBackOnline.set(true);
        if (this.backOnlineTimer) clearTimeout(this.backOnlineTimer);
        this.backOnlineTimer = setTimeout(() => {
          this.recentlyBackOnline.set(false);
        }, this.backOnlineSignalDurationMs);
        this.pendingResolve?.();
        this.pendingResolve = null;
      }, this.onlineDebounceMs);
    };

    const handleOffline = (): void => {
      if (this.onlineTimer) clearTimeout(this.onlineTimer);
      if (this.backOnlineTimer) clearTimeout(this.backOnlineTimer);
      this.online.set(false);
      this.recentlyBackOnline.set(false);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      const conn = (navigator as unknown as {
        connection?: { effectiveType: string; addEventListener: (e: string, fn: () => void) => void; removeEventListener: (e: string, fn: () => void) => void; };
      }).connection;
      if (conn) {
        const updateType = (): void => this.connectionType.set((conn.effectiveType as EffectiveConnectionType) ?? 'unknown');
        updateType();
        conn.addEventListener('change', updateType);
        destroyRef.onDestroy(() => conn.removeEventListener('change', updateType));
      }

      destroyRef.onDestroy(() => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        if (this.onlineTimer) clearTimeout(this.onlineTimer);
        if (this.backOnlineTimer) clearTimeout(this.backOnlineTimer);
      });
    }
  }

  /** Configures options (first call wins — subsequent calls are no-ops). */
  configure(opts: { onlineDebounceMs?: number; backOnlineSignalDurationMs?: number }): void {
    this.onlineDebounceMs = opts.onlineDebounceMs ?? this.onlineDebounceMs;
    this.backOnlineSignalDurationMs = opts.backOnlineSignalDurationMs ?? this.backOnlineSignalDurationMs;
  }

  whenBackOnline(): Promise<void> {
    if (this.online()) return Promise.resolve();
    return new Promise((resolve) => {
      this.pendingResolve = resolve;
    });
  }
}
