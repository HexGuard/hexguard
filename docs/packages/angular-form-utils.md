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
- `moveArrayItem(array, fromIndex, toIndex)` — Move an item to a new position (reorder).
- `syncArrayValues(array, values, toControl?)` — Sync FormArray to match an ordered set of values, preserving existing controls.
- `controlSignal(form, path)` — Create a typed `Signal<T>` from a form control's value at a dotted path.
- `isControlInvalid(control)` — `touched && invalid` shorthand for template validation display.
- `formDiff(initial, current)` — Deep partial diff between two form value snapshots.
- `IsInvalidPipe` — `| isInvalid` pipe: `touched && invalid` in templates.
- `FormErrorPipe` — `| formError` pipe: extract all or specific validation errors by key.

## Assessment

| Area | Suggestion | Priority |
|------|-----------|----------|
| Tests | Missing: formUnsavedGuard with confirm | Low |
| API | All form utilities + pipes | ✅ Complete |

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

// FormArray helpers
const tags = new FormArray([new FormControl('a')]);
const dirty = injectFormArrayDirtyState(tags);
dirty.isDirty(); // Signal<boolean>
arrayToggleItem(tags, 'b');     // adds → ['a', 'b']
arrayToggleItem(tags, 'a');     // removes → ['b']
moveArrayItem(tags, 0, 1);      // reorder
syncArrayValues(tags, ['x', 'y']); // sync → ['x', 'y']

// Control signal — typed signal from a form control value
const street = controlSignal(form, 'address.street');
effect(() => console.log('Street:', street()));

// Touch+invalid shorthand
if (isControlInvalid(form.get('name'))) { /* show error */ }

// Deep partial diff
const diff = formDiff(initialValues, form.value);
// → only changed keys
```
