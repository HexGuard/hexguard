import type { AsyncActionDuplicateRunPolicy, AsyncActionRunArgs } from './types';

/** Configuration accepted by `asyncAction()`. */
export interface AsyncActionOptions<TInput = void, TResult = void, TError = unknown> {
  /** Async action invoked by `run()`. */
  readonly run: (...args: AsyncActionRunArgs<TInput>) => Promise<TResult>;

  /** Maps unknown thrown values into the public error type. */
  readonly mapError?: (error: unknown) => TError;

  /**
   * Controls what happens when `run()` is called again while a previous run is pending.
   *
   * `reuse` returns the same in-flight promise and does not call `run` again.
   * `reject` returns a rejected promise with `AsyncActionPendingError`.
   */
  readonly duplicateRunPolicy?: AsyncActionDuplicateRunPolicy;
}
