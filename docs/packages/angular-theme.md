# @hexguard/angular-theme — Deep Package Notes

Theme switching state for Angular: light/dark/system modes, CSS class management, `prefers-color-scheme` detection, persistence, and smooth transitions.

## Problem

Every Angular app with dark mode support rebuilds the same pattern: a `matchMedia` listener for `prefers-color-scheme`, a localStorage toggle for persisting the user's choice, a CSS class or attribute on `<html>`, and SSR guards. Small differences in implementation — when to apply the class, how to handle the system change event, what to persist — cause inconsistent behavior across teams.

**`@hexguard/angular-theme`** standardizes this into one injectable contract with `mode`/`effectiveTheme` signals, automatic `data-theme` attribute management, and configurable persistence.

## API

- `mode: Signal<ThemeMode>` — The user's selected mode: `'light'`, `'dark'`, or `'system'`
- `effectiveTheme: Signal<'light' | 'dark'>` — The resolved theme (system mode is resolved to actual preference via matchMedia)
- `isDark: Signal<boolean>`, `isLight: Signal<boolean>` — Convenience booleans
- `setMode(mode)` — Set the theme mode explicitly
- `toggle()` — Toggle between light and dark (sets mode directly, not system)
- `resetToSystem()` — Reset to system preference

Automatic behaviors:
- Applies `data-theme` attribute on `<html>` when effective theme changes
- Persists mode to localStorage (configurable `persistKey`)
- Listens for `prefers-color-scheme` changes and updates `effectiveTheme` reactively
- Cleans up matchMedia listener via `DestroyRef`

---

## Assessment: Potential Improvements

| Area | Suggestion | Priority |
|------|-----------|----------|
| API | Consider adding a `systemDarkSignal` export for standalone system preference observation | Low |
| API | Consider adding CSS variable injection for common theme tokens (`--bg`, `--text`, etc.) | Low |
| API | Consider adding a `themeTransition` directive for declarative transition class binding | Low |
| Tests | Missing test: transition class is added/removed with correct timing | Low |
| Tests | Consider adding integration test with matchMedia mock for system preference | Medium |

## Code Examples

### Light/dark/system switcher

```typescript
import { injectTheme } from '@hexguard/angular-theme';

@Component({ ... })
class ThemeSwitcherComponent {
  readonly theme = injectTheme();
}
// Template:
// <button (click)="theme.setMode('light')">Light</button>
// <button (click)="theme.setMode('dark')">Dark</button>
// <button (click)="theme.resetToSystem()">System</button>
// <button (click)="theme.toggle()">Toggle</button>
// Current: {{ theme.mode() }} ({{ theme.effectiveTheme() }})
```

### React to theme changes

```typescript
effect(() => {
  const isDark = this.theme.isDark();
  // Update chart theme, map style, etc.
  this.chart.setTheme(isDark ? 'dark' : 'light');
});
```

### CSS targeting with data-theme

```css
/* Consumer's styles.css */
:root {
  --bg: #ffffff;
  --text: #1a1a1a;
}

[data-theme="dark"] {
  --bg: #1a1a1a;
  --text: #f0f0f0;
}

body {
  background: var(--bg);
  color: var(--text);
}
```

## Related Resources

- [Package README](../../angular/packages/angular-theme/README.md)
- [Package Catalog](../README.md)
- [Demo Routes](../../angular/apps/demo-angular/src/app/features/packages/angular/angular-theme/)
- [Source Code](../../angular/packages/angular-theme/src/)

---

## API Review Findings

Review date: 2026-06-28. Findings are observational.

### Observations

| Dimension | Finding | Severity |
|-----------|---------|----------|
| Public API Design | Minimal surface: 1 function (`injectTheme`), 3 types. Clean mode/effectiveTheme/isDark/isLight contract with setMode/toggle/resetToSystem. | praise |
| Implementation Quality | matchMedia listener for system preference with live updates. localStorage persistence. data-theme attribute on documentElement. SSR-safe guards. DestroyRef cleanup. | praise |
| Test Coverage | 10 tests covering system default, setMode, toggle, resetToSystem, localStorage persistence/custom key, data-theme attribute, persisted mode loading, and toggle symmetry. | praise |
| Demo Integration | Interactive demo with light/dark/system buttons, toggle, and inspector panel showing all signal values. | praise |
