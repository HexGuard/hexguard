# `@hexguard/angular-optimistic-state` Deep Dive

This page complements the npm-facing README with repo-specific implementation notes and validation
guidance.

## Purpose

`@hexguard/angular-optimistic-state` standardizes optimistic mutation workflows for Angular without
turning the package into a cache client, transport abstraction, or opaque component library.

The package is intentionally narrow:

- explicit committed value and optimistic overlay state through `optimisticState()`
- explicit success reconciliation and failure rollback
- configurable same-target conflict handling through `reject`, `queue`, or `replace`
- thin optional Angular outlet helper over the same headless handle
- no built-in cache graph, offline queue, or merge engine

## Feature Matrix

| Capability                                          | Status      | Notes                                                                                                          |
| --------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------- |
| Headless optimistic state with `optimisticState()`  | Available   | One handle owns committed value, optimistic overlay, status, errors, and mutation history.                     |
| Success reconciliation hooks                        | Available   | `reconcile()` lets confirmed server results canonicalize or enrich the committed value.                        |
| Same-target conflict policy                         | Available   | `reject`, `queue`, and `replace` make overlap behavior explicit instead of hiding it in cache logic.           |
| Mutation history inspection                         | Available   | `entries()` surfaces pending, queued, replaced, failed, and succeeded entries for demos or UI.                 |
| Thin Angular outlet helper                          | Available   | `HexguardOptimisticStateOutletComponent` renders the current value with optional pending and error companions. |
| Shared cache graph or request client                | Not planned | Keep that concern in application code or a future dedicated package.                                           |
| Automatic conflict resolution beyond local policies | Not planned | Rich merge strategies should remain application-owned in `0.1.x`.                                              |
| Offline-first replay and durable sync               | Not planned | Local session optimism is in scope; persistent sync orchestration is not.                                      |

## Public API Map

| Export                                   | Role                                                                 |
| ---------------------------------------- | -------------------------------------------------------------------- |
| `optimisticState()`                      | Creates the optimistic mutation handle                               |
| `OptimisticStateOptions`                 | Configures committed state, mutation body, overlay apply, and policy |
| `OptimisticState`                        | High-level handle shape for optimistic flows                         |
| `OptimisticStateStatus`                  | Handle lifecycle status union                                        |
| `OptimisticMutationConflictPolicy`       | Same-target overlap policy union                                     |
| `OptimisticMutationEntry`                | Public mutation history entry shape                                  |
| `OptimisticStatePendingError`            | Rejection type used by `conflictPolicy: 'reject'`                    |
| `HexguardOptimisticStateOutletComponent` | Thin standalone outlet for rendering one optimistic-state handle     |

The package also exports outlet template-context types for consumers who want strongly typed
templates or wrapper abstractions on top of the headless handle.

## Lifecycle Model

`optimisticState()` uses:

- `idle`
- `pending`
- `error`

The handle keeps two value layers visible:

- `settledValue()`: the last committed value that survived reconciliation
- `value()`: `settledValue()` plus the currently pending optimistic overlays

Key behavior:

- pending optimistic overlays apply immediately to `value()`
- failed mutations roll back by disappearing from `value()` while leaving `settledValue()` unchanged
- successful mutations reconcile into `settledValue()` and then disappear from the pending overlay list
- same-target overlap handling is explicit through `reject`, `queue`, or `replace`
- `entries()` stays inspectable so the caller can surface pending, queued, failed, replaced, or succeeded work
- `reset()` clears mutation history and optionally replaces the committed baseline

## Option Resolution and Defaults

`optimisticState(options)` defaults:

- `conflictPolicy`: `'reject'`
- `mapError`: identity cast of the thrown value
- `reconcile`: reuses `apply()` against the latest committed base value
- `now`: `Date.now`

Practical guidance:

- keep `reject` as the default for forms or toggles where silent overlap would hide correctness problems
- switch to `queue` when the second mutation should wait its turn while preserving user intent
- switch to `replace` when the latest local intent should become the visible optimistic overlay immediately
- use `reconcile()` when the server canonicalizes text, emits server-owned timestamps, or returns related fields
- use `mapError()` when callers should not see transport-specific thrown shapes

## Configuration Reference

