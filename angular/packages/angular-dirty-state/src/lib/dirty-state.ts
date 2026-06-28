import { DestroyRef, inject, signal } from '@angular/core';
import type { CanDeactivateFn } from '@angular/router';
import type { DirtyGuardOptions, DirtyStateHandle } from './types';

export function injectDirtyState(): DirtyStateHandle {
  const destroyRef = inject(DestroyRef);
  const isDirty = signal(false);

  function markDirty(): void {
    isDirty.set(true);
  }

  function markClean(): void {
    isDirty.set(false);
  }

  function reset(): void {
    markClean();
  }

  function snapshot(): Record<string, unknown> {
    return { dirty: isDirty() };
  }

  destroyRef.onDestroy(() => {
    isDirty.set(false);
  });

  return {
    isDirty: isDirty.asReadonly(),
    markDirty,
    markClean,
    reset,
    snapshot,
  };
}

/**
 * Creates a `CanDeactivateFn` that prompts the user when the component
 * has unsaved changes. Integrates with Angular Router's `canDeactivate`.
 *
 * Usage in route config:
 * ```typescript
 * const component = inject(SomeComponent);
 * canDeactivate: [injectDirtyGuard(component.dirtyState)]
 * ```
 */
export function injectDirtyGuard(
  handle: DirtyStateHandle,
  options?: DirtyGuardOptions,
): CanDeactivateFn<unknown> {
  return () => {
    if (!handle.isDirty()) {
      return true;
    }
    const message = options?.message ?? 'You have unsaved changes. Discard them?';
    return confirm(message);
  };
}
