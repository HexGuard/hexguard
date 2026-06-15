import type { Signal } from '@angular/core';

/** High-level lifecycle state for the optimistic handle. */
export type OptimisticStateStatus = 'idle' | 'pending' | 'error';

/** Same-target conflict handling for a new optimistic mutation. */
export type OptimisticMutationConflictPolicy = 'queue' | 'reject' | 'replace';

/** Lifecycle states for individual optimistic mutation entries. */
export type OptimisticMutationEntryStatus =
  | 'failed'
  | 'pending'
  | 'queued'
  | 'replaced'
  | 'succeeded';

/** `run()` argument shape that stays ergonomic for handles with or without input. */
export type OptimisticStateRunArgs<TInput> = [TInput] extends [void] ? [] : [TInput];

/** Public mutation entry surfaced for inspection and docs-grade demos. */
export interface OptimisticMutationEntry<
  TInput = void,
  TResult = void,
  TError = unknown,
  TTarget extends PropertyKey = string,
> {
  readonly id: number;
  readonly target: TTarget;
  readonly input: TInput;
  readonly status: OptimisticMutationEntryStatus;
  readonly createdAt: number;
  readonly result: TResult | null;
  readonly error: TError | null;
}

/** High-level handle returned by `optimisticState()`. */
export interface OptimisticState<
  TValue,
  TInput = void,
  TResult = void,
  TError = unknown,
  TTarget extends PropertyKey = string,
> {
  readonly conflictPolicy: Signal<OptimisticMutationConflictPolicy>;
  readonly entries: Signal<readonly OptimisticMutationEntry<TInput, TResult, TError, TTarget>[]>;
  readonly error: Signal<TError | null>;
  readonly hasPendingMutations: Signal<boolean>;
  readonly hasQueuedMutations: Signal<boolean>;
  readonly isError: Signal<boolean>;
  readonly isIdle: Signal<boolean>;
  readonly isPending: Signal<boolean>;
  readonly lastResult: Signal<TResult | null>;
  readonly pendingCount: Signal<number>;
  readonly queuedCount: Signal<number>;
  readonly settledValue: Signal<TValue>;
  readonly status: Signal<OptimisticStateStatus>;
  readonly value: Signal<TValue>;
  run(...args: OptimisticStateRunArgs<TInput>): Promise<TResult>;
  setConflictPolicy(policy: OptimisticMutationConflictPolicy): void;
  reset(value?: TValue): void;
}

/** Template context for the current optimistic value. */
export interface OptimisticStateValueContext<
  TValue,
  TInput = void,
  TResult = void,
  TError = unknown,
  TTarget extends PropertyKey = string,
> {
  readonly $implicit: TValue;
  readonly value: TValue;
  readonly state: OptimisticState<TValue, TInput, TResult, TError, TTarget>;
}

/** Template context for the optional pending companion template. */
export interface OptimisticStatePendingContext<
  TValue,
  TInput = void,
  TResult = void,
  TError = unknown,
  TTarget extends PropertyKey = string,
> {
  readonly $implicit: readonly OptimisticMutationEntry<TInput, TResult, TError, TTarget>[];
  readonly entries: readonly OptimisticMutationEntry<TInput, TResult, TError, TTarget>[];
  readonly state: OptimisticState<TValue, TInput, TResult, TError, TTarget>;
}

/** Template context for the optional error companion template. */
export interface OptimisticStateErrorContext<
  TValue,
  TInput = void,
  TResult = void,
  TError = unknown,
  TTarget extends PropertyKey = string,
> {
  readonly $implicit: TError | null;
  readonly error: TError | null;
  readonly state: OptimisticState<TValue, TInput, TResult, TError, TTarget>;
}
