# @hexguard/angular-preferences — Deep Package Notes

Typed user preferences: schema-driven key-value persistence backed by `@hexguard/angular-storage`.

## API

- `pref<T>(key, defaultValue)` → `PreferenceDef<T>` — Factory for typed preference definitions.
- `injectPreferences<T>(schema)` → `PreferencesHandle<T>` — Returns typed handle.
- `handle.get(key)` → `Signal<T>` — Per-key typed signal.
- `handle.set(key, value)` — Set a preference.
- `handle.reset(key)` / `handle.resetAll()` — Reset to defaults.
- `handle.patch(values)` — Batch update.

---

## Assessment

| Area | Suggestion | Priority |
|------|-----------|----------|
| API | Consider nested key paths in v0.2 | Low |
| Tests | Missing: cross-tab sync via storage event | Low |
| Tests | Missing: TTL expiry via angular-storage | Low |

## Code Examples

```typescript
const PREFS = {
  sidebar: pref('sidebar', true),
  pageSize: pref('page-size', 20),
} as const;

@Component({ ... })
class AppComponent {
  readonly prefs = injectPreferences(PREFS);
}
```
