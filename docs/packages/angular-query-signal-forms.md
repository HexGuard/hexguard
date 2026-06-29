# @hexguard/angular-query-signal-forms — Deep Package Notes

URL-state adapter for Angular Signal Forms: bind typed query params through `@hexguard/angular-url-state`.

## API

- `querySignalForm(schema, options?)` → `QuerySignalForm`
- `handle.urlState` — Underlying URL-state handle
- `handle.snapshot()` — Current snapshot
- `handle.patch(value)` — Update with reset-on-change
- `handle.reset()` — Reset to defaults
- `handle.commit()` — Manual mode: write staged changes
- `handle.revert()` — Manual mode: discard staged changes

## Assessment

| Area | Suggestion | Priority |
|------|-----------|----------|
| API | Consider Signal Forms `form()` integration when stable | Medium |
| Tests | Missing: urlState.patch integration | Low |

## Code Examples

```typescript
const query = querySignalForm({
  search: stringParam(''),
  page: numberParam(1),
}, { resetKeysOnChange: { search: ['page'] } });
```
