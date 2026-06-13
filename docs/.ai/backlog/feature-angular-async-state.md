---
id: feature-angular-async-state
type: feature
status: proposed
created: 2026-06-13
package: '@hexguard/angular-async-state'
---

# Angular Async State Package

## Summary

Design `@hexguard/angular-async-state` as a signal-first Angular utility package for standardizing
the lifecycle around async values and async actions.

The core problem is repeated UI and state boilerplate around API-driven screens. Teams keep
rewriting slightly different versions of `isLoading`, `hasLoaded`, `error`, `data`, refresh logic,
empty-state branching, submit pending state, post-action success state, and retry behavior, and
templates drift into inconsistent patterns.

This package should standardize async state as a reusable primitive first, with optional template
helpers second. The main value is not a spinner component. The main value is making async value
and async action state explicit, typed, inspectable, and consistent across feature code.

## Goals

- Provide a small signal-first abstraction for async value lifecycle state.
- Provide a sibling abstraction for async action lifecycle state such as submit or save flows.
- Standardize common status transitions such as idle, loading, loaded, reloading, error,
  submitting, succeeded, and failed.
- Keep data, error, and status linked in one typed contract rather than spread across ad hoc
  booleans.
- Support both template branching and imperative orchestration without forcing one rendering style.
- Make it easy for narrower packages such as submit-lock or resource-debug tooling to compose with
  the same async-state contract.

## Non-Goals

- Replacing Angular's HTTP client, resources, or RxJS.
- A full data-fetching cache or query library.
- Automatic retry, deduplication, or stale-while-revalidate policy in the first version.
- A component-only solution that hides async control flow inside opaque UI wrappers.
- Treating fetch-style value lifecycles and submit-style command lifecycles as one overloaded
  status model.
- Modeling every possible domain state in the core package.

## Decisions

- Prefer a signal-first utility API over a component-first API.
- Treat template helpers as optional sugar layered on top of the core async-state primitive.
- Model async values and async actions as separate but related primitives.
- Keep the first version focused on lifecycle state, not a cache graph.
- Make the package Angular-specific in ergonomics, but avoid coupling it tightly to any one
  transport or backend library.

## Proposed Public API

```ts
import { asyncAction, asyncState } from '@hexguard/angular-async-state';

const orders = asyncState({
  initialValue: [] as Order[],
  load: async () => orderApi.list(),
});

const saveOrder = asyncAction({
  run: async (payload: SaveOrderInput) => orderApi.save(payload),
});

orders.status();
orders.value();
orders.error();
orders.isLoading();
orders.hasValue();

saveOrder.status();
saveOrder.pending();
saveOrder.error();
saveOrder.lastResult();

await orders.load();
await orders.reload();
orders.setValue(seedOrders);
orders.reset();

await saveOrder.run({ id: 'HG-1042', status: 'closed' });
saveOrder.reset();
```

Tentative exports:

- `asyncState()`
- `AsyncState<TValue, TError = unknown>`
- `AsyncStateStatus`
- `asyncAction()`
- `AsyncAction<TInput, TResult, TError = unknown>`
- `AsyncActionStatus`
- optional template helpers such as `HexguardAsyncOutletComponent` or `*hexguardAsyncState`
  only if they stay thin wrappers over the core contract

## Recommended Direction

The best first version is a utility package, not a template-component package.

The best contract split is two sibling primitives:

- `asyncState()` for fetch or read models where `value`, `empty`, `reload`, and stale data matter.
- `asyncAction()` for command flows where `pending`, `success`, `error`, and duplicate-run control
  matter.

Why:

- Utility-first adoption is broader. Teams can use the state model in smart components, route
  loaders, dialog flows, and custom templates.
- Component-first solutions tend to lock teams into one visual branching pattern too early.
- A strong core contract can still power small view helpers later without making the UI layer the
  only entrypoint.
- Value and action lifecycles overlap, but they are not the same problem, so separating them keeps
  the status models easy to reason about.

Template helpers can still exist, but they should be thin presentation adapters over a reusable
`AsyncState` or `AsyncAction` contract rather than the package's main value proposition.

## Implementation Plan

1. Define separate minimal lifecycle contracts for async values and async actions.
2. Decide whether the value status model should be `idle | loading | loaded | error | reloading`
  and whether empty-state distinction belongs as a derived helper instead of a core status.
3. Decide whether the action status model should be `idle | pending | succeeded | failed` or
  whether success should remain a derived signal over `lastResult` and `error`.
4. Implement a signal-backed `asyncState()` factory with typed value, error, and status signals.
5. Implement a sibling `asyncAction()` factory with typed input, result, error, and pending state.
6. Support explicit `load()`, `reload()`, `reset()`, and `setValue()` operations for async state.
7. Support explicit `run()`, `reset()`, and duplicate-run policy for async actions.
8. Define the error-retention policy during reloads so templates can distinguish first-load errors
  from background refresh failures.
9. Define the result-retention policy for actions so templates can distinguish first-run failures,
  latest success, and subsequent retry attempts.
10. Add derived helpers such as `isLoading`, `isLoaded`, `hasValue`, `isEmpty`, `isReloading`,
   and `pending` only if they simplify ergonomics without duplicating the status model.
11. Add focused tests for first load, successful reload, failed reload, manual reset, empty
   values, submit success, submit failure, and duplicate-run behavior.
12. Decide whether template helpers belong in v0.1 or should wait until the core utility proves
   itself.
13. If template helpers are included, keep them optional and thin so they do not become the only
   supported rendering path.
14. Add realistic demos such as dashboard cards, retryable detail views, and save/submit flows.

## Validation

- Unit tests for value lifecycle transitions, action lifecycle transitions, and derived helpers.
- Demo coverage proving loading, loaded, empty, error, reload, submit pending, submit success,
  and submit failure transitions.
- Template-level checks only if view helpers are added in the first version.

## Risks

- The package can become too broad if it drifts from state modeling into caching, request
  orchestration, retries, or deduplication.
- Status vocabularies are easy to overcomplicate, especially when empty, stale, reloading,
  success, and failure states are all treated as first-class.
- Component-first helpers could make the package feel productive early while hiding a weak core
  contract underneath.
- Angular's built-in resource patterns may overlap with part of the problem space, so the value
  proposition must stay explicit and pragmatic.
- Folding too much submit-lock behavior into the core could blur the line between generic async
  lifecycle state and narrow form or button ergonomics.

## Follow-Ups

- Decide whether `@hexguard/angular-submit-lock` remains a separate ergonomic helper package or
  collapses into thin helpers on top of `AsyncAction`.
- Revisit template helpers after the signal-first core utility proves out.
- Compare this package with any future resource-debug tooling so responsibilities stay separate.