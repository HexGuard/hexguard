/**
 * Aggregate status for a bulk operation response.
 * - `completed`: All items succeeded.
 * - `partialFailure`: Some items succeeded, some failed.
 * - `failed`: All items failed.
 */
export type BulkOperationStatus = 'completed' | 'partialFailure' | 'failed';

/** Per-item error information. */
export interface BulkOperationError {
  /** Machine-readable error code. */
  readonly code: string;
  /** Human-readable error message. */
  readonly message: string;
  /** Optional dot-separated field path for form-level binding. */
  readonly field?: string;
}

/** The outcome of a single item in a bulk operation. */
export interface BulkOperationResult<TItem, TResult = void> {
  /** The original item from the request. */
  readonly item: TItem;
  /** Whether this item succeeded. */
  readonly succeeded: boolean;
  /** Optional success payload. */
  readonly result?: TResult;
  /** Error details when `succeeded` is `false`. */
  readonly error?: BulkOperationError;
}

/** The top-level response envelope for a bulk operation. */
export interface BulkOperationResponse<TItem, TResult = void> {
  /** Aggregate operation status. */
  readonly status: BulkOperationStatus;
  /** Total number of items in the request. */
  readonly totalCount: number;
  /** Number of items that succeeded. */
  readonly successCount: number;
  /** Number of items that failed. */
  readonly failureCount: number;
  /** Per-item results in the same order as the request. */
  readonly results: readonly BulkOperationResult<TItem, TResult>[];
}

/**
 * A bulk operation request with either a shared payload for all items
 * or per-item payloads keyed by item identifier.
 */
export interface BulkOperationRequest<TItem, TPayload = void> {
  /** The list of items to operate on. */
  readonly items: readonly TItem[];
  /**
   * A payload applied to all items.
   * When set, `perItemPayloads` is ignored.
   */
  readonly sharedPayload?: TPayload;
  /**
   * Per-item payloads keyed by item identifier.
   * Only used when `sharedPayload` is `undefined`.
   */
  readonly perItemPayloads?: ReadonlyMap<string, TPayload>;
}
