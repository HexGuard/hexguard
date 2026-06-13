---
id: feature-angular-query-signal-forms
type: feature
status: proposed
created: 2026-06-13
package: '@hexguard/angular-query-signal-forms'
dependsOn:
  - '@hexguard/angular-url-state'
---

# Angular Query Signal Forms Package

## Summary

Design a separate `@hexguard/angular-query-signal-forms` package that binds Angular Signal Forms
models to typed query parameters through `@hexguard/angular-url-state`.

The goal is to give teams using Angular's emerging signal-first forms model the same core value
that `@hexguard/angular-query-form` gives Reactive Forms today: shareable URLs, deterministic
query serialization, malformed-link recovery, browser-history support, and dependent reset rules
for filter-heavy screens.

This should be a separate package rather than an overload inside `@hexguard/angular-query-form` so
the Reactive Forms API stays stable while Angular Signal Forms is still evolving.

## Goals

- Define a package-scoped adapter for Angular Signal Forms on top of `@hexguard/angular-url-state`.
- Preserve the current HexGuard URL-state guarantees: deterministic serialization, explicit
  defaults, inherited invalid-param behavior, and route-scoped cleanup.
- Keep the Signal Forms integration first-class without mixing Reactive Forms and Signal Forms into
  one overloaded adapter surface.
- Support reset-on-change rules for real search, filter, and pagination workflows.
- Produce docs-grade demos and tests that prove the package against actual browser behavior.

## Non-Goals

- Rewriting `@hexguard/angular-query-form` to support both form systems in one API.
- Template-driven forms.
- A generic abstraction that hides Angular's Signal Forms concepts entirely.
- A second query parser or router synchronization layer.
- Stabilizing Angular Signal Forms itself inside HexGuard if Angular changes the experimental API.

## Decisions

- Treat this as a separate package, not a mode inside `@hexguard/angular-query-form`.
- Keep `@hexguard/angular-url-state` as the single owner of parsing, serialization, debounce,
  history behavior, and invalid query handling.
- Use the same product framing as query-form: narrow adapter, realistic demos, and deterministic
  URL behavior over broad form-state abstractions.
- Keep the package status `proposed` until Angular Signal Forms stabilizes enough for a published
  package contract.

## Proposed Public API

```ts
import { signal } from '@angular/core';
import { form } from '@angular/forms/signals';
import {
  enumParam,
  numberParam,
  querySignalForm,
  stringParam,
} from '@hexguard/angular-query-signal-forms';

const model = signal({
  search: '',
  page: 1,
  status: 'all' as 'all' | 'open' | 'closed',
});

const query = querySignalForm(
  form(model),
  {
    search: stringParam(''),
    page: numberParam(1),
    status: enumParam(['all', 'open', 'closed'] as const, 'all'),
  },
  {
    history: 'replace',
    resetKeysOnChange: {
      search: ['page'],
      status: ['page'],
    },
  },
);

query.snapshot();
query.patch({ search: 'priority', page: 1 });
query.reset();
```

Tentative exports:

- `querySignalForm()`
- `QuerySignalForm<TSchema>`
- `QuerySignalFormOptions<TSchema>`
- `QuerySignalFormResetKeysOnChange<TSchema>`
- selected URL-state codecs and public types for ergonomic single-package imports, if this does
  not blur ownership of parsing behavior

## Implementation Plan

1. Confirm Angular Signal Forms readiness and current API shape before locking package naming.
2. Add a publishable `packages/angular-query-signal-forms` library with Angular 22 support.
3. Add package metadata, path mappings, build scripts, test scripts, and package verification
   commands in the same style as the existing Angular libraries.
4. Define a narrow adapter API such as `querySignalForm(formModel, schema, options?)`.
5. Reuse `urlState(schema, options?)` internally instead of duplicating router or parsing logic.
6. Identify the minimal Signal Forms primitives needed to read current values and write
   URL-originated updates back into the form model.
7. Add reset-on-change semantics that mirror the existing query-form behavior where feasible.
8. Fail fast when required schema keys cannot be mapped into the Signal Forms model contract.
9. Decide whether the package needs a low-level `urlState` escape hatch on the returned handle.
10. Add library tests covering hydration, local edits, history replay, invalid-query behavior,
    reset rules, patch/reset methods, and teardown.
11. Add docs-grade demo routes showing one search/filter flow and one malformed-link or history
    recovery flow.
12. Extend Playwright coverage and package docs only after the Angular Signal Forms API surface is
    stable enough to justify long-lived examples.

## Validation

- Angular documentation check confirming the currently supported Signal Forms API shape.
- `pnpm test:lib` or package-scoped test command once the package exists.
- `pnpm build:lib` or package-scoped build command once the package exists.
- `pnpm test:e2e` once demo coverage is added.
- Manual browser checks for hydration, edits, reset behavior, invalid links, and Back/Forward
  replay on the demo routes.

## Risks

- Angular Signal Forms is still evolving, so the public API surface may churn under this package.
- The package could duplicate too much of `@hexguard/angular-query-form` if the shared abstraction
  line is not clear.
- Signal Forms model writes may have different semantics from Reactive Forms around change
  propagation, touched state, and field-level updates.
- Publishing too early could lock HexGuard into supporting an Angular experimental API that still
  changes meaningfully.

## Follow-Ups

- Decide whether the package name should stay `@hexguard/angular-query-signal-forms` or be
  shortened before implementation starts.
- Compare `querySignalForm()` against a secondary entrypoint strategy if Angular Signal Forms
  stabilizes quickly.
- Revisit whether shared reset-rule helpers can be factored between the Reactive Forms and Signal
  Forms adapters once both exist.