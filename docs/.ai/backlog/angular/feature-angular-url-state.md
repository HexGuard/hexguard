---
id: feature-angular-url-state
type: feature
status: proposed
created: 2026-06-13
package: '@hexguard/angular-url-state'
---

# Angular URL State Package

## Summary

Capture post-v0.1 evolution planning for `@hexguard/angular-url-state` without widening the
package beyond its core job: typed, deterministic, signal-first query-param state for Angular.

The package already covers the main adoption path for query-backed filters, dashboards, and
shareable view state. This backlog file records the next most relevant improvements based on real
adoption pressure: legacy or external URL contracts, invalid-link cleanup expectations, and better
diagnostics around multi-instance ownership.

## Goals

- Preserve deterministic query serialization and unmanaged-param preservation.
- Keep the package focused on query-string state rather than growing into a general state manager.
- Improve adoption where existing products need legacy query keys or clearer URL contracts.
- Prefer follow-ups that strengthen the one-owner-per-key mental model instead of weakening it.

## Non-Goals

- A global application state manager.
- Form binding in the core package.
- Path-param or hash-fragment synchronization in the next iteration.
- A coordination engine for multiple writers that intentionally own the same query key.
- Runtime validation dependencies beyond consumer-supplied codecs.

## Current Contract

- Schema property names currently double as query-param keys.
- Serialization order follows schema property order so URLs stay deterministic.
- Unmanaged query params are preserved on writes.
- `removeInvalid` reparses into safe values and cleans invalid params on the next managed write.
- Multiple `urlState()` handles are supported only when they own disjoint query keys.
- Reserved schema property names such as `patch`, `reset`, and `snapshot` are blocked because they
  collide with the returned handle methods.
- Custom codecs remain the primary extension point for domain-specific parsing and serialization.

## Post-v0.1 Evolution Triage

Accepted follow-up work should graduate into separate backlog files once scope is committed. Until
then, keep the package roadmap triaged here.

| Idea | Triage | Real problem solved | Main risk | Recommended next step |
| ---- | ------ | ------------------- | --------- | --------------------- |
| Query-key aliases or key remapping | Planned next | Lets apps keep descriptive local signal names while honoring legacy, external, or shortened URL contracts | Expands the schema model and touches parse, serialize, and invalid-reporting paths | Draft a backward-compatible schema shape and spike deterministic serialization behavior |
| Immediate invalid URL normalization | Proposed | Canonicalizes malformed links without waiting for the next user interaction | Triggers navigation during initial parse or history replay and can blur history semantics | Keep as RFC until a concrete adopter needs eager cleanup |
| Dev-mode duplicate ownership detection | Proposed | Catches parent or sibling components competing for the same query key before production | Requires lifecycle-aware tracking and could warn in cases that are technically safe but noisy | Explore a dev-only warning model before any stronger coordination contract |
| Query-key namespace or prefix helpers | Proposed | Helps reusable widgets compose param slices without every app hand-prefixing keys manually | Can duplicate aliasing support and obscure the actual public URL contract | Revisit only after aliasing proves insufficient |
| Transaction or manual-commit mode | Deferred | Supports staged local edits without immediate navigation | Breaks the simple signal-equals-URL mental model that makes the package easy to trust | Prefer local app state or `@hexguard/angular-query-form` for this workflow first |
| Path-param or hash support | Deferred | Helps products whose shareable state cannot live in the query string | Broadens the package beyond its current intentionally narrow query-state scope | Keep out until query-string scope becomes a proven adoption blocker |

## Query-Key Alias API Draft

### Goal

Allow the local signal property name to differ from the external query-param key without giving up
deterministic serialization, typed snapshots, or unmanaged-param preservation.

### Recommended API shape

```ts
type UrlStateSchemaField<T> =
  | ParamCodec<T>
  | {
      readonly codec: ParamCodec<T>;
      readonly queryKey?: string;
    };

type UrlStateSchema = Record<string, UrlStateSchemaField<unknown>>;

const state = urlState({
  search: { codec: stringParam(''), queryKey: 'q' },
  page: { codec: numberParam(1), queryKey: 'p' },
  sort: { codec: enumParam(['createdAt', 'total'] as const, 'createdAt'), queryKey: 'order' },
});

state.search();
state.patch({ page: 2 });
```

