---
id: feature-ts-phone
type: feature
status: proposed
created: 2026-06-28
package: '@hexguard/ts-phone'
---

# @hexguard/ts-phone

## Summary

Zero-dependency phone number formatting, parsing, and validation utilities. E.164 formatting, national formatting, carrier detection, and country code lookup.


## Goals

- Provide zero-dependency, tree-shakeable pure functions
- Full TypeScript generics with strict type safety
- Compatible with browser and Node.js runtimes

## Non-Goals

- No runtime dependencies
- No framework-specific integrations
- No server-side or platform-specific features

## Proposed Public API

```typescript
// Formatting
export function formatPhone(number: string, country?: string, format?: PhoneFormat): string;
export type PhoneFormat = 'e164' | 'international' | 'national' | 'rfc3966';
// e164: +14155552671
// international: +1 415 555 2671
// national: (415) 555-2671
// rfc3966: tel:+1-415-555-2671

// Parsing
export function parsePhone(input: string, defaultCountry?: string): ParsedPhone | null;
export interface ParsedPhone {
  countryCode: number;       // 1
  countryName: string;       // "United States"
  nationalNumber: string;    // "4155552671"
  formattedE164: string;     // "+14155552671"
  formattedInternational: string;
  formattedNational: string;
  carrier?: string;
  type?: PhoneType;
}
export type PhoneType = 'mobile' | 'fixed' | 'voip' | 'toll-free' | 'premium' | 'shared-cost' | 'personal';

// Validation
export function isValidPhone(input: string, country?: string): boolean;
export function getValidationError(input: string, country?: string): string | null;

// Country codes
export function getCountryByCode(code: number): CountryPhoneInfo | undefined;
export function getCountryByIso(iso: string): CountryPhoneInfo | undefined;
export interface CountryPhoneInfo {
  code: number;        // 1
  iso: string;         // "US"
  name: string;        // "United States"
  dialCode: string;    // "+1"
  format: string;      // "(XXX) XXX-XXXX"
  exampleNumber: string;
}

// Utilities
export function extractPhoneNumbers(text: string, defaultCountry?: string): ParsedPhone[];
export function maskPhone(number: string, visibleChars?: number): string; // "+1415****671"
export function comparePhones(a: string, b: string): boolean; // E.164 comparison
```

## Implementation Plan
1. Create `ts/packages/ts-phone/` with zero dependencies.
2. Implement formatting, parsing, validation with country-specific rules.
3. Include country code data for all ITU members.
4. Add tests. Publish to npm.
