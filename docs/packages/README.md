# Package Catalog

This page tracks the published package, the next planned packages, and how they relate to one
another.

## Current Packages

| Package                        | Status      | Description                                                                                        | Primary Docs                                                                                         |
| ------------------------------ | ----------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `@hexguard/angular-url-state`  | Available   | Type-safe, signal-first synchronization between Angular state and URL query parameters.            | [Deep Dive](angular-url-state.md), [npm-facing README](../../packages/angular-url-state/README.md)   |
| `@hexguard/angular-query-form` | In Progress | Reactive Forms binding for typed query params, reset-on-change rules, and malformed-link recovery. | [Deep Dive](angular-query-form.md), [npm-facing README](../../packages/angular-query-form/README.md) |

## Package Status Notes

<a id="package-angular-query-form"></a>

### `@hexguard/angular-query-form`

Status: In Progress

This package now exists in the repo as a Reactive Forms companion to `@hexguard/angular-url-state`.
It focuses on typed top-level form binding, dependent reset rules such as `search -> page`, and
demo-driven coverage for history replay and malformed-link recovery.

## Planned Package Briefs

<a id="package-angular-submit-lock"></a>

### `@hexguard/angular-submit-lock`

Status: Planned

May narrow into thin ergonomics for preventing duplicate submissions and exposing explicit
in-flight state on top of a broader async action contract.

<a id="package-angular-async-state"></a>

### `@hexguard/angular-async-state`

Status: Proposed

Would standardize async value and async action lifecycle state such as loading, loaded,
reloading, pending, success, empty, and error through a signal-first utility API, with optional
thin template helpers layered on top.

<a id="package-angular-optimistic-state"></a>

### `@hexguard/angular-optimistic-state`

Status: Proposed

Would standardize optimistic mutation, rollback, and reconciliation patterns for Angular screens
that need fast local updates without losing correctness.

<a id="package-angular-upload-state"></a>

### `@hexguard/angular-upload-state`

Status: Proposed

Would standardize upload lifecycle state such as queueing, progress, retry, cancel, and
completion without forcing one transport implementation.

<a id="package-angular-route-memory"></a>

### `@hexguard/angular-route-memory`

Status: Proposed

Would standardize repeated route-memory patterns such as return-to-list, restored filters, last
tab, and route-scoped context recovery.

<a id="package-angular-navigation-pending"></a>

### `@hexguard/angular-navigation-pending`

Status: Proposed

Would standardize route transition busy state, page readiness, and app-level navigation pending
indicators through a headless Angular contract.

<a id="package-angular-permissions"></a>

### `@hexguard/angular-permissions`

Status: Proposed

Would standardize capability and policy checks across routes, templates, actions, and feature code
through a headless Angular permission contract.

<a id="package-angular-form-drafts"></a>

### `@hexguard/angular-form-drafts`

Status: Proposed

Would standardize draft persistence, restore, discard, and autosave ergonomics for Angular edit
flows without forcing one storage or form model.

<a id="package-angular-selection-state"></a>

### `@hexguard/angular-selection-state`

Status: Proposed

Would standardize keyed selection, bulk-action enablement, and select-visible behavior for lists
and tables through a headless state model.

<a id="package-angular-feature-flags"></a>

### `@hexguard/angular-feature-flags`

Status: Proposed

Would standardize typed feature-flag checks across routes, templates, and service logic while
remaining provider-agnostic.

<a id="package-angular-confirmation"></a>

### `@hexguard/angular-confirmation`

Status: Proposed

Would standardize confirm/cancel and confirm-and-run flows for destructive or high-impact actions
through a headless API with optional dialog adapters.

<a id="package-angular-live-data"></a>

### `@hexguard/angular-live-data`

Status: Proposed

Would standardize visibility-aware polling, stale indicators, and refresh ergonomics for
dashboard-style and operational Angular screens.

<a id="package-angular-page-context"></a>

### `@hexguard/angular-page-context`

Status: Proposed

Would standardize page titles, breadcrumbs, contextual actions, and route-scoped page chrome
through a headless metadata contract.

<a id="package-angular-command-palette"></a>

### `@hexguard/angular-command-palette`

Status: Proposed

Would standardize command registration, keyboard shortcuts, and searchable command invocation,
with optional palette UI layered over a headless command registry.

<a id="package-angular-query-signal-forms"></a>

### `@hexguard/angular-query-signal-forms`

Status: Proposed

Would extend the URL-state story to Angular Signal Forms through a separate adapter package so the
Reactive Forms contract in `@hexguard/angular-query-form` stays stable while Angular's signal-form
surface continues to evolve.

