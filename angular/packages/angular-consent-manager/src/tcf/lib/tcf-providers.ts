import { APP_INITIALIZER, InjectionToken, type Provider, inject } from '@angular/core';
import { ConsentManagerService } from '../../lib/consent-service';

export interface TcfSupportConfig {
  /** IAB-assigned CMP ID (required for registered CMPs). */
  readonly cmpId: number;
  /** CMP version. */
  readonly cmpVersion?: number;
  /** Global vendor list URL override. */
  readonly gvlUrl?: string;
  /** Whether GDPR applies. Default: `true` (auto-detected from region). */
  readonly gdprApplies?: boolean;
}

export const TCF_SUPPORT_CONFIG = new InjectionToken<TcfSupportConfig>('TCF_SUPPORT_CONFIG');

/**
 * Provides IAB TCF v2.2 support.
 * Adds the `__tcfapi` command queue and TC string generation.
 *
 * Must be used alongside {@link provideConsentManager} with `tcfSupport` config.
 *
 * @example
 * ```typescript
 * import { provideTcfSupport } from '@hexguard/angular-consent-manager/tcf';
 * import { provideConsentManager, defaultConsentCategories } from '@hexguard/angular-consent-manager';
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideConsentManager({
 *       categories: defaultConsentCategories(),
 *       tcfSupport: { cmpId: 123 },
 *     }),
 *     provideTcfSupport({ cmpId: 123 }),
 *   ],
 * };
 * ```
 */
export function provideTcfSupport(config: TcfSupportConfig): Provider[] {
  return [
    { provide: TCF_SUPPORT_CONFIG, useValue: config },
    {
      provide: APP_INITIALIZER,
      useFactory: () => {
        const service = inject(ConsentManagerService);
        const existingConfig = service.getConfig();
        if (existingConfig && !existingConfig.tcfSupport) {
          // If provideConsentManager already ran without tcfSupport,
          // we can't retroactively enable it. The user needs to set
          // tcfSupport in provideConsentManager config.
          console.warn(
            '[hexguard] provideTcfSupport was called but provideConsentManager ' +
            'was not configured with tcfSupport. Add tcfSupport to the consent manager config.',
          );
        }
        return () => {};
      },
      multi: true,
    },
  ];
}
