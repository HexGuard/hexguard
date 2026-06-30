/**
 * Public API for the optional IAB TCF v2.2 module.
 *
 * Import from `@hexguard/angular-consent-manager/tcf` or directly from `@hexguard/angular-consent-manager`.
 * Both paths are supported — the TCF module is tree-shakeable when unused.
 */
export { provideTcfSupport } from './lib/tcf-providers';
export type { TcfSupportConfig } from './lib/tcf-providers';
export { injectTcfApi } from './lib/tcf-api';
export type { TcfFacade, TcString, VendorConsent, PurposeConsent } from './lib/tcf-api';
export { encodeTcString, decodeTcString } from './lib/tc-string-encoder';
export type { TcStringInput, DecodedTcString } from './lib/tc-string-encoder';
export { IAB_PURPOSES, IAB_SPECIAL_FEATURES, TCF_POLICY_VERSION, EU_CONSENT_COOKIE } from './lib/tcf-constants';
export type { IabPurpose, IabSpecialFeature } from './lib/tcf-constants';
