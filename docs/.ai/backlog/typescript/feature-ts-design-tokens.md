---
id: feature-ts-design-tokens
type: feature
status: proposed
created: 2026-06-30
package: '@hexguard/ts-design-tokens'
---

# @hexguard/ts-design-tokens

## Summary

Zero-dependency design token utilities — CSS variable generation, token path parsing, format conversion (JSON↔CSS↔SCSS), validation, and color manipulation. Framework-agnostic token tooling.

## Goals

- Token path parsing and CSS variable generation
- Token flattening/unflattening
- Format conversion (JSON, CSS, SCSS)
- Token validation with error reporting
- Color manipulation helpers (lighten, darken, alpha, contrast)
- Token alias resolution

## Non-Goals

- No runtime CSS injection
- No design tool integration
- No token storage or persistence

## Proposed Public API

```typescript
// CSS variable generation
export function toCssVariable(tokenPath: string, prefix?: string): string;
export function generateCssVariables(tokens: TokenTree, prefix?: string): string;

// Token flattening
export function flattenTokens(tree: TokenTree): Record<string, string>;
export function unflattenTokens(flat: Record<string, string>): TokenTree;

// Validation
export function validateTokens(tokens: TokenTree): { path: string; type: string; message: string }[];

// Color utilities
export function lighten(hex: string, amount: number): string;
export function darken(hex: string, amount: number): string;
export function alpha(hex: string, alpha: number): string;
export function contrastRatio(fg: string, bg: string): number;

// Format conversion
export function tokensToJson(tokens: TokenTree): string;
export function tokensToScss(tokens: TokenTree, prefix?: string): string;
export function tokensToCss(tokens: TokenTree, prefix?: string): string;

export type TokenTree = { [key: string]: string | TokenTree };
```

## Implementation Plan
1. Create `ts/packages/ts-design-tokens/` with zero dependencies.
2. Implement token parsing, CSS var generation, validation, format conversion.
3. Add color manipulation helpers.
4. Add tests. Publish to npm.
