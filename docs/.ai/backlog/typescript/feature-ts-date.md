---
id: feature-ts-date
type: feature
status: proposed
created: 2026-06-27
package: '@hexguard/ts-date'
---

# @hexguard/ts-date

## Summary

Zero-dependency date manipulation utilities — add/subtract, diff, format, range, startOf/endOf. Immutable, timezone-aware, no moment/luxon dependency.

## Proposed Public API

```typescript
export function add(date: Date, amount: number, unit: DateUnit): Date;
export function subtract(date: Date, amount: number, unit: DateUnit): Date;
export function diff(a: Date, b: Date, unit: DateUnit): number;
export function startOf(date: Date, unit: DateUnit): Date;
export function endOf(date: Date, unit: DateUnit): Date;
export function isBefore(a: Date, b: Date): boolean;
export function isAfter(a: Date, b: Date): boolean;
export function isBetween(date: Date, start: Date, end: Date): boolean;
export function isToday(date: Date): boolean;
export function isWeekend(date: Date): boolean;
export function daysInMonth(year: number, month: number): number;
export function dateRange(start: Date, end: Date, step?: DateUnit): Date[];
export function format(date: Date, pattern: string): string;
export function parse(dateStr: string, pattern: string): Date;
export function fromNow(date: Date): string;

export type DateUnit = 'millisecond' | 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';
```

## Implementation Plan

1. Create `ts/packages/ts-date/` with zero dependencies.
2. Implement all functions immutably with full TypeScript types.
3. Handle edge cases: DST transitions, leap years, month boundaries.
4. Add tests. Publish to npm.
