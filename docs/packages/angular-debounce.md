# `@hexguard/angular-debounce` Deep Dive

This page complements the npm-facing README with repo-specific implementation notes and behavior details.

## Purpose

`@hexguard/angular-debounce` provides a single signal-based debounce primitive — one factory function and one interface — without pulling in RxJS or requiring an injection context.

The package is intentionally narrow:

- one `debouncedSignal()` factory function
- three edge modes: trailing-only (default), leading-only, and both edges
- imperative `flush()` and `cancel()` control
- `isPending` signal for UI indicators
- no RxJS dependency, no component wrappers, no directives

## Feature Matrix

| Capability                       | Status    | Notes                                                    |
| -------------------------------- | --------- | -------------------------------------------------------- |
| Trailing-only debounce (default) | Available | Emits `dueTime` ms after the last `set()` call           |
| Leading-only debounce            | Available | Emits immediately on every `set()`, no trailing emission |
| Both edges                       | Available | Emits immediately on `set()` and again after settling    |
| `isPending` signal               | Available | Tracks whether a trailing flush is scheduled             |
| `flush()`                        | Available | Immediately emits the current pending value              |
| `cancel()`                       | Available | Cancels pending timeout without emitting                 |
| Zero dependencies                | ✅        | Only `@angular/core` + `tslib`                           |

## Public API Map

| Export              | Role                                              |
| ------------------- | ------------------------------------------------- |
| `debouncedSignal()` | Creates a debounced signal handle                 |
| `DebounceOptions`   | Configures `leading` and `trailing` edge behavior |
| `DebouncedValue`    | Handle shape with signals and imperative methods  |

## Behavior Details

### Edge Modes

| Mode               | `leading` | `trailing` | Behavior                                                                                                                                                                                  |
| ------------------ | --------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Trailing (default) | `false`   | `true`     | Every `set()` restarts a `dueTime` timer. The value emits when the timer expires without further changes. This is the standard debounce used for search-as-you-type.                      |
| Leading only       | `true`    | `false`    | Every `set()` immediately updates the output signal. No timer is started. Good for immediate feedback where you still want to batch a downstream effect separately.                       |
| Both edges         | `true`    | `true`     | Each `set()` immediately emits (leading) and also restarts the timer for a trailing emission. Good for form inputs that should feel responsive while still debouncing validation or sync. |

### Leading-Only vs Both Edges

The critical difference is trailing behavior:

- **Leading-only**: only emits on `set()`. If the source never changes again, the last value is the last emission. No trailing timer runs.
- **Both edges**: emits on `set()` (leading) AND again after `dueTime` ms of inactivity (trailing). Two emissions per input burst — one immediate, one delayed.

### Timer Lifecycle

1. `set(value)` stores `value` as `lastSetValue` and starts/restarts the debounce timer
2. When the timer fires: output signal updates to `lastSetValue`, `isPending` becomes `false`
3. `flush()`: clears timer, emits `lastSetValue` immediately, sets `isPending` to `false`
4. `cancel()`: clears timer without emitting, sets `isPending` to `false`

### Thread Safety

JavaScript is single-threaded, so `set()`, `flush()`, and `cancel()` are mutually exclusive in practice. The `lastSetValue` closure variable is only accessed from synchronous callbacks, so there are no race conditions.

## Option Resolution and Defaults

```ts
const defaults: Required<DebounceOptions> = {
  leading: false,
  trailing: true,
};

const opts = { ...defaults, ...userOptions };
```

Invalid option combinations (e.g. both `leading: false` and `trailing: false`) are not validated — defaults apply for each dimension independently. If both are `false`, the signal never updates after initialization.

## Configuration Reference

### `debouncedSignal<T>(initialValue, dueTime, options?)`

| Parameter      | Required | Description                                          |
| -------------- | -------- | ---------------------------------------------------- |
| `initialValue` | yes      | The initial value exposed by `value()` until `set()` |
| `dueTime`      | yes      | Debounce delay in milliseconds                       |
| `options`      | no       | Optional leading/trailing edge configuration         |

Returns `DebouncedValue<T>`.

### `DebounceOptions`

| Field      | Type      | Default | Description                           |
| ---------- | --------- | ------- | ------------------------------------- |
| `leading`  | `boolean` | `false` | Emit immediately on `set()`           |
| `trailing` | `boolean` | `true`  | Emit after `dueTime` ms of inactivity |

### `DebouncedValue<T>`

