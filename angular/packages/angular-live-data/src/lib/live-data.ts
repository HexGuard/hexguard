import { inject } from '@angular/core';
import type { LiveDataHandle, LiveDataOptions } from './types';
import { LiveDataService } from './live-data-service';

/**
 * Creates a reactive live-data polling handle.
 *
 * Periodically invokes `fetcher` at the configured `pollInterval`, exposing
 * the result as a readonly signal. Polling automatically pauses when the
 * document is hidden (Page Visibility API) and resumes when visible.
 *
 * @example
 * ```typescript
 * const live = injectLiveData({
 *   pollInterval: 15_000,
 *   fetcher: () => fetch('/api/dashboard/stats').then(r => r.json()),
 * });
 *
 * // In template:
 * // @if (live.loading()) { <span>Loading…</span> }
 * // @if (live.stale()) { <span class="badge">Stale</span> }
 * // {{ live.data() }}
 * ```
 *
 * @example
 * ```typescript
 * // With custom retry configuration
 * const live = injectLiveData({
 *   pollInterval: 30_000,
 *   fetcher: myApi.fetch,
 *   retryConfig: { maxRetries: 5, baseDelayMs: 500, maxDelayMs: 10_000 },
 * });
 * ```
 */
export function injectLiveData<T>(options: LiveDataOptions<T>): LiveDataHandle<T> {
  return inject(LiveDataService).createHandle(options);
}
