# @hexguard/angular-signal-persist

**One-call signal persistence for Angular.** Wrap any `WritableSignal<T>` to auto-persist its value to `localStorage` or `sessionStorage` via an `effect()`, with hydration on init, TTL expiry, migration, and cross-tab sync.

---

## Problem

Every app persists something — theme preference, sidebar state, form drafts, filter selections. The pattern is always the same: read from storage on init, write on change via `effect()`, handle serialization and errors. This package reduces it to one function call.

## Installation

```bash
pnpm add @hexguard/angular-signal-persist
```

## Quickstart

```typescript
import { injectPersistedSignal } from '@hexguard/angular-signal-persist';

// Returns a WritableSignal that auto-persists to localStorage
const theme = injectPersistedSignal('app-theme', 'light');

theme();        // reads from localStorage or 'light'
theme.set('dark'); // updates signal AND persists to localStorage
```

## Use Cases

### TTL expiry

```typescript
const cache = injectPersistedSignal('api-cache', null, {
  ttlMs: 300_000, // 5 minutes
});
```

### Migration on restore

```typescript
const prefs = injectPersistedSignal('user-prefs', { sidebar: true }, {
  onRestore: (stored) => ({ ...stored, migratedAt: Date.now() }),
});
```

### Custom serializer

```typescript
const data = injectPersistedSignal('key', null, {
  serializer: (v) => btoa(JSON.stringify(v)),
  deserializer: (raw) => JSON.parse(atob(raw)),
});
```

## API

### `injectPersistedSignal<T>(key, defaultValue, options?)`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `backend` | `Storage` | `localStorage` | Storage backend to use |
| `serializer` | `(T) => string` | `JSON.stringify` | Custom serializer |
| `deserializer` | `(string) => T` | `JSON.parse` | Custom deserializer |
| `ttlMs` | `number?` | — | Auto-expire after milliseconds |
| `onRestore` | `(T) => T` | — | Migration callback on restore |
| `writeDelayMs` | `number` | `0` | Debounce writes |
| `syncAcrossTabs` | `boolean` | `true` | Sync via StorageEvent |

Returns a `WritableSignal<T>` — use `.set()`, `.update()`, `.mutate()` as normal.

## Scope Boundaries

| Concern | Status |
|---------|--------|
| localStorage/sessionStorage persistence | ✅ |
| TTL expiry | ✅ |
| Migration callback | ✅ |
| Custom serializer | ✅ |
| Cross-tab sync | ✅ |
| Debounced writes | ✅ |
| SSR-safe (guarded access) | ✅ |
| DestroyRef cleanup | ✅ |
| Encryption | ❌ (v0.2) |

## Demo

Visit `/packages/angular-signal-persist/demo` to test signal persistence with TTL, custom serializers, and cross-tab sync.