<a id="package-angular-api-errors"></a>

### `@hexguard/angular-api-errors`

Status: Planned

Will normalize backend validation, business-rule failures, and problem-details payloads into a
consistent Angular-facing error surface.

<a id="package-angular-table-state"></a>

### `@hexguard/angular-table-state`

Status: Planned

Builds on URL state to coordinate sorting, paging, filters, and selection in reusable data-table
workflows.

<a id="package-angular-preferences"></a>

### `@hexguard/angular-preferences`

Status: Planned

Targets lightweight user preferences such as dashboard defaults, hidden columns, and saved views.

<a id="package-angular-dirty-state"></a>

### `@hexguard/angular-dirty-state`

Status: Planned

Will provide consistent unsaved-change tracking and route-guard integration for Angular screens.

<a id="package-angular-http-dedupe"></a>

### `@hexguard/angular-http-dedupe`

Status: Planned

Designed to collapse duplicate HTTP work across concurrent consumers while keeping cancellation and
cache semantics explicit.

<a id="package-angular-http-resource-debug"></a>

### `@hexguard/angular-http-resource-debug`

Status: Planned

Will add visibility into resource/request lifecycles for teams debugging stale caches, retries, and
request churn.

## Broader Prioritization Matrix

Scores use `1-5` where higher adoption means broader repeated demand, higher complexity means a
harder package to design and support well, and higher differentiation means a stronger HexGuard
story beyond thin wrappers.

| Package | Scope | Status | Adoption | Complexity | Differentiation | Priority |
| ------- | ----- | ------ | -------- | ---------- | --------------- | -------- |
| `@hexguard/angular-async-state` | Angular | Proposed | 5 | 3 | 4 | High |
| `@hexguard/angular-api-errors` | Angular | Planned | 5 | 3 | 5 | High |
| `@hexguard/angular-permissions` | Angular | Proposed | 5 | 3 | 4 | High |
| `@hexguard/angular-form-drafts` | Angular | Proposed | 4 | 3 | 4 | High |
| `@hexguard/angular-selection-state` | Angular | Proposed | 4 | 3 | 4 | High |
| `HexGuard.OperationStatus + @hexguard/angular-operation-status` | Cross-stack | Proposed | 5 | 4 | 5 | High |
| `HexGuard.Idempotency + @hexguard/angular-idempotency` | Cross-stack | Proposed | 5 | 4 | 5 | High |
| `HexGuard.ProblemDetails` | .NET | Planned | 5 | 3 | 4 | High |
| `@hexguard/angular-table-state` | Angular | Planned | 4 | 4 | 4 | High |
| `HexGuard.ValidationContracts + @hexguard/angular-api-errors` | Cross-stack | Proposed | 4 | 4 | 5 | High |
| `HexGuard.QueryContracts + @hexguard/angular-query-contracts` | Cross-stack | Proposed | 4 | 4 | 4 | High |
| `@hexguard/angular-optimistic-state` | Angular | Proposed | 4 | 4 | 4 | High |
| `HexGuard.Concurrency` | .NET | Proposed | 4 | 4 | 4 | High |
| `@hexguard/angular-feature-flags` | Angular | Proposed | 4 | 3 | 3 | Medium |
| `@hexguard/angular-live-data` | Angular | Proposed | 4 | 4 | 4 | Medium |
| `@hexguard/angular-dirty-state` | Angular | Planned | 4 | 3 | 3 | Medium |
| `@hexguard/angular-upload-state` | Angular | Proposed | 4 | 4 | 4 | Medium |
| `HexGuard.PreferenceSync + @hexguard/angular-preferences` | Cross-stack | Proposed | 4 | 4 | 4 | Medium |
| `HexGuard.EndpointConventions` | .NET | Proposed | 4 | 3 | 3 | Medium |
| `@hexguard/angular-preferences` | Angular | Planned | 3 | 2 | 3 | Medium |
| `@hexguard/angular-confirmation` | Angular | Proposed | 4 | 2 | 2 | Medium |
| `@hexguard/angular-navigation-pending` | Angular | Proposed | 3 | 3 | 3 | Medium |
| `HexGuard.Uploads + @hexguard/angular-upload-state` | Cross-stack | Proposed | 4 | 5 | 4 | Explore |
| `HexGuard.Filtering` | .NET | Proposed | 3 | 3 | 3 | Explore |
| `HexGuard.AuditTrail` | .NET | Proposed | 3 | 3 | 3 | Explore |
| `@hexguard/angular-page-context` | Angular | Proposed | 3 | 2 | 3 | Explore |
| `@hexguard/angular-command-palette` | Angular | Proposed | 3 | 3 | 4 | Explore |
| `@hexguard/angular-query-signal-forms` | Angular | Proposed | 3 | 4 | 3 | Explore |
| `@hexguard/angular-http-dedupe` | Angular | Planned | 3 | 4 | 4 | Explore |
| `@hexguard/angular-http-resource-debug` | Angular | Planned | 2 | 4 | 5 | Explore |
| `@hexguard/angular-route-memory` | Angular | Proposed | 3 | 3 | 3 | Explore |
| `@hexguard/angular-submit-lock` | Angular | Planned | 3 | 2 | 2 | Explore |

