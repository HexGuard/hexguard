---
id: feature-angular-performance
type: feature
status: proposed
created: 2026-06-30
package: '@hexguard/angular-performance'
---

# @hexguard/angular-performance

## Summary

Headless performance monitoring — Core Web Vitals, custom metrics, change detection profiling, and bundle size awareness. For production performance diagnostics.

## Goals

- Core Web Vitals signals (LCP, INP, CLS) with thresholds
- Custom metric recording with histogram aggregation
- Change detection cycle counting and profiling
- Slow component detection (render > threshold)
- Resource timing (API calls, asset loading)
- Performance budget enforcement (warn on violation)
- Development-mode performance overlay

## Non-Goals

- No RUM (Real User Monitoring) backend
- No server-side performance monitoring
- No rendered performance UI

## Proposed Public API

```typescript
export function injectPerformance(): {
  // Web Vitals
  readonly lcp: Signal<number | null>;
  readonly inp: Signal<number | null>;
  readonly cls: Signal<number | null>;
  readonly tti: Signal<number | null>;
  readonly vitalsRating: Signal<'good' | 'needs-improvement' | 'poor'>;

  // Custom metrics
  mark(name: string): void;
  measure(name: string, startMark: string, endMark?: string): PerformanceMeasure;
  recordMetric(name: string, value: number, tags?: Record<string, string>): void;
  histogram(name: string): { p50: number; p75: number; p95: number; p99: number; count: number };

  // Change detection
  readonly cdRenders: Signal<number>;      // total renders since page load
  readonly averageCdTime: Signal<number>;   // ms
  readonly slowComponents: Signal<string[]>; // components exceeding threshold
  profileComponent(name: string): () => void; // returns stop function

  // Resource timing
  getResourceTiming(url: string): PerformanceResourceTiming | undefined;
  readonly slowestResources: Signal<PerformanceResourceTiming[]>;

  // Budgets
  checkBudget(): BudgetViolation[];
};

export interface BudgetViolation {
  metric: string;
  actual: number;
  budget: number;
  severity: 'warning' | 'error';
}

export function providePerformanceMonitoring(config: {
  webVitals?: boolean;
  cdProfiling?: boolean;
  budgets?: PerformanceBudget[];
  sampleRate?: number;
}): Provider[];
```

## Implementation Plan
1. Scaffold `angular/packages/angular-performance/`.
2. Implement web vitals, custom metrics, CD profiling, resource timing with signals.
3. Add budgets, slow component detection, dev overlay.
4. Add tests. Register in workspace.
