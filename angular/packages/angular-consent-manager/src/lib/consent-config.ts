import type {
  ConsentCategory,
  ConsentModel,
  GoogleConsentType,
  RegionDetectionMode,
  StorageBackend,
} from './types';
import type { GoogleConsentModeConfig } from './google-consent-mode';
import type { RegionDetectionConfig } from './region-detection';

/**
 * Configuration for the consent manager.
 * Passed to {@link provideConsentManager}.
 */
export interface ConsentManagerConfig {
  // ── Identity & Cookie Settings ────────────────────────────────────
  /** Name of the consent cookie. Default: `'hexguard_consent'`. */
  readonly cookieName?: string;
  /** Cookie domain. Default: current hostname. */
  readonly cookieDomain?: string;
  /** Cookie path. Default: `'/'`. */
  readonly cookiePath?: string;
  /** Cookie Secure flag. Default: `true`. */
  readonly cookieSecure?: boolean;
  /** Cookie SameSite attribute. Default: `'lax'`. */
  readonly cookieSameSite?: 'lax' | 'strict' | 'none';

  // ── Consent Categories ───────────────────────────────────────────
  /**
   * Consent categories. Use {@link defaultConsentCategories} or
   * {@link defaultCcpCategories} for predefined sets, or provide custom.
   */
  readonly categories: readonly ConsentCategory[];

  /** The consent model. Default: `'opt-in'` (GDPR-style). */
  readonly consentModel?: ConsentModel;

  // ── Lifecycle ─────────────────────────────────────────────────────
  /** How many days before consent expires. Default: `365`. */
  readonly consentExpiryDays?: number;
  /** Milliseconds before the banner appears. Default: `0`. */
  readonly bannerDisplayDelay?: number;
  /** Max times the banner is shown per session. Default: `3`. */
  readonly bannerDisplayLimit?: number;

  // ── Region Detection ──────────────────────────────────────────────
  /** How to detect the user's region. Default: `'browser-timezone'`. */
  readonly regionDetection?: RegionDetectionConfig;
  /** Default region (ISO 3166-1 alpha-2) fallback. */
  readonly defaultRegion?: string;
  /**
   * Region-specific config overrides.
   * Key: ISO 3166-1 alpha-2 country code.
   * Value: partial config to merge with base config.
   */
  readonly regionalOverrides?: Record<string, Partial<ConsentManagerConfig>>;

  // ── Google Consent Mode ───────────────────────────────────────────
  /** Google Consent Mode v2 configuration. Set `enabled: false` to disable. */
  readonly googleConsentMode?: GoogleConsentModeConfig;

  // ── Storage ───────────────────────────────────────────────────────
  /** Storage backend for consent state. Default: `'both'`. */
  readonly storageBackend?: StorageBackend;
  /** Whether to record audit trail. Default: `true`. */
  readonly auditEnabled?: boolean;

  // ── Script Loading ────────────────────────────────────────────────
  /** Script loading configuration. */
  readonly scriptLoading?: {
    /** Whether script loading management is enabled. Default: `true`. */
    readonly enabled: boolean;
    /** Scripts to manage. */
    readonly scripts?: readonly import('./types').ConsentManagedScript[];
    /** How to handle scripts when consent is not yet given. Default: `'queue'`. */
    readonly blockingMode?: 'queue' | 'reject';
  };
}
