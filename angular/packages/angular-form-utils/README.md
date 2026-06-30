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

### FormArray helpers

FormArray manipulation and dirty-state tracking — see the full API in the [source file](src/lib/form-array.ts) or the [deep-doc](../../docs/packages/angular-form-utils.md).

### Control & diff utilities

```typescript
// Typed Signal from a form control at a dotted path
const name$ = controlSignal(form, 'name');        // Signal<string>
const street$ = controlSignal(form, 'address.street');

// touched && invalid shorthand
isControlInvalid(form.get('name')); // boolean

// Deep partial diff between two form value snapshots
formDiff({ name: 'Alice' }, { name: 'Bob' }); // → { name: 'Bob' }

// Reactive form status signal
const status = formStatusSignal(form);           // Signal<'VALID'|'INVALID'|'PENDING'|'DISABLED'>

// Standardized form submit handler
const submit = formSubmitHandler(form, () => this.save());
// Template: <button (click)="submit()">Save</button>
```

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

### Template directive

```html
<!-- Shows content only when control is touched AND invalid -->
<p *showFormError="form.get('name')">Name is required.</p>

<!-- With error context -->
<p *showFormError="form.get('email'); let err">
  {{ err?.required ? 'Required' : err?.email ? 'Invalid format' : 'Error' }}
</p>
```

Import `ShowFormErrorDirective` and add it to your component's `imports` array. The directive subscribes to `valueChanges` and `statusChanges` so the view updates automatically.

## New APIs

### `injectFormArray<T>()` — Typed FormArray wrapper

```typescript
const items = injectFormArray<FormControl<string>>(() => [
  new FormControl('a', { nonNullable: true }),
  new FormControl('b', { nonNullable: true }),
]);

items.length();      // Signal<number>
items.value();       // Signal<string[]>
items.dirty();       // Signal<boolean>
items.valid();       // Signal<boolean>

items.push(new FormControl('c', { nonNullable: true }));
items.remove(0);
items.insert(1, new FormControl('x', { nonNullable: true }));
items.move(0, 2);    // Move first to third position
items.swap(0, 1);    // Swap first and second
items.clear();
items.reset();
items.at(0);         // FormControl<string> | undefined
```

### `injectFormField<T>()` — Signal facade for a form control

```typescript
const form = new FormGroup({ name: new FormControl('') });
const name = injectFormField<string>(form, 'name');

name.value();        // Signal<string> — reads control value
name.setValue('x');  // updates control (signal follows via valueChanges)
name.isInvalid();    // Signal<boolean> — touched && invalid
name.errors();       // Signal<ValidationErrors | null>
name.isDirty();      // Signal<boolean>
name.isDisabled();   // Signal<boolean>
name.isPending();    // Signal<boolean> — async validation in progress
name.markAsTouched();// shows validation errors
```

### `injectFormSubmission()` — Submit lifecycle

```typescript
const form = new FormGroup({ name: new FormControl('', [Validators.required]) });
const sub = injectFormSubmission(form, async () => {
  await this.api.save(form.value);
});

// Template:
// <button (click)="sub.submit()" [disabled]="sub.disabled()">Save</button>
// @if (sub.submitting()) { <spinner /> }
// @if (sub.error(); let err) { <error [message]="err" /> }

sub.submitting();  // Signal<boolean>
sub.disabled();    // Signal<boolean> — submitting || form.disabled
sub.error();       // Signal<unknown> — last submit error
sub.submit();      // () => Promise<void> — double-submit safe
```

### `debouncedServerValidator()` — Debounced async validation

```typescript
const validator = debouncedServerValidator<string>(async (username) => {
  const taken = await checkUsername(username);
  return taken ? { usernameTaken: true } : null;
}, 400);

const form = new FormGroup({
  username: new FormControl('', { asyncValidators: validator }),
});
```

Cancels the previous pending request when a new value is emitted, making it safe for server-side uniqueness checks.

### `createControlValueAccessor<T>()` — Custom form control CVA helper

