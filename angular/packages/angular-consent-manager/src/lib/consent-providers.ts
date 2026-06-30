import { InjectionToken, type Provider } from '@angular/core';
import type { ConsentManagerConfig } from './consent-config';

/**
 * Internal injection token for the consent manager configuration.
 */
export const CONSENT_MANAGER_CONFIG = new InjectionToken<ConsentManagerConfig>(
  'CONSENT_MANAGER_CONFIG',
);

/**
 * Configures the consent manager at the application root.
 * Must be called once in the root application config.
 *
 * @example
 * ```typescript
 * // app.config.ts
 * import { provideConsentManager, defaultConsentCategories } from '@hexguard/angular-consent-manager';
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideConsentManager({
 *       categories: defaultConsentCategories(),
 *       googleConsentMode: { enabled: true },
 *       consentExpiryDays: 365,
 *     }),
 *   ],
 * };
 * ```
 */
export function provideConsentManager(config: ConsentManagerConfig): Provider[] {
  return [
    { provide: CONSENT_MANAGER_CONFIG, useValue: config },
  ];
}
