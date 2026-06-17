/**
 * Public API for `@hexguard/angular-error-boundary`.
 *
 * The package provides a declarative component error boundary that catches
 * render-time errors from projected content and displays a configurable
 * fallback UI, plus async error capture for child-component timers and
 * promise callbacks.
 */
export { HexguardErrorBoundaryComponent } from './lib/error-boundary.component';
export type { ErrorBoundaryContext } from './lib/types';
