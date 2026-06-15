import type { Signal } from '@angular/core';

/** Lifecycle states for async value or fetch-oriented handles. */
export type AsyncStateStatus = 'idle' | 'loading' | 'loaded' | 'error' | 'reloading';

/** Lifecycle states for observable-backed live value handles. */
export type ObservableStateStatus = 'idle' | 'connecting' | 'live' | 'error' | 'complete';

/** Lifecycle states for async action or submit-oriented handles. */
export type AsyncActionStatus = 'idle' | 'pending' | 'succeeded' | 'failed';

/** Duplicate-run handling for async actions while a previous run is still pending. */
export type AsyncActionDuplicateRunPolicy = 'reuse' | 'reject';

/** `run()` argument shape that stays ergonomic for actions with or without input. */
export type AsyncActionRunArgs<TInput> = [TInput] extends [void] ? [] : [TInput];

/** High-level handle returned by `asyncState()`. */
export interface AsyncState<TValue, TError = unknown> {
  readonly status: Signal<AsyncStateStatus>;
  readonly value: Signal<TValue>;
  readonly error: Signal<TError | null>;
  readonly hasLoaded: Signal<boolean>;
  readonly hasValue: Signal<boolean>;
  readonly isEmpty: Signal<boolean>;
  readonly isIdle: Signal<boolean>;
  readonly isLoading: Signal<boolean>;
  readonly isLoaded: Signal<boolean>;
  readonly isError: Signal<boolean>;
  readonly isReloading: Signal<boolean>;
  load(): Promise<TValue>;
  reload(): Promise<TValue>;
  setValue(value: TValue): void;
  reset(): void;
}

/** High-level handle returned by `observableState()`. */
export interface ObservableState<TValue, TError = unknown> {
  /** Current observable lifecycle state. */
  readonly status: Signal<ObservableStateStatus>;

  /** Latest emitted value, or the initial value before the first emission. */
  readonly value: Signal<TValue>;

  /** Latest terminal error for the active or most recent connection. */
  readonly error: Signal<TError | null>;

  /** Whether the latest emitted value is non-empty according to `empty()`. */
  readonly hasValue: Signal<boolean>;

  /** Whether the latest emitted value is considered empty. */
  readonly isEmpty: Signal<boolean>;

  /** Whether no observable connection is active. */
  readonly isIdle: Signal<boolean>;

  /** Whether the handle is connected and waiting for the first emission. */
  readonly isConnecting: Signal<boolean>;

  /** Whether the current connection has emitted at least one value and is still active. */
  readonly isLive: Signal<boolean>;

  /** Whether the current or most recent connection ended with an error. */
  readonly isError: Signal<boolean>;

  /** Whether the current or most recent connection completed normally. */
  readonly isComplete: Signal<boolean>;

  /** Starts the observable subscription when no active connection exists. */
  connect(): void;

  /** Tears down the current subscription and returns the handle to `idle`. */
  disconnect(): void;

  /** Replaces the current subscription with a fresh connection from `source()`. */
  reconnect(): void;

  /** Clears the latest value, error, and connection state back to the initial snapshot. */
  reset(): void;
}

/** High-level handle returned by `asyncAction()`. */
export interface AsyncAction<TInput = void, TResult = void, TError = unknown> {
  readonly status: Signal<AsyncActionStatus>;
  readonly error: Signal<TError | null>;
  readonly lastResult: Signal<TResult | null>;
  readonly pending: Signal<boolean>;
  readonly isPending: Signal<boolean>;
  readonly isIdle: Signal<boolean>;
  readonly hasSucceeded: Signal<boolean>;
  readonly hasFailed: Signal<boolean>;
  run(...args: AsyncActionRunArgs<TInput>): Promise<TResult>;
  reset(): void;
}

/** Template context for a loaded async-state value. */
export interface AsyncStateValueContext<TValue, TError = unknown> {
  readonly $implicit: TValue;
  readonly value: TValue;
  readonly state: AsyncState<TValue, TError>;
}

/** Template context for an async-state first-load error. */
export interface AsyncStateErrorContext<TValue, TError = unknown> {
  readonly $implicit: TError | null;
  readonly error: TError | null;
  readonly state: AsyncState<TValue, TError>;
}

/** Template context for an idle async-state before the first request completes. */
export interface AsyncStateIdleContext<TValue, TError = unknown> {
  readonly state: AsyncState<TValue, TError>;
}

/** Template context for a successful empty async-state value. */
export interface AsyncStateEmptyContext<TValue, TError = unknown> {
  readonly state: AsyncState<TValue, TError>;
}

/** Template context for a reload or stale-data error companion template. */
export interface AsyncStateReloadingContext<TValue, TError = unknown> {
  readonly $implicit: TValue;
  readonly value: TValue;
  readonly error: TError | null;
  readonly state: AsyncState<TValue, TError>;
}

/** Template context for an idle async action. */
export interface AsyncActionIdleContext<TInput = void, TResult = void, TError = unknown> {
  readonly action: AsyncAction<TInput, TResult, TError>;
}

/** Template context for a pending async action. */
export interface AsyncActionPendingContext<TInput = void, TResult = void, TError = unknown> {
  readonly action: AsyncAction<TInput, TResult, TError>;
}

/** Template context for a failed async action. */
export interface AsyncActionErrorContext<TInput = void, TResult = void, TError = unknown> {
  readonly $implicit: TError | null;
  readonly error: TError | null;
  readonly action: AsyncAction<TInput, TResult, TError>;
}

/** Template context for a succeeded async action. */
export interface AsyncActionSuccessContext<TInput = void, TResult = void, TError = unknown> {
  readonly $implicit: TResult | null;
  readonly result: TResult | null;
  readonly action: AsyncAction<TInput, TResult, TError>;
}
