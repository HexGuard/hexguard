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
