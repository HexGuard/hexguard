/**
 * Public API for `@hexguard/angular-clipboard`.
 *
 * The package provides a single injectable — `injectClipboard()` — for
 * headless clipboard interaction state: copy, paste, permission awareness,
 * execCommand fallback, and in-memory history tracking.
 */
export { injectClipboard } from './lib/clipboard';
export { ClipboardService } from './lib/clipboard-service';
export type { ClipboardHandle, ClipboardConfig } from './lib/types';
