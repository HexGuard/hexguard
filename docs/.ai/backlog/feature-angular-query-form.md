---
id: feature-angular-query-form
type: feature
status: in-progress
created: 2026-06-13
branch: feature/angular-query-form
package: '@hexguard/angular-query-form'
dependsOn:
  - '@hexguard/angular-url-state'
---

# Angular Query Form Package

## Summary

Build `@hexguard/angular-query-form` as the next publishable HexGuard Angular package. It should
be a Reactive Forms-only companion to `@hexguard/angular-url-state` that keeps top-level form
controls, typed query parameters, reset behavior, browser history, and demo snapshots in sync.

The first release should solve a common admin-app problem: filter-heavy pages need shareable URLs,
debounced form edits, pagination reset rules, default stripping, invalid-link recovery, and
Back/Forward behavior without each app hand-writing fragile synchronization code.

## Goals

- Add a publishable `packages/angular-query-form` library with Angular 22 and ng-packagr support.
- Expose a narrow `queryForm(form, schema, options?)` API for Reactive Forms.
- Delegate query parsing, deterministic serialization, debounce, invalid-param behavior, history
  mode, and router synchronization to `@hexguard/angular-url-state`.
- Synchronize URL-backed top-level `FormGroup` controls with typed URL state.
- Support `resetKeysOnChange` for workflows where filter changes reset pagination or other
  dependent query keys.
- Add unit/integration tests covering form-to-URL, URL-to-form, history replay, invalid query
  behavior, reset behavior, missing controls, and cleanup.
- Add two docs-grade demo pages with stable Playwright selectors and generated source snippets.
- Update package docs, catalog docs, demo docs, release workflow, and validation scripts.

## Non-Goals

- Template-driven forms.
- Nested control path mapping.
- Local-only field orchestration.
- Validation UI or validation rule helpers.
- Backend API error mapping.
- Dirty-state route guards.
- Submit locking or async action state.
- A table-state abstraction.
- A second query-param parser or router synchronization engine.

## Decisions

- v0.1 supports Angular Reactive Forms only.
- v0.1 maps URL-backed top-level controls only; local-only fields are deferred.
- The package uses `urlState()` internally instead of reimplementing URL synchronization.
- The main value-add is form binding plus reset-on-change rules for real filter/search workflows.
- Consumers continue to use URL-state codecs for field serialization and parsing.
- Two demos are part of the first implementation: one realistic search/filter flow and one
  advanced history or invalid-query recovery flow.
- Root scripts need to become multi-library aware before release automation is trustworthy.

## Proposed Public API

