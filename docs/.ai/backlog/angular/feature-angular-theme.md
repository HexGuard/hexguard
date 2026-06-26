---
id: feature-angular-theme
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/angular-theme'
---

# @hexguard/angular-theme

## Summary

Theme switching state — light/dark/system modes, CSS class management, `prefers-color-scheme` detection, persistence, and smooth transitions.

**Competition check:** No headless Angular theme state package exists.

## Proposed Public API

```typescript
export type ThemeMode = 'light' | 'dark' | 'system';

export function injectTheme(config?: {
  defaultMode?: ThemeMode;
  persistKey?: string;
  transitionClass?: string;
}): {
  readonly mode: Signal<ThemeMode>;
  readonly effectiveTheme: Signal<'light' | 'dark'>;
  readonly isDark: Signal<boolean>;
  readonly isLight: Signal<boolean>;
  setMode(mode: ThemeMode): void;
  toggle(): void;
};
```

## Implementation Plan

1. Scaffold `angular/packages/angular-theme/`.
2. Implement mode state with system preference detection via `matchMedia`.
3. Implement persistence and CSS class management.
4. Add tests.
5. Register in workspace.
