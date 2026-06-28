---
id: feature-ts-slug
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/ts-slug'
---

# @hexguard/ts-slug

## Summary

String manipulation utilities for TypeScript â€” slugify, truncate, highlight matching text, capitalize, camelCase/snake_case/kebab-case conversion, and sanitize HTML. Every app with URLs, search results, or text display needs these.

**Competition check:** Individual packages exist (`slugify`, `truncate`, `change-case`) but no single package combines the 8 most common string utilities.


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
export function slugify(text: string, separator?: string): string;
// "Hello World!" â†’ "hello-world"

export function truncate(text: string, maxLength: number, suffix?: string): string;
// truncate("Hello World", 8) â†’ "Hello..."

export function highlight(text: string, query: string, tag?: string): string;
// highlight("Hello World", "world") â†’ "Hello <mark>World</mark>"

export function capitalize(text: string): string;
export function camelCase(text: string): string;
export function snakeCase(text: string): string;
export function kebabCase(text: string): string;
export function pascalCase(text: string): string;

export function stripHtml(html: string): string;
export function escapeHtml(text: string): string;
export function stripAccents(text: string): string;         // "cafÃ©" â†’ "cafe"
```

## Implementation Plan

1. Create `ts/packages/ts-slug/`.
2. Implement all string utilities.
3. Add tests.
4. Publish to npm.
