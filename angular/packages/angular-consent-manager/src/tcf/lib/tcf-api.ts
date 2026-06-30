import { inject, signal, computed, type Signal } from '@angular/core';
import { ConsentManagerService } from '../../lib/consent-service';

/** Facade returned by {@link injectTcfApi}. */
export interface TcfFacade {
  /** The current TC string (base64-encoded). */
  readonly tcString: Signal<string | null>;
  /** The current GPP string (if available). */
  readonly gppString: Signal<string | null>;
  /** Whether the TCF API is available. */
  readonly isAvailable: Signal<boolean>;
  /** The current TC string version. */
  readonly tcfPolicyVersion: Signal<number>;

  /** Get consent for a specific IAB purpose (1-10). */
  isPurposeConsented(purposeId: number): Signal<boolean>;
  /** Get consent for a specific vendor. */
  isVendorConsented(vendorId: number): Signal<boolean>;
  /** Get legitimate interest for an IAB purpose. */
  isPurposeLegitimateInterest(purposeId: number): Signal<boolean>;
}

/** A TC string with its decoded segments. */
export interface TcString {
  readonly version: number;
  readonly created: string;
  readonly lastUpdated: string;
  readonly cmpId: number;
  readonly cmpVersion: number;
  readonly consentScreen: number;
  readonly consentLanguage: string;
  readonly vendorListVersion: number;
  readonly tcfPolicyVersion: number;
  readonly isServiceSpecific: boolean;
  readonly useNonStandardStacks: boolean;
  readonly specialFeatureOptIns: readonly number[];
  readonly purposeConsents: readonly PurposeConsent[];
  readonly purposeLegitimateInterests: readonly number[];
  readonly vendorConsents: readonly VendorConsent[];
}

export interface PurposeConsent {
  readonly purposeId: number;
  readonly consented: boolean;
}

export interface VendorConsent {
  readonly vendorId: number;
  readonly consented: boolean;
}

/**
 * Injects the IAB TCF v2.2 API facade.
 * The facade is wired to the consent manager's actual consent state.
 * Returns a stub if TCF support is not configured.
 *
 * @example
 * ```typescript
 * const tcf = injectTcfApi();
 * const consented = tcf.isPurposeConsented(1); // Store/access info
 * ```
 */
export function injectTcfApi(): TcfFacade {
  const service = inject(ConsentManagerService);
  const gppString = signal<string | null>(null);
  const isAvailable = computed(() => service.tcString() !== null);
  const tcfPolicyVersion = computed(() => (service.tcString() ? 4 : 0));

  return {
    tcString: service.tcString.asReadonly(),
    gppString: gppString.asReadonly(),
    isAvailable,
    tcfPolicyVersion,

    isPurposeConsented: (purposeId: number): Signal<boolean> => {
      return computed(() => {
        if (!service.tcString()) return false;
        const cats = service.categories();
        for (const cat of cats) {
          if (cat.iabPurposeIds?.includes(purposeId)) {
            const state = service.state();
            return state[cat.id] === true;
          }
        }
        return false;
      });
    },

    isVendorConsented: (_vendorId: number): Signal<boolean> => {
      // Vendor consent requires GVL — not yet implemented
      return signal(false).asReadonly();
    },

    isPurposeLegitimateInterest: (purposeId: number): Signal<boolean> => {
      return computed(() => {
        if (!service.tcString()) return false;
        const cats = service.categories();
        for (const cat of cats) {
          if (cat.iabPurposeIds?.includes(purposeId)) {
            const state = service.state();
            return state[cat.id] === true;
          }
        }
        return false;
      });
    },
  };
}
