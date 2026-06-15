# `@hexguard/angular-optimistic-state`

Signal-first optimistic mutation, rollback, and reconciliation state for Angular.

This package standardizes repeated optimistic UI patterns around toggles, inline edits, row
actions, and bulk updates without turning the behavior into an opaque cache or transport layer.

Additional in-repo guides:

- [Deep package notes](https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-optimistic-state.md)
- [Package demo routes](https://github.com/HexGuard/hexguard/blob/main/docs/demo/README.md#optimistic-state-demo-routes)
- [Demo runbook](https://github.com/HexGuard/hexguard/blob/main/docs/demo/README.md)
- [Package catalog and roadmap context](https://github.com/HexGuard/hexguard/blob/main/docs/packages/README.md)

## Installation

```bash
pnpm add @hexguard/angular-optimistic-state
```

## Quickstart

```ts
import { optimisticState } from '@hexguard/angular-optimistic-state';

interface TodoItem {
  readonly id: string;
  readonly done: boolean;
  readonly pending: boolean;
}

const todos = optimisticState<
  readonly TodoItem[],
  { readonly id: string; readonly done: boolean },
  { readonly id: string; readonly done: boolean },
  string
>({
  initialValue: [{ id: 'todo-1', done: false, pending: false }],
  getTarget: (input) => input.id,
  apply: (rows, input) =>
    rows.map((row) => (row.id === input.id ? { ...row, done: input.done, pending: true } : row)),
  reconcile: (rows, result) =>
    rows.map((row) => (row.id === result.id ? { ...row, done: result.done, pending: false } : row)),
  conflictPolicy: 'reject',
  run: (input) => todoApi.save(input),
  mapError: (error) =>
    error instanceof Error ? error.message : 'Unknown optimistic-state failure.',
});

await todos.run({ id: 'todo-1', done: true });
todos.status();
todos.value();
todos.entries();
```

## Feature Matrix

| Capability                                          | Status      | Notes                                                                                                         |
| --------------------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------- |
| Headless optimistic state with `optimisticState()`  | Available   | One handle owns committed value, optimistic overlay, mutation history, and rollback behavior.                 |
| Success reconciliation hooks                        | Available   | `reconcile()` can normalize confirmed server results back into the committed base value.                      |
| Configurable same-target conflict policy            | Available   | `reject`, `queue`, and `replace` keep overlap behavior explicit instead of hiding it in the cache.            |
| Mutation inspection through `entries`               | Available   | Pending, queued, replaced, succeeded, and failed mutation entries stay inspectable for demos or UI.           |
| Thin Angular outlet helper                          | Available   | `HexguardOptimisticStateOutletComponent` renders the current value plus optional pending or error companions. |
| Transport or cache abstraction                      | Not planned | The package intentionally stops short of becoming a query client, cache graph, or offline engine.             |
| Automatic conflict resolution beyond local policies | Not planned | Rich merge strategies remain app-owned or future companion-package work.                                      |
| Offline-first sync queue                            | Not planned | Durable replay and offline reconciliation stay out of `0.1.x`.                                                |

## Demo Routes

This repository ships a package overview page plus three docs-grade demo routes for the public
API. Start the demo app from the repo root with `pnpm start`, then open:

- `/packages/angular-optimistic-state`: package overview and demo catalog
- `/packages/angular-optimistic-state/toggle`: optimistic toggle with rollback and configurable same-target policy
- `/packages/angular-optimistic-state/inline-edit`: optimistic inline edit with success reconciliation and failure rollback
- `/packages/angular-optimistic-state/bulk`: optimistic bulk publish with pending overlays and queued follow-up runs

Route expectations and manual verification notes live in the [optimistic state demo runbook section](https://github.com/HexGuard/hexguard/blob/main/docs/demo/README.md#optimistic-state-demo-routes).

## What It Owns

- explicit committed value and optimistic overlay state for one handle
- same-target overlap control through `reject`, `queue`, or `replace`
- optimistic apply, rollback on failure, and reconciliation on success
- mutation-entry inspection for status, result, and error details
- reset ergonomics that return the handle to a known committed snapshot
- optional thin template outlet over the same headless handle

## What It Does Not Own

- HTTP transport, retry policy, or one shared cache graph
- optimistic persistence across page reloads or offline sessions
- backend conflict-resolution rules or collaborative merge engines
- normalized entity stores or query invalidation policies
- one opinionated component library for optimistic banners or row styling

## API Reference

### `optimisticState(options)`

Creates a typed optimistic mutation handle around one committed value.

The returned handle exposes:

- `status`, `value`, `settledValue`, `error`, `entries`, `lastResult`
- `hasPendingMutations`, `hasQueuedMutations`, `pendingCount`, `queuedCount`
- `isIdle`, `isPending`, `isError`
- `run(...args)`, `setConflictPolicy(policy)`, `reset(value?)`

`OptimisticStateOptions<TValue, TInput, TResult, TError, TTarget>` fields:

| Field            | Required | Description                                                                  |
| ---------------- | -------- | ---------------------------------------------------------------------------- |
| `initialValue`   | yes      | Committed value exposed before the first optimistic mutation and after reset |
| `run`            | yes      | Promise-returning mutation body invoked for each optimistic input            |
| `getTarget`      | yes      | Computes the logical same-target identity used for conflict handling         |
| `apply`          | yes      | Applies one optimistic overlay to the current visible value                  |
| `reconcile`      | no       | Reconciles a confirmed server result back into the committed value           |
| `mapError`       | no       | Normalizes unknown thrown values into the public error type                  |
| `conflictPolicy` | no       | Chooses whether same-target overlap rejects, queues, or replaces             |
| `now`            | no       | Supplies timestamps for mutation history entries                             |

```ts
type Preference = { id: string; enabled: boolean; pending: boolean };

const preferences = optimisticState<
  readonly Preference[],
  { id: string; enabled: boolean },
  { id: string; enabled: boolean },
  string
>({
  initialValue: [],
  getTarget: (input) => input.id,
  apply: (rows, input) =>
    rows.map((row) =>
      row.id === input.id ? { ...row, enabled: input.enabled, pending: true } : row,
    ),
  reconcile: (rows, result) =>
    rows.map((row) =>
      row.id === result.id ? { ...row, enabled: result.enabled, pending: false } : row,
    ),
  conflictPolicy: 'queue',
  run: (input) => preferencesApi.save(input),
  mapError: (error) => normalizePreferenceError(error),
});
```

Use `reconcile()` when the server may canonicalize values or return related fields that the
optimistic overlay does not know yet. When omitted, the handle reuses `apply()` against the latest
committed base value.

### `OptimisticStatePendingError`

Thrown when `conflictPolicy` is `reject` and a new mutation targets the same logical item while an
earlier mutation for that target is still unsettled.

### Template Outlet

The package exports one optional standalone template helper:

- `HexguardOptimisticStateOutletComponent`

The outlet always renders the current derived value through a required value template and can
optionally render pending or error companion templates beside it.

The package also exports `OptimisticStateOptions`, `OptimisticMutationConflictPolicy`,
`OptimisticMutationEntry`, and the outlet template-context interfaces for consumers building their
own wrapper abstractions on top of the headless handle.

## Behavioral Notes

- `value()` is the committed value plus all currently pending optimistic overlays.
- `settledValue()` changes only after a successful reconciliation or an explicit reset.
- Failed mutations roll back by dropping their overlay and leaving `settledValue()` untouched.
- `queue` keeps the second same-target mutation visible only after the earlier one settles.
- `replace` swaps the visible overlay immediately and ignores the superseded mutation result when it eventually resolves.
- `entries()` keeps mutation history visible so demos and consumers can inspect pending, queued, replaced, failed, and succeeded states.

## Validation

```bash
pnpm test:lib:optimistic-state
pnpm build:lib:optimistic-state
pnpm test:e2e
```

The demo routes are part of the validation story because they exercise the same public API surface
the package exports.

## Release Contract

- bump `angular/packages/angular-optimistic-state/package.json`
- tag `angular-optimistic-state-v<version>`
- let `.github/workflows/release-angular-optimistic-state.yml` validate, publish, and create the release
