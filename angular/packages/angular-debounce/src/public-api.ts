/**
 * Public API for `@hexguard/angular-debounce`.
 *
 * The package provides a single primitive — `debouncedSignal()` — that wraps an
 * Angular source signal and produces a debounced output signal with configurable
 * leading and trailing edge emission behavior.
 */
export { debouncedSignal } from './lib/debounce';
export type { DebounceOptions, DebouncedValue } from './lib/types';
