/**
 * Public API for the optional IAB TCF v2.2 module.
 *
 * Import from `@hexguard/angular-consent-manager/tcf`.
 * This module is tree-shakeable — only included when imported.
 */
export { provideTcfSupport } from './lib/tcf-providers';
export { injectTcfApi } from './lib/tcf-api';
export type { TcfFacade, TcString, VendorConsent, PurposeConsent } from './lib/tcf-api';
