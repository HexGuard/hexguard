/**
 * Public API for `@hexguard/angular-preferences`.
 *
 * Provides schema-driven typed user preferences backed by `@hexguard/angular-storage`.
 */
export { injectPreferences } from './lib/preferences';
export type { PreferencesHandle } from './lib/preferences';
export { pref } from './lib/pref-factory';
export type { PreferenceDef } from './lib/pref-factory';
