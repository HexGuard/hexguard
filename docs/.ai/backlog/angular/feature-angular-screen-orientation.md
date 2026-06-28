---
id: feature-angular-screen-orientation
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/angular-screen-orientation'
---

# @hexguard/angular-screen-orientation

## Summary

Screen Orientation API state â€” detect/lock orientation as signals. For fullscreen video, mobile games, kiosk mode.


## Goals

- Provide reactive, signal-based headless state for Angular applications
- Dependency-free at runtime beyond Angular core and tslib
- SSR-safe with TransferState awareness where applicable


## Non-Goals

- No rendered UI components — headless state, signals, and services only
- No browser globals or window-dependent code without SSR guard
- No backend API calls (consumer provides data/endpoints)

## Proposed Public API

```typescript
export function injectScreenOrientation(): {
  readonly type: Signal<OrientationType>;
  readonly angle: Signal<number>;
  readonly isPortrait: Signal<boolean>;
  readonly isLandscape: Signal<boolean>;
  readonly supported: Signal<boolean>;
  lock(orientation: OrientationLockType): Promise<boolean>;
  unlock(): Promise<void>;
};
```

## Implementation Plan

1. Scaffold `angular/packages/angular-screen-orientation/`.
2. Wrap `screen.orientation` API with signals.
3. Add tests.
4. Register in workspace.
