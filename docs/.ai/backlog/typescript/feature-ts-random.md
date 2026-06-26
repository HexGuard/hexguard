---
id: feature-ts-random
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/ts-random'
---

# @hexguard/ts-random

## Summary

Random ID generation and sampling utilities for TypeScript — UUID v4/v7, nanoid, random string, random integer, seeded RNG, array shuffle, and weighted random selection. Every app needs random IDs, and `crypto.randomUUID()` isn't available in all environments.

**Competition check:** `uuid` (60M+ weekly) is the standard for UUIDs. `nanoid` (25M+) is popular for short IDs. This wraps the best of both in one package plus adds sampling/shuffle/weighted utilities not found elsewhere.

## Goals

1. Provide `uuid()` — RFC 9562 UUID v4 (and v7 time-ordered).
2. Provide `nanoid(size?)` — short URL-safe random string.
3. Provide `randomInt(min, max)`, `randomString(length, alphabet?)`.
4. Provide `shuffle(array)` — Fisher-Yates shuffle.
5. Provide `sample(array, n?)` — random sample with/without replacement.
6. Provide `weightedRandom(items, weights)` — weighted random selection.
7. Provide `SeededRng` class for deterministic randomness (tests, seeds).
8. Zero dependencies, uses `crypto.getRandomValues` when available, falls back to Math.random.

## Proposed Public API

```typescript
// ── IDs ───────────────────────────────────────────────────

export function uuid(): string;                    // "550e8400-e29b-41d4-a716-446655440000"
export function uuid7(): string;                  // "018f5e60-0000-7a1a-b000-000000000000" (time-ordered)
export function nanoid(size?: number): string;    // "V1StGXR8_Z5jdHi6B-myT" (default 21 chars)

// ── Random Values ─────────────────────────────────────────

export function randomInt(min: number, max: number): number;  // min inclusive, max exclusive
export function randomFloat(min?: number, max?: number): number;  // Default 0–1
export function randomString(length: number, alphabet?: string): string;
export function randomBool(): boolean;

// ── Collections ───────────────────────────────────────────

export function shuffle<T>(array: T[]): T[];
export function sample<T>(array: T[], n?: number): T | T[];
export function weightedRandom<T>(items: T[], weights: number[]): T;

// ── Seeded (Deterministic) ────────────────────────────────

export class SeededRng {
  constructor(seed: number | string);
  next(): number;                  // 0–1
  int(min: number, max: number): number;
  shuffle<T>(array: T[]): T[];
  sample<T>(array: T[], n?: number): T | T[];
}
```

## Implementation Plan

1. Create `ts/packages/ts-random/`.
2. Implement UUID v4/v7, nanoid, random values.
3. Implement shuffle/sample/weighted.
4. Implement SeededRng.
5. Add tests.
6. Publish to npm.
