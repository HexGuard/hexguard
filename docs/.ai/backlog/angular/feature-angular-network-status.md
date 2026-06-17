---
id: feature-angular-network-status
type: feature
status: proposed
created: 2026-06-17
package: '@hexguard/angular-network-status'
---

# Angular Network Status Package

## Summary

Design `@hexguard/angular-network-status` as a tiny, focused Angular package for standardizing online/offline connectivity state, connection-type changes, and debounced reconnection signals.

The repeated problem is that Angular apps increasingly need offline-aware behavior — show "you're offline" banners, pause polling when disconnected, queue actions for retry, and detect when connectivity returns. Every team rebuilds the same `navigator.onLine` + `window.addEventListener('online'/'offline')` boilerplate with slightly different debounce and edge-case handling.

## Goals

- Provide a single injectable facade (`injectNetworkStatus()`) returning signal-based connectivity state.
- Expose `online: Signal<boolean>`, `connectionType: Signal<EffectiveConnectionType>`, and `recentlyBackOnline: Signal<boolean>`.
- Include configurable debounce for the transition back online (avoid flickering when connectivity toggles rapidly).
- Track connection type via `navigator.connection.effectiveType` where available (slow-2g, 2g, 3g, 4g).
- Expose a `whenBackOnline(): Promise<void>` helper for composing with retry logic.
- Keep the package dependency-free beyond `@angular/core` and `tslib`.

## Non-Goals

- Building offline-queue or request-retry logic — those compose on top of network-status signals.
- Service worker registration or offline-cache management.
- Measuring bandwidth or latency beyond the effective-type hint.
- P2P or WebRTC connection state.

## Decisions

- Use `navigator.onLine` + `online`/`offline` events as the primary source of truth.
- Use `navigator.connection` events for connection-type changes where available (Chromium-based browsers).
- Default to a 1-second debounce on the offline→online transition to avoid flapping. Configurable via options.
- Treat `connectionType` as `'unknown'` when the API is unavailable.
- Keep the API surface to one facade function, one options interface, and one return type.

## Proposed Public API

```ts
import { injectNetworkStatus } from '@hexguard/angular-network-status';

@Component({ ... })
export class MyComponent {
  private readonly network = injectNetworkStatus({ onlineDebounceMs: 1000 });

  // Reactive signals
  readonly isOnline = this.network.online;               // Signal<boolean>
  readonly connectionType = this.network.connectionType;  // Signal<'slow-2g' | '2g' | '3g' | '4g' | 'unknown'>
  readonly recentlyBackOnline = this.network.recentlyBackOnline; // Signal<boolean> — true for 3s after reconnection

  // Promise helper for retry composition
  async savePendingChanges() {
    if (!this.network.online()) {
      await this.network.whenBackOnline();
    }
    await this.save();
  }
}

// Options
interface NetworkStatusOptions {
  onlineDebounceMs?: number;       // debounce window for offline→online (default 1000)
  backOnlineSignalDurationMs?: number; // how long recentlyBackOnline stays true (default 3000)
}

// Return type
interface NetworkStatus {
  readonly online: Signal<boolean>;
  readonly connectionType: Signal<EffectiveConnectionType>;
  readonly recentlyBackOnline: Signal<boolean>;
  whenBackOnline(): Promise<void>;
}
```

## Implementation Plan

### Phase 0: Foundation

1. Scaffold the publishable Angular library under `angular/packages/angular-network-status/` following existing conventions (package.json, ng-package.json, tsconfigs, `angular.json` registration).
2. Add build and test scripts to `angular/package.json` (`build:lib:network-status`, `test:lib:network-status`).

### Phase 1: Core Implementation

3. Implement `injectNetworkStatus()` using Angular's `DestroyRef` for cleanup.
4. Implement `online` signal bound to `navigator.onLine` + `online`/`offline` window events.
5. Implement debounced offline→online transition using `setTimeout`/`clearTimeout` with configurable window.
6. Implement `connectionType` signal via `navigator.connection` change events with graceful fallback.
7. Implement `recentlyBackOnline` signal that stays `true` for a configurable duration after reconnection.
8. Implement `whenBackOnline()` promise that resolves on the next online transition (or immediately if already online).
9. Add unit tests for: online→offline→online transitions, debounce window, flapping prevention, connection-type changes, recently-back-online timing, cleanup on destroy, and browser API unavailability.

### Phase 2: Demo & Docs

10. Add a demo route at `/packages/angular-network-status` showing:
    - Live online/offline indicator with visual state
    - Connection-type display
    - "Recently back online" flash indicator
    - Simulated offline toggle for testing
11. Add Playwright coverage for the demo page.
12. Write the deep-dive doc at `docs/packages/angular-network-status.md`.
13. Update the npm-facing `README.md`.

### Phase 3: Release

14. Add `verify:package:network-status` to `angular/package.json`.
15. Add `.github/workflows/release-angular-network-status.yml`.
16. Run `pnpm test:ci` and `pnpm build` for the full validation gate.

## Validation

- `pnpm test:lib:network-status` — unit tests for connectivity transitions, debounce, connection-type, cleanup.
- `pnpm build:lib` — package builds successfully.
- `pnpm test:app` — demo app compiles.
- `pnpm test:e2e` — Playwright coverage for demo interactions.
- `pnpm verify:package:network-status` — tarball smoke test.

## Follow-Ups

- Evaluate whether a companion `@hexguard/angular-offline-queue` for queueing and retrying actions while offline should be a separate package.
- Revisit `navigator.connection.downlink`/`rtt` exposure if demand arises for bandwidth-aware data fetching.
- Compare overlap with the cross-stack `HexGuard.UserPresence` package (different concern — presence is multi-user, network-status is client-only).
