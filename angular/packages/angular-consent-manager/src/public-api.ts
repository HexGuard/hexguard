/**
 * Public API for `@hexguard/angular-consent-manager`.
 *
 * Headless consent management engine — state machine, storage, region detection,
 * Google Consent Mode v2, audit trail, and script loader for cookie/data processing consent.
 */
export { provideConsentManager } from './lib/consent-providers';
export { injectConsentManager } from './lib/consent-manager';
export type { ConsentManagerFacade } from './lib/consent-manager';
export type { ConsentManagerConfig } from './lib/consent-config';
export type {
  ConsentStatus,
  ConsentValue,
  ConsentState,
  ConsentModel,
  ConsentCategory,
  ConsentPurpose,
  ConsentVendor,
  GoogleConsentType,
  RegionDetectionMode,
  StorageBackend,
  ScriptLoadingStrategy,
  ConsentManagedScript,
} from './lib/types';
export { defaultConsentCategories, defaultCcpCategories, RegionConfig } from './lib/default-categories';
export type { GoogleConsentModeConfig } from './lib/google-consent-mode';
export { GoogleConsentModeService } from './lib/google-consent-mode';
export { detectRegion } from './lib/region-detection';
export type { RegionDetectionConfig } from './lib/region-detection';
export { injectConsentAudit } from './lib/consent-audit';
export type { ConsentAuditHandle, ConsentRecord, ConsentAction, ConsentMethod } from './lib/consent-audit';
export { ConsentScriptLoader } from './lib/consent-script-loader';
