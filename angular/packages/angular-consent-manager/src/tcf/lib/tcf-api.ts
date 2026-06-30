import { inject, signal } from '@angular/core';
import { type Signal } from '@angular/core';

/** Facade returned by {@link injectTcfApi}. */
export interface TcfFacade {
  /** The current TC string (base64-encoded). */
  readonly tcString: Signal<string | null>;
  /** The current GPP string (if available). */
  readonly gppString: Signal<string | null>;
  /** Whether the TCF API is available. */
  readonly isAvailable: Signal<boolean>;

  /** Get consent for a specific purpose. */
  isPurposeConsented(purposeId: number): Signal<boolean>;
  /** Get consent for a specific vendor. */
  isVendorConsented(vendorId: number): Signal<boolean>;
  /** Get legitimate interest for a purpose. */
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
 * The facade provides TC string management and consent querying.
 *
 * **Important**: Full TCF implementation is a placeholder in this release.
 * The IAB TCF Global Vendor List parsing, TC string encoding/decoding,
 * and CMP registration are not included. This module provides the API shape
 * and `__tcfapi` command queue integration for future extension.
 *
 * @example
 * ```typescript
 * const tcf = injectTcfApi();
 * const consented = tcf.isPurposeConsented(1); // Store/access info
 * ```
 */
export function injectTcfApi(): TcfFacade {
  const tcString = signal<string | null>(null);
  const gppString = signal<string | null>(null);
  const isAvailable = signal(false);

  return {
    tcString: tcString.asReadonly(),
    gppString: gppString.asReadonly(),
    isAvailable: isAvailable.asReadonly(),
    isPurposeConsented: () => signal(false).asReadonly(),
    isVendorConsented: () => signal(false).asReadonly(),
    isPurposeLegitimateInterest: () => signal(false).asReadonly(),
  };
}
