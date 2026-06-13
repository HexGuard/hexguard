import { type EnvironmentProviders, InjectionToken, makeEnvironmentProviders } from '@angular/core';

import type { InvalidParamBehavior, UrlStateHistoryMode } from './types';

export interface UrlStateOptions {
  readonly history: UrlStateHistoryMode;
  readonly debounceMs: number;
  readonly removeDefaultsFromUrl: boolean;
  readonly invalidParamBehavior: InvalidParamBehavior;
}

export type UrlStateOptionsInput = Partial<UrlStateOptions>;

export const DEFAULT_URL_STATE_OPTIONS: UrlStateOptions = Object.freeze({
  history: 'replace' as UrlStateHistoryMode,
  debounceMs: 0,
  removeDefaultsFromUrl: true,
  invalidParamBehavior: 'fallbackToDefault' as InvalidParamBehavior,
});

export const HEXGUARD_URL_STATE_OPTIONS = new InjectionToken<UrlStateOptionsInput>(
  'HEXGUARD_URL_STATE_OPTIONS',
);

export function provideHexGuardUrlState(options: UrlStateOptionsInput = {}): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: HEXGUARD_URL_STATE_OPTIONS,
      useValue: options,
    },
  ]);
}

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
