# `@hexguard/angular-async-state`

Signal-first async value, live observable, and async action lifecycle state for Angular.

This package standardizes repeated boilerplate around loading, loaded, empty, reloading, pending,
success, failure, and duplicate-submit handling without forcing a component-first rendering model.

Additional in-repo guides:

- [Deep package notes](https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-async-state.md)
- [Package demo routes](https://github.com/HexGuard/hexguard/blob/main/docs/demo/README.md#async-state-demo-routes)
- [Demo runbook](https://github.com/HexGuard/hexguard/blob/main/docs/demo/README.md)
- [Package catalog and roadmap context](https://github.com/HexGuard/hexguard/blob/main/docs/packages/README.md)

## Installation

```bash
pnpm add @hexguard/angular-async-state rxjs
```

## Quickstart

```ts
import { asyncAction, asyncState, observableState } from '@hexguard/angular-async-state';
import { interval, map } from 'rxjs';

const orders = asyncState({
  initialValue: [] as string[],
  load: async () => ['HG-1042', 'HG-1049'],
});

const liveOrders = observableState({
  initialValue: [] as string[],
  source: () => interval(5_000).pipe(map(() => ['HG-1042', 'HG-1049'])),
});

const saveOrder = asyncAction<{ id: string }, { ok: true }>({
  run: async (payload) => ({ ok: payload.id.length > 0 }),
});

await orders.load();
orders.status();
orders.value();
orders.error();

liveOrders.connect();
liveOrders.status();
liveOrders.value();

await saveOrder.run({ id: 'HG-1042' });
saveOrder.pending();
saveOrder.lastResult();
```

## Feature Matrix

| Capability                                       | Status      | Notes                                                                                                         |
| ------------------------------------------------ | ----------- | ------------------------------------------------------------------------------------------------------------- |
| Async value lifecycle with `asyncState`          | Available   | Explicit `idle`, `loading`, `loaded`, `error`, and `reloading` state with derived emptiness.                  |
| Live observable lifecycle with `observableState` | Available   | Explicit `idle`, `connecting`, `live`, `error`, and `complete` state with retained last snapshot.             |
| Async action lifecycle with `asyncAction`        | Available   | Explicit `idle`, `pending`, `succeeded`, and `failed` state for submit or command flows.                      |
| One-shot observable actions                      | Available   | `asyncAction()` accepts Promise-like values or one-shot observables and still returns a promise from `run()`. |
| Duplicate-run control                            | Available   | `duplicateRunPolicy` defaults to `reuse`; `reject` throws `AsyncActionPendingError`.                          |
| Thin Angular outlet helpers                      | Available   | Optional standalone outlets render idle/loading/error/empty/reloading and action states.                      |
| Error mapping and custom empty rules             | Available   | `mapError` and `empty` keep the public contract typed without adding transport coupling.                      |
| Shared cache graph or query client               | Not planned | The package deliberately stops short of becoming a data-fetching or live-query cache library.                 |
| Automatic retry orchestration                    | Not planned | Retries and backoff remain application concerns or future companion-package work.                             |

## Demo Routes

This repository ships a package overview page plus three docs-grade demo routes for the public
API. Start the demo app from the repo root with `pnpm start`, then open:

- `/packages/angular-async-state`: package overview and demo catalog
- `/packages/angular-async-state/value`: first-load, empty, reload, and stale-data failure value flows
- `/packages/angular-async-state/observable`: live stream connect, reconnect, complete, and terminal error handling
- `/packages/angular-async-state/action`: submit-style pending, success, failure, and duplicate-run reuse flows

Route expectations and manual verification notes live in the [async state demo runbook section](https://github.com/HexGuard/hexguard/blob/main/docs/demo/README.md#async-state-demo-routes).

## What It Owns

- explicit async lifecycle state for fetch-like value flows
- explicit async lifecycle state for long-lived observable value flows
- explicit async lifecycle state for submit-like action flows
- per-handle duplicate-run control for actions
- reset and set-value ergonomics that keep state transitions inspectable
- optional thin template outlets over the same headless handles

## What It Does Not Own

- HTTP transport, rich RxJS orchestration, or Angular resource APIs
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

`AsyncStateOptions<TValue, TError>` fields:

| Field          | Required | Description                                                                                      |
| -------------- | -------- | ------------------------------------------------------------------------------------------------ |
| `initialValue` | yes      | Value exposed before the first successful load and restored by `reset()`                         |
| `load`         | yes      | Promise-returning loader invoked by both `load()` and `reload()`                                 |
| `empty`        | no       | Overrides the default empty-value rules when your domain has a different success-empty condition |
| `mapError`     | no       | Normalizes unknown thrown values into the public error type                                      |

`load()` and `reload()` reuse the same in-flight promise while the current request is pending.
Successful reload failures keep the last good value available while surfacing the new error.

```ts
type OrdersError = { message: string; retryable: boolean };

const orders = asyncState<string[], OrdersError>({
  initialValue: [],
  load: () => api.listOrderIds(),
  empty: (value) => value.length === 0,
  mapError: (error) => normalizeOrdersError(error),
});
```

Use `asyncState()` for finite read flows. If the value should keep streaming over time, switch to
`observableState()` instead of returning an observable from `load`.

### `observableState(options)`

Creates a typed live-value handle for multi-emission RxJS streams.

The returned handle exposes:

- `status`, `value`, `error`
- `hasValue`, `isEmpty`
- `isIdle`, `isConnecting`, `isLive`, `isError`, `isComplete`
- `connect()`, `disconnect()`, `reconnect()`, `reset()`

`ObservableStateOptions<TValue, TError>` fields:

| Field          | Required | Description                                                                                       |
| -------------- | -------- | ------------------------------------------------------------------------------------------------- |
| `initialValue` | yes      | Value exposed before the first emission and restored by `reset()`                                 |
| `source`       | yes      | Observable factory invoked whenever the handle opens a fresh connection                           |
| `empty`        | no       | Overrides the default empty-value rules when an emitted success value should still count as empty |
| `mapError`     | no       | Normalizes unknown terminal errors into the public error type                                     |

`observableState()` keeps one active subscription at a time. It does not coerce a stream into a
one-shot fetch model. The latest emitted value stays visible across terminal `error` and
`complete` states until the next reconnect or an explicit `reset()`.

```ts
type FeedSnapshot = { alerts: readonly string[]; updatedAt: string | null };

const alertsFeed = observableState<FeedSnapshot, Error>({
  initialValue: { alerts: [], updatedAt: null },
  source: () => monitoringApi.connectAlerts(),
  empty: (snapshot) => snapshot.alerts.length === 0,
  mapError: (error) => normalizeFeedError(error),
});
```

Keep `source` as a factory that can create a fresh observable per `connect()` or `reconnect()`.
Passing one already-consumed stream instance usually leads to confusing reconnect semantics.

### `asyncAction(options)`

Creates a typed async action handle for submit or command flows.

The returned handle exposes:

- `status`, `error`, `lastResult`
- `pending`, `isPending`, `isIdle`, `hasSucceeded`, `hasFailed`
- `run(...args)`, `reset()`

`AsyncActionOptions<TInput, TResult, TError>` fields:

| Field                | Required | Description                                                                                  |
| -------------------- | -------- | -------------------------------------------------------------------------------------------- |
| `run`                | yes      | Action body invoked by `run()`. It may return a Promise-like value or a one-shot observable  |
| `mapError`           | no       | Normalizes unknown thrown values into the public error type                                  |
| `duplicateRunPolicy` | no       | Chooses whether concurrent `run()` calls reuse the in-flight promise or reject with an error |

`duplicateRunPolicy` defaults to `reuse`, which means repeated `run()` calls while pending return
the same in-flight promise instead of starting another submission. `reject` returns a rejected
promise with `AsyncActionPendingError`. `run()` can return either a Promise-like result or a
one-shot observable. Observable sources resolve from their first emitted value and fail if they
complete without emitting.

```ts
import { defer } from 'rxjs';

type SaveError = { message: string };

const saveOrder = asyncAction<{ id: string }, { ok: true }, SaveError>({
  run: (payload) => defer(() => ordersApi.save(payload)),
  duplicateRunPolicy: 'reject',
  mapError: (error) => normalizeSaveError(error),
});
```

Even when `run` returns an observable, the handle still exposes a Promise-returning `run()` API.
Keep observable-returning actions finite and one-shot; long-lived streams belong in
`observableState()`.

### Template Outlets

The package exports two optional standalone template helpers:

- `HexguardAsyncStateOutletComponent`
- `HexguardAsyncActionOutletComponent`

They are intentionally thin. They render the same headless handles with explicit templates instead
of introducing their own hidden state model. `observableState()` stays headless in `0.1.x`; use
its signals directly when you need live-stream rendering.

The package also exports `AsyncStateOptions`, `ObservableStateOptions`, `AsyncActionOptions`,
`AsyncActionDuplicateRunPolicy`, `AsyncActionRunArgs`, and typed template-context interfaces for
consumers building wrapper abstractions on top of the headless handles or outlet components.

## Behavioral Notes

- `asyncState()` keeps `empty` as a derived concern rather than a separate lifecycle status.
- `observableState()` is the live-stream sibling for multi-emission RxJS flows where connect,
  disconnect, reconnect, and terminal states matter.
- Default empty detection treats `null`, `undefined`, empty strings, empty arrays, empty maps, and
  empty sets as empty values.
- First-load failures leave `hasLoaded()` false. Failed reloads keep the last successful value and
  mark the handle as `error` with `hasLoaded()` still true.
- `asyncAction()` keeps the last successful result visible across later failures until the next
  success or an explicit `reset()`.
- `asyncAction()` normalizes one-shot observables into the same Promise-returning `run()` contract
  used for Promise-based actions.
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