```typescript
import { createControlValueAccessor, provideControlValueAccessor } from '@hexguard/angular-form-utils';

@Component({
  selector: 'app-rating',
  standalone: true,
  providers: [provideControlValueAccessor(RatingComponent)],
  template: `...`,
})
class RatingComponent implements ControlValueAccessor {
  readonly cva = createControlValueAccessor(0);
  readonly value = this.cva.value;     // Signal<number>
  readonly disabled = this.cva.disabled; // Signal<boolean>

  writeValue(v: number): void { this.cva.writeValue(v); }
  registerOnChange(fn: any): void { this.cva.registerOnChange(fn); }
  registerOnTouched(fn: any): void { this.cva.registerOnTouched(fn); }
  setDisabledState(d: boolean): void { this.cva.setDisabledState(d); }

  // Call in template:
  // (input)="cva.onChange($any($event).value)" (blur)="cva.onTouched()"
}
```

Saves ~25 lines of `ControlValueAccessor` boilerplate per custom form control. The `onChange()` and `onTouched()` methods update both the signals and Angular's forms.

### `injectValidator<T>()` — Custom control validator helper

```typescript
import { injectValidator } from '@hexguard/angular-form-utils';

@Component({
  selector: 'app-color-picker',
  standalone: true,
  providers: [validators.providers],
  template: `...`,
})
class ColorPickerComponent implements Validator {
  readonly validators = injectValidator<string>(
    (value) => ALLOWED_COLORS.includes(value) ? null : { invalidColor: true },
    async (value) => serverCheck(value) ? { colorTaken: true } : null, // optional
  );

  validate(control: AbstractControl): ValidationErrors | null {
    return this.validators.validate(control);
  }
}
```

Eliminates `NG_VALIDATORS` and `NG_ASYNC_VALIDATORS` provider boilerplate from custom form controls.

### `injectFormArrayItem()` — FormArray item context

```typescript
const items = injectFormArray<FormControl<string>>(() => [...]);

// Inside @for loop:
// <button (click)="ctx.removeSelf()">Remove</button>
// <button (click)="ctx.moveUp()" [disabled]="ctx.isFirst()">↑</button>
const ctx = injectFormArrayItem(items, computed(() => index()));
ctx.index();      // Signal<number>
ctx.isFirst();    // Signal<boolean>
ctx.isLast();     // Signal<boolean>
ctx.removeSelf(); // Remove this item
ctx.moveUp();     // Move toward index 0
ctx.moveDown();   // Move toward the end
```

### `controlErrorMessages()` — Reactive error message mapping

```typescript
readonly emailErrors = controlErrorMessages(form.get('email')!, {
  required: 'Email is required.',
  email: 'Enter a valid email address.',
  emailTaken: (err) => `"${err.value}" is already in use.`,
});

// Template:
// @for (msg of emailErrors(); track msg) {
//   <p class="error">{{ msg }}</p>
// }
```

Returns a `Signal<string[]>` that updates automatically when the control's errors change.

### Scope Boundaries

| Concern | Status |
|---------|--------|
| cross-field validators (4 factories) | ✅ |
| injectFormDirtyState / formUnsavedGuard | ✅ |
| aggregateFormErrors / asyncFieldValidator / debouncedServerValidator | ✅ |
| injectValidator — custom control validator helper | ✅ |
| FormArray helpers — injectFormArray, injectFormArrayItem, dirty state, toggle, move, sync | ✅ |
| injectFormField / injectFormSubmission | ✅ |
| controlErrorMessages — reactive error mapping | ✅ |
| createControlValueAccessor / provideControlValueAccessor | ✅ |
| controlSignal / isControlInvalid / formDiff / formStatusSignal / formSubmitHandler | ✅ |
| IsInvalidPipe / FormErrorPipe | ✅ |
| ShowFormErrorDirective | ✅ |
| Template-driven forms | ❌ (Reactive Forms only) |
| Template-driven forms | ❌ (Reactive Forms only) |

## Demo

Visit `/packages/angular-form-utils/demo` to test form validators, dirty state, error aggregation, async validation, and FormArray helpers.
