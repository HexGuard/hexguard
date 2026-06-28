/**
 * Public API for `@hexguard/angular-signal-utils`.
 *
 * Provides:
 * - `computedFrom` — derive a signal from multiple source signals.
 * - `injectToggle` — boolean toggle signal with convenience methods.
 * - `memoized` — cached computed with TTL expiry.
 * - `throttledSignal` — rate-limited signal emissions.
 */
export { computedFrom } from './lib/computed-from';
export { injectToggle } from './lib/toggle';
export type { ToggleHandle } from './lib/toggle';
export { memoized } from './lib/memoized';
export { throttledSignal } from './lib/throttled-signal';
export type { ThrottledValue } from './lib/throttled-signal';
