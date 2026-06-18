import { DestroyRef, Injectable, Inject, InjectionToken, type Signal, signal } from '@angular/core';

import type { FeatureFlagCatalog } from './feature-flag-providers';

/** Options for configuring the feature flag sync service. */
export interface FeatureFlagSyncOptions {
  /** Base URL of the feature flag API endpoint. */
  baseUrl: string;

  /** Optional polling interval in milliseconds.
   *  When set, the service polls automatically. */
  pollingIntervalMs?: number;

  /**
   * Optional custom sync endpoint path.
   *
   * Defaults to `/api/feature-flags/sync`. Change this when your backend
   * routes the sync endpoint at a different path under `baseUrl`.
   */
  readonly syncEndpointPath?: string;

  /**
   * Optional custom fetch request init that is merged into every sync
   * HTTP request. Use this to attach authorization headers, CSRF tokens,
   * AbortSignal, or other fetch-level configuration.
   *
   * Headers are merged with any library-internal headers (none currently).
   * Duplicate keys in `headers` override library defaults.
   */
  readonly fetchInit?: RequestInit;
}

/** Injection token for {@link FeatureFlagSyncOptions}. */
export const FEATURE_FLAG_SYNC_OPTIONS = new InjectionToken<FeatureFlagSyncOptions>(
  'FEATURE_FLAG_SYNC_OPTIONS',
);

/**
 * Service that syncs the feature flag catalog from a backend API
 * using conditional 304 responses via context hash.
 *
 * By default, sync is on-demand via `sync()`. Polling is opt-in
 * via `startPolling(intervalMs)`.
 */
@Injectable()
export class FeatureFlagSyncService {
  private readonly _catalog = signal<FeatureFlagCatalog | null>(null);
  private _currentHash: string | null = null;
  private _pollingTimerId: ReturnType<typeof setInterval> | null = null;
  private _baseUrl: string;
  private _syncEndpointPath: string;
  private _fetchInit: RequestInit | undefined;

  /** Signal emitting the latest synced catalog, or null before the
   *  first successful sync. */
  readonly catalog: Signal<FeatureFlagCatalog | null> = this._catalog.asReadonly();

  constructor(
    @Inject(FEATURE_FLAG_SYNC_OPTIONS) options: FeatureFlagSyncOptions,
    @Inject(DestroyRef) private readonly destroyRef: DestroyRef,
  ) {
    this._baseUrl = options.baseUrl.replace(/\/+$/, '');
    this._syncEndpointPath = options.syncEndpointPath ?? '/api/feature-flags/sync';
    this._fetchInit = options.fetchInit;

    if (options.pollingIntervalMs && options.pollingIntervalMs > 0) {
      this.startPolling(options.pollingIntervalMs);
    }

    // Clean up polling timer when the service is destroyed
    this.destroyRef.onDestroy(() => this.stopPolling());
  }

  /**
   * Triggers a sync from the backend. Returns the synced catalog
   * or null if the server returned 304 (no change).
   */
  async sync(): Promise<FeatureFlagCatalog | null> {
    const normalizedPath = this._syncEndpointPath.startsWith('/')
      ? this._syncEndpointPath
      : `/${this._syncEndpointPath}`;

    const url = this._currentHash
      ? `${this._baseUrl}${normalizedPath}?contextHash=${encodeURIComponent(this._currentHash)}`
      : `${this._baseUrl}${normalizedPath}`;

    let response: Response;
    try {
      response = await fetch(url, this._fetchInit);
    } catch (cause) {
      throw new Error(`Feature flag sync failed at ${url}: network error`, { cause });
    }

    if (response.status === 304) {
      return null;
    }

    if (!response.ok) {
      throw new Error(
        `Feature flag sync failed at ${url}: ${response.status} ${response.statusText}`,
      );
    }

    const body: unknown = await response.json();

    if (!isValidSyncResponse(body)) {
      throw new Error(`Feature flag sync returned invalid payload from ${url}`);
    }

    const catalog: FeatureFlagCatalog = {
      flags: body.flags as Record<string, never>,
      contextHash: body.contextHash,
    };

    this._catalog.set(catalog);
    this._currentHash = body.contextHash;
    return catalog;
  }

  /**
   * Starts automatic polling at the given interval.
   * Call `stopPolling()` to cancel.
   */
  startPolling(intervalMs: number): void {
    if (intervalMs <= 0) {
      throw new Error(`Polling interval must be positive, got ${intervalMs}.`);
    }
    this.stopPolling();
    this._pollingTimerId = setInterval(() => {
      this.sync().catch(() => {
        // Silently ignore sync errors during polling;
        // the previous catalog remains available.
      });
    }, intervalMs);
  }

  /** Stops automatic polling, if active. */
  stopPolling(): void {
    if (this._pollingTimerId !== null) {
      clearInterval(this._pollingTimerId);
      this._pollingTimerId = null;
    }
  }
}

/**
 * Validates the shape of a sync API response.
 * Guards against malformed payloads from the server.
 */
/**
 * Validates the shape of a sync API response.
 * Guards against malformed payloads from the server.
 */
function isValidSyncResponse(
  value: unknown,
): value is { flags: Record<string, unknown>; contextHash: string } {
  if (typeof value !== 'object' || value === null) return false;
  if (!('contextHash' in value) || !('flags' in value)) return false;
  const flags = (value as { flags: unknown }).flags;
  const hash = (value as { contextHash: unknown }).contextHash;
  return (
    typeof flags === 'object' && flags !== null && !Array.isArray(flags) && typeof hash === 'string'
  );
}
