---
id: feature-angular-error-reporter
type: feature
status: proposed
created: 2026-06-30
package: '@hexguard/angular-error-reporter'
---

# @hexguard/angular-error-reporter

## Summary

Headless client-side error capture and reporting — global error handler, breadcrumb collection, stack trace normalization, and reporter adapter interface. Pluggable backends (Sentry, Application Insights, custom).

## Goals

- Global error handler catching unhandled exceptions and Promise rejections
- Breadcrumb collection (user actions, navigation, HTTP calls, state changes)
- Stack trace normalization across browsers
- Context enrichment (user ID, app version, environment, URL)
- Pluggable reporter adapter interface
- Error deduplication (same error within window)
- Offline queue (report when reconnected)
- Configurable filter (ignore certain errors)

## Non-Goals

- No error monitoring dashboard
- No source map resolution
- No rendered error UI

## Proposed Public API

```typescript
export interface ErrorReporter {
  captureException(error: Error, context?: ErrorContext): void;
  captureMessage(message: string, level?: ErrorLevel, context?: ErrorContext): void;
  addBreadcrumb(breadcrumb: Breadcrumb): void;
  setUser(user: { id: string; email?: string; name?: string } | null): void;
}

export interface ErrorContext {
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
  fingerprint?: string[];
  level?: ErrorLevel;
}

export type ErrorLevel = 'fatal' | 'error' | 'warning' | 'info' | 'debug';

export function provideErrorReporter(config: {
  adapter: ErrorReporterAdapter;
  enabled?: boolean;
  environment?: string;
  release?: string;
  maxBreadcrumbs?: number;
  ignoreErrors?: (string | RegExp)[];
  sampleRate?: number;
}): Provider[];

// Adapter interface
export interface ErrorReporterAdapter {
  captureException(error: NormalizedError): Promise<void>;
  captureMessage(message: NormalizedMessage): Promise<void>;
  addBreadcrumb(breadcrumb: Breadcrumb): void;
  setUser(user: { id: string } | null): void;
}

// Built-in adapters
export function sentryAdapter(dsn: string, options?: SentryOptions): ErrorReporterAdapter;
export function appInsightsAdapter(connectionString: string): ErrorReporterAdapter;
export function consoleAdapter(): ErrorReporterAdapter; // dev only
```

## Implementation Plan
1. Scaffold `angular/packages/angular-error-reporter/`.
2. Implement global handler, breadcrumbs, stack normalization, adapter interface.
3. Add Sentry + AppInsights adapters, offline queue, deduplication.
4. Add tests. Register in workspace.
