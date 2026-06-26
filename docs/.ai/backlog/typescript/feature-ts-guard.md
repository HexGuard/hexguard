---
id: feature-ts-guard
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/ts-guard'
---

# @hexguard/ts-guard

## Summary

Runtime type guards and validation for TypeScript — validate unknown data against TypeScript types at runtime, returning `Result<T, ValidationError[]>` with typed output. Lighter than Zod (which is a full schema DSL); uses plain TypeScript functions.

**Competition check:** Zod (10M+ weekly downloads) is dominant but heavy. `joi`, `yup`, `valibot` exist. This targets the **simplest possible** use case: define a guard function, call it on unknown data, get a typed result.

## Goals

1. Provide `guard<T>(value, isT)` — validate and narrow type.
2. Provide built-in guards: `isString`, `isNumber`, `isBoolean`, `isArray`, `isObject`, `isUnion`, `isLiteral`.
3. Provide `isShape<T>` for object shape validation with nested guards.
4. Return `Result<T, GuardError[]>` for functional composition with `ts-result`.
5. Zero dependencies.

## Proposed Public API

```typescript
// ── Core ──────────────────────────────────────────────────

export type Guard<T> = (value: unknown) => value is T;
export type Validator<T> = (value: unknown) => ValidationResult<T>;

export interface ValidationResult<T> {
  readonly ok: boolean;
  readonly value?: T;
  readonly errors: ValidationError[];
}

export interface ValidationError {
  path: string;        // "user.email"
  expected: string;    // "string"
  received: string;    // "number"
}

// ── Built-in Guards ───────────────────────────────────────

export const isString: Guard<string>;
export const isNumber: Guard<number>;
export const isBoolean: Guard<boolean>;
export const isArray: <T>(itemGuard: Guard<T>) => Guard<T[]>;
export const isObject: Guard<Record<string, unknown>>;
export const isUnion: <T extends [unknown, ...unknown[]]>(
  ...guards: { [K in keyof T]: Guard<T[K]> }
) => Guard<T[number]>;
export const isLiteral: <T extends string | number | boolean>(value: T) => Guard<T>;
export const isOptional: <T>(guard: Guard<T>) => Guard<T | undefined>;
export const isNullable: <T>(guard: Guard<T>) => Guard<T | null>;

// ── Shape (Object) Validation ─────────────────────────────

export function isShape<T extends Record<string, unknown>>(
  shape: { [K in keyof T]: Guard<T[K]> }
): Guard<T>;

// ── Validate + Narrow ─────────────────────────────────────

export function guard<T>(value: unknown, guard: Guard<T>): value is T;
export function validate<T>(value: unknown, guard: Guard<T>): ValidationResult<T>;

// ── Usage ─────────────────────────────────────────────────

const UserGuard = isShape({
  id: isNumber,
  name: isString,
  email: isString,
  role: isUnion(isLiteral('admin'), isLiteral('user')),
  age: isOptional(isNumber),
});

if (guard(rawData, UserGuard)) {
  // rawData is typed as { id: number; name: string; email: string; role: 'admin' | 'user'; age?: number }
  console.log(rawData.name);
}
```

## Implementation Plan

1. Create `ts/packages/ts-guard/`.
2. Implement core `Guard<T>` type and built-in guards.
3. Implement `isShape` for object validation.
4. Add tests.
5. Publish to npm.
