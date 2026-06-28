---
id: feature-angular-share
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/angular-share'
---

# @hexguard/angular-share

## Summary

Web Share API wrapper for Angular â€” share text, URLs, and files using the native OS share dialog. Simple `share()` with support detection and result tracking.

**Competition check:** No Angular Web Share API wrapper exists.


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
export function injectShare(): {
  readonly isSupported: Signal<boolean>;
  share(data: ShareData): Promise<{ success: boolean; error?: string }>;
  readonly lastResult: Signal<ShareResult | null>;
};

export interface ShareResult { success: boolean; error?: string; timestamp: Date; }
```

## Implementation Plan

1. Scaffold `angular/packages/angular-share/`.
2. Wrap `navigator.share()` with support detection and result tracking.
3. Add tests.
4. Register in workspace.
