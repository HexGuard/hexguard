---
id: feature-angular-debounce
type: feature
status: proposed
created: 2026-06-17
package: '@hexguard/angular-debounce'
---

# Angular Debounce Package

## Summary

Design `@hexguard/angular-debounce` as a tiny, focused Angular package for debounced value signals with configurable wait, leading/trailing invocation, distinct-until-changed semantics, and pending/ready state.

The repeated problem is that search-as-you-type, auto-save, and filter-on-input are among the most universal patterns in business Angular apps. Every team wraps `Subject.pipe(debounceTime, distinctUntilChanged)` with slightly different pending-indicator logic, leading-edge/trailing-edge behavior, and teardown semantics. A single, well-tested, signal-first primitive would eliminate this boilerplate.

## Goals

- Provide a single headless primitive: `debouncedSignal(source, options?)` returning a debounced output signal.
- Support configurable wait duration (ms), leading-edge, trailing-edge, and max-wait (throttle-like) behavior.
- Include a built-in `pending: Signal<boolean>` for showing spinner/indicator while debounce is active.
- Include built-in distinct-until-changed semantics to avoid unnecessary downstream updates.
- Compose naturally with `@hexguard/angular-url-state` (debounced URL sync), `@hexguard/angular-async-state` (debounce-then-fetch), and `@hexguard/angular-query-form` (debounced form submission).
- Keep the package tiny — one export, no dependencies beyond `@angular/core` and `tslib`.

## Non-Goals

- A general-purpose RxJS operator library or Subject wrapper.
- Replacing Angular's built-in `formGroup.valueChanges` debounce approaches.
- Building input directives or template utilities — those belong in companion packages or the demo.

## Decisions

- Prefer a signal-based API over RxJS pipes for ergonomic Angular integration.
- Keep leading and trailing as explicit options, not hidden flags.
- Treat distinct-until-changed as enabled by default with an opt-out flag.
- Keep the API surface to a single function export and one options interface.

## Proposed Public API

```ts
import { signal } from '@angular/core';
import { debouncedSignal } from '@hexguard/angular-debounce';

const searchInput = signal('');
const debounced = debouncedSignal(searchInput, {
  wait: 300,
  leading: false,
  trailing: true,
  distinctUntilChanged: true,
});

// Use in component
effect(() => {
  if (!debounced.pending()) {
    fetchResults(debounced.value());
  }
});

// In template
@if (debounced.pending()) {
  <span class="spinner" />
}

// Interface
interface DebouncedSignalOptions {
  wait: number;                          // debounce delay in ms
  leading?: boolean;                     // emit on leading edge (default false)
  trailing?: boolean;                    // emit on trailing edge (default true)
  maxWait?: number;                      // max time before forced emission
  distinctUntilChanged?: boolean;        // skip emit if value unchanged (default true)
}

interface DebouncedResult<T> {
  readonly value: Signal<T>;
  readonly pending: Signal<boolean>;
  flush(): void;                         // immediately emit current pending value
  cancel(): void;                        // cancel pending debounce without emitting
}
```

## Implementation Plan

### Phase 0: Foundation

1. Scaffold the publishable Angular library under `angular/packages/angular-debounce/` following existing conventions (package.json, ng-package.json, tsconfigs, `angular.json` registration).
2. Add build and test scripts to `angular/package.json` (`build:lib:debounce`, `test:lib:debounce`).

### Phase 1: Core Implementation

3. Implement `debouncedSignal()` using `effect()` + `setTimeout`/`clearTimeout` internally for signal-source tracking.
4. Implement leading-edge emit behavior (emit immediately, then debounce subsequent changes).
5. Implement trailing-edge emit behavior (emit after `wait` ms of no changes).
6. Implement `maxWait` for forced emission (throttle-like behavior when input keeps changing).
7. Implement `distinctUntilChanged` using signal value comparison.
8. Implement `pending` signal — becomes `true` when a change is detected and stays `true` until the trailing edge emits.
9. Implement `flush()` and `cancel()` control methods.
10. Implement proper cleanup on destroy (cancel pending timeout).
11. Add unit tests for: basic trailing debounce, leading emit, max-wait, distinct-until-changed, pending state transitions, flush, cancel, cleanup on destroy, rapid value changes, and edge cases (wait=0, single value, no changes).

### Phase 2: Demo & Docs

12. Add a demo route at `/packages/angular-debounce` showing:
    - Search-input with debounced value display and pending indicator
    - Leading vs trailing mode comparison
    - Max-wait forced emission demo
    - Integration demo with `@hexguard/angular-url-state` (if available) for debounced URL sync
13. Add Playwright coverage for the demo page.
14. Write the deep-dive doc at `docs/packages/angular-debounce.md`.
15. Update the npm-facing `README.md` with quickstart and API reference.

### Phase 3: Release

16. Add `verify:package:debounce` to `angular/package.json`.
17. Add `.github/workflows/release-angular-debounce.yml`.
18. Run `pnpm test:ci` and `pnpm build` for the full validation gate.

## Validation

- `pnpm test:lib:debounce` — unit tests for debounce timing, leading/trailing, pending, flush, cancel.
- `pnpm build:lib` — package builds successfully.
- `pnpm test:app` — demo app compiles.
- `pnpm test:e2e` — Playwright coverage for demo interactions.
- `pnpm verify:package:debounce` — tarball smoke test.

## Follow-Ups

- Evaluate whether a companion `debouncedInput()` directive for template-driven debounce belongs in a future version.
- Revisit RxJS interop helpers (`fromDebouncedSignal`, `toDebouncedSignal`) if demand arises.
- Consider adding an `autoFetch` composable that combines debounce with async-state for the common "debounce-then-fetch" pattern.
