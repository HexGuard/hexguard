# @hexguard/angular-dirty-state

**Headless unsaved-change tracking for Angular.** Signal-based `isDirty` state with `markDirty`/`markClean`/`reset` controls and route deactivation guard integration.

**[Deep package notes](docs/packages/angular-dirty-state.md)** · **[Demo](/packages/angular-dirty-state/demo)**

---

## Problem

Forms and editors need to warn users about unsaved changes before navigating away. Manually wiring `beforeunload` events, route guards, and dirty-state tracking across components leads to inconsistent UX and fragile code.

**`@hexguard/angular-dirty-state`** standardizes this into one injectable contract with `isDirty`, `markDirty()`, `markClean()`, `reset()`, `snapshot()`, and `injectDirtyGuard()` for route protection.

## Installation

```bash
pnpm add @hexguard/angular-dirty-state
```

## Quickstart

```typescript
import { injectDirtyState } from '@hexguard/angular-dirty-state';

const dirty = injectDirtyState();

dirty.isDirty(); // Signal<boolean> — starts false
dirty.markDirty();
dirty.isDirty(); // true
dirty.markClean();
dirty.isDirty(); // false
```

### Route guard

```typescript
import { injectDirtyGuard } from '@hexguard/angular-dirty-state';

@Component({ ... })
class EditorComponent {
  private readonly dirty = injectDirtyState();
  // Returns a CanDeactivateFn
  static guard = injectDirtyGuard(injectDirtyState());
}
```

## Use Cases

### Detect unsaved changes

```typescript
const dirty = injectDirtyState();

function onFieldChange(): void {
  dirty.markDirty();
}

function onSave(): void {
  // ... persist data ...
  dirty.markClean();
}
```

### Snapshot comparison

```typescript
const dirty = injectDirtyState();

function onBeginEdit(): void {
  dirty.snapshot(); // captures current state
  dirty.markDirty();
}

function onCancel(): void {
  dirty.reset(); // reverts to snapshot
}
```

## API

### `injectDirtyState()`

| Member | Type | Description |
|--------|------|-------------|
| `isDirty` | `Signal<boolean>` | Whether tracked state is dirty |
| `markDirty()` | `() => void` | Mark state as dirty |
| `markClean()` | `() => void` | Mark state as clean |
| `reset()` | `() => void` | Reset to the captured snapshot state |
| `snapshot()` | `() => void` | Capture current state baseline |

### `injectDirtyGuard(handle, options?)`

| Member | Type | Description |
|--------|------|-------------|
| `handle` | Return type of `injectDirtyState()` | The dirty state to monitor |
| `options.message` | `string?` | Custom confirmation message (default: `'You have unsaved changes. Are you sure you want to leave?'`) |

Returns a `CanDeactivateFn` for use in Angular route config.

## Scope Boundaries

| Concern | Status |
|---------|--------|
| isDirty signal with imperative controls | ✅ |
| Snapshot capture for baseline comparison | ✅ |
| injectDirtyGuard — route deactivation guard | ✅ |
| beforeunload browser event integration | ✅ |
| SSR-safe | ✅ |
| Automatic cleanup via DestroyRef | ✅ |
| Form-library integration (Reactive Forms, template forms) | ❌ (manual only) |
| Nested dirty-state composition | ❌ (v0.2) |

## Demo

Visit `/packages/angular-dirty-state/demo` to test dirty marking, clean/reset, snapshot capture, and route guard integration.
