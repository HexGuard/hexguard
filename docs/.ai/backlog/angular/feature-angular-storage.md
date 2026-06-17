---
id: feature-angular-storage
type: feature
status: proposed
created: 2026-06-17
package: '@hexguard/angular-storage'
---

# Angular Storage Package

## Summary

Design `@hexguard/angular-storage` as a typed, signal-friendly wrapper package around `localStorage` and `sessionStorage` with automatic JSON serialization, versioning, cross-tab change detection, and optional expiry.

The repeated problem is that almost every Angular app stores user preferences, recently-viewed items, form drafts, or UI state in `localStorage`, but the raw API is stringly-typed, has no change notifications, no cross-tab synchronization, no expiry, and no versioning. Teams wrap it in ad hoc services with inconsistent serialization and error handling.

## Goals

- Provide `injectStorage()` returning typed `Signal<T>`-backed storage values for `localStorage` and `sessionStorage`.
- Support automatic JSON serialization/deserialization with type-safe generics.
- Support optional value expiry (TTL) for cache-like patterns.
- Support cross-tab synchronization via the `storage` event — when one tab writes, other tabs update.
- Support versioning — if the stored schema version doesn't match, the value is treated as missing.
- Provide a `storageMeta` signal exposing metadata (stored, expired, missing, version mismatch).
- Keep the package dependency-free beyond `@angular/core` and `tslib`.

## Non-Goals

- Overriding or replacing Angular `APP_INITIALIZER` hydration strategies.
- Encrypting stored values — that's an app-level concern.
- Large binary data storage — that belongs in IndexedDB, not localStorage.
- Server-side rendering support — localStorage is browser-only.

## Decisions

- Use `localStorage` as the default storage backend, with `sessionStorage` selectable via options.
- Use the `storage` event for cross-tab synchronization (only fires in other tabs, so the writing tab updates its signals directly).
- Store metadata (version, expiry, stored-at timestamp) alongside the value in the same key as a JSON envelope.
- Fail gracefully when localStorage is unavailable (private browsing, storage full) — signals fall back to in-memory defaults.
- Keep the API surface to one injectable factory, one options interface, and one return type.

## Proposed Public API

```ts
import { injectStorage } from '@hexguard/angular-storage';

const prefs = injectStorage('user-preferences', {
  defaultValue: { theme: 'light', sidebar: true },
  version: 2,
  ttlMs: 7 * 24 * 60 * 60 * 1000, // 7 day expiry
  storage: 'local', // 'local' | 'session' (default 'local')
});

// Reactive signal — updates when the value changes in any tab
const value = prefs.value; // Signal<{ theme: string; sidebar: boolean }>

// Write — persists and updates the signal
prefs.set({ theme: 'dark', sidebar: false });

// Patch — merges with current value
prefs.patch({ theme: 'dark' });

// Clear this key
prefs.clear();

// Metadata
const meta = prefs.meta; // Signal<'stored' | 'expired' | 'missing' | 'versionMismatch'>

// Option interface
interface StorageOptions<T> {
  defaultValue: T;
  version?: number; // for schema migration detection (default 1)
  ttlMs?: number; // time-to-live in ms (default: no expiry)
  storage?: 'local' | 'session'; // default 'local'
}

// Return type
interface TypedStorage<T> {
  readonly value: Signal<T>;
  readonly meta: Signal<StorageMeta>;
  set(value: T): void;
  patch(partial: Partial<T>): void;
  clear(): void;
}
```

## Implementation Plan

### Phase 0: Foundation

1. Scaffold the publishable Angular library under `angular/packages/angular-storage/` following existing conventions.
2. Add build and test scripts to `angular/package.json` (`build:lib:storage`, `test:lib:storage`).

### Phase 1: Core Implementation

3. Implement `injectStorage()` using Angular's `DestroyRef` for cleanup.
4. Implement JSON envelope storage with typed serialization/deserialization and error recovery (malformed JSON → fall to default).
5. Implement version checking — compare stored version against requested version, reset on mismatch.
6. Implement optional TTL — compare stored-at timestamp, reset on expiry.
7. Implement cross-tab sync — listen for `window.storage` events, update signals when other tabs write.
8. Implement `patch()` — shallow merge with current value for object types.
9. Implement `clear()` — remove key from storage and reset signal to default.
10. Implement graceful fallback when localStorage is unavailable (private browsing, quota exceeded).
11. Add unit tests for: set/get/clear, JSON serialization, TTL expiry, version mismatch, cross-tab event handling, localStorage unavailability, patch merge, concurrent mutations, and cleanup on destroy.

### Phase 2: Demo & Docs

12. Add a demo route at `/packages/angular-storage` showing:
    - Preference editor that persists across reloads
    - Cross-tab sync (open two tabs, watch values synchronize)
    - Expiry demo (set a short TTL, watch it expire)
    - Version mismatch demo (increment version, see default take over)
13. Add Playwright coverage for the demo page.
14. Write the deep-dive doc at `docs/packages/angular-storage.md`.
15. Update the npm-facing `README.md`.

### Phase 3: Release

16. Add `verify:package:storage` to `angular/package.json`.
17. Add `.github/workflows/release-angular-storage.yml`.
18. Run `pnpm test:ci` and `pnpm build` for the full validation gate.

## Validation

- `pnpm test:lib:storage` — unit tests for serialization, expiry, versioning, cross-tab sync, fallback.
- `pnpm build:lib` — package builds.
- `pnpm test:app` — demo compiles.
- `pnpm test:e2e` — Playwright for demo interactions.
- `pnpm verify:package:storage` — tarball smoke test.

## Follow-Ups

- Evaluate whether a companion `@hexguard/angular-storage-indexeddb` for larger structured data is warranted.
- Revisit cross-origin storage if iframe or multi-origin apps need it.
- Consider adding a `watch(key)` API for inspecting individual keys outside the typed facade.