## Angular Candidate Prioritization Matrix

Scores use `1-5`, where `5` means higher adoption, higher implementation/support complexity, or
higher differentiation.

| Rank | Package | Status | Adoption | Complexity | Differentiation | Notes |
| ---- | ------- | ------ | -------- | ---------- | --------------- | ----- |
| 1 | `@hexguard/angular-async-state` | Proposed | 5 | 3 | 4 | Broad async read and action lifecycle need across most Angular apps |
| 2 | `@hexguard/angular-api-errors` | Planned | 5 | 3 | 5 | Strong cross-stack value when paired with consistent backend error contracts |
| 3 | `@hexguard/angular-permissions` | Proposed | 5 | 3 | 4 | Common enterprise pain point with repeated route, template, and action checks |
| 4 | `@hexguard/angular-form-drafts` | Proposed | 4 | 3 | 4 | High value on edit-heavy apps without overlapping query or dirty state directly |
| 5 | `@hexguard/angular-selection-state` | Proposed | 4 | 3 | 4 | Repeated list and table pattern with strong admin-app adoption potential |
| 6 | `@hexguard/angular-optimistic-state` | Proposed | 4 | 4 | 4 | Repeated mutation UX problem with strong admin and internal-tool value |
| 7 | `@hexguard/angular-feature-flags` | Proposed | 4 | 3 | 3 | Broadly useful but more crowded and less differentiated than permissions |
| 8 | `@hexguard/angular-table-state` | Planned | 4 | 4 | 4 | Valuable once URL/query patterns and selection patterns are clearer |
| 9 | `@hexguard/angular-live-data` | Proposed | 4 | 4 | 4 | Strong dashboard and ops value, but more orchestration complexity |
| 10 | `@hexguard/angular-dirty-state` | Planned | 4 | 3 | 3 | Common need, but narrower than async-state or permissions |
| 11 | `@hexguard/angular-upload-state` | Proposed | 4 | 4 | 3 | High practical value where uploads matter, but less universal than async-state |
| 12 | `@hexguard/angular-preferences` | Planned | 3 | 2 | 3 | Useful companion package with moderate adoption and low build cost |
| 13 | `@hexguard/angular-confirmation` | Proposed | 4 | 2 | 2 | Common pattern, but easier to re-create and less differentiated |
| 14 | `@hexguard/angular-route-memory` | Proposed | 3 | 3 | 3 | Valuable in list-detail-edit apps, but narrower than core state packages |
| 15 | `@hexguard/angular-navigation-pending` | Proposed | 3 | 3 | 2 | Useful UX primitive, but can overlap with existing router and async-state patterns |
| 16 | `@hexguard/angular-page-context` | Proposed | 3 | 2 | 3 | Helpful for larger apps, but less universal than state and policy packages |
| 17 | `@hexguard/angular-command-palette` | Proposed | 3 | 3 | 4 | Good product differentiation, but narrower adoption profile |
| 18 | `@hexguard/angular-http-dedupe` | Planned | 3 | 4 | 4 | Real performance value, but implementation and semantics are trickier |
| 19 | `@hexguard/angular-http-resource-debug` | Planned | 2 | 4 | 5 | Highly differentiated, but niche compared with core app-state packages |
| 20 | `@hexguard/angular-query-signal-forms` | Proposed | 3 | 4 | 3 | Strategically relevant, but gated by Angular Signal Forms maturity |
| 21 | `@hexguard/angular-submit-lock` | Planned | 3 | 2 | 2 | Likely narrows into thin ergonomics on top of async-action primitives |
| 22 | `@hexguard/angular-optimistic-actions` | Proposed | 2 | 3 | 2 | Likely overlaps too much with optimistic-state unless the action-only surface stays very narrow |
| 23 | `@hexguard/angular-operation-status` | Proposed | 3 | 3 | 4 | Strong when paired with server-side operation contracts |
| 24 | `@hexguard/angular-idempotency` | Proposed | 3 | 3 | 4 | Most valuable when paired with server-side idempotent APIs |
| 25 | `@hexguard/angular-query-contracts` | Proposed | 3 | 3 | 3 | Useful contract layer, but strongest in cross-stack scenarios rather than standalone Angular |

