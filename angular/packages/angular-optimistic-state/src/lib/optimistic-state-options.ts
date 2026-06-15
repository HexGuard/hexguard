import type { OptimisticMutationConflictPolicy, OptimisticStateRunArgs } from './types';

/**
 * Configures how an optimistic state handle behaves.
 */
export interface OptimisticStateOptions<
  TValue,
  TInput = void,
  TResult = void,
  TError = unknown,
  TTarget extends PropertyKey = string,
> {
  /** Initial committed value before any optimistic mutations run. */
  readonly initialValue: TValue;

  /** Runs the underlying mutation for each optimistic input. */
  readonly run: (...args: OptimisticStateRunArgs<TInput>) => Promise<TResult>;

  /** Returns the logical target used for same-target conflict handling. */
  readonly getTarget: (input: TInput) => TTarget;

  /** Applies the optimistic overlay to the current visible value. */
  readonly apply: (value: TValue, input: TInput) => TValue;

  /** Reconciles a successful server result into the committed value. */
  readonly reconcile?: (value: TValue, result: TResult, input: TInput) => TValue;

  /** Maps unknown failures into the exported error type. */
  readonly mapError?: (error: unknown) => TError;

  /**
   * Controls how a second unsettled mutation for the same target is handled.
   *
   * The first release defaults to `reject` so consumers opt into more complex
   * concurrency behavior explicitly.
   */
  readonly conflictPolicy?: OptimisticMutationConflictPolicy;

  /** Supplies timestamps for mutation history entries. Defaults to `Date.now`. */
  readonly now?: () => number;
}
