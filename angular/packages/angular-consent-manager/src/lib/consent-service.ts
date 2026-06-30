import {
  DestroyRef,
  Injectable,
  computed,
  inject,
  signal,
  type Signal,
  type WritableSignal,
} from '@angular/core';
import type { ConsentManagerConfig } from './consent-config';
import type {
  ConsentCategory,
  ConsentState,
  ConsentStatus,
  ConsentValue,
} from './types';
import type { ConsentManagedScript } from './types';
import { detectRegion } from './region-detection';
import type { GoogleConsentModeService } from './google-consent-mode';
import type { ConsentRecord, ConsentMethod } from './consent-audit';

const CONSENT_COOKIE_DEFAULT = 'hexguard_consent';

interface PersistedConsent {
  readonly v: number;                              // schema version
  readonly cid: string;                            // consent ID (UUID)
  readonly s: Record<string, boolean | null>;       // category states
  readonly ts: number;                             // consented at (epoch ms)
  readonly ex: number;                             // expires at (epoch ms)
  readonly r?: string;                             // region
}

let consentIdCounter = 0;
function generateConsentId(): string {
  return `hc-${++consentIdCounter}-${Date.now().toString(36)}`;
}

/**
 * Singleton service managing the consent lifecycle.
 *
 * State machine:
 * ```
 * unknown ──► pending ──► granted / denied ──► expired ──► unknown
 *                 │                                  │
 *                 └──► withdrawn ──► unknown ◄────────┘
 * ```
 */
@Injectable({ providedIn: 'root' })
export class ConsentManagerService {
  // ── Configuration (set by provideConsentManager) ──────────────────
  private config: ConsentManagerConfig | null = null;
  private gcmService: null = null;

  // ── State signals ─────────────────────────────────────────────────
  readonly status: WritableSignal<ConsentStatus> = signal('unknown');
  readonly state: WritableSignal<ConsentState> = signal({});
  readonly consentId: WritableSignal<string | null> = signal(null);
  readonly consentedAt: WritableSignal<number | null> = signal(null);
  readonly expiresAt: WritableSignal<number | null> = signal(null);
  readonly region: WritableSignal<string | null> = signal(null);

  // ── Derived signals ───────────────────────────────────────────────
  /** True if at least one non-necessary category has been granted. */
  readonly isConsented: Signal<boolean> = computed(() => {
    const state = this.state();
    const cats = this.config?.categories ?? [];
    return cats.some(c => !c.required && state[c.id] === true);
  });

  /** True if the user has made a decision on all non-required categories. */
  readonly hasDecided: Signal<boolean> = computed(() => {
    const state = this.state();
    const cats = this.config?.categories ?? [];
    return cats.filter(c => !c.required).every(c => state[c.id] !== null);
  });

  /** True if the consent period has ended. */
  readonly isExpired: Signal<boolean> = computed(() => {
    const exp = this.expiresAt();
    return exp !== null && exp < Date.now();
  });

  /** The configured categories (readonly access for consumers). */
  readonly categories: Signal<readonly ConsentCategory[]> = computed(() => {
    return this.config?.categories ?? [];
  });

  // ── Internal state ────────────────────────────────────────────────
  private auditRecords: ConsentRecord[] | null = null;
  private scriptLoader: { register: (scripts: ConsentManagedScript[]) => void; onConsentChange: (state: ConsentState) => void } | null = null;

  constructor() {
    // Injected services for cleanup
    inject(DestroyRef).onDestroy(() => this.destroy());
  }

