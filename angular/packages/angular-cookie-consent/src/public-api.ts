/**
 * Public API for `@hexguard/angular-cookie-consent`.
 *
 * Cookie consent UI layer — banner, preference center, floating button,
 * cookie declaration, directives, pipe. Depends on `@hexguard/angular-consent-manager`.
 */
export { CookieConsentBannerComponent } from './lib/components/cookie-consent-banner/cookie-consent-banner.component';
export { ConsentPreferenceCenterComponent } from './lib/components/consent-preference-center/consent-preference-center.component';
export { ConsentFloatingButtonComponent } from './lib/components/consent-floating-btn/consent-floating-btn.component';
export { CookieDeclarationComponent } from './lib/components/cookie-declaration/cookie-declaration.component';
export type { CookieDeclarationEntry } from './lib/components/cookie-declaration/cookie-declaration.component';
export { ConsentDirective } from './lib/directives/consent.directive';
export { ConsentPipe } from './lib/pipes/consent.pipe';
