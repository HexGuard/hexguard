---
id: feature-angular-i18n
type: feature
status: proposed
created: 2026-06-29
package: '@hexguard/angular-i18n'
---

# @hexguard/angular-i18n

## Summary

Headless internationalization state — runtime locale switching, ICU message formatting, number/date/currency formatting per locale, and RTL detection. For multi-language Angular apps.

## Goals

- Runtime locale switching without page reload
- ICU MessageFormat for pluralization and gender
- Number formatting per locale (decimal, percent, currency)
- Date formatting per locale (short, medium, long, full)
- Relative time formatting ("3 hours ago")
- RTL (right-to-left) detection and direction signal
- Locale persistence (localStorage, URL, cookie)
- Lazy-loaded translation bundles

## Non-Goals

- No translation management or extraction
- No rendered i18n UI components
- No machine translation

## Proposed Public API

```typescript
export function injectI18n(config: {
  defaultLocale: string;
  supportedLocales: string[];
  loadTranslations: (locale: string) => Promise<Record<string, string>>;
}): {
  readonly locale: Signal<string>;
  readonly locales: Signal<string[]>;
  readonly direction: Signal<'ltr' | 'rtl'>;
  readonly isLoaded: Signal<boolean>;
  setLocale(locale: string): Promise<void>;
  t(key: string, params?: Record<string, unknown>): string;
  formatNumber(value: number, options?: Intl.NumberFormatOptions): string;
  formatDate(value: Date, options?: Intl.DateTimeFormatOptions): string;
  formatRelativeTime(value: number, unit: Intl.RelativeTimeFormatUnit): string;
  formatCurrency(value: number, currency: string): string;
  // ICU MessageFormat
  formatMessage(message: string, params?: Record<string, unknown>): string;
};

// Usage
const i18n = injectI18n({ defaultLocale: 'en', supportedLocales: ['en', 'fr', 'ar'], loadTranslations });
i18n.t('welcome', { name: 'Alice' }); // "Welcome, Alice!"
i18n.formatMessage('{count, plural, =0 {No items} one {# item} other {# items}}', { count: 3 });
```

## Implementation Plan
1. Scaffold `angular/packages/angular-i18n/`.
2. Implement locale switching, translation loading, ICU formatting, number/date/currency with signals.
3. Add RTL detection and lazy bundle loading.
4. Add tests. Register in workspace.
