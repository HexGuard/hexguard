import { inject, type InjectionToken } from '@angular/core';
import type { Signal } from '@angular/core';
import { BulkOperationService, type BulkOperationSummary } from './bulk-operation.service';
import type { BulkOperationRequest, BulkOperationResponse, BulkOperationResult } from './types';

/** Typed facade returned by {@link injectBulkOperation}. */
export interface BulkOperationFacade<TItem, TResult, TPayload = void> {
  /** Per-item results from the last execution. */
  readonly results: Signal<readonly BulkOperationResult<TItem, TResult>[]>;
  /** Whether a bulk operation is currently executing. */
  readonly inProgress: Signal<boolean>;
  /** A top-level error message, or `null`. */
  readonly error: Signal<string | null>;
  /** Aggregate summary computed from results, or `null` when no results. */
  readonly summary: Signal<BulkOperationSummary | null>;

  /** Execute a bulk operation. */
  execute(
    request: BulkOperationRequest<TItem, TPayload>,
  ): Promise<BulkOperationResponse<TItem, TResult>>;

  /** Clear all results and error state. */
  clearResults(): void;

  /**
   * Retry only the failed items from the last execution.
   * Calls `buildRetryRequest` with the failed results to produce a new request.
   */
  retryFailed(
    buildRetryRequest: (
      failedItems: readonly BulkOperationResult<TItem, TResult>[],
    ) => BulkOperationRequest<TItem, TPayload>,
  ): Promise<BulkOperationResponse<TItem, TResult> | null>;
}

/**
 * Injects the {@link BulkOperationService} and returns a typed facade
 * with signals and methods.
 *
 * Must be called within an Angular injection context after
 * {@link provideBulkOperation} has been registered.
 *
 * When multiple bulk operations coexist (e.g. delete + approve),
 * pass the token returned by `provideBulkOperation()` to distinguish them:
 *
 * ```ts
 * const DELETE = provideBulkOperation({ executeFn: bulkDelete });
 * const APPROVE = provideBulkOperation({ executeFn: bulkApprove });
 *
 * // In component:
 * readonly deleteOp = injectBulkOperation(DELETE.token);
 * readonly approveOp = injectBulkOperation(APPROVE.token);
 * ```
 */
export function injectBulkOperation<TItem, TResult, TPayload = void>(
  token?: InjectionToken<BulkOperationService<TItem, TResult, TPayload>>,
): BulkOperationFacade<TItem, TResult, TPayload> {
  const service = token
    ? inject(token)
    : (inject(BulkOperationService) as BulkOperationService<TItem, TResult, TPayload>);

  return {
    results: service.results,
    inProgress: service.inProgress,
    error: service.error,
    summary: service.summary,
    execute: (request) => service.execute(request),
    clearResults: () => service.clearResults(),
    retryFailed: (buildRetryRequest) => service.retryFailed(buildRetryRequest),
  };
}