  /**
   * Configure the consent manager with the given config.
   * Called by `provideConsentManager`.
   */
  configure(config: ConsentManagerConfig): void {
    if (this.config) return; // already configured
    this.config = this.resolveConfig(config);

    // Detect region
    const region = detectRegion(this.config.regionDetection ?? { mode: 'browser-timezone' });
    this.region.set(region);

    // Apply regional overrides
    if (region && this.config.regionalOverrides?.[region]) {
      const override = this.config.regionalOverrides[region];
      if (override.categories) {
        this.config = { ...this.config, categories: override.categories };
      }
    }

    // Set default consent states from categories
    const defaults: ConsentState = {};
    for (const cat of this.config.categories) {
      defaults[cat.id] = cat.defaultConsent;
    }

    // Try to hydrate from storage
    const persisted = this.readFromStorage();
    if (persisted) {
      this.hydrate(persisted, defaults);
    } else {
      this.state.set(defaults);
    }

    // Initialize Google Consent Mode
    if (this.config.googleConsentMode?.enabled) {
      this.initGoogleConsentMode();
    }

    // Initialize script loader
    if (this.config.scriptLoading?.enabled && this.config.scriptLoading.scripts) {
      this.initScriptLoader([...this.config.scriptLoading.scripts]);
    }

    // Check expiry
    this.checkExpiry();
  }

  // ── Public API ────────────────────────────────────────────────────

  isCategoryGranted(categoryId: string): Signal<boolean> {
    return computed(() => {
      const s = this.state();
      return s[categoryId] === true;
    });
  }

  isPurposeGranted(purposeId: string): Signal<boolean> {
    return computed(() => {
      const cats = this.config?.categories ?? [];
      for (const cat of cats) {
        if (cat.purposes.some(p => p.id === purposeId)) {
          const s = this.state();
          return s[cat.id] === true;
        }
      }
      return false;
    });
  }

  acceptAll(): void {
    const newState: ConsentState = {};
    const cats = this.config?.categories ?? [];
    for (const cat of cats) {
      newState[cat.id] = cat.required ? true : true;
    }
    this.applyConsent(newState, 'banner_accept_all');
  }

  rejectAll(): void {
    const newState: ConsentState = {};
    const cats = this.config?.categories ?? [];
    for (const cat of cats) {
      newState[cat.id] = cat.required ? true : false;
    }
    this.applyConsent(newState, 'banner_reject_all');
  }

  acceptCategory(categoryId: string): void {
    const current = { ...this.state() };
    current[categoryId] = true;
    this.applyConsent(current, 'preference_center');
  }

  rejectCategory(categoryId: string): void {
    const current = { ...this.state() };
    current[categoryId] = false;
    this.applyConsent(current, 'preference_center');
  }

  setConsent(state: ConsentState, method: ConsentMethod = 'api'): void {
    const merged: ConsentState = {};
    const cats = this.config?.categories ?? [];
    for (const cat of cats) {
      merged[cat.id] = cat.required ? true : (state[cat.id] ?? cat.defaultConsent);
    }
    this.applyConsent(merged, method);
  }

  updateConsent(partial: Partial<ConsentState>, method: ConsentMethod = 'api'): void {
    const merged = { ...this.state() };
    for (const [key, value] of Object.entries(partial)) {
      if (value !== undefined) {
        merged[key] = value;
      }
    }
    this.applyConsent(merged, method);
  }

  withdrawConsent(): void {
    const reset: ConsentState = {};
    const cats = this.config?.categories ?? [];
    for (const cat of cats) {
      reset[cat.id] = cat.required ? true : null;
    }
    const prevState = this.state();
    this.state.set(reset);
    this.status.set('unknown');
    this.consentId.set(null);
    this.consentedAt.set(null);
    this.expiresAt.set(null);

    this.writeToStorage(null);
    this.recordAudit(prevState, reset, 'withdraw', 'api');
    this.updateGoogleConsent(reset);
    this.notifyScriptLoader(reset);
  }

  refreshConsent(): void {
    const persisted = this.readFromStorage();
    if (persisted) {
      const defaults: ConsentState = {};
      const cats = this.config?.categories ?? [];
      for (const cat of cats) {
        defaults[cat.id] = cat.defaultConsent;
      }
      this.hydrate(persisted, defaults);
    }
    this.checkExpiry();
  }

  reset(): void {
    const defaults: ConsentState = {};
    const cats = this.config?.categories ?? [];
    for (const cat of cats) {
      defaults[cat.id] = cat.defaultConsent;
    }
    this.state.set(defaults);
    this.status.set('unknown');
    this.consentId.set(null);
    this.consentedAt.set(null);
    this.expiresAt.set(null);
    this.writeToStorage(null);
  }

