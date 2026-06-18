# @hexguard/angular-debounce

Debounced value signal primitive for Angular: wraps a source signal and produces a throttled output with configurable leading and trailing edge behavior.

**[Deep package notes](https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-debounce.md)** ·
**[Demo routes](#demo-routes)** ·
**[Installation](#installation)**

## Installation

```bash
pnpm add @hexguard/angular-debounce
# No RxJS dependency required
```

## Quickstart

```ts
import { debouncedSignal } from '@hexguard/angular-debounce';

// Trailing-only debounce (default): emits 300ms after the last change
const search = debouncedSignal('', 300);

// In an input handler:
search.set('search term');

// In a component template or effect:
console.log(search.value()); // debounced output
console.log(search.isPending()); // true while timer is active
```

## Features

| Feature                         | Status | Notes                                              |
| ------------------------------- | ------ | -------------------------------------------------- |
| Trailing-only debounce          | ✅     | Default mode — emits after `dueTime` of inactivity |
| Leading-only debounce           | ✅     | Emits immediately on each change, no trailing      |
| Both edges (leading + trailing) | ✅     | Emits on change and again after settling           |
| `isPending` signal              | ✅     | Tracks whether a trailing flush is scheduled       |
| `flush()`                       | ✅     | Immediately emits the current pending value        |
| `cancel()`                      | ✅     | Cancels pending timeout without emitting           |
| Zero dependencies               | ✅     | Only `@angular/core` + `tslib`                     |

## Demo routes

| Route                        | Description                                                    |
| ---------------------------- | -------------------------------------------------------------- |
| `/packages/angular-debounce` | Debounce demo with trailing, leading, and both-edge comparison |

## What It Owns

- One signal-based debounce primitive with three edge modes
- Imperative `flush()` and `cancel()` control
- `isPending` signal for UI indicators

## What It Does Not Own

- Observable or RxJS interop — use native `toSignal`/`toObservable` if needed
- Auto-watching external signals — the consumer calls `set()` explicitly
- Component or directive wrappers — this is a headless primitive

## API Reference

### `debouncedSignal<T>(initialValue, dueTime, options?)`

Creates a debounced signal handle.

**Parameters:**

- `initialValue: T` — The initial value.
- `dueTime: number` — Debounce delay in milliseconds.
- `options?: DebounceOptions` — `{ leading?: boolean, trailing?: boolean }`. Defaults to `{ leading: false, trailing: true }`.

**Returns:** `DebouncedValue<T>`

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
