/**
 * Core types for the consent management engine.
 */

/** The lifecycle status of the consent decision. */
export type ConsentStatus =
  | 'unknown'    // First visit, no decision recorded
  | 'pending'    // Banner displayed, waiting for user action
  | 'granted'    // User granted (at least some non-necessary categories)
  | 'denied'     // User rejected all non-necessary categories
  | 'expired';   // Consent validity period has ended

/** `true` = granted, `false` = denied, `null` = undecided. */
export type ConsentValue = boolean | null;

/** Category ID → consent value map. */
export type ConsentState = Record<string, ConsentValue>;

/** The consent model determines default states and behavior. */
export type ConsentModel = 'opt-in' | 'opt-out';

/** Maps a consent category to a Google Consent Mode type. */
export type GoogleConsentType =
  | 'analytics_storage'
  | 'ad_storage'
  | 'ad_user_data'
  | 'ad_personalization'
  | 'functionality_storage'
  | 'personalization_storage'
  | 'security_storage';

/** A single consent category (e.g. "analytics", "marketing"). */
export interface ConsentCategory {
  /** Unique identifier for the category (e.g. 'analytics', 'marketing'). */
  readonly id: string;
  /** Human-readable label displayed in the banner/preference center. */
  readonly label: string;
  /** Description explaining what this category does. */
  readonly description: string;
  /** If true, this category is always enabled and not user-toggleable. */
  readonly required: boolean;
  /** Default value before the user makes a decision. null = undecided. */
  readonly defaultConsent: ConsentValue;
  /** Sub-purposes within this category. */
  readonly purposes: readonly ConsentPurpose[];
  /** Google Consent Mode type this category maps to. */
  readonly googleConsentType?: GoogleConsentType;
  /** Identifiers of scripts that fall under this category. */
  readonly scriptIdentifiers?: readonly string[];
}

/** A granular purpose within a consent category. */
export interface ConsentPurpose {
  /** Unique identifier (e.g. 'ga4_page_view', 'ad_personalization'). */
  readonly id: string;
  /** Human-readable label. */
  readonly label: string;
  /** Description of the purpose. */
  readonly description: string;
  /** Whether legitimate interest can be claimed for this purpose. */
  readonly legitimateInterest?: boolean;
}

/** A third-party vendor that processes data under consent. */
export interface ConsentVendor {
  /** IAB vendor ID (if registered). */
  readonly id: string;
  /** Vendor name. */
  readonly name: string;
  /** Vendor privacy policy URL. */
  readonly policyUrl?: string;
  /** Purpose IDs this vendor uses. */
  readonly purposeIds: readonly string[];
  /** Whether this vendor claims legitimate interest. */
  readonly legitimateInterest?: boolean;
}

/** Controls how the user's region is detected. */
export type RegionDetectionMode = 'disabled' | 'browser-timezone' | 'geo-api';

/** Storage backend for persisting consent state. */
export type StorageBackend = 'cookie' | 'localstorage' | 'both';

/** Strategy for loading a script based on consent category. */
export type ScriptLoadingStrategy =
  /** Script won't load until the user grants this category. */
  | 'block_until_consent'
  /** Script loads but Google Consent Mode reports 'denied' for its type. */
  | 'load_with_denied_signal'
  /** Script always loads regardless of consent (only for 'necessary' category). */
  | 'load_always';

/** A script whose loading is managed by the consent system. */
export interface ConsentManagedScript {
  /** Unique identifier for this script. */
  readonly id: string;
  /** Script source URL. */
  readonly src: string;
  /** Consent category this script belongs to. */
  readonly category: string;
  /** Loading strategy. */
  readonly strategy: ScriptLoadingStrategy;
  /** Additional HTML attributes for the script element. */
  readonly attributes?: Record<string, string>;
  /** Callback invoked after the script loads successfully. */
  readonly onLoad?: () => void;
}
