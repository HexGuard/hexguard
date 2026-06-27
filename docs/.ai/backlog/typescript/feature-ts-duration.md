---
id: feature-ts-duration
type: feature
status: proposed
created: 2026-06-27
package: '@hexguard/ts-duration'
---

# @hexguard/ts-duration

## Summary

Zero-dependency duration parsing, formatting, and arithmetic utilities. Parse human-readable durations ("2h 30m"), format seconds into readable strings, and perform duration math.

## Proposed Public API

```typescript
// Parsing
export function parseDuration(input: string): number; // returns total seconds
// "2h 30m 15s" → 9015
// "1.5h" → 5400
// "90m" → 5400
// "1d 6h" → 108000

// Formatting
export function formatDuration(seconds: number, format?: DurationFormat): string;
export type DurationFormat = 'short' | 'long' | 'compact' | 'colon' | 'human';
// short: "2h 30m"
// long: "2 hours 30 minutes"
// compact: "2:30"
// colon: "02:30:00"
// human: "about 2 hours"

// Components
export function toComponents(seconds: number): DurationComponents;
export interface DurationComponents { days: number; hours: number; minutes: number; seconds: number; totalSeconds: number; }

// Arithmetic
export function addDuration(seconds: number, amount: number, unit: DurationUnit): number;
export function subtractDuration(seconds: number, amount: number, unit: DurationUnit): number;
export function betweenDates(from: Date, to: Date): DurationComponents;
export type DurationUnit = 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks';

// Rounding
export function roundDuration(seconds: number, to: DurationUnit): number;
export function ceilDuration(seconds: number, to: DurationUnit): number;
export function floorDuration(seconds: number, to: DurationUnit): number;

// ISO 8601
export function toIso8601(seconds: number): string; // "PT2H30M15S"
export function fromIso8601(iso: string): number;
```

## Implementation Plan
1. Create `ts/packages/ts-duration/` with zero dependencies.
2. Implement parsing, formatting, arithmetic, ISO 8601 conversion.
3. Handle edge cases: negative durations, overflow, locale formatting.
4. Add tests. Publish to npm.
