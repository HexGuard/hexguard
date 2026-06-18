/**
 * Template context passed to the `fallback` template reference.
 *
 * The context exposes the caught error and a `reset()` function so the
 * fallback template can offer a retry or recovery action.
 */
export interface ErrorBoundaryContext {
  /** The caught error object. */
  readonly $implicit: unknown;
  /** The caught error object. */
  readonly error: unknown;
  /** Clears the error state and re-renders the original content. */
  readonly reset: () => void;
}