```ts
interface DebouncedValue<T> {
  readonly value: Signal<T>;
  readonly isPending: Signal<boolean>;
  set(value: T): void;
  flush(): void;
  cancel(): void;
}
```

### Usage Examples

**Basic trailing debounce (search input):**

```ts
const search = debouncedSignal('', 300);

function onInput(value: string): void {
  search.set(value);
}

effect(() => {
  api.search(search.value()); // runs 300ms after the last keystroke
});
```

**Leading-edge for immediate feedback:**

```ts
const counter = debouncedSignal(0, 1000, { leading: true, trailing: false });

counter.set(counter.value() + 1); // updates immediately on every click
```

**Both edges for responsive forms:**

```ts
const formValue = debouncedSignal(initialData, 500, { leading: true, trailing: true });

formValue.set(newData); // renders immediately, also debounces save
```

## Comparison with RxJS debounce

| Aspect             | `@hexguard/angular-debounce`   | RxJS `debounceTime`                              |
| ------------------ | ------------------------------ | ------------------------------------------------ |
| Dependency         | `@angular/core` only           | `rxjs` + `rxjs` operators                        |
| Injection context  | Not needed                     | Needs subscription management                    |
| Imperative control | `flush()`, `cancel()` built-in | Manual `Subject` + subscription                  |
| Signal output      | Native `Signal<T>`             | `toSignal()` conversion needed                   |
| Edge modes         | Leading, trailing, both        | `debounceTime` (trailing only) or `throttleTime` |

Choose this package when you want a native signal debounce without RxJS. Choose RxJS when you're already using observables in the same pipeline.

## Related Resources

- [Package README](../../angular/packages/angular-debounce/README.md)
- [Package Catalog](../README.md)
- [Demo Routes](../../angular/apps/demo-angular/src/app/features/packages/angular/angular-debounce/)
- [Source Code](../../angular/packages/angular-debounce/src/)

---

## API Review Findings

Review date: 2026-06-22. Findings are observational — no code has been changed.

### Observations

| Dimension                 | Finding                                                                                                                                                                                                                                                                                          | Severity |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| Public API Design         | Extremely tight API — exactly 3 exports (`debouncedSignal`, `DebounceOptions`, `DebouncedValue`). No internal helpers leaked.                                                                                                                                                                    | praise   |
| Public API Design         | `debouncedSignal()` has JSDoc with two `@example` tags (trailing + both-edges). `DebounceOptions` and `DebouncedValue` have field-level JSDoc with `@default` tags.                                                                                                                              | praise   |
| Public API Design         | No injection context needed — pure function with no Angular DI dependency. Truly headless.                                                                                                                                                                                                       | praise   |
| Public API Design         | `{leading: false, trailing: false}` silently produces a dead signal with no runtime validation or warning. Deep-dive documents this but no enforcement.                                                                                                                                          | minor    |
| Implementation Quality    | Signal-first: `signal<T>()` from `@angular/core`, returns `.asReadonly()` for both `value` and `isPending`. No RxJS.                                                                                                                                                                             | praise   |
| Implementation Quality    | Proper timer management with `clearTimer()` helper. Uses `globalThis.setTimeout` for platform safety.                                                                                                                                                                                            | praise   |
| Implementation Quality    | Trailing-only mode optimizes `isPending` signal to avoid unnecessary emissions (`pending.set(true)` only when `!pending()`).                                                                                                                                                                     | praise   |
| Implementation Quality    | Inconsistent closure capture: trailing-only mode uses the `value` parameter directly in the timer callback, while both-edges mode uses `lastSetValue`. Same outcome but diverging patterns.                                                                                                      | minor    |
| Implementation Quality    | No guard against negative `dueTime` — consumer could pass `-100` and timer would fire immediately (or throw).                                                                                                                                                                                    | minor    |
| Implementation Quality    | `as Required<DebounceOptions>` cast is technically type-unsafe if someone passes `undefined` fields — safe due to spread defaults but fragile.                                                                                                                                                   | minor    |
| Documentation             | README covers quickstart, features table, demo route, full API reference, scope boundaries.                                                                                                                                                                                                      | praise   |
| Documentation             | Deep-dive doc covers edge-mode comparison table, option resolution, configuration reference, usage examples, RxJS comparison. Excellent depth.                                                                                                                                                   | praise   |
| Test Coverage             | 13 test cases covering: initial value, delay emission, rapid set() reset, isPending tracking (trailing/leading/both), flush(), cancel(), set() timing. Uses `vi.useFakeTimers()`.                                                                                                                | praise   |
| Test Coverage             | Not tested: `flush()` in both-edges or leading-only mode, `cancel()` in both-edges or leading-only mode, `flush()` followed by `set()`, `cancel()` followed by `set()`, negative/zero `dueTime`, `{leading: false, trailing: false}` dead-signal, `computed()` derived from `debounced.value()`. | moderate |
| Demo Integration          | Interactive demo showing 3 debounce instances (trailing, leading, both-edges) with live value, pending indicators, flush/cancel buttons.                                                                                                                                                         | praise   |
| Demo Integration          | Stable `data-testid` attributes on all elements. Inspector panel with JSON snapshot.                                                                                                                                                                                                             | praise   |
| Demo Integration          | **No snippet entry in `generate-demo-snippets.mjs`** — code panel will show "snippet not found" or similar error. Demo code panel is broken.                                                                                                                                                     | moderate |
| Demo Integration          | No Playwright test for interactive demo behavior (typing, verifying debounce delays, clicking flush/cancel).                                                                                                                                                                                     | minor    |
| Cross-package Consistency | Build scripts, angular.json registration, CHANGELOG, LICENSE all present. Release workflow exists.                                                                                                                                                                                               | praise   |
| Cross-package Consistency | Root `package.json` missing proxy scripts (`angular:build:lib:debounce`, `angular:test:lib:debounce`, `angular:verify:package:debounce`, `build:lib:debounce`, `test:lib:debounce`, `verify:package:debounce`). All newer packages have these.                                                   | moderate |

