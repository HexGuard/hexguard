---
id: feature-angular-signal-persist
type: feature
status: proposed
created: 2026-06-25
package: '@hexguard/angular-signal-persist'
---

# @hexguard/angular-signal-persist

## Summary

One-call signal persistence for Angular — wrap any `WritableSignal<T>` to automatically persist its value to `localStorage`, `sessionStorage`, or a custom storage backend, with automatic hydration on init. Eliminates the boilerplate of manually reading from storage, writing on change via `effect()`, and handling serialization.

**Relationship to `@hexguard/angular-storage`:** `angular-storage` is a lower-level storage abstraction with typed get/set/remove and cross-tab sync. `angular-signal-persist` is a **higher-level convenience** — it takes any existing signal and persists it automatically. `angular-storage` is the storage engine; `angular-signal-persist` is the reactive auto-persistence layer.

**Competition check:** No Angular package provides automatic signal persistence with a single function call. Some state management libraries include persistence as a feature, but none offer it as a standalone, headless primitive.

## Why Wide Adoption

Persistence is universal: user preferences (theme, language, sidebar state), form drafts, filter selections, recently viewed items, UI layout state. Currently every app writes the same pattern:

```typescript
const storage = injectStorage();
const value = signal(storage.get('key', default));
effect(() => storage.set('key', value()));
```

This package reduces it to one line.

## Goals

1. Provide `injectPersistedSignal(key, defaultValue, options?)` — returns a `WritableSignal<T>` that auto-persists to storage.
2. Support `localStorage` and `sessionStorage` backends out of the box.
3. Support custom `Storage` backend (for use with `angular-storage` or cookie storage).
4. Support optional TTL expiry — signal resets to default when expired.
5. Support migration/versioning via `onRestore` callback.
6. Support `syncAcrossTabs` option — persist updates across browser tabs via `storage` event.

## Non-Goals

- No cross-tab sync for sessionStorage (not supported by the browser `storage` event).
- No encryption of stored values.
- No migration of keys or storage structure.

## Decisions

1. **Effect-based**: Uses `effect()` internally to write to storage on every signal change.
2. **Hydration on init**: Reads from storage synchronously on construction (localStorage is sync).
3. **Debounced writes**: Optional `writeDelayMs` to batch rapid writes (default 0 = immediate).
4. **Error-tolerant**: Storage read/write failures are silently caught — the signal falls back to default rather than throwing.

## Proposed Public API

```typescript
// ── Options ───────────────────────────────────────────────

export interface PersistSignalOptions<T> {
  backend?: 'localStorage' | 'sessionStorage' | Storage;  // Default: localStorage
  serializer?: (value: T) => string;
  deserializer?: (raw: string) => T;
  ttl?: number;                            // TTL in milliseconds
  onRestore?: (raw: T) => T;               // Migration/upgrade on restore
  writeDelayMs?: number;                   // Debounce writes (default: 0)
  syncAcrossTabs?: boolean;                // Listen for storage events
}

// ── Factory ───────────────────────────────────────────────

export function injectPersistedSignal<T>(
  key: string,
  defaultValue: T,
  options?: PersistSignalOptions<T>
): WritableSignal<T>;

// ── Usage ─────────────────────────────────────────────────

// Basic
const theme = injectPersistedSignal('app:theme', 'light');
theme.set('dark'); // Auto-persisted

// With TTL
const session = injectPersistedSignal('app:session', null, {
  ttl: 3_600_000,       // 1 hour
  syncAcrossTabs: true,
});

// With migration
const prefs = injectPersistedSignal('app:prefs', defaultPrefs, {
  onRestore: (raw) => {
    if ('fontSize' in raw) return { ...raw, fontSize: raw.fontSize + 'px' };
    return raw;
  },
});
```

## Implementation Plan

1. Scaffold `angular/packages/angular-signal-persist/` following the standard pattern.
2. Implement `injectPersistedSignal()` with effect-based persistence.
3. Support localStorage/sessionStorage backends and custom `Storage`.
4. Add TTL expiry and `onRestore` migration.
5. Add cross-tab sync via `window.addEventListener('storage', ...)`.
6. Add tests: basic persistence, cross-tab sync, TTL expiry, migration, error tolerance, edge cases (SSR, storage quota exceeded).
7. Create demo page.
8. Register in workspace, build scripts, and catalog.
