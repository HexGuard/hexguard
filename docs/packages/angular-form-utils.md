# @hexguard/angular-form-utils — Deep Package Notes

Form utility helpers: cross-field validators, form dirty state, unsaved-changes guard.

## API

- `fieldsEqual(a, b)` / `fieldsNotEqual(a, b)` — Compare two field values.
- `requiredIf(field, condition)` — Required when condition is true.
- `requiresAtLeastOne(fields)` — At least one field must have value.
- `injectFormDirtyState(form)` → `FormDirtyState` — Track form dirty state.
- `formUnsavedGuard(dirtyState, message?)` → `CanDeactivateFn`.

## Assessment

| Area | Suggestion | Priority |
|------|-----------|----------|
| API | Consider async validators in v0.2 | Low |
| Tests | Missing: formUnsavedGuard with confirm | Low |

## Code Examples

```typescript
const form = new FormGroup({
  password: new FormControl(''),
  confirm: new FormControl(''),
}, { validators: fieldsEqual('password', 'confirm') });
```