  /** Internal: get current config (for GCM integration). */
  getConfig(): ConsentManagerConfig | null {
    return this.config;
  }

  /** Internal: set config reference (used by injectConsentManager). */
  setConfigRef(config: ConsentManagerConfig): void {
    this.config = this.resolveConfig(config);
  }

  // ── Internal ──────────────────────────────────────────────────────

  private resolveConfig(config: ConsentManagerConfig): ConsentManagerConfig {
    return {
      cookieName: CONSENT_COOKIE_DEFAULT,
      cookiePath: '/',
      cookieSecure: true,
      cookieSameSite: 'lax',
      consentModel: 'opt-in',
      consentExpiryDays: 365,
      bannerDisplayDelay: 0,
      bannerDisplayLimit: 3,
      storageBackend: 'both',
      auditEnabled: true,
      regionDetection: { mode: 'browser-timezone' },
      ...config,
      scriptLoading: {
        enabled: true,
        blockingMode: 'queue',
        ...(config.scriptLoading ?? {}),
      },
      googleConsentMode: {
        enabled: true,
        defaultConsent: undefined,
        waitForUpdate: 500,
        urlPassthrough: false,
        adsDataRedaction: true,
        ...(config.googleConsentMode ?? {}),
      },
    };
  }

  private applyConsent(newState: ConsentState, method: ConsentMethod): void {
    const prevState = this.state();
    const now = Date.now();
    const expiryDays = this.config?.consentExpiryDays ?? 365;

    this.state.set(newState);
    this.consentId.set(generateConsentId());
    this.consentedAt.set(now);
    this.expiresAt.set(now + expiryDays * 24 * 60 * 60 * 1000);

    // Determine status
    const hasAnyGranted = Object.values(newState).some(v => v === true);
    const allNonRequiredDenied = (this.config?.categories ?? [])
      .filter(c => !c.required)
      .every(c => newState[c.id] === false);

    if (allNonRequiredDenied && !hasAnyGranted) {
      this.status.set('denied');
    } else {
      this.status.set('granted');
    }

    this.writeToStorage();
    this.recordAudit(prevState, newState, 'grant', method);
    this.updateGoogleConsent(newState);
    this.notifyScriptLoader(newState);
  }

  private hydrate(persisted: PersistedConsent, defaults: ConsentState): void {
    const merged: ConsentState = {};
    const cats = this.config?.categories ?? [];

    for (const cat of cats) {
      const val = persisted.s[cat.id];
      merged[cat.id] = val !== undefined ? val : (cat.defaultConsent ?? defaults[cat.id] ?? null);
    }

    this.state.set(merged);
    this.consentId.set(persisted.cid);
    this.consentedAt.set(persisted.ts);
    this.expiresAt.set(persisted.ex);

    if (persisted.r) {
      this.region.set(persisted.r);
    }

    // Determine status from persisted state
    const hasAnyGranted = Object.values(merged).some(v => v === true);
    const allNonRequiredDenied = cats
      .filter(c => !c.required)
      .every(c => merged[c.id] === false);

    if (allNonRequiredDenied && !hasAnyGranted) {
      this.status.set('denied');
    } else if (hasAnyGranted) {
      this.status.set('granted');
    } else {
      this.status.set('unknown');
    }
  }

  private checkExpiry(): void {
    const exp = this.expiresAt();
    if (exp !== null && exp < Date.now()) {
      this.status.set('expired');
      const prevState = this.state();

      // Reset non-necessary categories
      const reset: ConsentState = {};
      const cats = this.config?.categories ?? [];
      for (const cat of cats) {
        reset[cat.id] = cat.required ? true : null;
      }
      this.state.set(reset);
      this.consentId.set(null);
      this.consentedAt.set(null);
      this.expiresAt.set(null);

      this.recordAudit(prevState, reset, 'expire', 'expiry');
      this.writeToStorage(null);
    }
  }

