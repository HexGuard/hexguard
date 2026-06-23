# `@hexguard/angular-storage` Deep Dive

This page complements the npm-facing README with repo-specific implementation notes and behavior details.

## Purpose

`@hexguard/angular-storage` provides a typed, signal-backed wrapper for `localStorage` and `sessionStorage`. It bridges the imperative browser Storage API into Angular's reactive signal ecosystem with JSON serialization, schema versioning, TTL expiry, and cross-tab synchronization.

## Feature Matrix

| Capability                  | Status    | Notes                                                     |
| --------------------------- | --------- | --------------------------------------------------------- |
| Typed signal-backed storage | Available | `value()` and `meta()` signals for type-safe access       |
| JSON serialization          | Available | Automatic `JSON.parse`/`JSON.stringify` via envelope      |
| Schema versioning           | Available | `versionMismatch` meta when stored schema version differs |
| TTL expiry                  | Available | `expired` meta for time-sensitive cached data             |
| Cross-tab sync              | Available | Listens to `window` `storage` events                      |
| `patch()` shallow merge     | Available | For object types — merges partial values                  |
| `clear()` reset             | Available | Removes key from storage and resets signal to default     |
| Graceful fallback           | Available | In-memory signals when storage throws                     |
| Zero runtime dependencies   | ✅        | Only `@angular/core` + `tslib`                            |

## Public API Map

| Export            | Kind     | Role                                                      |
| ----------------- | -------- | --------------------------------------------------------- |
| `injectStorage()` | Function | Creates typed storage signals and persistence helpers     |
| `StorageOptions`  | Type     | `{ defaultValue, version?, ttlMs?, storage? }`            |
| `TypedStorage`    | Type     | Return shape: `value`, `meta`, `set`, `patch`, `clear`    |
| `StorageMeta`     | Type     | `'stored' \| 'expired' \| 'missing' \| 'versionMismatch'` |

## Behavior Details

### Initialization Flow

When `injectStorage(key, options)` is called:

1. Attempts to access the storage API (`localStorage` or `sessionStorage`)
2. Probes by writing/removing a test key to detect private browsing or quota issues
3. Reads the stored value for `key` and parses the JSON envelope
4. Checks:
   - **Missing key** → uses `defaultValue`, meta = `'missing'`
   - **Version mismatch** (`_v !== version`) → uses `defaultValue`, meta = `'versionMismatch'`
   - **TTL expired** (`_ts` + `ttlMs` < now) → uses `defaultValue`, meta = `'expired'`
   - **Valid** → uses `_value`, meta = `'stored'`
5. Registers cross-tab sync listener
6. Registers cleanup via `DestroyRef`

### JSON Envelope Format

```json
{
  "_value": <your data>,
  "_v": 2,
  "_ts": 1718712000000
}
```

| Field    | Purpose                    | Present when                    |
| -------- | -------------------------- | ------------------------------- |
| `_value` | The serialized value       | Always                          |
| `_v`     | Schema version             | Always (defaults to `1`)        |
| `_ts`    | Write timestamp (epoch ms) | Only when `ttlMs` is configured |

### Cross-Tab Synchronization

When another tab modifies storage for the same key, a `StorageEvent` fires on the `window`. The package:

- Ignores events for other keys or different `storageArea`
- Updates `value` signal with the new data from the event
- Resets to `defaultValue` if the key was removed

### Graceful Fallback

Storage access can fail in:

- **Private browsing** (some browsers throw on `setItem`)
- **Full quota** (storage is full)
- **Disabled cookies** (some browsers restrict storage)
- **SSR** (no `window.localStorage`)

When any of these occur, the package keeps the `value` signal updated in memory but does not persist. The `meta` signal shows `'missing'` after a failed write attempt.

## Edge Cases

| Scenario                             | Behavior                                                     |
| ------------------------------------ | ------------------------------------------------------------ |
| Key doesn't exist                    | Returns `defaultValue`, meta = `'missing'`                   |
| Malformed JSON in storage            | Returns `defaultValue`, meta = `'missing'`                   |
| Wrong schema version                 | Returns `defaultValue`, meta = `'versionMismatch'`           |
| TTL expired                          | Returns `defaultValue`, meta = `'expired'`                   |
| Storage full on write                | Keeps in-memory value, meta = `'missing'`                    |
| Key removed in another tab           | Resets to `defaultValue`, meta = `'missing'`                 |
| Cross-tab update with malformed JSON | Ignores the event, keeps current value                       |
| `patch()` on non-object type         | Results in runtime behavior — designed for object types only |
| SSR (no window)                      | In-memory signals, no cross-tab sync, no persistence         |

## Envelope Evolution

The envelope format uses underscore-prefixed keys (`_value`, `_v`, `_ts`) to minimize collision risk with user data. If your stored value happens to have a `_value` property, it would be shadowed — however, this is extremely unlikely in practice and a deliberate trade-off for a clean envelope format.

## Test Coverage

Tests use mocked `localStorage`/`sessionStorage` via `Object.defineProperty` and `Map`-backed stores. Covered scenarios:

- Initialization: missing key, existing value, version mismatch, TTL expiry, malformed JSON
- `set()`: persistence to storage, signal update, TTL timestamp inclusion
- `patch()`: shallow merge correctness
- `clear()`: key removal, signal reset
- Cross-tab sync: value update from another tab, key removal
- Graceful fallback: storage unavailable (throws)
- Session storage: correct backend selection

## Related Resources

- [Package README](../../angular/packages/angular-storage/README.md)
- [Package Catalog](../README.md)
- [Source Code](../../angular/packages/angular-storage/src/)

## Assessment: Potential Improvements

| Area | Suggestion                                                                         | Priority                                         |
| ---- | ---------------------------------------------------------------------------------- | ------------------------------------------------ | ----------- |
| API  | ✅ Added RxJS observable alternative — `fromStorageKey(key)` returns `Observable<T | null>`. Import from `@hexguard/angular-storage`. | Implemented |

---

## RxJS Observable API

For RxJS consumers, `fromStorageKey()` returns an observable that emits the current value on subscribe and reacts to cross-tab changes:

```ts
import { fromStorageKey } from '@hexguard/angular-storage';
import { filter } from 'rxjs/operators';

interface Preferences {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
}

fromStorageKey<Preferences>('user-preferences')
  .pipe(filter(Boolean))
  .subscribe((prefs) => {
    applyTheme(prefs.theme);
    toggleSidebar(prefs.sidebarOpen);
  });

// With explicit storage backend:
fromStorageKey<string>('session-token', 'session').subscribe((token) => {
  if (token) authenticate(token);
});
```

## API Review Findings

Review date: 2026-06-22. Findings are observational.

### Observations

| Dimension                 | Finding                                                                                                                             | Severity |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Public API Design         | Clean surface: 1 function (`injectStorage`), 3 types. Envelope format with versioning and TTL.                                      | praise   |
| Implementation Quality    | Cross-tab `storage` event sync via `window.addEventListener('storage', ...)`. Session/local storage backend selection.              | praise   |
| Implementation Quality    | Catalog status `"In Progress"` — not yet released.                                                                                  | note     |
| Test Coverage             | All initialization modes, TTL expiry, cross-tab sync, graceful fallback, session storage.                                           | praise   |
| Test Coverage             | **No release workflow** — missing `.github/workflows/release-angular-storage.yml`.                                                  | moderate |
| Cross-package Consistency | **Not integrated into `build:lib`, `test:lib`, `test:ci`, or `verify:package` chains**. Only standalone `build:lib:storage` exists. | moderate |
