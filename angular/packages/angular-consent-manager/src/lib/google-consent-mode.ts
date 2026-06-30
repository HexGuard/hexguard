import { Injectable } from '@angular/core';

/**
 * Configuration for Google Consent Mode v2 integration.
 */
export interface GoogleConsentModeConfig {
  /** Whether Google Consent Mode is enabled. Default: `true`. */
  readonly enabled: boolean;
  /**
   * Custom default consent overrides.
   * If omitted, all non-security types default to `'denied'`.
   */
  readonly defaultConsent?: Partial<Record<string, 'granted' | 'denied'>>;
  /** Milliseconds for GTM to wait for the CMP update. Default: `500`. */
  readonly waitForUpdate?: number;
  /** Enable URL passthrough for conversion modeling. Default: `false`. */
  readonly urlPassthrough?: boolean;
  /** Redact ads data when ad_storage is denied. Default: `true`. */
  readonly adsDataRedaction?: boolean;
}

/**
 * Service that manages Google Consent Mode v2 integration.
 * Called automatically by ConsentManagerService when enabled.
 */
@Injectable({ providedIn: 'root' })
export class GoogleConsentModeService {
  private initialized = false;

  /** Initialize default consent (call before Google tags load). */
  initialize(config: GoogleConsentModeConfig): void {
    if (this.initialized || typeof window === 'undefined') return;
    this.initialized = true;

    const defaults: Record<string, string> = {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
      functionality_storage: 'denied',
      personalization_storage: 'denied',
      security_storage: 'granted',
    };

    if (config.defaultConsent) {
      for (const [key, val] of Object.entries(config.defaultConsent)) {
        if (val) defaults[key] = val;
      }
    }

    if (config.waitForUpdate !== undefined && config.waitForUpdate > 0) {
      defaults['wait_for_update'] = String(config.waitForUpdate);
    }
    if (config.adsDataRedaction) {
      defaults['ads_data_redaction'] = 'true';
    }

    this.pushCommand('consent', 'default', defaults);

    if (config.urlPassthrough) {
      this.pushCommand('set', 'url_passthrough', true);
    }
  }

  /** Update consent state after user action. */
  update(state: Record<string, 'granted' | 'denied'>): void {
    this.pushCommand('consent', 'update', state);
  }

  private pushCommand(...args: unknown[]): void {
    try {
      const w = window as unknown as Record<string, unknown[]>;
      w['dataLayer'] = w['dataLayer'] ?? [];
      w['dataLayer'].push(args);
    } catch { /* GCM unavailable */ }
  }
}
