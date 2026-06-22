/** Configuration for retry on polling failure. */
export interface RetryConfig {
  /** Maximum number of consecutive retry attempts before giving up. */
  maxRetries: number;
  /** Base delay in milliseconds before the first retry (doubles each attempt). */
  baseDelayMs: number;
  /** Maximum delay in milliseconds between retries. */
  maxDelayMs: number;
}

/** Options for configuring a live-data polling instance. */
export interface LiveDataOptions<T> {
  /** Interval in milliseconds between successive polls. */
  readonly pollInterval: number;
  /** Async function that fetches the current data value. */
  readonly fetcher: () => Promise<T>;
  /**
   * Time in milliseconds after which cached data is considered stale.
   * @default pollInterval * 2
   */
  readonly staleAfter?: number;
  /** Retry configuration for handling polling failures. */
  readonly retryConfig?: RetryConfig;
  /**
   * Whether to automatically pause polling when the document tab is hidden.
   * @default true
   */
  readonly visibilityAware?: boolean;
}

/** Default retry configuration applied when no custom config is provided. */
export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelayMs: 1_000,
  maxDelayMs: 30_000,
};

/** Reactive handle returned by {@link injectLiveData}. */
export interface LiveDataHandle<T> {
  /** The latest successfully fetched data value, or `undefined` before the first successful poll. */
  readonly data: import('@angular/core').Signal<T | undefined>;
  /** Whether the current data is considered stale (no successful fetch within the stale window). */
  readonly stale: import('@angular/core').Signal<boolean>;
  /** Whether a fetch is currently in progress. */
  readonly loading: import('@angular/core').Signal<boolean>;
  /** The last error encountered during polling, or `null` if the last poll succeeded. */
  readonly error: import('@angular/core').Signal<unknown>;
  /** Whether polling is currently paused. */
  readonly isPaused: import('@angular/core').Signal<boolean>;
  /** Pause polling. Has no effect if already paused. */
  pause(): void;
  /** Resume polling. Triggers an immediate fetch if no data is available. Has no effect if not paused. */
  resume(): void;
  /** Trigger an immediate fetch, bypassing the regular interval. */
  refresh(): Promise<void>;
}
