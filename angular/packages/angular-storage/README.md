# @hexguard/angular-storage

Typed, signal-backed local and session storage for Angular — JSON serialization, schema versioning, TTL expiry, cross-tab synchronization, and graceful fallback.

**[Deep package notes](https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-storage.md)** ·
**[Demo routes](#demo-routes)** ·
**[Installation](#installation)**

## Installation

```bash
pnpm add @hexguard/angular-storage
```

## Quickstart

```ts
import { injectStorage } from '@hexguard/angular-storage';

@Component({ ... })
class SettingsComponent {
  readonly prefs = injectStorage('user-preferences', {
    defaultValue: { theme: 'light', sidebarOpen: true },
    version: 2,
    storage: 'local',
  });

  // Read
  get theme(): string { return this.prefs.value().theme; }

  // Write
  toggleSidebar(): void {
    this.prefs.patch({ sidebarOpen: !this.prefs.value().sidebarOpen });
  }

  // Reset
  reset(): void { this.prefs.clear(); }

  // Storage metadata
  get meta(): string { return this.prefs.meta(); } // "stored" | "expired" | "missing" | "versionMismatch"
}
```

## Features

| Feature                              | Status | Notes                                                |
| ------------------------------------ | ------ | ---------------------------------------------------- |
| Typed signal-backed storage          | ✅     | Type-safe `value()` and `meta()` signals             |
| Schema versioning                    | ✅     | `versionMismatch` meta when stored version differs   |
| TTL expiry                           | ✅     | `expired` meta for time-sensitive data               |
| Cross-tab sync                       | ✅     | Listens to `window` storage events                   |
| `patch()` shallow merge              | ✅     | For object types — merge partial values              |
| `clear()` reset                      | ✅     | Removes key and resets to default                    |
| Graceful fallback                    | ✅     | In-memory fallback when storage unavailable          |
| Zero runtime dependencies            | ✅     | Only `@angular/core` + `tslib`                       |

## Demo routes

| Route                          | Description                                        |
| ------------------------------ | -------------------------------------------------- |
| `/packages/angular-storage`    | Package hub page with catalog overview             |
| `/packages/angular-storage/demo` | Persistent preference panel with inspector panel |

## Public API

| Export            | Kind     | Description                                              |
| ----------------- | -------- | -------------------------------------------------------- |
| `injectStorage()` | Function | DI factory returning `TypedStorage<T>`                   |
| `StorageOptions`  | Type     | `{ defaultValue, version?, ttlMs?, storage? }`           |
| `TypedStorage`    | Type     | Return shape with `value`, `meta`, `set`, `patch`, `clear` |
| `StorageMeta`     | Type     | `'stored' \| 'expired' \| 'missing' \| 'versionMismatch'` |

## Storage Envelope Format

Values are stored as a JSON envelope for versioning and TTL support:

```json
{
  "_value": <your data>,
  "_v": 2,
  "_ts": 1718712000000
}
```

| Field     | Purpose                             |
| --------- | ----------------------------------- |
| `_value`  | The serialized value                |
| `_v`      | Schema version (matches `version`)  |
| `_ts`     | Write timestamp (present when TTL set) |

## What It Owns

- Typed, signal-backed read/write to `localStorage` or `sessionStorage`
- Schema versioning for safe migration detection
- TTL-based expiry for cached or time-sensitive data
- Cross-tab synchronization via `window` storage events
- In-memory fallback when storage throws (private browsing, quota)

## What It Does Not Own

- No encryption or obfuscation — values are plain JSON
- No automatic migration — consumers handle `versionMismatch` as needed
- No size monitoring — storage quota errors surface through graceful fallback
