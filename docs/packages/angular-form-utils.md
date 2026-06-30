# @hexguard/angular-form-utils — Deep Package Notes

Form utility helpers: cross-field validators, form dirty state, unsaved-changes guard, error aggregation, and async validation.

## API

- `fieldsEqual(a, b)` / `fieldsNotEqual(a, b)` — Compare two field values.
- `requiredIf(field, condition)` — Required when condition is true.
- `requiresAtLeastOne(fields)` — At least one field must have value.
- `injectFormDirtyState(form)` → `FormDirtyState` — Track form dirty state.
- `formUnsavedGuard(dirtyState, message?)` → `CanDeactivateFn`.
- `aggregateFormErrors(form)` — Walk form tree, return flat error map keyed by control path.
- `asyncFieldValidator(validateFn)` — Wrap a promise-based validator into an `AsyncValidatorFn`.
- `injectFormArrayDirtyState(formArray)` — Track dirty state of FormArray items with index-based access.
- `arrayToggleItem(array, value, toControl?)` — Toggle a value in a FormArray (add if absent, remove if present).

## Assessment

| Area | Suggestion | Priority |
|------|-----------|----------|
| Tests | Missing: formUnsavedGuard with confirm | Low |
| Tests | Nested form dirty state | ✅ Added |
| API | Error aggregation helper | ✅ Added |
| API | Async validator wrapper | ✅ Added |
| API | FormArray dirty state + toggle | ✅ Added |

## Code Examples

```typescript
// Cross-field validators
const form = new FormGroup({
  password: new FormControl(''),
  confirm: new FormControl(''),
}, { validators: fieldsEqual('password', 'confirm') });

// Error aggregation
const errors = aggregateFormErrors(form);
// { name: { required: true }, 'address.street': { required: true } }

// Async validation
const uniqueUsername = asyncFieldValidator<string>(async (value) => {
  const taken = await checkUsername(value);
  return taken ? { taken: { message: 'Taken.' } } : null;
});

// FormArray dirty state
const tags = new FormArray([new FormControl('a')]);
const dirty = injectFormArrayDirtyState(tags);
dirty.isDirty(); // Signal<boolean>

// Toggle array item
arrayToggleItem(tags, 'b'); // adds
arrayToggleItem(tags, 'a'); // removes
```
