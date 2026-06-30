# @hexguard/angular-design-tokens — Deep Package Notes

Typed design token registry with CSS custom property synchronization, signal-based access, semantic aliasing, and per-theme override layers.

## Problem

Every design system needs a single source of truth for spacing, colors, typography, and radii. Teams rebuild token-to-CSS-variable mapping, hardcode values in components, and lack a typed contract between design decisions and code. Theme switching requires manually swapping CSS variables per mode.

**`@hexguard/angular-design-tokens`** standardizes this into a typed token registry with automatic CSS custom property output, signal-based access for reactive template binding, semantic aliasing, and per-theme override layers.

## API

### `defineTokens(definition, options?)`

Accepts a nested token definition object and recursively flattens it into dot-separated paths. Returns a `TokenRegistry`.

```typescript
const tokens = defineTokens({
  color: { primary: { 500: '#3b82f6' }, neutral: { 50: '#fafafa' } },
  spacing: { sm: '0.5rem', md: '1rem' },
});
tokens.get('color.primary.500'); // '#3b82f6'
tokens.size; // 4
```

`validate()` checks color tokens for valid hex using `Color.fromHex()` from `@hexguard/angular-color`.

### `syncTokensToRoot(registry)` / `unsyncTokensFromRoot(registry)`

Writes/removes CSS custom properties on `<html>`:

- Token `color.primary.500` → `--hexguard-color-primary-500: #3b82f6`
- SSR-safe (guards `document` access)

### `injectTokens(registry, options?)`

Returns `TokenAccess` with signal-based `get()` and `all`. Optional `syncCss: true` auto-syncs CSS custom properties and cleans up on destroy.

```typescript
const access = injectTokens(tokens, { syncCss: true });
const primary = access.get('color.primary.500'); // Signal<string | undefined>
```

### `tokenAliases(registry, aliases)`

Creates semantic aliases (e.g. `'color.brand'` → `'color.primary.500'`). Detects circular references at definition time. Returns a `TokenRegistry`-compatible object.

### `TokenThemeLayer`

```typescript
const darkLayer = new TokenThemeLayer({
  'color.surface': '#1a1a1a',
  'color.text': '#f0f0f0',
});
const darkTokens = darkLayer.applyTo(lightTokens);
darkLayer.syncToDom(); // Applies overrides directly to :root
```

## Design Decisions

1. **Token flattening at definition time.** One-time recursive walk — no runtime resolution overhead.
2. **Color validation uses `Color.fromHex()`.** Leverages the `@hexguard/angular-color` value object for accurate hex parsing.
3. **CSS custom property prefix is configurable.** Default `hexguard` but overridable via `defineTokens(tokens, { prefix: 'myapp' })`.
4. **Aliases resolve at definition time.** Circular references are caught eagerly rather than at access time.
5. **Theme layers are additive.** `applyTo()` creates a merged registry — base tokens are preserved for non-overridden keys.

## Code Examples

### Define and sync tokens

```typescript
const tokens = defineTokens({
  color: { primary: { 500: '#3b82f6' }, surface: '#ffffff', text: '#171717' },
  spacing: { sm: '0.25rem', md: '0.5rem', lg: '1rem' },
  radius: { sm: '0.25rem', md: '0.5rem' },
});

syncTokensToRoot(tokens);
// CSS: --hexguard-color-primary-500, --hexguard-color-surface, etc.
```

### Semantic aliases with circular detection

```typescript
const semantic = tokenAliases(tokens, {
  'color.brand': 'color.primary.500',
  'color.background': 'color.surface',
  'color.foreground': 'color.text',
});
semantic.get('color.brand'); // '#3b82f6'
```

### Theme-aware token overrides

```typescript
// Used by @hexguard/angular-theme v0.2.0 via injectTokenTheme()
const darkLayer = new TokenThemeLayer({
  'color.surface': '#1a1a1a',
  'color.text': '#f0f0f0',
});
```

## Related Resources

- [Package README](../../angular/packages/angular-design-tokens/README.md)
- [Package Catalog](../README.md)
- [Demo Routes](../../angular/apps/demo-angular/src/app/features/packages/angular/angular-design-tokens/)
- [Source Code](../../angular/packages/angular-design-tokens/src/)
