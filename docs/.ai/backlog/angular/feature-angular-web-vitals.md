---
id: feature-angular-web-vitals
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/angular-web-vitals'
---

# @hexguard/angular-web-vitals

## Summary

Core Web Vitals tracking for Angular â€” LCP, CLS, INP, FCP, TTFB as signals with per-route reset. Wraps Google's `web-vitals` library with Angular signals and zone-aware reporting.

**Competition check:** Google's `web-vitals` library provides measurement but isn't Angular-specific.


## Goals

- Provide reactive, signal-based headless state for Angular applications
- Dependency-free at runtime beyond Angular core and tslib
- SSR-safe with TransferState awareness where applicable


## Non-Goals

- No rendered UI components — headless state, signals, and services only
- No browser globals or window-dependent code without SSR guard
- No backend API calls (consumer provides data/endpoints)

## Proposed Public API

```typescript
export interface WebVitalsState {
  readonly lcp: Signal<number | null>;      // Largest Contentful Paint (ms)
  readonly cls: Signal<number | null>;      // Cumulative Layout Shift
  readonly inp: Signal<number | null>;      // Interaction to Next Paint (ms)
  readonly fcp: Signal<number | null>;      // First Contentful Paint (ms)
  readonly ttfb: Signal<number | null>;     // Time to First Byte (ms)
  readonly ratings: Signal<Record<string, 'good' | 'needs-improvement' | 'poor'>>;
}

export function injectWebVitals(options?: {
  reportAllChanges?: boolean;
  reportTo?: (metric: WebVitalMetric) => void;
}): WebVitalsState;
```

## Implementation Plan

1. Scaffold `angular/packages/angular-web-vitals/`.
2. Implement signal wrapping around `web-vitals`.
3. Implement per-route reset via NavigationEnd.
4. Add tests.
5. Register in workspace.
