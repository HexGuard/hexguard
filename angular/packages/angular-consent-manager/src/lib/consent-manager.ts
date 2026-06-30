import { inject, type Signal } from '@angular/core';
import { CONSENT_MANAGER_CONFIG } from './consent-providers';
import type { ConsentManagerConfig } from './consent-config';
import { ConsentManagerService } from './consent-service';
import type { ConsentStatus, ConsentState, ConsentCategory } from './types';
import type { ConsentMethod } from './consent-audit';

/**
 * The public facade returned by {@link injectConsentManager}.
 */
export interface ConsentManagerFacade {
  /** Current consent lifecycle status. */
  readonly status: Signal<ConsentStatus>;
  /** Current consent state (category ID → boolean | null). */
  readonly state: Signal<ConsentState>;
  /** Configured consent categories. */
  readonly categories: Signal<readonly ConsentCategory[]>;
  /** True if at least one non-necessary category has been granted. */
  readonly isConsented: Signal<boolean>;
  /** True if all non-required categories have been decided. */
  readonly hasDecided: Signal<boolean>;
  /** True if the consent period has ended. */
  readonly isExpired: Signal<boolean>;
  /** Unique consent session ID (null before first decision). */
  readonly consentId: Signal<string | null>;
  /** Timestamp when consent was last given (epoch ms). */
  readonly consentedAt: Signal<number | null>;
  /** Timestamp when consent expires (epoch ms). */
  readonly expiresAt: Signal<number | null>;
  /** Detected region (ISO 3166-1 alpha-2 or null). */
  readonly region: Signal<string | null>;

  /** Returns a signal that is true when the given category is granted. */
  isCategoryGranted(categoryId: string): Signal<boolean>;
  /** Returns a signal that is true when the purpose's parent category is granted. */
  isPurposeGranted(purposeId: string): Signal<boolean>;

  /** Accept all non-necessary categories. */
  acceptAll(): void;
  /** Reject all non-necessary categories. */
  rejectAll(): void;
  /** Accept a single category. */
  acceptCategory(categoryId: string): void;
  /** Reject a single category. */
  rejectCategory(categoryId: string): void;
  /** Set the full consent state. */
  setConsent(state: ConsentState, method?: ConsentMethod): void;
  /** Update specific categories in the consent state. */
  updateConsent(partial: Partial<ConsentState>, method?: ConsentMethod): void;
  /** Withdraw all consent (reset non-necessary to undecided). */
  withdrawConsent(): void;
  /** Refresh consent state from storage and check expiry. */
  refreshConsent(): void;
  /**
   * Change the detected region and re-apply regional category overrides.
   * Resets non-necessary categories to their region-specific defaults.
   */
  setRegion(regionCode: string | null): void;
}

/**
 * Injects the consent manager facade.
 * Must be called after {@link provideConsentManager} has been configured.
 *
 * @example
 * ```typescript
 * @Component({ ... })
 * export class MyComponent {
 *   readonly consent = injectConsentManager();
 *
 *   readonly showBanner = computed(() =>
 *     this.consent.status() === 'unknown' || this.consent.isExpired()
 *   );
 * }
 * ```
 */
export function injectConsentManager(): ConsentManagerFacade {
  const service = inject(ConsentManagerService);
  const config = inject(CONSENT_MANAGER_CONFIG, { optional: true });

  if (config && !service['getConfig']()) {
    service.configure(config);
  }

  return {
    status: service.status.asReadonly(),
    state: service.state.asReadonly(),
    categories: service.categories,
    isConsented: service.isConsented,
    hasDecided: service.hasDecided,
    isExpired: service.isExpired,
    consentId: service.consentId.asReadonly(),
    consentedAt: service.consentedAt.asReadonly(),
    expiresAt: service.expiresAt.asReadonly(),
    region: service.region.asReadonly(),

    isCategoryGranted: (id) => service.isCategoryGranted(id),
    isPurposeGranted: (id) => service.isPurposeGranted(id),

    acceptAll: () => service.acceptAll(),
    rejectAll: () => service.rejectAll(),
    acceptCategory: (id) => service.acceptCategory(id),
    rejectCategory: (id) => service.rejectCategory(id),
    setConsent: (state, method) => service.setConsent(state, method),
    updateConsent: (partial, method) => service.updateConsent(partial, method),
    withdrawConsent: () => service.withdrawConsent(),
    refreshConsent: () => service.refreshConsent(),
    setRegion: (code) => service.setRegion(code),
  };
}
