import { type EnvironmentProviders, InjectionToken, makeEnvironmentProviders } from '@angular/core';

import type { InvalidParamBehavior, UrlStateHistoryMode } from './types';

/** Resolved runtime options that control URL synchronization behavior. */
export interface UrlStateOptions {
  readonly history: UrlStateHistoryMode;
  readonly debounceMs: number;
  readonly removeDefaultsFromUrl: boolean;
  readonly invalidParamBehavior: InvalidParamBehavior;
}

/** Partial options accepted from DI configuration or a single `urlState()` call. */
export type UrlStateOptionsInput = Partial<UrlStateOptions>;

/** Safe defaults for the library's URL synchronization behavior. */
export const DEFAULT_URL_STATE_OPTIONS: UrlStateOptions = Object.freeze({
  history: 'replace' as UrlStateHistoryMode,
  debounceMs: 0,
  removeDefaultsFromUrl: true,
  invalidParamBehavior: 'fallbackToDefault' as InvalidParamBehavior,
});

/** DI token used to provide workspace- or app-level URL state defaults. */
export const HEXGUARD_URL_STATE_OPTIONS = new InjectionToken<UrlStateOptionsInput>(
  'HEXGUARD_URL_STATE_OPTIONS',
);

/** Registers global defaults for all `urlState()` instances created in the injector tree. */
export function provideHexGuardUrlState(options: UrlStateOptionsInput = {}): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: HEXGUARD_URL_STATE_OPTIONS,
      useValue: options,
    },
  ]);
}

/** Combines global DI options with per-state overrides and normalizes debounce input. */
export function mergeUrlStateOptions(
  globalOptions: UrlStateOptionsInput = {},
  localOptions: UrlStateOptionsInput = {},
): UrlStateOptions {
  const merged = {
    ...DEFAULT_URL_STATE_OPTIONS,
    ...globalOptions,
    ...localOptions,
  } satisfies UrlStateOptions;

  return {
    ...merged,
    debounceMs:
      Number.isFinite(merged.debounceMs) && merged.debounceMs >= 0
        ? Math.trunc(merged.debounceMs)
        : DEFAULT_URL_STATE_OPTIONS.debounceMs,
  };
}
