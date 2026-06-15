/** Error thrown when an async action is triggered again under `duplicateRunPolicy: 'reject'`. */
export class AsyncActionPendingError extends Error {
  override readonly name = 'AsyncActionPendingError';

  constructor(message = 'asyncAction rejected a duplicate run while the previous run is pending.') {
    super(message);
  }
}
