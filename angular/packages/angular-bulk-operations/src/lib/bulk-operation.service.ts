import { computed, signal, type Signal } from '@angular/core';
import type { BulkOperationRequest, BulkOperationResponse, BulkOperationResult } from './types';

/** Configuration for creating a {@link BulkOperationService}. */
export interface BulkOperationConfig<TItem, TResult, TPayload = void> {
  /**
   * The function that executes the bulk operation.
   * Receives the typed request and returns the server response.
   */
  readonly executeFn: (
    request: BulkOperationRequest<TItem, TPayload>,
  ) => Promise<BulkOperationResponse<TItem, TResult>>;
}

/** Summary statistics for the last bulk operation execution. */
export interface BulkOperationSummary {
  readonly total: number;
  readonly succeeded: number;
  readonly failed: number;
}

/**
 * Generic, injectable service for managing bulk operation execution,
 * progress tracking, and per-item result state.
 *
 * Use {@link provideBulkOperation} to register a configured instance
 * in the DI container, then inject via {@link injectBulkOperation}.
 *
 * If the same component needs multiple independent bulk operations
 * (e.g. delete + approve), register each with a separate
 * {@link provideBulkOperation} call using a distinct {@link InjectionToken}
 * via `useExisting` or create separate providers with unique tokens.
 *
 * ⚠️ Calling `execute()` while a previous execution is still in-flight
 * will abort the prior result update. The in-progress check prevents
 * concurrent execution but does **not** cancel the underlying fetch.
 */
export class BulkOperationService<TItem, TResult, TPayload = void> {
  private readonly _executeFn: (
    request: BulkOperationRequest<TItem, TPayload>,
  ) => Promise<BulkOperationResponse<TItem, TResult>>;

  private readonly _results = signal<readonly BulkOperationResult<TItem, TResult>[]>([]);
  private readonly _inProgress = signal(false);
  private readonly _error = signal<string | null>(null);

  /** Tracks whether an execute call is currently in flight. */
  private _pendingExecution: Promise<BulkOperationResponse<TItem, TResult>> | null = null;

  constructor(config: BulkOperationConfig<TItem, TResult, TPayload>) {
    this._executeFn = config.executeFn;
  }

  // ── Public signals ────────────────────────────────────────────

  /** Per-item results from the last execution. */
  readonly results: Signal<readonly BulkOperationResult<TItem, TResult>[]> =
    this._results.asReadonly();

  /** Whether a bulk operation is currently executing. */
  readonly inProgress: Signal<boolean> = this._inProgress.asReadonly();

  /** A top-level error message if the entire operation failed unexpectedly. */
  readonly error: Signal<string | null> = this._error.asReadonly();

  /** Aggregate summary computed from results, or `null` when no results exist. */
  readonly summary: Signal<BulkOperationSummary | null> = computed(() => {
    const r = this._results();
    if (r.length === 0) return null;
    return {
      total: r.length,
      succeeded: r.filter((x) => x.succeeded).length,
      failed: r.filter((x) => !x.succeeded).length,
    };
  });

  // ── Public methods ────────────────────────────────────────────

  /**
   * Execute a bulk operation.
   *
   * Sets `inProgress`, calls the execute function, updates results,
   * and returns the response.
   *
   * If called while a previous execution is still in-flight, returns
   * the **existing** pending promise instead of starting a new one.
   * This prevents duplicate concurrent operations from corrupting
   * the result state.
   */
  async execute(
    request: BulkOperationRequest<TItem, TPayload>,
  ): Promise<BulkOperationResponse<TItem, TResult>> {
    // Deduplicate concurrent in-flight executions.
    if (this._pendingExecution) {
      return this._pendingExecution;
    }

    this._inProgress.set(true);
    this._error.set(null);

    const execution = this._executeFn(request)
      .then((response) => {
        this._results.set(response.results);
        return response;
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'Unknown error';
        this._error.set(message);
        this._results.set([]);
        throw err;
      })
      .finally(() => {
        this._inProgress.set(false);
        this._pendingExecution = null;
      });

    this._pendingExecution = execution;
    return execution;
  }

  /** Clear all results and error state. */
  clearResults(): void {
    this._results.set([]);
    this._error.set(null);
  }

  /**
   * Retry only the failed items from the last execution.
   * Builds a new request from the original items and calls execute.
   */
  async retryFailed(
    buildRetryRequest: (
      failedItems: readonly BulkOperationResult<TItem, TResult>[],
    ) => BulkOperationRequest<TItem, TPayload>,
  ): Promise<BulkOperationResponse<TItem, TResult> | null> {
    const currentResults = this._results();
    const failedItems = currentResults.filter((r) => !r.succeeded);

    if (failedItems.length === 0) return null;

    const retryRequest = buildRetryRequest(failedItems);
    return this.execute(retryRequest);
  }
}
