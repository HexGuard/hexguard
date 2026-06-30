import { type InjectionToken, type Provider } from '@angular/core';

export interface TcfSupportConfig {
  /** IAB-assigned CMP ID (required for registered CMPs). */
  readonly cmpId: number;
  /** CMP version. */
  readonly cmpVersion?: number;
  /** Global vendor list URL override. */
  readonly gvlUrl?: string;
}

export const TCF_SUPPORT_CONFIG = new InjectionToken<TcfSupportConfig>('TCF_SUPPORT_CONFIG');

/**
 * Provides IAB TCF v2.2 support.
 * Adds the `__tcfapi` command queue and TC string generation.
 *
 * @example
 * ```typescript
 * import { provideTcfSupport } from '@hexguard/angular-consent-manager/tcf';
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideTcfSupport({ cmpId: 123, cmpVersion: 1 }),
 *   ],
 * };
 * ```
 */
export function provideTcfSupport(config: TcfSupportConfig): Provider[] {
  return [
    { provide: TCF_SUPPORT_CONFIG, useValue: config },
  ];
}
