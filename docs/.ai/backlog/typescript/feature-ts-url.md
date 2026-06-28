---
id: feature-ts-url
type: feature
status: proposed
created: 2026-06-27
package: '@hexguard/ts-url'
---

# @hexguard/ts-url

## Summary

Zero-dependency URL construction and parsing utilities â€” build URLs safely, parse query strings, join paths, extract parts. Safer than manual string concatenation.


## Goals

- Provide zero-dependency, tree-shakeable pure functions
- Full TypeScript generics with strict type safety
- Compatible with browser and Node.js runtimes

## Non-Goals

- No runtime dependencies
- No framework-specific integrations
- No server-side or platform-specific features

## Proposed Public API

```typescript
export function buildUrl(base: string, params?: Record<string, string | number | boolean | null | undefined>): string;
export function parseQueryString<T extends Record<string, string>>(qs: string): T;
export function stringifyQueryString(params: Record<string, string | number | boolean | null | undefined>): string;
export function joinPaths(...segments: string[]): string;
export function getOrigin(url: string): string;
export function getPathname(url: string): string;
export function getSearchParams(url: string): Record<string, string>;
export function setSearchParam(url: string, key: string, value: string | null): string;
export function setSearchParams(url: string, params: Record<string, string | null>): string;
export function isAbsoluteUrl(url: string): boolean;
export function isSameOrigin(a: string, b: string): boolean;
export function normalizeUrl(url: string): string;
```

## Implementation Plan

1. Create `ts/packages/ts-url/` with zero dependencies.
2. Implement all functions using the `URL` API where available.
3. Handle edge cases: encoding, empty params, relative URLs.
4. Add tests. Publish to npm.
