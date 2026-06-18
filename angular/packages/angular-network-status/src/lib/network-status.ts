import { DestroyRef, inject, signal } from '@angular/core';

/** Effective connection type from the Network Information API. */
export type EffectiveConnectionType = 'slow-2g' | '2g' | '3g' | '4g' | 'unknown';

/** Options for {@link injectNetworkStatus}. */
export interface NetworkStatusOptions {
  /**
   * Debounce window (in ms) for the offline→online transition.
   * Prevents flapping when connectivity rapidly toggles.
   * @default 1000
   */
  readonly onlineDebounceMs?: number;

  /**
   * How long (in ms) the `recentlyBackOnline` signal stays `true` after reconnection.
   * @default 3000
   */
  readonly backOnlineSignalDurationMs?: number;
}

/** The return type of {@link injectNetworkStatus}. */
export interface NetworkStatus {
  /** Whether the browser currently reports being online. */
  readonly online: import('@angular/core').Signal<boolean>;

  /** The estimated effective connection type, or `'unknown'` when unavailable. */
  readonly connectionType: import('@angular/core').Signal<EffectiveConnectionType>;

  /**
   * `true` for a short duration after transitioning back online.
   * Useful for showing a brief "Back online!" indicator.
   */
  readonly recentlyBackOnline: import('@angular/core').Signal<boolean>;

  /**
   * Returns a promise that resolves on the next online transition.
   * Resolves immediately if already online.
   *
   * @example
   * ```ts
   * if (!network.online()) {
   *   await network.whenBackOnline();
   * }
   * await saveData();
   * ```
   */
  whenBackOnline(): Promise<void>;
}

/**
 * Injects network connectivity status signals.
 *
 * Must be called within an Angular injection context.
 * Automatically cleans up event listeners via `DestroyRef`.
 *
 * @example
 * ```ts
 * const network = injectNetworkStatus();
 *
 * if (network.online()) {
 *   console.log('Connected via', network.connectionType());
 * }
 * ```
 */
export function injectNetworkStatus(options?: NetworkStatusOptions): NetworkStatus {
  const opts: Required<NetworkStatusOptions> = {
    onlineDebounceMs: options?.onlineDebounceMs ?? 1000,
    backOnlineSignalDurationMs: options?.backOnlineSignalDurationMs ?? 3000,
  };

  const destroyRef = inject(DestroyRef);

  // ── State signals ─────────────────────────────────────────────

  const online = signal(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const connectionType = signal<EffectiveConnectionType>('unknown');
  const recentlyBackOnline = signal(false);

  // ── Timer management ──────────────────────────────────────────

  let onlineTimer: ReturnType<typeof setTimeout> | null = null;
  let backOnlineTimer: ReturnType<typeof setTimeout> | null = null;
  let pendingResolve: (() => void) | null = null;

  // ── Online/offline event handlers ─────────────────────────────

  const handleOnline = (): void => {
    // Clear any pending offline timer
    if (onlineTimer) clearTimeout(onlineTimer);

    // Debounce: only transition after a quiet period
    onlineTimer = setTimeout(() => {
      online.set(true);
      recentlyBackOnline.set(true);

      // Clear the "recently back online" flag after the configured duration
      if (backOnlineTimer) clearTimeout(backOnlineTimer);
      backOnlineTimer = setTimeout(() => {
        recentlyBackOnline.set(false);
      }, opts.backOnlineSignalDurationMs);

      // Resolve any pending whenBackOnline() promise
      pendingResolve?.();
      pendingResolve = null;
    }, opts.onlineDebounceMs);
  };

  const handleOffline = (): void => {
    if (onlineTimer) clearTimeout(onlineTimer);
    if (backOnlineTimer) clearTimeout(backOnlineTimer);
    online.set(false);
    recentlyBackOnline.set(false);
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // ── Connection type (Chromium-based browsers) ──────────────
    const conn = (
      navigator as unknown as {
        connection?: {
          effectiveType: string;
          addEventListener: (e: string, fn: () => void) => void;
          removeEventListener: (e: string, fn: () => void) => void;
        };
      }
    ).connection;
    if (conn) {
      const updateType = (): void => {
        connectionType.set((conn.effectiveType as EffectiveConnectionType) ?? 'unknown');
      };
      updateType();
      conn.addEventListener('change', updateType);

      destroyRef.onDestroy(() => {
        conn.removeEventListener('change', updateType);
      });
    }

    // ── Cleanup on destroy ─────────────────────────────────────
    destroyRef.onDestroy(() => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (onlineTimer) clearTimeout(onlineTimer);
      if (backOnlineTimer) clearTimeout(backOnlineTimer);
    });
  }

  // ── Public API ────────────────────────────────────────────────

  return {
    online: online.asReadonly(),
    connectionType: connectionType.asReadonly(),
    recentlyBackOnline: recentlyBackOnline.asReadonly(),
    whenBackOnline: () =>
      online()
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            pendingResolve = resolve;
          }),
  };
}
