# @hexguard/angular-form-utils

**Form utility helpers for Angular.** Cross-field validators, form dirty state tracking, and unsaved-changes route guard.

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

## Scope Boundaries

| Concern | Status |
|---------|--------|
| cross-field validators (4 factories) | ✅ |
| injectFormDirtyState | ✅ |
| formUnsavedGuard | ✅ |
| Template-driven forms | ❌ (Reactive Forms only) |
| Async validators | ❌ (v0.2) |
| FormArray helpers | ❌ (v0.2) |

## Demo

Visit `/packages/angular-form-utils/demo` to test form validators and dirty state.
