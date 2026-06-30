# @hexguard/angular-design-tokens

**Headless design token registry for Angular.** Typed token definitions, CSS custom property synchronization, signal-based token access, semantic aliasing, and per-theme override layers — all with Angular's reactivity model.

**[Deep package notes](docs/packages/angular-design-tokens.md)** · **[Demo](/packages/angular-design-tokens/demo)**

---

## Problem

Every design system needs a single source of truth for spacing, colors, typography, and radii. Teams rebuild token-to-CSS-variable mapping, hardcode values in components, and lack a typed contract between design decisions and code. Theme switching requires manually swapping CSS variables per mode.

**`@hexguard/angular-design-tokens`** standardizes this into a typed token registry with automatic CSS custom property output, signal-based access for reactive template binding, semantic aliasing, and per-theme override layers.

## Installation

```bash
pnpm add @hexguard/angular-design-tokens @hexguard/angular-color
```

## Quickstart

```typescript
import { defineTokens, injectTokens, tokenAliases } from '@hexguard/angular-design-tokens';

// 1. Define tokens
const tokens = defineTokens({
  color: {
    primary: { 500: '#3b82f6' },
    neutral: { 50: '#fafafa', 900: '#171717' },
  },
  spacing: { sm: '0.5rem', md: '1rem', lg: '1.5rem' },
});

// 2. Access via signals
const access = injectTokens(tokens, { syncCss: true });
const primary = access.get('color.primary.500'); // Signal<string | undefined>

// 3. Semantic aliases
const semantic = tokenAliases(tokens, {
  'color.brand': 'color.primary.500',
  'color.surface': 'color.neutral.50',
});
```

## API

### `defineTokens(definition, options?)`

| Option   | Type     | Default      | Description                |
| -------- | -------- | ------------ | -------------------------- |
| `prefix` | `string` | `'hexguard'` | CSS custom property prefix |

Returns `TokenRegistry`:
| Member | Type | Description |
|--------|------|-------------|
| `entries` | `FlatTokens` | All flat token entries |
| `get(path)` | `string \| undefined` | Get token value by path |
| `validate()` | `string[]` | Validation error messages (color hex check) |
| `size` | `number` | Token count |
| `prefix` | `string` | CSS prefix |

### `injectTokens(registry, options?)`

| Option    | Type      | Default | Description                              |
| --------- | --------- | ------- | ---------------------------------------- |
| `syncCss` | `boolean` | `false` | Auto-sync CSS custom properties on :root |

Returns `TokenAccess`:
| Member | Type | Description |
|--------|------|-------------|
| `get(path)` | `Signal<string \| undefined>` | Reactive signal per token |
| `all` | `Signal<FlatTokens>` | All tokens signal |

### `syncTokensToRoot(registry)` / `unsyncTokensFromRoot(registry)`

Manual CSS custom property sync/cleanup.

### `tokenAliases(registry, aliases)`

Create semantic aliases (e.g. `'color.brand'` → `'color.primary.500'`). Detects circular references.

### `TokenThemeLayer`

```typescript
const darkLayer = new TokenThemeLayer({
  'color.surface': '#1a1a1a',
  'color.text': '#f0f0f0',
});
const darkTokens = darkLayer.applyTo(lightTokens);
darkLayer.syncToDom(); // Or apply directly to :root
```

## Scope Boundaries

| Concern                        | Status                |
| ------------------------------ | --------------------- |
| Typed token definitions        | ✅                    |
| CSS custom property sync       | ✅                    |
| Signal-based access            | ✅                    |
| Semantic aliasing              | ✅                    |
| Theme override layers          | ✅                    |
| Token validation (color hex)   | ✅                    |
| Token documentation generation | ❌ (future extension) |
| Figma sync                     | ❌                    |

## Demo

Visit `/packages/angular-design-tokens/demo` to explore token definitions, CSS sync, aliases, and theme layers.
