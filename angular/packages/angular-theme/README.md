# @hexguard/angular-theme

**Theme switching state for Angular.** Light/dark/system modes, CSS class management, `prefers-color-scheme` detection, persistence, and smooth transitions — all with signal-based primitives.

**[Deep package notes](docs/packages/angular-theme.md)** · **[Demo](/packages/angular-theme/demo)**

---

## Problem

Most Angular apps need dark mode support, but teams rebuild the same pattern: `matchMedia` listener, localStorage toggle, CSS class on `<html>`, and SSR guards. Every implementation has subtle differences in persistence, system preference reactivity, and cleanup.

**`@hexguard/angular-theme`** standardizes this into one injectable contract with `mode`/`effectiveTheme` signals, `prefers-color-scheme` detection, and localStorage persistence.

## Installation

```bash
pnpm add @hexguard/angular-theme
```

## Quickstart

```typescript
import { injectTheme } from '@hexguard/angular-theme';

const theme = injectTheme();
theme.setMode('dark'); // switches to dark mode
theme.toggle(); // toggles light↔dark
theme.resetToSystem(); // follows system preference

// Reactive signals
theme.mode(); // 'light' | 'dark' | 'system'
theme.effectiveTheme(); // 'light' | 'dark' (resolved)
theme.isDark(); // boolean
theme.isLight(); // boolean
```

## API

### `injectTheme(config?)`

| Member            | Type                        | Description                                       |
| ----------------- | --------------------------- | ------------------------------------------------- |
| `mode`            | `Signal<ThemeMode>`         | Selected mode: `'light'`, `'dark'`, or `'system'` |
| `effectiveTheme`  | `Signal<'light' \| 'dark'>` | Resolved theme (system → actual)                  |
| `isDark`          | `Signal<boolean>`           | `true` when effective theme is dark               |
| `isLight`         | `Signal<boolean>`           | `true` when effective theme is light              |
| `setMode(mode)`   | `(ThemeMode) => void`       | Set theme mode explicitly                         |
| `toggle()`        | `() => void`                | Toggle light↔dark (ignores system)                |
| `resetToSystem()` | `() => void`                | Reset to system preference                        |

| Option               | Type        | Default            | Description                            |
| -------------------- | ----------- | ------------------ | -------------------------------------- |
| `defaultMode`        | `ThemeMode` | `'system'`         | Initial mode (falls back to persisted) |
| `persistKey`         | `string`    | `'hexguard-theme'` | localStorage key                       |
| `transitionClass`    | `string`    | —                  | CSS class for transition animations    |
| `transitionDuration` | `number`    | `300`              | Transition removal delay (ms)          |

## Scope Boundaries

| Concern                                       | Status                                    |
| --------------------------------------------- | ----------------------------------------- |
| Light/dark/system mode switching              | ✅                                        |
| `prefers-color-scheme` with live listener     | ✅                                        |
| localStorage persistence                      | ✅                                        |
| `data-theme` attribute on `<html>`            | ✅                                        |
| SSR-safe (guarded `window`/`document` access) | ✅                                        |
| Smooth transition CSS class support           | ✅                                        |
| Per-theme design token CSS custom properties  | ✅ (`injectTokenTheme` + `tokens` config) |
| Built-in UI toggle component                  | ❌ (headless only)                        |

### Design Token Layers (0.2.0+)

`injectTokenTheme()` adds per-theme CSS custom property injection. When the effective theme changes, the corresponding token layer is written as CSS custom properties on `<html>`.

```typescript
import { injectTokenTheme } from '@hexguard/angular-theme';

const theme = injectTokenTheme({
  tokens: {
    light: { 'color-surface': '#ffffff', 'color-text': '#171717' },
    dark: { 'color-surface': '#1a1a1a', 'color-text': '#f0f0f0' },
  },
});

theme.setMode('dark');
// Writes --color-surface: #1a1a1a and --color-text: #f0f0f0 on <html>
```

## Demo

Visit `/packages/angular-theme/demo` to test light, dark, and system modes.
