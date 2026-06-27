---
id: feature-angular-consent-manager
type: feature
status: proposed
created: 2026-06-27
package: '@hexguard/angular-consent-manager'
---

# @hexguard/angular-consent-manager

## Summary

Headless consent management state — GDPR/CCPA consent categories, granular opt-in/opt-out, consent history, and integration with cookie consent. For privacy preference centers and compliance dashboards.

## Goals

- Consent category management (necessary, analytics, marketing, functional, social)
- Granular opt-in/opt-out per category
- Consent version tracking (re-prompt on policy update)
- Consent history with audit timestamps
- Integration with cookie consent banner state
- DSAR (Data Subject Access Request) submission flow
- Consent export for portability
- Withdraw consent at any time

## Non-Goals

- No rendered consent banner UI (headless state only)
- No server-side consent enforcement (pairs with HexGuard.Consent)
- No cookie scanning

## Proposed Public API

```typescript
export function injectConsentManager(config: {
  endpoint: string;
  categories: ConsentCategory[];
}): {
  readonly categories: Signal<ConsentCategory[]>;
  readonly consentVersion: Signal<number>;
  readonly lastUpdated: Signal<Date | null>;
  readonly requiresReconsent: Signal<boolean>;
  readonly isSubmitting: Signal<boolean>;
  readonly history: Signal<ConsentRecord[]>;
  setConsent(categoryId: string, granted: boolean): void;
  acceptAll(): void;
  rejectAll(): void;
  savePreferences(): Promise<void>;
  withdrawAll(): Promise<void>;
  exportConsent(): Promise<ConsentExport>;
  submitDsar(request: DsarRequest): Promise<void>;
};

export interface ConsentCategory {
  id: string;
  name: string;
  description: string;
  isRequired: boolean;
  isGranted: boolean;
}

export interface ConsentRecord {
  version: number;
  categories: Record<string, boolean>;
  timestamp: Date;
  ipAddress?: string;
}

export interface DsarRequest {
  type: 'access' | 'erasure' | 'rectification' | 'portability';
  details: string;
}
```

## Implementation Plan
1. Scaffold `angular/packages/angular-consent-manager/`.
2. Implement category management, consent persistence, history, DSAR submission with signals.
3. Add version-based re-consent detection.
4. Add tests. Register in workspace.
