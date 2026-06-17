---
id: feature-bulk-operations-cross-stack
type: feature
status: proposed
created: 2026-06-17
package: 'HexGuard.BulkOperations + @hexguard/angular-bulk-operations'
---

# Bulk Operations Cross-Stack Package Pair

## Summary

Design a coordinated `.NET + Angular` package pair (`HexGuard.BulkOperations` + `@hexguard/angular-bulk-operations`) for standardized bulk create, update, delete, archive, approve, and reassign actions with partial-success (HTTP 207 Multi-Status) reporting.

The repeated problem is that every admin panel needs bulk actions (select 10 items → delete them, approve 5 requests, reassign 20 tasks), and every team builds the same partial-success handling: some items succeed, some fail, and the UI needs to show per-item results with meaningful error messages. The HTTP 207 Multi-Status pattern is well-defined but rarely standardized into reusable contracts. A cross-stack pair would solve this once.

## Goals

- Define a shared bulk-operation contract with typed request items, per-item responses, and aggregate status.
- Provide a .NET package (`HexGuard.BulkOperations`) for bulk-endpoint helpers, response envelope construction, and per-item error aggregation.
- Provide an Angular package (`@hexguard/angular-bulk-operations`) that composes selection-state with bulk-action execution, progress tracking, and per-item result rendering.
- Support the common patterns: bulk delete, bulk status-change, bulk update with shared payload, and heterogeneous actions per item.
- Compose with `@hexguard/angular-selection-state` (proposed) for the "select items → act on selection" flow.
- Compose with `@hexguard/angular-async-state` for tracking the bulk action's in-flight state.

## Non-Goals

