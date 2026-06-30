export interface DemoConsentCategory {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly purposes: readonly string[];
}

export const DEMO_CONSENT_CATEGORIES: DemoConsentCategory[] = [
  {
    id: 'necessary',
    label: 'Strictly Necessary',
    description: 'Required for the website to function.',
    purposes: ['Session management', 'Security', 'Load balancing'],
  },
  {
    id: 'functional',
    label: 'Functional',
    description: 'Remembers your preferences.',
    purposes: ['Language preference', 'Region selection'],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    description: 'Collects anonymous usage data.',
    purposes: ['Page views', 'Navigation analysis'],
  },
  {
    id: 'marketing',
    label: 'Marketing',
    description: 'Tracks browsing for ads.',
    purposes: ['Ad personalization', 'Ad measurement'],
  },
];

export const DEMO_CONSENT_COOKIES = [
  { name: 'session_id', domain: 'example.com', party: 'first' as const, purpose: 'Session management', category: 'necessary', duration: 'Session', type: 'cookie' as const },
  { name: 'csrf_token', domain: 'example.com', party: 'first' as const, purpose: 'Security', category: 'necessary', duration: 'Session', type: 'cookie' as const },
  { name: 'lang_pref', domain: 'example.com', party: 'first' as const, purpose: 'Language preference', category: 'functional', duration: '365 days', type: 'cookie' as const },
  { name: '_ga', domain: 'example.com', party: 'third' as const, purpose: 'Page views', category: 'analytics', duration: '730 days', type: 'cookie' as const },
  { name: '_fbp', domain: 'example.com', party: 'third' as const, purpose: 'Ad personalization', category: 'marketing', duration: '90 days', type: 'cookie' as const },
];

export const DEMO_REGIONS = [
  { code: 'EU', label: 'GDPR (EU)', model: 'opt-in' as const },
  { code: 'US', label: 'CCPA (California)', model: 'opt-out' as const },
  { code: 'GB', label: 'UK GDPR + PECR', model: 'opt-in' as const },
  { code: 'BR', label: 'LGPD (Brazil)', model: 'opt-in' as const },
];
