/**
 * Public API for `@hexguard/angular-click-outside`.
 *
 * The package provides:
 * - `injectClickOutside()` — signal-based click-outside detection for programmatic use.
 * - `HexguardClickOutsideDirective` — template directive with output and enabled input.
 */
export { injectClickOutside } from './lib/click-outside';
export { HexguardClickOutsideDirective } from './lib/click-outside.directive';
export type { ClickOutsideOptions, ClickOutsideHandle } from './lib/types';
