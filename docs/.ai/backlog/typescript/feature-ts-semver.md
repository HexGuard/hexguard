---
id: feature-ts-semver
type: feature
status: proposed
created: 2026-06-30
package: '@hexguard/ts-semver'
---

# @hexguard/ts-semver

## Summary

Zero-dependency semantic versioning utilities — parse, compare, bump, validate, and format semver strings. For release automation and version management.

## Proposed Public API

```typescript
// Parsing
export function parse(version: string): SemVer | null;
export function isValid(version: string): boolean;

export interface SemVer {
  major: number;
  minor: number;
  patch: number;
  prerelease: string[];  // ['alpha', '1']
  build: string[];       // ['build', '123']
}

// Comparison
export function compare(a: string, b: string): -1 | 0 | 1;
export function eq(a: string, b: string): boolean;
export function gt(a: string, b: string): boolean;
export function gte(a: string, b: string): boolean;
export function lt(a: string, b: string): boolean;
export function lte(a: string, b: string): boolean;
export function satisfies(version: string, range: string): boolean; // ^1.2.3, ~1.2.3, >=1.0.0

// Bumping
export function bumpMajor(version: string): string;
export function bumpMinor(version: string): string;
export function bumpPatch(version: string): string;
export function bumpPrerelease(version: string, identifier?: string): string;
export function bump(version: string, release: ReleaseType, identifier?: string): string;

export type ReleaseType = 'major' | 'minor' | 'patch' | 'premajor' | 'preminor' | 'prepatch' | 'prerelease';

// Formatting
export function format(version: SemVer): string;
export function clean(version: string): string | null; // "v1.2.3" → "1.2.3"

// Ranges
export function maxSatisfying(versions: string[], range: string): string | null;
export function minSatisfying(versions: string[], range: string): string | null;
export function sort(versions: string[]): string[];
export function rsort(versions: string[]): string[]; // descending

// Diff
export function diff(a: string, b: string): ReleaseType | null;
// "1.2.3" → "1.3.0" returns "minor"

// Coercion
export function coerce(input: string): SemVer | null; // "1.2" → { major:1, minor:2, patch:0 }
```

## Implementation Plan
1. Create `ts/packages/ts-semver/` with zero dependencies.
2. Implement all semver operations per semver.org spec.
3. Add tests for all edge cases.
4. Publish to npm.
