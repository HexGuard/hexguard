---
id: feature-ts-i18n
type: feature
status: proposed
created: 2026-06-29
package: '@hexguard/ts-i18n'
---

# @hexguard/ts-i18n

## Summary

Zero-dependency internationalization utilities — ICU MessageFormat parser, plural rules, number/date formatting, and locale negotiation. Pure functions for i18n logic.

## Proposed Public API

```typescript
// ICU MessageFormat
export function formatIcuMessage(pattern: string, params: Record<string, unknown>, locale?: string): string;
// formatIcuMessage('{count, plural, =0 {none} one {# item} other {# items}}', { count: 3 }) → "3 items"

export function parseIcuMessage(pattern: string): IcuAst;
export interface IcuAst { type: 'message'; elements: IcuElement[]; }

// Plural rules (CLDR)
export function getPluralCategory(count: number, locale?: string): PluralCategory;
export type PluralCategory = 'zero' | 'one' | 'two' | 'few' | 'many' | 'other';
export function selectPluralForm(count: number, forms: Partial<Record<PluralCategory, string>>, locale?: string): string;

// Locale negotiation
export function negotiateLocale(acceptLanguage: string, supported: string[], defaultLocale: string): string;
export function parseAcceptLanguage(header: string): { locale: string; quality: number }[];

// Number formatting (wraps Intl)
export function formatNumber(value: number, locale?: string, options?: Intl.NumberFormatOptions): string;
export function formatCompactNumber(value: number, locale?: string): string; // "1.2K", "3.4M"
export function formatPercent(value: number, locale?: string, decimals?: number): string;

// Date formatting
export function formatDate(date: Date, locale?: string, options?: Intl.DateTimeFormatOptions): string;
export function formatRelativeTime(date: Date, locale?: string, now?: Date): string;

// RTL
export function isRtlLanguage(locale: string): boolean;
// "ar", "he", "fa", "ur" → true
```

## Implementation Plan
1. Create `ts/packages/ts-i18n/` with zero dependencies.
2. Implement ICU parser, plural rules, locale negotiation, formatting wrappers.
3. Add CLDR plural data for all languages.
4. Add tests. Publish to npm.
