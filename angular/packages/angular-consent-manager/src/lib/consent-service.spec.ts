import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideConsentManager } from './consent-providers';
import { injectConsentManager } from './consent-manager';
import { defaultConsentCategories, defaultCcpCategories } from './default-categories';

const TEST_CATEGORIES = defaultConsentCategories();

describe('ConsentManagerService', () => {
  function setup(config?: Partial<Parameters<typeof provideConsentManager>[0]>) {
    @Component({ template: '', standalone: true })
    class TestComponent {
      readonly consent = injectConsentManager();
    }

    TestBed.configureTestingModule({
      providers: [
        provideConsentManager({
          categories: TEST_CATEGORIES,
          consentExpiryDays: 365,
          googleConsentMode: { enabled: false },
          auditEnabled: false,
          ...config,
        }),
      ],
    });

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    return fixture.componentInstance.consent;
  }

  beforeEach(() => {
    document.cookie = 'hexguard_consent=; max-age=0; path=/';
    try { window.localStorage.removeItem('hexguard_consent'); } catch { /* ignore */ }
  });

  describe('initial state', () => {
    it('should start with unknown status', () => {
      const consent = setup();
      expect(consent.status()).toBe('unknown');
    });

    it('should have necessary category set to true', () => {
      const consent = setup();
      expect(consent.state()['necessary']).toBe(true);
    });

    it('should have non-necessary categories set to null', () => {
      const consent = setup();
      expect(consent.state()['functional']).toBeNull();
      expect(consent.state()['analytics']).toBeNull();
      expect(consent.state()['marketing']).toBeNull();
    });

    it('should have null consentId before first decision', () => {
      const consent = setup();
      expect(consent.consentId()).toBeNull();
    });

    it('should have null consentedAt before first decision', () => {
      const consent = setup();
      expect(consent.consentedAt()).toBeNull();
    });

    it('should provide categories', () => {
      const consent = setup();
      expect(consent.categories().length).toBe(4);
      expect(consent.categories()[0].id).toBe('necessary');
    });

    it('should not be consented initially', () => {
      const consent = setup();
      expect(consent.isConsented()).toBe(false);
    });

    it('should not have decided initially', () => {
      const consent = setup();
      expect(consent.hasDecided()).toBe(false);
    });

    it('should not be expired initially', () => {
      const consent = setup();
      expect(consent.isExpired()).toBe(false);
    });
  });

  describe('acceptAll', () => {
    it('should set all categories to true', () => {
      const consent = setup();
      consent.acceptAll();
      expect(consent.state()['necessary']).toBe(true);
      expect(consent.state()['functional']).toBe(true);
      expect(consent.state()['analytics']).toBe(true);
      expect(consent.state()['marketing']).toBe(true);
    });

    it('should set status to granted', () => {
      const consent = setup();
      consent.acceptAll();
      expect(consent.status()).toBe('granted');
    });

    it('should set consentId', () => {
      const consent = setup();
      consent.acceptAll();
      expect(consent.consentId()).not.toBeNull();
    });

    it('should set consentedAt', () => {
      const consent = setup();
      consent.acceptAll();
      expect(consent.consentedAt()).not.toBeNull();
      expect(consent.consentedAt()!).toBeGreaterThan(0);
    });

    it('should set expiresAt', () => {
      const consent = setup();
      consent.acceptAll();
      expect(consent.expiresAt()).not.toBeNull();
      expect(consent.expiresAt()!).toBeGreaterThan(Date.now());
    });

    it('should be consented after acceptAll', () => {
      const consent = setup();
      consent.acceptAll();
      expect(consent.isConsented()).toBe(true);
    });

    it('should have decided after acceptAll', () => {
      const consent = setup();
      consent.acceptAll();
      expect(consent.hasDecided()).toBe(true);
    });
  });

  describe('rejectAll', () => {
    it('should set non-necessary categories to false', () => {
      const consent = setup();
      consent.rejectAll();
      expect(consent.state()['necessary']).toBe(true);
      expect(consent.state()['functional']).toBe(false);
      expect(consent.state()['analytics']).toBe(false);
      expect(consent.state()['marketing']).toBe(false);
    });

    it('should set status to denied', () => {
      const consent = setup();
      consent.rejectAll();
      expect(consent.status()).toBe('denied');
    });

    it('should not be consented after rejectAll', () => {
      const consent = setup();
      consent.rejectAll();
      expect(consent.isConsented()).toBe(false);
    });

    it('should have decided after rejectAll', () => {
      const consent = setup();
      consent.rejectAll();
      expect(consent.hasDecided()).toBe(true);
    });
  });

  describe('setConsent', () => {
    it('should set specific categories', () => {
      const consent = setup();
      consent.setConsent({ necessary: true, functional: true, analytics: false, marketing: false });
      expect(consent.state()['functional']).toBe(true);
      expect(consent.state()['analytics']).toBe(false);
    });

    it('should keep necessary always true', () => {
      const consent = setup();
      consent.setConsent({ necessary: false, functional: false, analytics: false, marketing: false });
      expect(consent.state()['necessary']).toBe(true);
    });

    it('should set status based on state', () => {
      const consent = setup();
      consent.setConsent({ necessary: true, functional: false, analytics: false, marketing: false });
      expect(consent.status()).toBe('denied');
    });
  });

  describe('updateConsent', () => {
    it('should update specific categories without changing others', () => {
      const consent = setup();
      consent.acceptAll();
      consent.updateConsent({ analytics: false });
      expect(consent.state()['functional']).toBe(true);
      expect(consent.state()['analytics']).toBe(false);
    });
  });

  describe('withdrawConsent', () => {
    it('should reset non-necessary categories to null', () => {
      const consent = setup();
      consent.acceptAll();
      consent.withdrawConsent();
      expect(consent.state()['necessary']).toBe(true);
      expect(consent.state()['functional']).toBeNull();
      expect(consent.state()['analytics']).toBeNull();
      expect(consent.state()['marketing']).toBeNull();
    });

    it('should set status to unknown', () => {
      const consent = setup();
      consent.acceptAll();
      consent.withdrawConsent();
      expect(consent.status()).toBe('unknown');
    });

    it('should clear consentId', () => {
      const consent = setup();
      consent.acceptAll();
      consent.withdrawConsent();
      expect(consent.consentId()).toBeNull();
    });
  });

  describe('isCategoryGranted', () => {
    it('should return true for granted category', () => {
      const consent = setup();
      consent.acceptAll();
      expect(consent.isCategoryGranted('analytics')()).toBe(true);
    });

    it('should return false for denied category', () => {
      const consent = setup();
      consent.rejectAll();
      expect(consent.isCategoryGranted('analytics')()).toBe(false);
    });

    it('should return false for undecided category', () => {
      const consent = setup();
      expect(consent.isCategoryGranted('analytics')()).toBe(false);
    });
  });

  describe('isPurposeGranted', () => {
    it('should return true when parent category is granted', () => {
      const consent = setup();
      consent.acceptAll();
      expect(consent.isPurposeGranted('page-views')()).toBe(true);
    });

    it('should return false when parent category is denied', () => {
      const consent = setup();
      consent.rejectAll();
      expect(consent.isPurposeGranted('page-views')()).toBe(false);
    });
  });

  describe('acceptCategory', () => {
    it('should accept a single category', () => {
      const consent = setup();
      consent.acceptCategory('analytics');
      expect(consent.state()['analytics']).toBe(true);
      expect(consent.state()['functional']).toBeNull();
    });
  });

  describe('rejectCategory', () => {
    it('should reject a single category', () => {
      const consent = setup();
      consent.acceptAll();
      consent.rejectCategory('analytics');
      expect(consent.state()['analytics']).toBe(false);
      expect(consent.state()['functional']).toBe(true);
    });
  });

  describe('storage persistence', () => {
    it('should persist consent to cookie after acceptAll', () => {
      const consent = setup();
      consent.acceptAll();
      expect(document.cookie).toContain('hexguard_consent=');
    });

    it('should persist consent to localStorage after acceptAll', () => {
      const consent = setup();
      consent.acceptAll();
      const stored = window.localStorage.getItem('hexguard_consent');
      expect(stored).not.toBeNull();
      const parsed = JSON.parse(stored!);
      expect(parsed.s.analytics).toBe(true);
    });

    it('should hydrate from persisted consent on new instance', () => {
      let consent = setup();
      consent.acceptAll();
      const consentId = consent.consentId();

      consent = setup();
      expect(consent.state()['analytics']).toBe(true);
      expect(consent.consentId()).toBe(consentId);
    });
  });

  describe('CCPA categories', () => {
    it('should use opt-out defaults when configured', () => {
      const consent = setup({ categories: defaultCcpCategories() });
      expect(consent.state()['analytics']).toBe(true);
      expect(consent.state()['functional']).toBe(true);
      expect(consent.state()['marketing']).toBeNull();
    });
  });
});
