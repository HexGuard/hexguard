# `@hexguard/angular-async-state`

Signal-first async value and async action lifecycle state for Angular.

This package standardizes repeated boilerplate around loading, loaded, empty, reloading, pending,
success, failure, and duplicate-submit handling without forcing a component-first rendering model.

Additional in-repo guides:

- [Deep package notes](https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-async-state.md)
- [Demo runbook](https://github.com/HexGuard/hexguard/blob/main/docs/demo/README.md)
- [Package catalog and roadmap context](https://github.com/HexGuard/hexguard/blob/main/docs/packages/README.md)

## Installation

```bash
pnpm add @hexguard/angular-async-state
```

## Quickstart

```ts
import { asyncAction, asyncState } from '@hexguard/angular-async-state';

const orders = asyncState({
  initialValue: [] as string[],
  load: async () => ['HG-1042', 'HG-1049'],
});

const saveOrder = asyncAction<{ id: string }, { ok: true }>({
  run: async (payload) => ({ ok: payload.id.length > 0 }),
});

await orders.load();
orders.status();
orders.value();
orders.error();

await saveOrder.run({ id: 'HG-1042' });
saveOrder.pending();
saveOrder.lastResult();
```

## Feature Matrix

| Capability                                | Status      | Notes                                                                                        |
| ----------------------------------------- | ----------- | -------------------------------------------------------------------------------------------- |
| Async value lifecycle with `asyncState`   | Available   | Explicit `idle`, `loading`, `loaded`, `error`, and `reloading` state with derived emptiness. |
| Async action lifecycle with `asyncAction` | Available   | Explicit `idle`, `pending`, `succeeded`, and `failed` state for submit or command flows.     |
| Duplicate-run control                     | Available   | `duplicateRunPolicy` defaults to `reuse`; `reject` throws `AsyncActionPendingError`.         |
| Thin Angular outlet helpers               | Available   | Optional standalone outlets render idle/loading/error/empty/reloading and action states.     |
| Error mapping and custom empty rules      | Available   | `mapError` and `empty` keep the public contract typed without adding transport coupling.     |
| Shared cache graph or query client        | Not planned | The package deliberately stops short of becoming a data-fetching cache library.              |
| Automatic retry orchestration             | Not planned | Retries and backoff remain application concerns or future companion-package work.            |

## What It Owns

- explicit async lifecycle state for fetch-like value flows
- explicit async lifecycle state for submit-like action flows
- per-handle duplicate-run control for actions
- reset and set-value ergonomics that keep state transitions inspectable
- optional thin template outlets over the same headless handles

## What It Does Not Own

- HTTP transport, RxJS orchestration, or Angular resource APIs
- shared cache graphs, normalized entities, or stale-while-revalidate policies
- automatic retry, polling, or deduplication across different handles
- backend validation or problem-details normalization
- one opinionated visual component library for loading and error UI

## API Reference

### `asyncState(options)`

Creates a typed async value handle for read or fetch flows.

The returned handle exposes:

- `status`, `value`, `error`
- `hasLoaded`, `hasValue`, `isEmpty`
- `isIdle`, `isLoading`, `isLoaded`, `isError`, `isReloading`
- `load()`, `reload()`, `setValue(value)`, `reset()`

`load()` and `reload()` reuse the same in-flight promise while the current request is pending.
Successful reload failures keep the last good value available while surfacing the new error.

### `asyncAction(options)`

Creates a typed async action handle for submit or command flows.

The returned handle exposes:

- `status`, `error`, `lastResult`
- `pending`, `isPending`, `isIdle`, `hasSucceeded`, `hasFailed`
- `run(...args)`, `reset()`

`duplicateRunPolicy` defaults to `reuse`, which means repeated `run()` calls while pending return
the same in-flight promise instead of starting another submission. `reject` returns a rejected
promise with `AsyncActionPendingError`.

### Template Outlets

The package exports two optional standalone template helpers:

- `HexguardAsyncStateOutletComponent`
- `HexguardAsyncActionOutletComponent`

They are intentionally thin. They render the same headless handles with explicit templates instead
of introducing their own hidden state model.

## Behavioral Notes

- `asyncState()` keeps `empty` as a derived concern rather than a separate lifecycle status.
- Default empty detection treats `null`, `undefined`, empty strings, empty arrays, empty maps, and
  empty sets as empty values.
- First-load failures leave `hasLoaded()` false. Failed reloads keep the last successful value and
  mark the handle as `error` with `hasLoaded()` still true.
- `asyncAction()` keeps the last successful result visible across later failures until the next
  success or an explicit `reset()`.
- `mapError` lets each handle normalize thrown values into a stable public error type.

## Validation

```bash
pnpm test:lib:async-state
pnpm build:lib:async-state
pnpm test:e2e
```

The demo routes are part of the validation story because they exercise the same public API surface
the package exports.

## Release Contract

- bump `angular/packages/angular-async-state/package.json`
- tag `angular-async-state-v<version>`
- let `.github/workflows/release-angular-async-state.yml` validate, publish, and create the release