```ts
import { FormControl, FormGroup } from '@angular/forms';
import { enumParam, numberParam, queryForm, stringParam } from '@hexguard/angular-query-form';

const form = new FormGroup({
  search: new FormControl('', { nonNullable: true }),
  page: new FormControl(1, { nonNullable: true }),
  status: new FormControl<'all' | 'open' | 'closed'>('all', { nonNullable: true }),
});

const query = queryForm(
  form,
  {
    search: stringParam(''),
    page: numberParam(1),
    status: enumParam(['all', 'open', 'closed'] as const, 'all'),
  },
  {
    debounceMs: 250,
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

- `queryForm()`
- `QueryForm<TSchema>`
- `QueryFormOptions<TSchema>`
- `QueryFormResetKeysOnChange<TSchema>`
- `QueryFormControls<TSchema>` or equivalent typed control helper
- `QueryFormControlMissingError`
- selected URL-state codecs and public types for ergonomic single-package imports, if this does
  not blur ownership of parsing behavior

## Implementation Plan

1. Scaffold `packages/angular-query-form` from the URL-state package template.
2. Add an `angular-query-form` library project to `angular.json`.
3. Add `@hexguard/angular-query-form` path mapping and TypeScript project references in
   `tsconfig.json`.
4. Add package metadata with peer dependencies on Angular packages and
   `@hexguard/angular-url-state`; keep runtime dependencies to `tslib` only.
5. Refactor root scripts from one-library assumptions to package-specific and aggregate scripts.
6. Add package-specific scripts such as `build:lib:query-form`, `test:lib:query-form`, and
   `verify:package:query-form`.
7. Keep aggregate commands such as `build:lib`, `test:lib`, `test:ci`, `lint`, and
   `verify:package` running both Angular libraries in dependency order.
8. Update the URL-state release workflow to use package-specific URL-state build and verify
   commands.
9. Add `.github/workflows/release-angular-query-form.yml` using tag pattern
   `angular-query-form-v*`, package metadata under `packages/angular-query-form`, publish path
   `dist/angular-query-form`, and package-scoped validation commands.
10. Implement `query-form.ts`, `types.ts`, `query-form-options.ts`, and `errors.ts`.
11. Have `queryForm()` call `urlState(schema, urlStateOptions)` internally from an Angular
    injection context.
12. Validate that each schema key has a matching top-level form control and throw a descriptive
    error otherwise.
13. Hydrate managed controls from URL state on creation using `emitEvent: false`.
14. Mirror URL-originated state changes into managed controls without feedback loops.
15. Subscribe to form `valueChanges`, read managed values, compare with URL-state snapshots using
    codec equality where available, and patch only changed URL-state keys.
16. Apply `resetKeysOnChange` during form-originated changes so dependent keys reset to codec
    defaults unless explicitly changed in the same emission.
17. Return a small handle with at least `form`, `urlState`, `snapshot()`, `patch(value)`, and
    `reset()`.
18. Clean up form subscriptions and signal effects with `DestroyRef`; rely on `urlState()` for
    router listener and debounce cleanup.
19. Add library tests for hydration, edits, default removal, debounce, history, invalid query
    behavior, reset rules, patch/reset methods, missing controls, structural equality, and route
    destruction cleanup.
20. Add `apps/demo-angular/src/app/features/angular-query-form/` with an overview page and two demo
    pages.
21. Demo 1: Orders Query Form with Reactive Forms, debounced URL updates, pagination, reset button,
    result summary, current URL, snapshot JSON, and `resetKeysOnChange`.
22. Demo 2: Recovery or Reports Query Form with push-state history and invalid query fallback or
    cleanup behavior.
23. Register query-form package and demo metadata in the demo registry.
24. Add query-form routes under `/packages/angular-query-form`.
25. Add source snippet markers in the demo components and update `scripts/generate-demo-snippets.mjs`.
26. Regenerate `apps/demo-angular/src/app/generated/demo-snippets.ts`.
27. Extend Playwright coverage for overview, navigation, URL hydration, form edits, reset behavior,
    history or invalid recovery, current URL display, snapshot JSON, and inspector code snippets.
28. Create package README and deep-dive docs.
29. Update package catalog, root README, demo runbook, and AI roadmap/backlog docs.
30. Run the full validation gate before release or handoff.

## Demo Plan

### Orders Query Form

Route: `/packages/angular-query-form/orders`

Purpose: demonstrate the main adoption path for the package.

Expected behavior:

- Initial query params hydrate Reactive Forms controls.
- Form edits update URL query params through `queryForm()`.
- Search/status/tag edits reset `page` to `1` through `resetKeysOnChange`.
- Defaults are stripped from the URL through inherited URL-state behavior.
- Result table/list, current URL, snapshot JSON, and code snippet update live.
- Reset clears filters and query params.

### Recovery or Reports Query Form

Route: `/packages/angular-query-form/recovery` or `/packages/angular-query-form/reports`

Purpose: demonstrate advanced behavior that would be easy to get wrong by hand.

Expected behavior:

- Bad query values fall back safely or are removed, depending on selected URL-state options.
- Browser Back/Forward replays query-form state into controls.
- Snapshot JSON and current URL prove the form and URL remain aligned.
- Playwright covers invalid-query fallback cases that are already called out in the roadmap.

## Files To Add Or Change

- `packages/angular-query-form/**`
- `angular.json`
- `tsconfig.json`
- `package.json`
- `pnpm-lock.yaml` if the new workspace package changes the lockfile importer set
- `.github/workflows/release-angular-query-form.yml`
- `.github/workflows/release-angular-url-state.yml`
- `apps/demo-angular/src/app/features/angular-query-form/**`
- `apps/demo-angular/src/app/demo-registry.ts`
- `apps/demo-angular/src/app/app.routes.ts`
- `scripts/generate-demo-snippets.mjs`
- `apps/demo-angular/src/app/generated/demo-snippets.ts`
- `playwright/tests/demo-angular.spec.ts`
- `packages/angular-query-form/README.md`
- `docs/packages/angular-query-form.md`
- `docs/packages/README.md`
- `README.md`
- `docs/demo/README.md`
- `docs/ai/backlog.md`

## Validation

- `pnpm demo:snippets`
- `pnpm test:lib:query-form`
- `pnpm build:lib:query-form`
- `pnpm verify:package:query-form`
- `pnpm test:lib`
- `pnpm test:app`
- `pnpm test:e2e`
- `pnpm format:check`
- `pnpm lint`
- `pnpm test:ci`
- `pnpm build`
- `pnpm verify:package`
- Manual browser checks on both query-form demo routes for hydration, edits, reset, invalid links,
  and Back/Forward behavior.

## Risks

- Root scripts and release workflows currently assume one library.
- Re-exporting URL-state codecs from query-form may improve ergonomics but can blur package
  ownership if not documented clearly.
- `resetKeysOnChange` needs careful event semantics so dependent keys reset without overwriting a
  key that changed explicitly in the same form emission.
- Form-to-state and state-to-form synchronization must guard re-entrant updates to avoid loops and
  dirty/touched side effects.
- Invalid query behavior should stay inherited from URL state and must not become a second parsing
  policy.

## Post-v0.1 Evolution Triage

Accepted follow-up work should graduate into separate backlog files once scope is committed. Until
then, keep the package roadmap triaged here.

| Idea | Triage | Real problem solved | Main risk | Recommended next step |
| ---- | ------ | ------------------- | --------- | --------------------- |
| Subset binding for form-managed keys | Planned next | Lets one route schema keep URL-only keys such as `tab`, `sort`, or `view` without forcing matching form controls | Reset and hydration semantics become more subtle when the form manages only part of the schema | Draft API around `managedKeys` and spike behavior in a focused follow-up |
| Manual or apply-button sync mode | Proposed | Supports filter drawers and staged edits where the URL should update only on explicit apply | Introduces divergence between current form values and committed URL state | Keep as RFC until a concrete adopter needs it |
| Nested control path mapping | Proposed | Supports common shapes such as `filters.search` without flattening forms | Higher typing and lifecycle complexity than the current top-level model | Treat as separate design spike, not the next implementation |
| Composable child bindings or slices | Proposed | Allows large pages to split one route query model across child components | Conflicts with the current single URL owner and one-binding-per-route model | Revisit only after subset binding proves out |
| Richer reset policies beyond codec defaults | Proposed | Covers cases such as reset-to-custom-value or resetting URL-only keys from a form change | Option-surface growth can outpace proven need | Wait for repeated concrete consumer stories |
| Local-only orchestration helpers | Deferred | Could reduce boilerplate when managed and unmanaged controls interact | Pulls the package toward a general form-state manager | Keep out unless repeated demand shows the current unmanaged model is insufficient |

## Subset Binding API Draft

### Goal

Allow `queryForm()` to bind only a subset of schema keys to top-level form controls while keeping
one underlying `urlState()` handle as the single URL owner.

### Recommended API shape

```ts
type QueryFormManagedKeys<TSchema extends UrlStateSchema> =
  readonly QueryFormSchemaKey<TSchema>[];

export interface QueryFormOptions<TSchema extends UrlStateSchema>
  extends UrlStateOptionsInput {
  readonly managedKeys?: QueryFormManagedKeys<TSchema>;
  readonly resetKeysOnChange?: QueryFormResetKeysOnChange<TSchema>;
}

const query = queryForm(form, schema, {
  managedKeys: ['search', 'status', 'tags'],
  resetKeysOnChange: {
    search: ['page'],
    status: ['page', 'sort'],
    tags: ['page'],
  },
});
```

### Proposed semantics

- `managedKeys` defaults to all schema keys to preserve current behavior.
- Only managed keys require matching top-level controls.
- Only managed keys hydrate from URL state back into the form.
- Only managed keys are read from `form.valueChanges` and written back into URL state.
- `query.snapshot()`, `query.patch()`, `query.reset()`, and `query.urlState` still operate on the
  full schema so the package keeps one URL owner.
- `resetKeysOnChange` source keys must be managed keys because only managed form controls emit
  changes through `queryForm()`.
- `resetKeysOnChange` target keys may be any schema key so a managed filter can still reset a
  URL-only key such as `page` or `sort`.
- `QueryFormControlMissingError` should only fire for managed keys.

### Naming options

- `managedKeys`: recommended. It matches the existing managed versus unmanaged language and makes
  it clear that `queryForm()` owns only part of the schema-to-form bridge.
- `bindKeys`: acceptable, but less precise because it does not say whether the subset refers to
  schema ownership, form controls, or synchronization direction.
- `syncKeys`: technically accurate, but too transport-oriented. It hides the ownership model and
  reads more like an internal optimization than a consumer contract.

### Recommendation

Use `managedKeys` if this feature moves forward. It is the clearest fit with the current package
language and preserves the distinction between managed URL-backed controls and extra local form
controls.

## RFC: Manual Or Apply-Button Sync Mode

### Status

Proposed. Keep the package live-sync by default and do not implement this mode until a concrete
adopter proves the need.

### Context

`@hexguard/angular-query-form` currently patches URL state from `form.valueChanges` immediately.
That is the right default for search pages, filter bars, pagination, and history-aware list views.

The pressure for a second mode comes from filter drawers, side panels, and report builders where
users expect to stage edits locally and commit them with an explicit Apply action.

### Option A: Stay Strictly Live-Sync Only

- Keeps the package identity narrow and easy to explain.
- Preserves the strongest guarantee: form values and committed URL state do not drift apart.
- Avoids new lifecycle questions around Back, Forward, dirty edits, and reset semantics.
- Leaves staged-edit workflows to plain `urlState()` plus custom local form code.

### Option B: Add Manual Mode As An Opt-In

- Expands adoption to explicit-apply workflows without forcing consumers to reimplement schema,
  equality, reset, and hydration logic.
- Adds a second mental model where form values can differ from committed URL state for an
  arbitrary amount of time.
- Makes history replay, invalid-param cleanup, and `reset()` behavior more complex because the
  package must define what happens when local staged edits conflict with external URL changes.

### Minimal API If Adopted Later

```ts
export type QueryFormSyncMode = 'live' | 'manual';

export interface QueryFormOptions<TSchema extends UrlStateSchema>
  extends UrlStateOptionsInput {
  readonly syncMode?: QueryFormSyncMode;
}

export interface QueryForm<TSchema extends UrlStateSchema, TForm extends FormGroup = FormGroup> {
  readonly form: TForm;
  readonly urlState: UrlState<TSchema>;
  readonly hasPendingChanges: Signal<boolean>;
  snapshot(): InferSchemaValue<TSchema>;
  patch(value: Partial<InferSchemaValue<TSchema>>): void;
  reset(): void;
  commit(): void;
  revert(): void;
}
```

### Open questions

- When `syncMode` is `manual`, should Back or Forward immediately overwrite staged form edits?
- Should `reset()` clear staged edits only, committed URL state only, or both?
- Should `invalidParamBehavior: 'removeInvalid'` clean the URL as soon as parsing happens even if
  the form is still dirty locally?
- Does `debounceMs` still apply in manual mode, or does `commit()` always navigate immediately?

### Recommendation

Keep the package strictly live-sync for now. Subset binding solves a more common adoption problem
without changing the package's mental model. Revisit manual mode only after a real consumer proves
that the current live-sync contract forces too much custom glue.

## Follow-Ups

- Turn subset binding into a dedicated follow-up backlog file once the API is accepted.
- Keep manual or apply-button mode at RFC status until a concrete adopter appears.
- Treat nested control path mapping as a separate design spike, not the next default feature.
- Revisit composable child bindings only after the package proves out the single-owner subset model.
- Consider `@hexguard/angular-api-errors` and async-action/submit-lock packages after query-form
  gives HexGuard a stronger form story.
