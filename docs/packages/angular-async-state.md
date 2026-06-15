# `@hexguard/angular-async-state` Deep Dive

This page complements the npm-facing README with repo-specific implementation notes and validation
guidance.

## Purpose

`@hexguard/angular-async-state` standardizes async lifecycle state for Angular without turning the
package into a cache client, transport abstraction, or opaque component library.

The package is intentionally narrow:

- explicit value lifecycle state through `asyncState()`
- explicit live observable lifecycle state through `observableState()`
- explicit action lifecycle state through `asyncAction()`
- thin optional Angular outlets over the same headless handles
- no built-in cache graph, retry engine, or transport integration

## Feature Matrix

| Capability                                       | Status      | Notes                                                                                            |
| ------------------------------------------------ | ----------- | ------------------------------------------------------------------------------------------------ |
| Async value lifecycle with `asyncState`          | Available   | Explicit value, error, idle/loading/loaded/error/reloading, and derived emptiness signals.       |
| Live observable lifecycle with `observableState` | Available   | Explicit connect/live/error/complete state for multi-emission RxJS streams.                      |
| Async action lifecycle with `asyncAction`        | Available   | Explicit pending, success, failure, and retained `lastResult` for submit-style actions.          |
| One-shot observable actions                      | Available   | `asyncAction()` can normalize one-shot observables while preserving a Promise-returning `run()`. |
| Duplicate-run control                            | Available   | `reuse` is the default; `reject` surfaces `AsyncActionPendingError`.                             |
| Thin Angular outlet helpers                      | Available   | Standalone outlet components render lifecycle templates without adding hidden behavior.          |
| Custom empty detection                           | Available   | `empty(value)` keeps emptiness domain-specific when default rules are not enough.                |
| Shared cache graph or request client             | Not planned | Keep that concern in application code or a future dedicated package.                             |
| Automatic retry and polling                      | Not planned | Those policies should stay explicit and app-owned in `0.1.x`.                                    |

## Public API Map

| Export                               | Role                                                          |
| ------------------------------------ | ------------------------------------------------------------- |
| `asyncState()`                       | Creates the async value lifecycle handle                      |
| `AsyncStateOptions`                  | Configures `initialValue`, `load`, `empty`, and `mapError`    |
| `AsyncState`                         | High-level handle shape for value-oriented async flows        |
| `AsyncStateStatus`                   | Value lifecycle status union                                  |
| `observableState()`                  | Creates the live observable lifecycle handle                  |
| `ObservableStateOptions`             | Configures `initialValue`, `source`, `empty`, and `mapError`  |
| `ObservableState`                    | High-level handle shape for observable live-value flows       |
| `ObservableStateStatus`              | Observable lifecycle status union                             |
| `HexguardAsyncStateOutletComponent`  | Thin standalone outlet for rendering one `AsyncState` handle  |
| `asyncAction()`                      | Creates the async action lifecycle handle                     |
| `AsyncActionOptions`                 | Configures `run`, `mapError`, and `duplicateRunPolicy`        |
| `AsyncAction`                        | High-level handle shape for action-oriented async flows       |
| `AsyncActionStatus`                  | Action lifecycle status union                                 |
| `AsyncActionDuplicateRunPolicy`      | Duplicate-run behavior union for `asyncAction()`              |
| `AsyncActionPendingError`            | Rejection type used by `duplicateRunPolicy: 'reject'`         |
| `HexguardAsyncActionOutletComponent` | Thin standalone outlet for rendering one `AsyncAction` handle |

The package also exports template-context types for consumers who want strongly typed templates
or wrapper abstractions on top of the outlet components.

## Lifecycle Models

### Async Values

`asyncState()` uses:

- `idle`
- `loading`
- `loaded`
- `error`
- `reloading`

`empty` is intentionally derived instead of becoming a separate lifecycle status. That keeps the
core value model stable while still supporting empty-state UI.

