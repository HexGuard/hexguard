---
id: feature-ts-address
type: feature
status: proposed
created: 2026-06-28
package: '@hexguard/ts-address'
---

# @hexguard/ts-address

## Summary

Zero-dependency address formatting, parsing, and validation utilities. Country-specific formats, postal code validation, and address component extraction.

## Proposed Public API

```typescript
// Formatting
export function formatAddress(address: AddressComponents, country: string, format?: AddressFormat): string;
export type AddressFormat = 'single-line' | 'multi-line' | 'postal';

// Parsing
export function parseAddress(input: string, country: string): Partial<AddressComponents>;

// Validation
export function validatePostalCode(code: string, country: string): boolean;
export function validateAddress(address: AddressComponents): AddressValidationResult;

// Components
export interface AddressComponents {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  recipient?: string;
  organization?: string;
}

export interface AddressValidationResult {
  isValid: boolean;
  errors: AddressValidationError[];
  suggestions?: string[];
  normalized?: AddressComponents;
}

export interface AddressValidationError {
  field: keyof AddressComponents;
  code: 'required' | 'invalid_format' | 'unknown_value' | 'too_long';
  message: string;
}

// Country data
export function getCountryInfo(code: string): CountryInfo | undefined;
export interface CountryInfo {
  code: string;           // ISO 3166-1 alpha-2
  name: string;
  postalCodeFormat: string; // regex pattern
  addressFormat: string;    // template like "{recipient}\n{line1}\n{city} {state} {postalCode}"
  states?: { code: string; name: string }[];
}

export function getCountryList(): CountryInfo[];
export function getStates(country: string): { code: string; name: string }[];

// Postal code
export function formatPostalCode(code: string, country: string): string;
export function normalizePostalCode(code: string, country: string): string;
```

## Implementation Plan
1. Create `ts/packages/ts-address/` with zero dependencies.
2. Implement formatting, parsing, validation with country-specific rules.
3. Include postal code patterns for major countries.
4. Add tests. Publish to npm.