## Cross-Stack Candidate Prioritization Matrix

These proposals are strongest when Angular and .NET packages ship as complementary pairs.

| Rank | Package Pair | Adoption | Complexity | Differentiation | Notes |
| ---- | ------------ | -------- | ---------- | --------------- | ----- |
| 1 | `HexGuard.OperationStatus` + `@hexguard/angular-operation-status` | 5 | 4 | 5 | Strong long-running operation story across export, import, rebuild, and sync flows |
| 2 | `HexGuard.ValidationContracts` + `@hexguard/angular-api-errors` | 5 | 3 | 5 | Clear cross-stack value for field paths, error codes, and form mapping |
| 3 | `HexGuard.Idempotency` + `@hexguard/angular-idempotency` | 4 | 4 | 5 | Strong correctness story for duplicate-submit and replay-safe commands |
| 4 | `HexGuard.QueryContracts` + `@hexguard/angular-query-contracts` | 4 | 3 | 4 | Useful glue between query-form, table-state, and pageable APIs |
| 5 | `HexGuard.PreferenceSync` + `@hexguard/angular-preferences` | 3 | 3 | 3 | Strong once saved views and user preferences become a larger product concern |
| 6 | `HexGuard.Uploads` + `@hexguard/angular-upload-state` | 3 | 4 | 4 | Valuable for upload-heavy apps, but narrower than operation status or validation contracts |

## .NET Candidate Prioritization Matrix

| Rank | Package | Status | Adoption | Complexity | Differentiation | Notes |
| ---- | ------- | ------ | -------- | ---------- | --------------- | ----- |
| 1 | `HexGuard.ProblemDetails` | Planned | 5 | 3 | 4 | Foundational error-response guardrail with strong ecosystem fit |
| 2 | `HexGuard.Concurrency` | Proposed | 4 | 3 | 4 | Repeated CRUD API pain point with good Angular-side synergy |
| 3 | `HexGuard.Idempotency` | Proposed | 4 | 4 | 5 | High-value correctness primitive for command-style APIs |
| 4 | `HexGuard.OperationStatus` | Proposed | 4 | 4 | 5 | Strong operational workflow story for long-running jobs |
| 5 | `HexGuard.ValidationContracts` | Proposed | 4 | 3 | 4 | Strong server contract story with Angular mapping upside |
| 6 | `HexGuard.QueryContracts` | Proposed | 4 | 3 | 4 | Good API consistency story, especially with Angular query-state packages |
| 7 | `HexGuard.EndpointConventions` | Proposed | 4 | 4 | 3 | Broadly useful, but differentiation depends on keeping the helpers sharp and minimal |
| 8 | `HexGuard.Filtering` | Proposed | 4 | 3 | 3 | Common need, but can become generic or ORM-adjacent quickly |
| 9 | `HexGuard.Pagination` | Planned | 4 | 2 | 3 | Broadly useful but less differentiated on its own |
| 10 | `HexGuard.Webhooks` | Planned | 3 | 4 | 4 | Real operational value, but narrower audience than core API guardrails |
| 11 | `HexGuard.PreferenceSync` | Proposed | 3 | 3 | 3 | Useful mostly when preferences become a broader cross-device product need |
| 12 | `HexGuard.AuditTrail` | Proposed | 3 | 3 | 3 | Common business-app concern, but policy and storage needs vary widely |
| 13 | `HexGuard.Uploads` | Proposed | 3 | 4 | 4 | Strong in document-heavy products, but narrower than core API reliability packages |

<a id="package-problemdetails"></a>

### `HexGuard.ProblemDetails`

Status: Planned

The .NET problem-details package will focus on creating, mapping, and testing API error payloads
in line with RFC 9457-style responses.

<a id="package-webhooks"></a>

### `HexGuard.Webhooks`

Status: Planned

Targets webhook signature validation, event envelope handling, and operationally safe processing
pipelines in .NET services.

<a id="package-pagination"></a>

### `HexGuard.Pagination`

Status: Planned

Will provide reusable API contracts and helpers for cursor or page-based pagination in .NET.