- Building an admin-panel UI or data-table component.
- Handling long-running bulk operations that need background-job polling (that's the OperationStatus pair).
- Distributed transaction guarantees or rollback semantics.
- File uploads (that's the Uploads pair).

## Decisions

- Use HTTP 207 Multi-Status as the transport envelope with `application/json` content.
- Keep per-item errors consistent with `HexGuard.ValidationContracts` error shape for field-level error display.
- Treat the Angular package as a thin coordinator over selection-state and async-state, not a replacement for either.
- Keep the request model flexible: a shared payload for all items (bulk delete, bulk status change) or per-item payloads (bulk update with different values).
- Release-coupling: independent minor versions with opt-in coordinated major releases.

## Proposed Contracts

### .NET Models

```csharp
// Request
public record BulkOperationRequest<TItem, TPayload>(
    IReadOnlyList<TItem> Items,
    TPayload? SharedPayload,
    IReadOnlyDictionary<string, TPayload>? PerItemPayloads   // keyed by item id
);

// Response
public record BulkOperationResponse<TItem, TResult>(
    BulkOperationStatus Status,
    int TotalCount,
    int SuccessCount,
    int FailureCount,
    IReadOnlyList<BulkOperationResult<TItem, TResult>> Results
);

public record BulkOperationResult<TItem, TResult>(
    TItem Item,
    bool Succeeded,
    TResult? Result,
    BulkOperationError? Error
);

public record BulkOperationError(
    string Code,
    string Message,
    string? Field                         // optional field path for form-level binding
);

public enum BulkOperationStatus { Completed, PartialFailure, Failed }
```

### Angular Types

```ts
interface BulkOperationRequest<TItem, TPayload = void> {
  items: TItem[];
  sharedPayload?: TPayload;
  perItemPayloads?: Map<string, TPayload>;
}

interface BulkOperationResponse<TItem, TResult = void> {
  status: 'completed' | 'partialFailure' | 'failed';
  totalCount: number;
  successCount: number;
  failureCount: number;
  results: BulkOperationResult<TItem, TResult>[];
}

interface BulkOperationResult<TItem, TResult> {
  item: TItem;
  succeeded: boolean;
  result?: TResult;
  error?: BulkOperationError;
}

interface BulkOperationError {
  code: string;
  message: string;
  field?: string;
}
```

## Implementation Plan

### Phase 0: .NET — HexGuard.BulkOperations

1. Scaffold the .NET project + test project under `dotnet/src/HexGuard.BulkOperations/` and `dotnet/tests/HexGuard.BulkOperations.Tests/`.
2. Define the core types: `BulkOperationRequest<TItem, TPayload>`, `BulkOperationResponse<TItem, TResult>`, `BulkOperationResult<TItem, TResult>`, `BulkOperationStatus`, `BulkOperationError`.
3. Implement `BulkOperationResultBuilder` — aggregates per-item results into the response envelope.
4. Implement `TypedResults.BulkOperation()` factory for minimal-API and controller usage.
5. Implement `ProblemDetails` integration: when the overall status is `Failed` or `PartialFailure`, produce an RFC 9457-compatible error with per-item details in the `"errors"` extension.
6. Add a sample API endpoint in `HexGuard.SampleApi` under `Packages/HexGuardBulkOperations/` with mock data for bulk delete and bulk status-change scenarios.
7. Add unit and integration tests via `WebApplicationFactory`.

### Phase 1: Angular — @hexguard/angular-bulk-operations

8. Scaffold the publishable Angular library under `angular/packages/angular-bulk-operations/`.
9. Define the Angular TypeScript types mirroring the .NET contracts.
10. Implement `BulkOperationService<TItem, TResult>` — generic service that accepts a fetch function and manages execution, progress, and result state.
11. Implement `injectBulkOperation()` facade that returns signals for:
    - `results: Signal<BulkOperationResult<TItem, TResult>[]>` — per-item results
    - `summary: Signal<{ total, succeeded, failed }>` — aggregate counts
    - `inProgress: Signal<boolean>` — any operation running
    - `execute(request): Promise<BulkOperationResponse>` — runs the operation
12. Implement composition helpers for `@hexguard/angular-selection-state`: `selectedItemsForBulkAction(selectionState)` that maps selected items into a bulk request.
13. Add unit tests for: success, partial-failure, full-failure, progress tracking, result aggregation, selection-state composition, and error parsing.

### Phase 2: Demo & Docs

14. Add a demo route at `/packages/angular-bulk-operations` showing:
    - A mock data table with checkboxes (using selection-state patterns)
    - "Delete selected" and "Approve selected" bulk actions
    - Partial-success scenario where some items fail
    - Per-item error display in a result summary panel
    - Retry-failed-items flow
15. Add the .NET bulk-operations endpoint to the shared `HexGuard.SampleApi`.
16. Add Playwright coverage for the demo page.
17. Write deep-dive docs: `docs/packages/angular-bulk-operations.md`, `docs/packages/hexguard-bulk-operations.md`.
18. Update the npm-facing and NuGet READMEs.

### Phase 3: Release

19. Add build, test, and verify scripts for both packages.
20. Add `.github/workflows/release-angular-bulk-operations.yml` and `.github/workflows/release-dotnet-bulk-operations.yml`.
21. Run `pnpm test:ci`, `pnpm build`, `pnpm dotnet:test`, and `pnpm dotnet:build` for the full validation gate.

## Validation

- `pnpm dotnet:test` — .NET unit and integration tests for response building, error aggregation, and endpoint behavior.
- `pnpm test:lib:bulk-operations` — Angular unit tests for service, result tracking, selection-state composition, error parsing.
- `pnpm build:lib` — Angular package builds.
- `pnpm test:app` — Demo app compiles.
- `pnpm test:e2e` — Playwright coverage for demo interactions.
- `pnpm dotnet:build` — .NET package builds.

## Follow-Ups

- Revisit cursor-based or streaming bulk results for very large item sets (1000+ items).
- Evaluate whether dry-run / preview-before-commit belongs in a separate companion or the same package.
- Consider adding an undo helper that composes the bulk-operation result with optimistic-state for reversible bulk actions.
- Revisit background-job integration with `HexGuard.OperationStatus` for bulk operations that take longer than a single request cycle.
