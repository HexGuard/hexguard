# @hexguard/angular-preferences

**Typed user preferences for Angular.** Schema-driven key-value persistence with per-key signals, backed by `@hexguard/angular-storage` for cross-tab sync, TTL, and versioning.

---

## Installation

```bash
pnpm add @hexguard/angular-preferences
```

Requires `@hexguard/angular-storage` as a peer dependency.

## Quickstart

```typescript
import { injectPreferences, pref } from '@hexguard/angular-preferences';

const USER_PREFS = {
  sidebarOpen: pref('sidebar-open', true),
  theme: pref('theme', 'system' as 'light' | 'dark' | 'system'),
  pageSize: pref('page-size', 20),
} as const;

@Component({ ... })
class AppComponent {
  readonly prefs = injectPreferences(USER_PREFS);
  readonly sidebarOpen = this.prefs.get('sidebarOpen');

  toggleSidebar() {
    this.prefs.set('sidebarOpen', !this.sidebarOpen());
  }

  resetAll() {
    this.prefs.resetAll();
  }
}
```

## API

### `pref(key, defaultValue)`

Define a preference with a storage key and default value.

### `injectPreferences(schema)`

| Method | Description |
|--------|-------------|
| `get(key)` | Get typed signal for a preference |
| `set(key, value)` | Set a preference value |
| `reset(key)` | Reset single preference to default |
| `resetAll()` | Reset all preferences to defaults |
| `patch(values)` | Update multiple preferences at once |

## Scope Boundaries

| Concern | Status |
|---------|--------|
| Typed schema-driven preferences | ✅ |
| Per-key signals backed by `angular-storage` | ✅ |
| Cross-tab sync (via angular-storage) | ✅ |
| TTL expiry (via angular-storage) | ✅ |
| Patch multiple preferences | ✅ |
| Reset individual/all | ✅ |
| Nested key paths | ❌ (v0.2) |
| Preferences UI editor | ❌ (v0.2) |

## Demo

Visit `/packages/angular-preferences/demo` to test typed preferences with persistence and cross-tab sync.
