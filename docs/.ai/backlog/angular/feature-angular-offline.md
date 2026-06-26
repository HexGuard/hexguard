---
id: feature-angular-offline
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/angular-offline'
---

# @hexguard/angular-offline

## Summary

Service Worker / PWA offline readiness state for Angular — track SW registration, update availability, cache status, and install prompt. Every PWA needs this state for "Update available, restart?" prompts and offline indicators.

**Competition check:** Angular's `SwUpdate` from `@angular/service-worker` covers update detection but is tied to Angular's Service Worker. This package works with any Service Worker and adds signal-based state.

## Goals

1. Provide `injectOffline()` — PWA/offline state with signals.
2. Track `navigator.onLine` with online/offline events.
3. Track Service Worker registration status.
4. Detect update availability and provide `activateUpdate()` + reload.
5. Track `beforeinstallprompt` event for PWA install.

## Proposed Public API

```typescript
export function injectOffline(): {
  readonly isOnline: Signal<boolean>;
  readonly swStatus: Signal<'unsupported' | 'registered' | 'installing' | 'activated' | 'error'>;
  readonly updateAvailable: Signal<boolean>;
  readonly isInstallable: Signal<boolean>;
  readonly isInstalled: Signal<boolean>;

  activateUpdate(): Promise<void>;       // Skip waiting + reload
  installApp(): Promise<boolean>;        // Trigger beforeinstallprompt
};
```

## Implementation Plan

1. Scaffold `angular/packages/angular-offline/`.
2. Implement online/offline tracking and SW registration state.
3. Implement update detection and install prompt.
4. Add tests.
5. Register in workspace.
