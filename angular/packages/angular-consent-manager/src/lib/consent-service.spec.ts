import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ConsentManagerService } from './consent-service';
import { defaultConsentCategories } from './default-categories';

const TEST_CATEGORIES = defaultConsentCategories();

describe('ConsentManagerService', () => {
  function setup(): ConsentManagerService {
    @Component({ template: '', standalone: true })
    class TestHost {}

    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const service = TestBed.inject(ConsentManagerService);
    service.configure({
      categories: TEST_CATEGORIES,
      consentExpiryDays: 365,
      googleConsentMode: { enabled: false },
      auditEnabled: false,
    });
    return service;
  }

  beforeEach(() => {
    document.cookie = 'hexguard_consent=; max-age=0; path=/';
    try { window.localStorage.removeItem('hexguard_consent'); } catch { /* ignore */ }
  });

  it('should start with unknown status', () => {
    const s = setup();
    expect(s.status()).toBe('unknown');
  });

  it('should accept all', () => {
    const s = setup();
    s.acceptAll();
    expect(s.state()['analytics']).toBe(true);
    expect(s.status()).toBe('granted');
  });

  it('should reject all', () => {
    const s = setup();
    s.rejectAll();
    expect(s.state()['analytics']).toBe(false);
    expect(s.state()['necessary']).toBe(true);   // required categories stay true
    expect(s.status()).toBe('granted');            // granted because necessary is true
  });

  it('should keep necessary always true', () => {
    const s = setup();
    s.setConsent({ necessary: false, functional: false, analytics: false, marketing: false });
    expect(s.state()['necessary']).toBe(true);
  });

  it('should withdraw consent', () => {
    const s = setup();
    s.acceptAll();
    s.withdrawConsent();
    expect(s.state()['analytics']).toBeNull();
    expect(s.status()).toBe('unknown');
  });

  it('should persist to cookie', () => {
    const s = setup();
    s.acceptAll();
    expect(document.cookie).toContain('hexguard_consent=');
  });

  it('should persist to localStorage', () => {
    const s = setup();
    s.acceptAll();
    expect(window.localStorage.getItem('hexguard_consent')).not.toBeNull();
  });

  it('should hydrate from storage', () => {
    const s1 = setup();
    s1.acceptAll();
    const s2 = setup();
    expect(s2.status()).toBe('granted');
    expect(s2.state()['analytics']).toBe(true);
  });

  it('should set region and reset non-necessary categories', () => {
    const s = setup();
    s.acceptAll();
    expect(s.state()['analytics']).toBe(true);
    s.setRegion('DE');
    expect(s.region()).toBe('DE');
    expect(s.state()['necessary']).toBe(true);
    expect(s.state()['analytics']).not.toBe(true);
    expect(s.status()).toBe('unknown');
  });

  it('should clear region when set to null', () => {
    const s = setup();
    s.setRegion('DE');
    expect(s.region()).toBe('DE');
    s.setRegion(null);
    expect(s.region()).toBeNull();
  });
});