### Improvement & Extension Opportunities

| Area       | Suggestion                                                                                                                                                                                                               | Type        | Difficulty |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------- | ---------- |
| Demos      | Add missing snippet entry in `generate-demo-snippets.mjs` for `angular-debounce/demo-state`.                                                                                                                             | improvement | easy       |
| Infra      | Add root `package.json` proxy scripts for debounce (`angular:build:lib:debounce`, `angular:test:lib:debounce`, `angular:verify:package:debounce`, `build:lib:debounce`, `test:lib:debounce`, `verify:package:debounce`). | improvement | easy       |
| Tests      | Add `flush()` tests for both-edges and leading-only modes.                                                                                                                                                               | improvement | easy       |
| Tests      | Add `cancel()` tests for both-edges and leading-only modes.                                                                                                                                                              | improvement | easy       |
| Tests      | Add `{leading: false, trailing: false}` dead-signal test.                                                                                                                                                                | improvement | easy       |
| Tests      | Add negative/zero `dueTime` edge case test.                                                                                                                                                                              | improvement | easy       |
| Tests      | Add derived signal (`computed()` from `debounced.value()`) test.                                                                                                                                                         | improvement | easy       |
| Tests      | Add Playwright E2E test for interactive debounce demo (type input, verify timing, click flush/cancel).                                                                                                                   | improvement | medium     |
| Robustness | Add runtime validation or `console.warn` for `{leading: false, trailing: false}` and negative `dueTime`.                                                                                                                 | improvement | easy       |
| Extension  | Two-way binding support via writable source creation (noted in CHANGELOG but not demonstrated in docs).                                                                                                                  | extension   | easy       |
| Extension  | ✅ Added RxJS observable variant — `debouncedObservable<T>(source$, dueTime, options?)` returns `Observable<T>` with same leading/trailing edge modes. Import from `@hexguard/angular-debounce`.                         | extension   | completed  |

## RxJS Observable API

For consumers using RxJS, `debouncedObservable()` mirrors `debouncedSignal()` but takes an input `Observable<T>` and returns an `Observable<T>`:

```ts
import { debouncedObservable } from '@hexguard/angular-debounce';
import { Subject } from 'rxjs';

const search$ = new Subject<string>();
const debounced$ = debouncedObservable(search$, 300);

const sub = debounced$.subscribe((value) => {
  api.search(value); // 300ms after last emission
});

search$.next('a');
search$.next('ab');
search$.next('abc');
// After 300ms: logs 'abc'

// Later: sub.unsubscribe() cleans up both the source subscription and timer
```

Same edge modes as the signal variant:

```ts
// Leading-only: emit immediately on each source emission
const leading$ = debouncedObservable(source$, 1000, { leading: true, trailing: false });

// Both edges: emit immediately + after settling
const both$ = debouncedObservable(source$, 500, { leading: true, trailing: true });
```