Key behavior:

- repeated `load()` or `reload()` calls while pending reuse the same in-flight promise
- first-load failures leave `hasLoaded()` false
- failed reloads keep the last successful value available and surface the new error
- `setValue()` moves the handle directly into `loaded`
- `reset()` returns the handle to its original `initialValue` and `idle` state

### Async Actions

`asyncAction()` uses:

- `idle`
- `pending`
- `succeeded`
- `failed`

Key behavior:

- repeated `run()` calls while pending default to `reuse`
- `duplicateRunPolicy: 'reject'` returns a rejected promise with `AsyncActionPendingError`
- `run()` accepts either a Promise-like result or a one-shot observable source
- observable actions resolve from the first emitted value and fail if the source completes empty
- failed runs keep the previous `lastResult()` available until `reset()` or a later success
- `reset()` clears `error`, `lastResult`, and returns the handle to `idle`

### Live Observable Values

`observableState()` uses:

- `idle`
- `connecting`
- `live`
- `error`
- `complete`

Key behavior:

- `connect()` starts one active subscription for the handle
- `disconnect()` tears down the current subscription and returns the handle to `idle`
- `reconnect()` tears down the previous stream, opens a fresh subscription, and preserves the last
  visible value until the next emission
- `error` and `complete` are terminal for the current subscription but retain the latest emitted
  value until `reset()` or the next reconnect
- `reset()` clears the last emitted value back to `initialValue` and returns the handle to `idle`

## Option Resolution and Defaults

`asyncState(options)` defaults:

- `empty`: treats `null`, `undefined`, empty strings, empty arrays, empty maps, and empty sets as empty
- `mapError`: identity cast of the thrown value

`asyncAction(options)` defaults:

- `duplicateRunPolicy`: `'reuse'`
- `mapError`: identity cast of the thrown value

`observableState(options)` defaults:

- `empty`: treats `null`, `undefined`, empty strings, empty arrays, empty maps, and empty sets as empty
- `mapError`: identity cast of the thrown value

Practical guidance:

- use `mapError` when callers should not see transport-specific thrown shapes
- use a custom `empty` predicate when a domain-specific “empty success” value differs from the default rules
- use `observableState()` when the latest value should keep updating over time rather than settling after one fetch
- keep `duplicateRunPolicy: 'reuse'` for most submit buttons and command triggers
- switch to `reject` only when duplicate submissions should fail loudly and intentionally

## Configuration Reference

### `AsyncStateOptions<TValue, TError>`

| Field          | Required | Description                                                                                      |
| -------------- | -------- | ------------------------------------------------------------------------------------------------ |
| `initialValue` | yes      | Value exposed before the first successful load and restored by `reset()`                         |
| `load`         | yes      | Promise-returning loader used by both `load()` and `reload()`                                    |
| `empty`        | no       | Overrides the default empty-value rules when your domain has a different success-empty condition |
| `mapError`     | no       | Normalizes unknown thrown values into the public error type                                      |

```ts
const orders = asyncState<string[], OrdersError>({
  initialValue: [],
  load: () => api.listOrderIds(),
  empty: (value) => value.length === 0,
  mapError: (error) => normalizeOrdersError(error),
});
```

Use `asyncState()` only for finite read flows. If the source keeps emitting over time, model it as
`observableState()` instead of returning an observable from `load`.

### `ObservableStateOptions<TValue, TError>`

| Field          | Required | Description                                                                                       |
| -------------- | -------- | ------------------------------------------------------------------------------------------------- |
| `initialValue` | yes      | Value exposed before the first emission and restored by `reset()`                                 |
| `source`       | yes      | Observable factory invoked whenever the handle opens a fresh connection                           |
| `empty`        | no       | Overrides the default empty-value rules when an emitted success value should still count as empty |
| `mapError`     | no       | Normalizes unknown terminal errors into the public error type                                     |

