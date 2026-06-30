import type { ConsentCategory, GoogleConsentType } from './types';

/**
 * Returns the default GDPR-aligned consent categories.
 *
 * - **necessary** (required, maps to `security_storage`)
 * - **functional** (optional, maps to `functionality_storage`)
 * - **analytics** (optional, maps to `analytics_storage`)
 * - **marketing** (optional, maps to `ad_storage` + `ad_user_data` + `ad_personalization`)
 */
export function defaultConsentCategories(): ConsentCategory[] {
  return [
    {
      id: 'necessary',
      label: 'Strictly Necessary',
      description: 'Required for the website to function properly. Cannot be disabled. Includes session cookies, CSRF tokens, and load balancer cookies.',
      required: true,
      defaultConsent: true,
      purposes: [
        { id: 'session', label: 'Session Management', description: 'Maintains your session state across page requests.' },
        { id: 'security', label: 'Security', description: 'Protects against cross-site request forgery and other security threats.' },
        { id: 'load-balancing', label: 'Load Balancing', description: 'Distributes requests across servers for performance.' },
      ],
      googleConsentType: 'security_storage',
      scriptIdentifiers: ['necessary-scripts'],
    },
    {
      id: 'functional',
      label: 'Functional',
      description: 'Remembers your preferences to enhance your experience. Includes language, region, and display preferences.',
      required: false,
      defaultConsent: null,
      iabPurposeIds: [1],
      purposes: [
        { id: 'language', label: 'Language Preference', description: 'Remembers your language selection.' },
        { id: 'region', label: 'Region Selection', description: 'Stores your region for localized content.' },
        { id: 'ui-preferences', label: 'UI Preferences', description: 'Remembers display settings like theme or font size.' },
      ],
      googleConsentType: 'functionality_storage',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      description: 'Collects anonymous usage data to help us improve the website. Includes page views, navigation paths, and feature usage.',
      required: false,
      defaultConsent: null,
      iabPurposeIds: [7, 8, 9, 10],
      purposes: [
        { id: 'page-views', label: 'Page Views', description: 'Tracks pages visited and time spent on each page.' },
        { id: 'navigation', label: 'Navigation Analysis', description: 'Analyzes how users navigate through the site.' },
        { id: 'performance', label: 'Performance Monitoring', description: 'Monitors site performance and error rates.' },
      ],
      googleConsentType: 'analytics_storage',
    },
    {
      id: 'marketing',
      label: 'Marketing',
      description: 'Tracks your browsing across sites to deliver relevant ads and measure campaign effectiveness.',
      required: false,
      defaultConsent: null,
      iabPurposeIds: [2, 3, 4, 5, 6],
      iabSpecialFeatureIds: [1, 2],
      purposes: [
        { id: 'ad-personalization', label: 'Ad Personalization', description: 'Shows ads tailored to your interests.' },
        { id: 'ad-measurement', label: 'Ad Measurement', description: 'Measures the effectiveness of advertising campaigns.' },
        { id: 'social-media', label: 'Social Media Integration', description: 'Enables social media sharing and tracking.' },
      ],
      googleConsentType: 'ad_storage',
      scriptIdentifiers: ['marketing-scripts'],
    },
  ];
}

/**
 * Returns CCPA-aligned consent categories with opt-out model.
 * Under CCPA, analytics and functional may default to true (no prior consent needed),
 * while marketing/sale-of-data is undecided (opt-out available).
 */
export function defaultCcpCategories(): ConsentCategory[] {
  return [
    {
      id: 'necessary',
      label: 'Strictly Necessary',
      description: 'Required for the website to function properly. Cannot be disabled.',
      required: true,
      defaultConsent: true,
      purposes: [
        { id: 'session', label: 'Session Management', description: 'Maintains your session state.' },
        { id: 'security', label: 'Security', description: 'Protects against security threats.' },
      ],
      googleConsentType: 'security_storage',
    },
    {
      id: 'functional',
      label: 'Functional',
      description: 'Remembers your preferences for an enhanced experience.',
      required: false,
      defaultConsent: true,
      purposes: [
        { id: 'language', label: 'Language Preference', description: 'Remembers your language selection.' },
        { id: 'ui-preferences', label: 'UI Preferences', description: 'Stores display preferences.' },
      ],
      googleConsentType: 'functionality_storage',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      description: 'Collects usage data to help us improve the website.',
      required: false,
      defaultConsent: true,
      purposes: [
        { id: 'page-views', label: 'Page Views', description: 'Tracks pages visited.' },
        { id: 'performance', label: 'Performance', description: 'Monitors site performance.' },
      ],
      googleConsentType: 'analytics_storage',
    },
    {
      id: 'marketing',
      label: 'Marketing / Sale of Information',
      description: 'Tracks your browsing to deliver targeted ads. Under the California Consumer Privacy Act (CCPA), you may opt out of the sale of your personal information.',
      required: false,
      defaultConsent: null,
      purposes: [
        { id: 'ad-personalization', label: 'Ad Personalization', description: 'Shows personalized ads.' },
        { id: 'data-sale', label: 'Sale of Information', description: 'Shares data with third parties for cross-context behavioral advertising.' },
      ],
      googleConsentType: 'ad_storage',
    },
  ];
}

/** Region-specific config presets. */
export const RegionConfig = {
  /** Default GDPR opt-in configuration for EU/EEA countries. */
  gdpr: {
    consentModel: 'opt-in' as const,
    googleConsentMode: { enabled: true },
    categories: defaultConsentCategories(),
  },
  /** CCPA opt-out configuration for California. */
  ccpa: {
    consentModel: 'opt-out' as const,
    googleConsentMode: { enabled: true },
    categories: defaultCcpCategories(),
  },
  /** UK-specific configuration (UK GDPR + PECR). */
  uk: {
    consentModel: 'opt-in' as const,
    googleConsentMode: { enabled: true },
    categories: defaultConsentCategories(),
  },
  /** LGPD opt-in configuration for Brazil. */
  lgpd: {
    consentModel: 'opt-in' as const,
    googleConsentMode: { enabled: true },
    categories: defaultConsentCategories(),
  },
} as const;
