# `@hexguard/angular-bulk-operations` Deep Dive

This page complements the npm-facing README with repo-specific implementation notes and behavior details.

## Purpose

`@hexguard/angular-bulk-operations` provides a generic bulk-action service and facade for Angular that handles HTTP 207 Multi-Status partial-success responses. It composes with `@hexguard/angular-selection-state` for the "select items → act on selection → display per-item results" flow.

## Public API Map

| Export | Role |
|--------|------|
| `BulkOperationService` | Generic injectable service with signals + execution methods |
| `BulkOperationConfig` | Configuration for the service (execute function) |
| `provideBulkOperation()` | Provider factory for the service |
| `injectBulkOperation()` | Facade returning typed signals + methods |
| `selectedItemsToBulkRequest()` | Maps selection-state signal + items map to a request |
| Types | `BulkOperationStatus`, `BulkOperationError`, `BulkOperationResult`, `BulkOperationResponse`, `BulkOperationRequest` |

## Behavior Details

### Execution Lifecycle

1. `execute(request)` sets `inProgress` to `true`
2. Calls the configured `executeFn` with the request
3. On success: updates `results` and `summary` signals, sets `inProgress` to `false`
4. On error: captures the error message in `error` signal, sets `results` to empty, sets `inProgress` to `false`

### Summary Signal

The `summary` signal returns `null` when no results exist, otherwise:

```ts
{ total: number, succeeded: number, failed: number }
```

### Retry Failed Items

`retryFailed(buildRetryRequest)` extracts items where `succeeded === false` from the last results and calls `buildRetryRequest` to construct a new request containing only the failed items.

### Selection-State Composition

`selectedItemsToBulkRequest(selectedSignal, itemsMap, sharedPayload?)` consumes the `selected` signal from `@hexguard/angular-selection-state` and builds a `BulkOperationRequest` containing only the selected items.

## Cross-Stack Pairing

| Side | Package |
|------|---------|
| Angular | `@hexguard/angular-bulk-operations` |
| .NET | `HexGuard.BulkOperations` |

Both packages share identical contract shapes (BulkOperationRequest, BulkOperationResponse, BulkOperationResult, BulkOperationError).

## Scope Boundaries

**Included** — generic bulk-action service with progress tracking, result/summary signals, retry-failed flow, selection-state composition, typed contracts.

**Excluded** — admin-panel UI or data-table components, long-running operation polling (OperationStatus pair), distributed transaction guarantees, file uploads.
