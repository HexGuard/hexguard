---
id: feature-ts-perf
type: feature
status: proposed
created: 2026-06-30
package: '@hexguard/ts-perf'
---

# @hexguard/ts-perf

## Summary

Zero-dependency performance measurement utilities — mark/measure wrappers, high-resolution timers, metric aggregation, and performance observer helpers. For custom performance instrumentation.

## Proposed Public API

```typescript
// Mark & measure
export function mark(name: string): PerformanceMark;
export function measure(name: string, startMark: string, endMark?: string): PerformanceMeasure;
export function measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T>; // auto times

// High-res timer
export function now(): number; // performance.now() wrapper
export function timeSince(start: number): number;
export class Timer {
  start(): void;
  stop(): number; // returns elapsed ms
  elapsed: number;
  lap(label: string): number;
  laps: { label: string; elapsed: number }[];
}

// Metric aggregation
export class MetricAggregator {
  record(value: number): void;
  getStats(): MetricStats;
  reset(): void;
}
export interface MetricStats { count: number; min: number; max: number; avg: number; p50: number; p75: number; p95: number; p99: number; }

// Performance observer
export function observeEntryTypes(types: string[], callback: (entries: PerformanceEntry[]) => void): () => void;
export function observeLCP(callback: (lcp: number) => void): () => void;
export function observeINP(callback: (inp: number) => void): () => void;
export function observeCLS(callback: (cls: number) => void): () => void;
export function observeLongTasks(callback: (duration: number, attribution: string) => void): () => void;

// Budgets
export function checkBudget(metric: string, value: number, budget: number): BudgetResult;
export interface BudgetResult { metric: string; value: number; budget: number; withinBudget: boolean; severity: 'ok' | 'warning' | 'error'; }
```

## Implementation Plan
1. Create `ts/packages/ts-perf/` with zero dependencies.
2. Implement all performance utilities.
3. Add tests. Publish to npm.
