# @hexguard/angular-signal-persist — Deep Package Notes

One-call signal persistence: wrap any `WritableSignal<T>` to auto-persist to `localStorage`/`sessionStorage` with hydration on init, TTL expiry, migration callback, custom serialization, and cross-tab sync.

## API

- `injectPersistedSignal<T>(key, defaultValue, options?)` → `WritableSignal<T>` — Returns a signal that auto-persists to storage on every change via an `effect()`. Hydrates from storage on construction.

## Options

| Option | Description |
|--------|-------------|
| `backend` | Storage backend (`localStorage` or `sessionStorage`). Default: `localStorage`. |
| `serializer` | Custom serializer function. Default: `JSON.stringify`. |
| `deserializer` | Custom deserializer function. Default: `JSON.parse`. |
| `ttlMs` | Time-to-live in ms. When expired, value resets to default. |
| `onRestore` | Migration callback: `(stored: T) => T`. Called on hydration. |
| `writeDelayMs` | Debounce writes in ms. Default: 0 (immediate). |
| `syncAcrossTabs` | Listen for `StorageEvent` cross-tab changes. Default: `true`. |

---

## Assessment

| Area | Suggestion | Priority |
|------|-----------|----------|
| API | Consider adding encryption support in v0.2 | Low |
| Tests | Missing: concurrent tab write while debounced write pending | Low |
| Tests | Missing: TTL wrap with custom serializer | Low |

## Code Examples

### Persist a single value

```typescript
import { injectPersistedSignal } from '@hexguard/angular-signal-persist';

@Component({ ... })
class ThemeComponent {
  readonly theme = injectPersistedSignal('app-theme', 'light');

  toggle() {
    this.theme.update(t => t === 'light' ? 'dark' : 'light');
  }
}
```

### Persist with TTL expiry

```typescript
const cache = injectPersistedSignal<{ data: string } | null>('api-cache', null, {
  ttlMs: 300_000, // 5 minutes
});
```