### Proposed semantics

- `queryKey` defaults to the schema property name to preserve current behavior.
- Schema property names remain the public TypeScript keys used for signals, `patch()`, and
  `snapshot()`.
- `queryKey` values must be unique after normalization; duplicates should fail fast.
- Reserved property names such as `patch`, `reset`, and `snapshot` stay reserved on the returned
  handle, but `queryKey` may use those strings because they are URL keys, not local API keys.
- Deterministic serialization should still follow schema property order, not sorted `queryKey`
  order, so alias support does not make URLs unstable.
- Invalid query diagnostics should report the schema property name and the actual incoming
  `queryKey` when they differ.

### Naming options

- `queryKey`: recommended. It matches the package's existing query-param terminology and is the
  clearest description of the external URL key.
- `paramKey`: acceptable, but less precise because the package may eventually discuss other URL
  parameter surfaces and this name does not say query-string explicitly.
- `alias`: too ambiguous. It hides whether the alias applies to the local TypeScript property, the
  external URL key, or both.

### Recommendation

Use `queryKey` if this feature moves forward. It preserves the current schema mental model while
making legacy or shortened URL contracts possible without flattening local code readability.

## RFC: Immediate Invalid URL Normalization

### Status

Proposed. Keep the current deferred cleanup model for now and do not implement eager cleanup until
an adopter demonstrates that canonicalizing invalid URLs on first parse matters more than avoiding
surprise navigation.

### Context

`invalidParamBehavior: 'removeInvalid'` currently reparses malformed values into safe defaults and
removes the invalid params on the next managed write.

That is conservative and avoids an immediate navigation during initial load, Back, Forward, or
direct URL edits. Some products, however, may want malformed links scrubbed immediately so shared
URLs become canonical as soon as the app parses them.

### Option A: Keep Deferred Cleanup Only

- Keeps URL parsing side effects predictable: parsing alone does not immediately navigate.
- Avoids replacing history entries during initial render or popstate handling.
- Preserves the current mental model where navigation happens because app state changed, not just
  because the library observed an invalid URL.
- Leaves canonicalization to the next intentional write.

### Option B: Add Eager Cleanup As An Opt-In

- Produces canonical URLs immediately after parsing malformed links.
- Reduces the window where the UI shows safe values but the address bar still contains invalid
  params.
- Adds edge cases around initial navigation, popstate replay, and whether eager cleanup should
  force `replaceUrl` regardless of the configured history mode.

### Minimal API If Adopted Later

```ts
export type InvalidParamCleanupTiming = 'onManagedWrite' | 'immediate';

export interface UrlStateOptionsInput {
  readonly invalidParamBehavior?: InvalidParamBehavior;
  readonly invalidParamCleanupTiming?: InvalidParamCleanupTiming;
}
```

### Open questions

- When cleanup timing is `immediate`, should the library always use replace-state even if
  `history: 'push'` is configured?
- Should immediate cleanup run after the initial parse only, or also after popstate and direct URL
  edits?
- Should immediate cleanup bypass `debounceMs`, or should it still respect the configured delay?
- If multiple disjoint `urlState()` instances detect invalid params on the same URL, how should
  eager cleanup avoid redundant navigation attempts?

### Recommendation

Keep the current deferred cleanup model for now. Query-key aliases solve a more common adoption
problem without changing navigation timing semantics. Revisit eager cleanup only after a concrete
consumer proves that deferred cleanup leaves too much canonicalization burden in app code.

## Validation

- Add router-sync tests for aliased keys, duplicate query-key rejection, and deterministic
  serialization order if alias support is implemented.
- Add integration tests covering reserved local property names versus external `queryKey` values.
- If eager cleanup is implemented later, add navigation-timing tests for initial load, popstate,
  and multi-instance disjoint ownership.

## Follow-Ups

- Turn query-key aliasing into a dedicated follow-up backlog file once the API is accepted.
- Keep immediate invalid cleanup at RFC status until a concrete adopter appears.
- Revisit dev-mode duplicate ownership detection after aliasing, because better key diagnostics may
  change how much coordination help the library really needs.