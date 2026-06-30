import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ConsentManagerService } from './consent-service';
import { defaultConsentCategories } from './default-categories';
import { injectConsentAudit } from './consent-audit';

const TEST_CATEGORIES = defaultConsentCategories();

describe('injectConsentAudit', () => {
  function setup(extraConfig?: Record<string, unknown>) {
    @Component({ template: '', standalone: true })
    class TestHost {}

    const fixture = TestBed.createComponent(TestHost);
    fixture.detectChanges();
    const service = TestBed.inject(ConsentManagerService);
    service.configure({
      categories: TEST_CATEGORIES,
      consentExpiryDays: 365,
      googleConsentMode: { enabled: false },
      auditEnabled: true,
      ...extraConfig,
    });
    const audit = TestBed.runInInjectionContext(() => injectConsentAudit());
    return { service, audit, fixture };
  }

  beforeEach(() => {
    document.cookie = 'hexguard_consent=; max-age=0; path=/';
    try {
      window.localStorage.removeItem('hexguard_consent');
      window.localStorage.removeItem('hexguard_consent_audit');
    } catch { /* ignore */ }
  });

  it('should return an empty array initially', () => {
    const { audit } = setup();
    expect(audit.getRecords()).toEqual([]);
  });

  it('should record a grant entry after acceptAll', () => {
    const { service, audit } = setup();
    service.acceptAll();
    const records = audit.getRecords();
    expect(records.length).toBe(1);
    expect(records[0].action).toBe('grant');
    expect(records[0].method).toBe('banner_accept_all');
    expect(typeof records[0].region).toBe('string');
    expect(records[0].consentId).not.toBeNull();
  });

  it('should record a grant entry after rejectAll', () => {
    const { service, audit } = setup();
    service.rejectAll();
    const records = audit.getRecords();
    expect(records.length).toBe(1);
    expect(records[0].action).toBe('grant');
    expect(records[0].method).toBe('banner_reject_all');
  });

  it('should record a withdraw entry', () => {
    const { service, audit } = setup();
    service.acceptAll();
    service.withdrawConsent();
    const records = audit.getRecords();
    expect(records.length).toBe(2);
    expect(records[1].action).toBe('withdraw');
    expect(records[1].method).toBe('api');
  });

  it('should record setConsent via api method', () => {
    const { service, audit } = setup();
    service.setConsent({ analytics: true, marketing: false });
    const records = audit.getRecords();
    expect(records.length).toBe(1);
    expect(records[0].action).toBe('grant');
    expect(records[0].method).toBe('api');
  });

  it('should clear all records', () => {
    const { service, audit } = setup();
    service.acceptAll();
    expect(audit.getRecords().length).toBe(1);
    audit.clearRecords();
    expect(audit.getRecords().length).toBe(0);
  });

  it('should export records as JSON string', () => {
    const { service, audit } = setup();
    service.acceptAll();
    const exported = audit.exportRecords();
    const parsed = JSON.parse(exported);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed.length).toBe(1);
    expect(parsed[0].action).toBe('grant');
    expect(parsed[0].previousState).toBeDefined();
    expect(parsed[0].newState).toBeDefined();
  });

  it('should not record when auditEnabled is false', () => {
    const { service, audit } = setup({ auditEnabled: false });
    service.acceptAll();
    expect(audit.getRecords().length).toBe(0);
  });

  it('should include previous state in audit records', () => {
    const { service, audit } = setup();
    service.acceptAll();
    const prevState = audit.getRecords()[0].previousState;
    expect(prevState).not.toBeNull();
    expect(prevState!['analytics']).toBeNull(); // undecided before accept
  });

  it('should include new state in audit records', () => {
    const { service, audit } = setup();
    service.acceptAll();
    const newState = audit.getRecords()[0].newState;
    expect(newState['analytics']).toBe(true);
    expect(newState['necessary']).toBe(true);
  });
});
