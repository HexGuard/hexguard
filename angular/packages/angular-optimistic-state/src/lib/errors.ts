/** Error thrown when a same-target optimistic mutation is rejected while one is unsettled. */
export class OptimisticStatePendingError extends Error {
  override readonly name = 'OptimisticStatePendingError';

  constructor(
    message = 'optimisticState rejected a same-target mutation while another mutation for that target is still unsettled.',
  ) {
    super(message);
  }
}
