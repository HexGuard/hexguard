---
id: feature-angular-wake-lock
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/angular-wake-lock'
---

# @hexguard/angular-wake-lock

## Summary

Screen Wake Lock API state for Angular â€” keep the device screen awake during presentations, video playback, QR code display, or kiosk mode. Simple `acquire()`/`release()` with signal-based state tracking.

**Competition check:** No Angular wake-lock state package exists.


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
export function injectWakeLock(): {
  readonly isActive: Signal<boolean>;
  readonly isSupported: Signal<boolean>;
  acquire(): Promise<boolean>;
  release(): Promise<void>;
  readonly error: Signal<string | null>;
};

// Usage
const wl = injectWakeLock();
await wl.acquire();  // Screen stays on
// ... show presentation ...
await wl.release();  // Screen can dim again
```

## Implementation Plan

1. Scaffold `angular/packages/angular-wake-lock/`.
2. Implement `navigator.wakeLock` wrapper with auto-reacquire on visibility change.
3. Add tests with mocked Wake Lock API.
4. Register in workspace.
