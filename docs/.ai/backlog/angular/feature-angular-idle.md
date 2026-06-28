---
id: feature-angular-idle
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/angular-idle'
---

# @hexguard/angular-idle

## Summary

Session idle/timeout manager â€” track inactivity, show warning before expiry, auto-logout on timeout. Every secure app needs session timeout workflows.

**Complements `angular-visibility`** (idle detection) with the full timeout workflow (warning, extend, logout).


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
export function injectIdleManager(config: {
  idleTimeoutMs: number;
  warningBeforeMs?: number;               // Default: 60_000 (1 min warning)
  onTimeout: () => void | Promise<void>;  // Redirect to login, clear tokens
  onActivity?: () => void;
  autoStart?: boolean;
}): {
  readonly state: Signal<'active' | 'idle' | 'warning' | 'timed-out'>;
  readonly remainingMs: Signal<number>;     // Time until timeout
  readonly idleDurationMs: Signal<number>;

  start(): void;
  stop(): void;
  resetTimer(): void;                        // User activity
  extend(): void;                            // "Stay logged in" button
};
```

## Implementation Plan

1. Scaffold `angular/packages/angular-idle/`.
2. Implement idle detection â†’ countdown â†’ warning â†’ timeout flow.
3. Add tests.
4. Register in workspace.
