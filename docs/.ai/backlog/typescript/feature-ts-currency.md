---
id: feature-ts-currency
type: feature
status: proposed
created: 2026-06-27
package: '@hexguard/ts-currency'
---

# @hexguard/ts-currency

## Summary

Zero-dependency currency formatting, conversion, and arithmetic utilities. Locale-aware formatting, ISO 4217 currency codes, and precise decimal math.

## Proposed Public API

```typescript
// Formatting
export function formatCurrency(amount: number, currency: string, locale?: string, options?: CurrencyFormatOptions): string;
export interface CurrencyFormatOptions {
  showCode?: boolean;      // "$1,234.56 USD"
  showSymbol?: boolean;    // "$1,234.56" (default true)
  compact?: boolean;       // "$1.2K"
  decimalPlaces?: number;  // override default
}

// Parsing
export function parseCurrency(input: string, currency: string, locale?: string): number;

// ISO 4217 data
export function getCurrencyInfo(code: string): CurrencyInfo | undefined;
export interface CurrencyInfo {
  code: string;           // "USD"
  symbol: string;         // "$"
  name: string;           // "US Dollar"
  decimalPlaces: number;  // 2
  numericCode: number;    // 840
}

export function getCurrencySymbol(code: string): string;
export function getCurrencyName(code: string): string;
export function isValidCurrencyCode(code: string): boolean;
export function getCurrencyList(): CurrencyInfo[];

// Conversion
export function convertCurrency(amount: number, from: string, to: string, rates: Record<string, number>): number;

// Arithmetic (precise, avoids floating point issues)
export function add(amounts: number[]): number;
export function subtract(a: number, b: number): number;
export function multiply(amount: number, factor: number): number;
export function divide(amount: number, divisor: number): number;
export function round(amount: number, decimalPlaces?: number): number;
export function allocate(amount: number, ratios: number[]): number[]; // split proportionally

// Percentage
export function percentOf(amount: number, percent: number): number;
export function addPercent(amount: number, percent: number): number;
export function subtractPercent(amount: number, percent: number): number;
```

## Implementation Plan
1. Create `ts/packages/ts-currency/` with zero dependencies.
2. Implement formatting, parsing, ISO 4217 data, precise arithmetic.
3. Handle edge cases: zero amounts, large numbers, allocation rounding.
4. Add tests. Publish to npm.
