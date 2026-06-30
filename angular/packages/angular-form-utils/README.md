# @hexguard/angular-form-utils

**Form utility helpers for Angular.** Cross-field validators, form dirty state tracking, unsaved-changes route guard, error aggregation, and async validation.

---

## Installation

```bash
pnpm add @hexguard/angular-form-utils
```

## API

### Cross-field validators

```typescript
// Fields must match (confirm-password)
fieldsEqual('password', 'confirmPassword');

// Fields must differ
fieldsNotEqual('newEmail', 'currentEmail');

// Field required when condition met
requiredIf('reason', (v) => v === 'other');

// At least one field must have a value
requiresAtLeastOne(['phone', 'email']);
```

### Form dirty state

```typescript
const form = new FormGroup({ name: new FormControl('') });
const dirty = injectFormDirtyState(form);

dirty.isDirty();        // Signal<boolean>
dirty.controlStates();  // Signal<Record<string, boolean>>
dirty.markControlClean('name');
dirty.markControlDirty('name');
dirty.resetAll();
```

### Unsaved changes guard

```typescript
const route: Route = {
  path: 'editor',
  component: EditorComponent,
  canDeactivate: [() => formUnsavedGuard(editor.dirty, 'Custom message?')],
};
```

### Error aggregation

```typescript
import { aggregateFormErrors } from '@hexguard/angular-form-utils';

const form = new FormGroup({
  name: new FormControl('', [Validators.required]),
  address: new FormGroup({
    street: new FormControl('', [Validators.required]),
  }),
});

const errors = aggregateFormErrors(form);
// { name: { required: true }, 'address.street': { required: true } }
```

Recursively walks the form tree and returns a flat map of control path → errors. Root-level validator errors appear under `"(root)"`.

### Async validator wrapper

```typescript
import { asyncFieldValidator } from '@hexguard/angular-form-utils';

const usernameTaken = asyncFieldValidator<string>(async (value) => {
  const exists = await checkUsername(value);
  return exists ? { usernameTaken: { message: `"${value}" is taken.` } } : null;
});

const form = new FormGroup({
  username: new FormControl('', { asyncValidators: usernameTaken }),
});
```

Wraps an async validation function into an Angular `AsyncValidatorFn`. The function receives the current control value and the control itself, and returns a `Promise<ValidationErrors | null>`.

### Template pipes

```typescript
import { IsInvalidPipe, FormErrorPipe } from '@hexguard/angular-form-utils';
```

```html
<!-- Show error only when control is touched AND invalid -->
@if (form.get('name') | isInvalid) {
  <p class="error">Name is required.</p>
}

<!-- Extract a specific error by key -->
@if (form.get('email') | formError:'required'; as err) {
  <p>{{ err.message }}</p>
}

<!-- Get all errors as a map -->
<pre>{{ form.get('email') | formError | json }}</pre>
```

| Concern | Status |
|---------|--------|
| cross-field validators (4 factories) | ✅ |
| injectFormDirtyState / formUnsavedGuard | ✅ |
| aggregateFormErrors / asyncFieldValidator | ✅ |
| FormArray helpers (5 functions) | ✅ |
| controlSignal / isControlInvalid / formDiff | ✅ |
| IsInvalidPipe / FormErrorPipe | ✅ |
| Template-driven forms | ❌ (Reactive Forms only) |

## Demo

Visit `/packages/angular-form-utils/demo` to test form validators, dirty state, error aggregation, async validation, and FormArray helpers.
