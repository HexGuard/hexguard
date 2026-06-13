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

Focuses on preventing duplicate submissions and exposing explicit in-flight state for forms and
command-style interactions.

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
