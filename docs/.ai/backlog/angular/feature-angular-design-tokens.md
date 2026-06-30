---
id: feature-angular-design-tokens
type: feature
status: proposed
created: 2026-06-30
package: '@hexguard/angular-design-tokens'
---

# @hexguard/angular-design-tokens

## Summary

Headless design token registry — typed token definitions, CSS custom property synchronization, signal-based token access, and theme layers. Single source of truth for all design values.

## Goals

- Typed token definitions (color, spacing, typography, elevation, animation)
- Automatic CSS custom property sync
- Signal-based token access (`token('color.primary.500')`)
- Token aliasing (`semantic.error` → `color.red.600`)
- Multiple theme support with override layers
- Runtime token validation

## Non-Goals

- No rendered token editor UI
- No CSS-in-JS runtime
- No Figma integration

## Proposed Public API

```typescript
export const tokens = defineTokens({
  color: {
    primary: { 50: '#eff6ff', 100: '#dbeafe', 500: '#3b82f6', 900: '#1e3a5f' },
    neutral: { 50: '#fafafa', 100: '#f5f5f5', 500: '#737373', 900: '#171717' }
  },
  spacing: { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem' },
  typography: { fontFamily: { sans: 'Inter, sans-serif' }, fontSize: { sm: '0.875rem', base: '1rem' } },
  radius: { sm: '0.25rem', md: '0.5rem', lg: '0.75rem' },
  shadow: { sm: '0 1px 2px rgba(0,0,0,0.05)', md: '0 4px 6px rgba(0,0,0,0.1)' }
});

export const semantic = tokenAliases(tokens, {
  'color.surface': tokens.color.neutral[50],
  'color.text': tokens.color.neutral[900],
  'color.brand': tokens.color.primary[500]
});

export function injectTokens(): {
  get<T>(path: string): Signal<T>;
  all: Signal<Record<string, string>>;
};

export function injectTheme(): {
  current: Signal<string>;
  themes: Signal<string[]>;
  set(theme: string): void;
};
```

## Implementation Plan
1. Scaffold `angular/packages/angular-design-tokens/`.
2. Implement token definition API, CSS var sync, signal accessors, theme layers.
3. Add token aliasing, validation, documentation generation.
4. Add tests. Register in workspace.
