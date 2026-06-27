---
id: feature-ts-gdpr
type: feature
status: proposed
created: 2026-06-27
package: '@hexguard/ts-gdpr'
---

# @hexguard/ts-gdpr

## Summary

Zero-dependency GDPR/CCPA compliance utilities — consent string parsing, age verification, data classification helpers, and regulatory formatting. For client-side compliance tooling.

## Proposed Public API

```typescript
// Consent string (IAB TCF v2)
export function parseConsentString(consent: string): ConsentData;
export interface ConsentData {
  version: number;
  vendorConsents: number[];
  purposeConsents: number[];
  vendorLegitimateInterests: number[];
}

// Age verification
export function isAgeVerified(birthDate: Date, minAge?: number): boolean;
export function ageFromDob(birthDate: Date): number;

// Data classification
export function classifyData(data: unknown): SensitivityLevel;
export type SensitivityLevel = 'none' | 'pii' | 'spi' | 'phi';

// PII detection (client-side lightweight)
export function detectPiiTypes(text: string): PiiType[];
export type PiiType = 'email' | 'phone' | 'creditCard' | 'ssn' | 'ipAddress' | 'passport';

// Regulatory formatting
export function formatDataRetention(days: number): string; // "30 days", "1 year", "Indefinite"
export function formatLegalBasis(basis: string): string;
export function getGdprDeadline(submittedAt: Date): Date; // +30 days
export function getCcpaDeadline(submittedAt: Date): Date; // +45 days

// Cookie helpers
export function parseCookieString(cookie: string): Record<string, string>;
export function serializeCookieString(cookies: Record<string, string>): string;
```

## Implementation Plan
1. Create `ts/packages/ts-gdpr/` with zero dependencies.
2. Implement consent parsing, PII detection, age verification, regulatory helpers.
3. Add tests for all regulatory edge cases.
4. Publish to npm.
