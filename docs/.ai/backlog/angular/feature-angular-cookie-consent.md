---
id: feature-angular-cookie-consent
type: feature
status: proposed
created: 2026-06-25
package: '@hexguard/angular-cookie-consent'
---

# @hexguard/angular-cookie-consent

## Summary

Headless GDPR/ePrivacy cookie consent management for Angular — signal-based consent state, categorized consent categories, local persistence, and a consent-change notification stream. EU-facing Angular apps must obtain explicit user consent before placing non-essential cookies or tracking scripts, yet every team rebuilds the same consent-state management.

**Competition check:** Existing Angular cookie consent packages (e.g., `ngx-cookieconsent`, `angular-cookie-law`) are opinionated UI widgets with baked-in banners. None offer a headless, signal-based consent state primitive that lets consumers render their own UI.

## Why Wide Adoption

GDPR, ePrivacy Directive, and similar regulations (LGPD, CCPA) require explicit consent for tracking. This is mandatory infrastructure, not a nice-to-have. Every Angular app serving EU users needs it. A headless package separates consent-state management from banner UI, making it compatible with any design system.

## Goals

1. Provide `injectCookieConsent()` — signal-based consent state factory.
2. Support categorized consent (e.g., `necessary`, `analytics`, `marketing`, `functional`).
3. Persist consent state to `localStorage` with timestamp and version.
4. Expose `grant(categories)` and `withdraw(categories)` methods.
5. Fire a signal/event when consent changes (for conditionally loading tracking scripts).
6. Support required categories that cannot be withdrawn (e.g., `necessary`).
7. Provide `ConsentGuard` — route guard that blocks navigation until consent is given for required categories.

## Non-Goals

- No banner UI component (headless — consumers render their own consent banner).
- No GTM/Tag Manager integration (consumer wires their own tag-loader on consent change).
- No cookie-scanning or auto-detection of cookies.

## Decisions

1. **Signal-first**: Uses `Signal<ConsentState>` for reactive UI updates.
2. **localStorage-backed**: Consent stored under `hexguard:consent:{id}` key with TTL consideration.
3. **InjectionToken-based**: Follows the `provide*()` + `inject*()` pattern with token disambiguation for multi-instance scenarios.

## Proposed Public API

```typescript
// ── Types ─────────────────────────────────────────────────

export interface ConsentCategory {
  id: string;
  label: string;
  description: string;
  required: boolean;    // Cannot be withdrawn
}

export interface ConsentState {
  granted: Record<string, boolean>;   // category → granted
  timestamp: number;
  version: number;
}

export interface CookieConsentConfig {
  categories: ConsentCategory[];
  storageKey?: string;
  consentVersion?: number;
}

// ── Provider ──────────────────────────────────────────────

export function provideCookieConsent(
  config?: CookieConsentConfig
): {
  readonly token: InjectionToken<CookieConsentFacade>;
  readonly providers: Provider[];
};

// ── Inject function ───────────────────────────────────────

export function injectCookieConsent(
  token?: InjectionToken<CookieConsentFacade>
): CookieConsentFacade;

// ── Facade ────────────────────────────────────────────────

export interface CookieConsentFacade {
  readonly state: Signal<ConsentState>;
  readonly isCategoryGranted: (id: string) => Signal<boolean>;
  readonly hasInteracted: Signal<boolean>;
  readonly consentGiven: Signal<readonly string[]>;  // granted category IDs

  grant(categories: string[]): void;
  withdraw(categories: string[]): void;
  reset(): void;

  readonly onChange: Signal<ConsentState>;  // emits on every grant/withdraw
}

// ── Route Guard ───────────────────────────────────────────

export const requireCookieConsent = (...categories: string[]): CanActivateFn => {
  // Blocks navigation until consent is given for the specified categories
};

// ── Usage ─────────────────────────────────────────────────

// app.config.ts
const COOKIE_CONSENT = provideCookieConsent({
  categories: [
    { id: 'necessary', label: 'Necessary', description: 'Essential cookies', required: true },
    { id: 'analytics', label: 'Analytics', description: 'Usage tracking', required: false },
    { id: 'marketing', label: 'Marketing', description: 'Ad personalization', required: false },
  ]
});

@Component({
  providers: [COOKIE_CONSENT.providers],
})
class AppComponent {
  readonly consent = injectCookieConsent(COOKIE_CONSENT.token);

  onAcceptAll() {
    this.consent.grant(['analytics', 'marketing']);
  }

  onAcceptNecessary() {
    this.consent.withdraw(['analytics', 'marketing']);
  }
}
```

## Implementation Plan

1. Scaffold `angular/packages/angular-cookie-consent/` following the standard pattern.
2. Implement `ConsentCategory`, `ConsentState`, `CookieConsentConfig` types.
3. Implement `provideCookieConsent()` factory with `InjectionToken`.
4. Implement `injectCookieConsent()` with signal-based state.
5. Implement localStorage persistence with serialization/deserialization.
6. Implement `requireCookieConsent` route guard.
7. Add tests: grant/withdraw/reset, persistence, required-category guard, edge cases.
8. Create demo page using `DemoPageLayoutComponent`.
9. Register in workspace, build scripts, and catalog.
