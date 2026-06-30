import { TestBed } from '@angular/core/testing';
import { GoogleConsentModeService } from './google-consent-mode';

describe('GoogleConsentModeService', () => {
  let service: GoogleConsentModeService;
  let dataLayer: unknown[][];

  beforeEach(() => {
    dataLayer = [];
    const w = window as unknown as Record<string, unknown[]>;
    w['dataLayer'] = dataLayer;
    service = TestBed.inject(GoogleConsentModeService);
  });

  afterEach(() => {
    const w = window as unknown as Record<string, unknown[]>;
    delete w['dataLayer'];
  });

  it('should push default consent on initialize', () => {
    service.initialize({ enabled: true });
    expect(dataLayer.length).toBe(1);
    expect(dataLayer[0]).toEqual([
      'consent',
      'default',
      {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'denied',
        functionality_storage: 'denied',
        personalization_storage: 'denied',
        security_storage: 'granted',
        wait_for_update: '500',
        ads_data_redaction: 'true',
      },
    ]);
  });

  it('should push update consent', () => {
    service.initialize({ enabled: true });
    service.update({
      ad_storage: 'granted',
      analytics_storage: 'granted',
    });
    expect(dataLayer.length).toBe(2);
    expect(dataLayer[1]).toEqual([
      'consent',
      'update',
      { ad_storage: 'granted', analytics_storage: 'granted' },
    ]);
  });

  it('should only initialize once', () => {
    service.initialize({ enabled: true });
    service.initialize({ enabled: true });
    expect(dataLayer.length).toBe(1);
  });

  it('should apply custom default consent overrides', () => {
    service.initialize({
      enabled: true,
      defaultConsent: { analytics_storage: 'granted' },
      waitForUpdate: 0,
      adsDataRedaction: false,
    });
    expect(dataLayer[0]).toEqual([
      'consent',
      'default',
      {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'granted',
        functionality_storage: 'denied',
        personalization_storage: 'denied',
        security_storage: 'granted',
      },
    ]);
  });

  it('should set url_passthrough when configured', () => {
    service.initialize({ enabled: true, urlPassthrough: true });
    expect(dataLayer.length).toBe(2);
    expect(dataLayer[1]).toEqual(['set', 'url_passthrough', true]);
  });
});