  // ── Storage ───────────────────────────────────────────────────────

  private getCookieName(): string {
    return this.config?.cookieName ?? CONSENT_COOKIE_DEFAULT;
  }

  private readFromStorage(): PersistedConsent | null {
    try {
      // Try cookie first
      const cookieStr = this.readCookie(this.getCookieName());
      if (cookieStr) {
        try {
          return JSON.parse(cookieStr) as PersistedConsent;
        } catch { /* fall through to localStorage */ }
      }

      // Fall back to localStorage
      const lsStr = this.getLocalStorage()?.getItem(this.getCookieName());
      if (lsStr) {
        return JSON.parse(lsStr) as PersistedConsent;
      }
    } catch { /* storage unavailable */ }
    return null;
  }

  private writeToStorage(override?: PersistedConsent | null): void {
    const persisted: PersistedConsent | null = override !== undefined ? override : {
      v: 1,
      cid: this.consentId() ?? generateConsentId(),
      s: this.state(),
      ts: this.consentedAt() ?? Date.now(),
      ex: this.expiresAt() ?? Date.now() + 365 * 24 * 60 * 60 * 1000,
      r: this.region() ?? undefined,
    };

    const backend = this.config?.storageBackend ?? 'both';

    if (persisted === null) {
      // Clear storage
      if (backend === 'cookie' || backend === 'both') {
        this.eraseCookie(this.getCookieName());
      }
      if (backend === 'localstorage' || backend === 'both') {
        this.getLocalStorage()?.removeItem(this.getCookieName());
      }
      return;
    }

    const json = JSON.stringify(persisted);
    const expiryDays = this.config?.consentExpiryDays ?? 365;

    if (backend === 'cookie' || backend === 'both') {
      this.writeCookie(this.getCookieName(), json, expiryDays);
    }
    if (backend === 'localstorage' || backend === 'both') {
      this.getLocalStorage()?.setItem(this.getCookieName(), json);
    }
  }

  // ── Cookie helpers ────────────────────────────────────────────────

  private isBrowser(): boolean {
    return typeof document !== 'undefined' && typeof document.cookie === 'string';
  }

  private readCookie(name: string): string | null {
    if (!this.isBrowser()) return null;
    const prefix = `${encodeURIComponent(name)}=`;
    for (const cookie of document.cookie.split('; ')) {
      const trimmed = cookie.trim();
      if (trimmed.startsWith(prefix)) {
        return decodeURIComponent(trimmed.slice(prefix.length));
      }
    }
    return null;
  }

  private writeCookie(name: string, value: string, maxAgeDays: number): void {
    if (!this.isBrowser()) return;
    const config = this.config!;
    const encoded = encodeURIComponent(value);
    const maxAgeSec = Math.floor(maxAgeDays * 24 * 60 * 60);
    let cookie = `${encodeURIComponent(name)}=${encoded}; path=${config.cookiePath ?? '/'}; max-age=${maxAgeSec}`;
    if (config.cookieDomain) cookie += `; domain=${config.cookieDomain}`;
    if (config.cookieSecure !== false) cookie += '; Secure';
    if (config.cookieSameSite) cookie += `; SameSite=${config.cookieSameSite}`;
    document.cookie = cookie;
  }

  private eraseCookie(name: string): void {
    if (!this.isBrowser()) return;
    document.cookie = `${encodeURIComponent(name)}=; path=${this.config?.cookiePath ?? '/'}; max-age=0`;
  }

  private getLocalStorage(): Storage | null {
    try {
      const ls = typeof window !== 'undefined' ? window.localStorage : null;
      if (ls) {
        ls.setItem('__hexguard_test__', '1');
        ls.removeItem('__hexguard_test__');
      }
      return ls;
    } catch {
      return null;
    }
  }

  // ── Google Consent Mode ───────────────────────────────────────────

  private initGoogleConsentMode(): void {
    if (typeof window === 'undefined') return;
    const cfg = this.config?.googleConsentMode;
    if (!cfg?.enabled) return;

    // We'll lazy-import a helper; the GCM integration is in google-consent-mode.ts
    // and will be set up via the provider. For now, push default consent.
    const state = this.state();
    this.pushGcmDefault(state);
  }

