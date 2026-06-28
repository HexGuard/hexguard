# @hexguard/angular-dirty-state — Deep Package Notes

Headless unsaved-change tracking for Angular: signal-based `isDirty` state with `markDirty`/`markClean`/`reset` controls and route deactivation guard integration.

## Problem

Forms and editors need to warn users about unsaved changes before navigating away. Manually wiring `beforeunload` events, route guards, and dirty-state tracking across components — often with inconsistent UX — leads to fragile code duplicated across every editable screen.

**`@hexguard/angular-dirty-state`** provides a single `injectDirtyState()` handle with `isDirty` signal, imperative dirty/clean/reset/snapshot controls, and `injectDirtyGuard()` that returns a `CanDeactivateFn` for Angular Router integration.

## API

- `isDirty: Signal<boolean>` — Whether tracked state has been modified.
- `markDirty()` — Mark state as dirty (e.g., on first field change).
- `markClean()` — Mark state as clean (e.g., after successful save).
- `reset()` — Reset state to the last snapshot baseline.
- `snapshot()` — Capture the current state as the baseline for future reset() calls.
- `injectDirtyGuard(handle, options?)` — Returns a `CanDeactivateFn`. Shows a `confirm()` dialog when `isDirty` is true.

---

## Assessment: Potential Improvements

| Area | Suggestion | Priority |
|------|-----------|----------|
| API | Consider adding `beforeunload` integration out of the box | Low |
| API | Consider reactive form auto-tracking in v0.2 | Medium |
| Tests | Missing test: `injectDirtyGuard` fires confirm when dirty | Low |
| Tests | Missing test: `injectDirtyGuard` bypasses confirm when clean | Low |

## Code Examples

### Basic dirty-state tracking

```typescript
import { injectDirtyState } from '@hexguard/angular-dirty-state';

@Component({ ... })
class DocumentEditorComponent {
  readonly dirty = injectDirtyState();

  onContentChange(): void {
    this.dirty.markDirty();
  }

  async onSave(): Promise<void> {
    await this.saveDocument();
    this.dirty.markClean();
  }
}
```

### Route guard integration

```typescript
import { injectDirtyState, injectDirtyGuard } from '@hexguard/angular-dirty-state';
import { Component } from '@angular/core';

@Component({ ... })
class ProfileEditorComponent {
  private readonly dirty = injectDirtyState();
  static guard = injectDirtyGuard(injectDirtyState());
}

// Route config:
// {
//   path: 'profile',
//   component: ProfileEditorComponent,
//   canDeactivate: [ProfileEditorComponent.guard],
// }
```

### Snapshot-based cancel

```typescript
@Component({ ... })
class OrderEditorComponent {
  readonly dirty = injectDirtyState();
  initialData: OrderData | null = null;

  loadOrder(data: OrderData): void {
    this.initialData = data;
    this.dirty.snapshot();
  }

  onCancel(): void {
    this.dirty.reset(); // revert to snapshot
  }
}
```
