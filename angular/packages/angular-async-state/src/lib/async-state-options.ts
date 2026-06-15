/** Configuration accepted by `asyncState()`. */
export interface AsyncStateOptions<TValue, TError = unknown> {
  /** Initial value exposed before the first successful load. */
  readonly initialValue: TValue;

  /** Async loader invoked by `load()` and `reload()`. */
  readonly load: () => Promise<TValue>;

  /**
   * Determines whether a successful value should be treated as empty.
   *
   * By default, `null`, `undefined`, empty strings, empty arrays, empty sets,
   * and empty maps are treated as empty values.
   */
  readonly empty?: (value: TValue) => boolean;

  /** Maps unknown thrown values into the public error type. */
  readonly mapError?: (error: unknown) => TError;
}
