import type { Observable } from 'rxjs';

/** Configuration accepted by `observableState()`. */
export interface ObservableStateOptions<TValue, TError = unknown> {
  /** Initial value exposed before the first subscription emits. */
  readonly initialValue: TValue;

  /** Observable factory invoked by `connect()` and `reconnect()`. */
  readonly source: () => Observable<TValue>;

  /**
   * Determines whether an emitted value should be treated as empty.
   *
   * By default, `null`, `undefined`, empty strings, empty arrays, empty sets,
   * and empty maps are treated as empty values.
   */
  readonly empty?: (value: TValue) => boolean;

  /** Maps unknown thrown values into the public error type. */
  readonly mapError?: (error: unknown) => TError;
}