### `OptimisticStateOptions<TValue, TInput, TResult, TError, TTarget>`

| Field            | Required | Description                                                                 |
| ---------------- | -------- | --------------------------------------------------------------------------- |
| `initialValue`   | yes      | Committed value exposed before the first mutation and restored by `reset()` |
| `run`            | yes      | Promise-returning mutation body invoked by `run()`                          |
| `getTarget`      | yes      | Computes the same-target identity used for overlap handling                 |
| `apply`          | yes      | Applies one optimistic overlay to the current visible value                 |
| `reconcile`      | no       | Reconciles a successful server result back into the committed value         |
| `mapError`       | no       | Normalizes unknown thrown values into the public error type                 |
| `conflictPolicy` | no       | Chooses whether same-target overlap rejects, queues, or replaces            |
| `now`            | no       | Supplies timestamps for mutation history entries                            |

```ts
const draftRows = optimisticState<readonly DraftRow[], EditInput, EditResult, EditError>({
  initialValue: initialDraftRows,
  getTarget: (input) => input.id,
  apply: (rows, input) =>
    rows.map((row) => (row.id === input.id ? { ...row, title: input.title, pending: true } : row)),
  reconcile: (rows, result) =>
    rows.map((row) =>
      row.id === result.id ? { ...row, title: result.canonicalTitle, pending: false } : row,
    ),
  conflictPolicy: 'queue',
  run: (input) => draftsApi.save(input),
  mapError: (error) => normalizeDraftError(error),
});
```

Keep `getTarget()` stable. The target is the unit that overlap policies act on. For a single row
edit it is usually the row id. For a bulk publish command it may intentionally be one shared key
such as `'bulk-publish'`.

## Conflict Policies

### `reject`

The second same-target mutation fails immediately with `OptimisticStatePendingError`. Use this when
duplicate intent is more likely to indicate a bug or accidental double-submit than meaningful user
input.

### `queue`

The second same-target mutation is remembered and starts only after the earlier one settles. Use
this when both intents should run in order but only one overlay should be visible at a time.

### `replace`

The second same-target mutation becomes the visible optimistic overlay immediately. Earlier results
still resolve or reject, but they no longer mutate the handle state once replaced. Use this when
the latest local intent should win visually, such as rapid preference toggles.

## Template Outlet

`HexguardOptimisticStateOutletComponent` is optional sugar over the same headless handle.

It always renders the current derived value through a required `valueTemplate` and may also render:

- a pending companion template with the current pending mutation entries
- an error companion template with the latest mapped error

The outlet does not own mutation execution, rollback, retry, or styling. It simply branches on the
same handle state and provides typed template contexts.

## Internal Behavior Notes

- `apply()` runs against the current visible value, so multiple pending overlays can accumulate across different targets.
- `reconcile()` runs against `settledValue()`, not `value()`, so confirmed mutations commit from the last known stable baseline.
- `replace` marks earlier same-target entries as replaced and ignores their eventual result or error for state mutation purposes.
- `queue` keeps future intent visible in `entries()` even before it becomes the active overlay.
- `error()` is cleared when a new mutation starts so recovery attempts do not keep stale failure banners alive.

## Demo Routes

Run the demo app locally with `pnpm start`, then inspect the routes listed in the [optimistic state demo runbook section](../demo/README.md#optimistic-state-demo-routes).

- `/packages/angular-optimistic-state`: package overview and demo catalog
- `/packages/angular-optimistic-state/toggle`: optimistic toggle with rollback and configurable same-target policy
- `/packages/angular-optimistic-state/inline-edit`: optimistic inline edit with queued follow-up saves and canonical server reconciliation
- `/packages/angular-optimistic-state/bulk`: optimistic bulk publish with pending overlays and explicit rollback on failure

The overview page and all three demos expose stable `data-testid` hooks and generated source
inspector panels, so the routes act as both documentation and Playwright fixtures.

## Validation Surface

```bash
pnpm test:lib:optimistic-state
pnpm build:lib:optimistic-state
pnpm test:app
pnpm test:e2e
```

The demo routes are part of the validation story because they prove visible optimistic overlays,
rollback, and conflict-policy behavior against the same public API surface the package exports.