  private updateGoogleConsent(state: ConsentState): void {
    if (typeof window === 'undefined') return;
    const cfg = this.config?.googleConsentMode;
    if (!cfg?.enabled) return;
    this.pushGcmUpdate(state);
  }

  private pushGcmDefault(state: ConsentState): void {
    this.pushDataLayer('consent', 'default', this.buildGcmPayload(state, true));
  }

  private pushGcmUpdate(state: ConsentState): void {
    this.pushDataLayer('consent', 'update', this.buildGcmPayload(state, false));
  }

  private buildGcmPayload(state: ConsentState, isDefault: boolean): Record<string, string> {
    const cfg = this.config?.googleConsentMode;
    const payload: Record<string, string> = {};

    // Map category states to Google Consent Types
    for (const cat of this.config?.categories ?? []) {
      if (!cat.googleConsentType) continue;
      const val = state[cat.id];
      payload[cat.googleConsentType] = val === true ? 'granted' : 'denied';
    }

    // Ensure security_storage is always granted
    payload['security_storage'] = 'granted';

    if (isDefault) {
      if (cfg?.waitForUpdate !== undefined && cfg.waitForUpdate > 0) {
        payload['wait_for_update'] = String(cfg.waitForUpdate);
      }
      if (cfg?.adsDataRedaction) {
        payload['ads_data_redaction'] = 'true';
      }
    }

    return payload;
  }

  private pushDataLayer(...args: unknown[]): void {
    try {
      const w = window as unknown as Record<string, unknown>;
      w['dataLayer'] = (w['dataLayer'] ?? []) as unknown[];
      const dl = w['dataLayer'] as unknown[];
      dl.push(args);
    } catch { /* GCM unavailable */ }
  }

  // ── Audit Trail ───────────────────────────────────────────────────

  private recordAudit(
    prevState: ConsentState,
    newState: ConsentState,
    action: ConsentRecord['action'],
    method: ConsentMethod,
  ): void {
    if (!this.config?.auditEnabled) return;

    const record: ConsentRecord = {
      id: generateConsentId(),
      timestamp: new Date().toISOString(),
      action,
      previousState: prevState,
      newState,
      consentVersion: 1,
      method,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      region: this.region(),
      consentId: this.consentId(),
    };

    this.appendAuditRecord(record);
  }

  private appendAuditRecord(record: ConsentRecord): void {
    try {
      const ls = this.getLocalStorage();
      if (!ls) return;
      const key = `${this.getCookieName()}_audit`;
      const raw = ls.getItem(key);
      const records: ConsentRecord[] = raw ? JSON.parse(raw) : [];
      records.push(record);
      // Keep max 500 records
      if (records.length > 500) {
        records.splice(0, records.length - 500);
      }
      ls.setItem(key, JSON.stringify(records));
    } catch { /* audit storage unavailable */ }
  }

  /** Get stored audit records. */
  getAuditRecords(): ConsentRecord[] {
    try {
      const ls = this.getLocalStorage();
      if (!ls) return [];
      const key = `${this.getCookieName()}_audit`;
      const raw = ls.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  // ── Script Loader ─────────────────────────────────────────────────

  private initScriptLoader(scripts: ConsentManagedScript[]): void {
    // Script loader is managed externally via ConsentScriptLoader class
    // Store for notification
  }

  private notifyScriptLoader(state: ConsentState): void {
    if (this.scriptLoader) {
      this.scriptLoader.onConsentChange(state);
    }
  }

  /** Internal: set script loader reference. */
  setScriptLoader(loader: { register: (scripts: ConsentManagedScript[]) => void; onConsentChange: (state: ConsentState) => void }): void {
    this.scriptLoader = loader;
  }

  // ── Cleanup ───────────────────────────────────────────────────────

  private destroy(): void {
    this.scriptLoader = null;
    this.gcmService = null;
    this.config = null;
  }
}