```ts
const alertsFeed = observableState<FeedSnapshot, FeedError>({
  initialValue: { alerts: [], updatedAt: null },
  source: () => monitoringApi.connectAlerts(),
  empty: (snapshot) => snapshot.alerts.length === 0,
  mapError: (error) => normalizeFeedError(error),
});
```

Keep `source` as a factory that can create a fresh observable per `connect()` or `reconnect()`.
That avoids reconnecting to an already-consumed stream instance.

### `AsyncActionOptions<TInput, TResult, TError>`

| Field                | Required | Description                                                                                 |
| -------------------- | -------- | ------------------------------------------------------------------------------------------- |
| `run`                | yes      | Action body invoked by `run()`. It may return a Promise-like value or a one-shot observable |
| `mapError`           | no       | Normalizes unknown thrown values into the public error type                                 |
| `duplicateRunPolicy` | no       | Chooses whether concurrent `run()` calls reuse the in-flight promise or reject              |

```ts
const saveOrder = asyncAction<{ id: string }, SaveResult, SaveError>({
  run: (payload) => defer(() => ordersApi.save(payload)),
  duplicateRunPolicy: 'reject',
  mapError: (error) => normalizeSaveError(error),
});
```

Even when `run` returns an observable, the handle still exposes a Promise-returning `run()` API.
Keep observable-returning actions finite and one-shot; long-lived streams belong in
`observableState()`.

## Template Outlets

The two outlet components are optional sugar over the same handles.

`HexguardAsyncStateOutletComponent` supports explicit templates for:

- idle
- loading
- first-load error
- empty
- reloading
- stale-data error companion content
- loaded value

`HexguardAsyncActionOutletComponent` supports explicit templates for:

- idle
- pending
- success
- error

`observableState()` intentionally has no dedicated outlet helper in `0.1.x`. Live-stream UIs tend
to vary more in how they render terminal states, reconnect controls, and incremental updates, so
the observable primitive stays headless for now.

These outlets do not own fetching, submitting, retries, or visual styling. They simply branch on
the handle state and provide typed template contexts.

## Internal Behavior Notes

- Both factories invoke `load()` and `run()` synchronously, then wrap the result in `Promise.resolve()` so pending state becomes visible immediately.
- `observableState()` intentionally does not share the finite async-state status model because stream connection and terminal events need different semantics.
- One handle instance owns one in-flight promise at a time. Reuse is handle-local and never global.
- Request tokens prevent stale completions from mutating state after `reset()` or `setValue()`.
- `asyncState()` keeps the last good value during failed reloads to support stale-data UIs.
- `asyncAction()` keeps the last successful result available across failures so success context is not discarded implicitly.

## Demo Routes

Run the demo app locally with `pnpm start`, then inspect the routes listed in the [async state demo
runbook section](../demo/README.md#async-state-demo-routes).

- `/packages/angular-async-state`: package overview and demo catalog
- `/packages/angular-async-state/value`: explicit value lifecycle with idle, loading, empty, first-load error, successful reload, and stale-data error handling
- `/packages/angular-async-state/observable`: live observable lifecycle with connect, live updates, empty snapshots, terminal errors, completion, and reconnect
- `/packages/angular-async-state/action`: explicit action lifecycle with pending, success, failure, and duplicate-run reuse

The overview page and all three demos expose stable `data-testid` hooks and generated source
inspector panels, so the routes act as both documentation and Playwright fixtures.

## Validation Surface

```bash
pnpm test:lib:async-state
pnpm build:lib:async-state
pnpm test:app
pnpm test:e2e
```

Cross-library and release-oriented changes should also run:

```bash
pnpm test:lib
pnpm build:lib
pnpm verify:package
```

## Release Contract

- bump `angular/packages/angular-async-state/package.json`
- tag `angular-async-state-v<version>`
- let `.github/workflows/release-angular-async-state.yml` validate, publish, and create the release
