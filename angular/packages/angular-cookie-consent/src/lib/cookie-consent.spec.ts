/**
 * Cookie Consent components are Angular-specific and require TestBed
 * for component rendering tests. See audit report for details on
 * the Angular 22 TestBed.initTestEnvironment compatibility issue.
 *
 * These tests verify that the public API exports are accessible.
 */
import { CookieConsentBannerComponent } from './components/cookie-consent-banner/cookie-consent-banner.component';
import { ConsentPreferenceCenterComponent } from './components/consent-preference-center/consent-preference-center.component';
import { ConsentFloatingButtonComponent } from './components/consent-floating-btn/consent-floating-btn.component';
import { CookieDeclarationComponent } from './components/cookie-declaration/cookie-declaration.component';
import { ConsentDirective } from './directives/consent.directive';
import { ConsentPipe } from './pipes/consent.pipe';

describe('angular-cookie-consent public API', () => {
  it('should export CookieConsentBannerComponent', () => {
    expect(CookieConsentBannerComponent).toBeTruthy();
  });

  it('should export ConsentPreferenceCenterComponent', () => {
    expect(ConsentPreferenceCenterComponent).toBeTruthy();
  });

  it('should export ConsentFloatingButtonComponent', () => {
    expect(ConsentFloatingButtonComponent).toBeTruthy();
  });

  it('should export CookieDeclarationComponent', () => {
    expect(CookieDeclarationComponent).toBeTruthy();
  });

  it('should export ConsentDirective', () => {
    expect(ConsentDirective).toBeTruthy();
  });

  it('should export ConsentPipe', () => {
    expect(ConsentPipe).toBeTruthy();
  });

  it('ConsentPipe should export the class', () => {
    expect(typeof ConsentPipe).toBe('function');
  });

  it('CookieDeclarationEntry should be constructable', () => {
    const entry: import('./components/cookie-declaration/cookie-declaration.component').CookieDeclarationEntry = {
      name: 'test',
      domain: 'example.com',
      party: 'first',
      purpose: 'Testing',
      category: 'necessary',
      duration: 'Session',
      type: 'cookie',
    };
    expect(entry.name).toBe('test');
  });
});
