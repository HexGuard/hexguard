---
id: feature-operation-status-cross-stack
type: feature
status: proposed
created: 2026-06-13
updated: 2026-06-17
package: 'HexGuard.OperationStatus + @hexguard/angular-operation-status'
---

# Operation Status Cross-Stack Package Pair

## Summary

Design a coordinated `.NET + Angular` package pair for long-running operation contracts such as imports, exports, sync jobs, rebuilds, or background tasks that expose progress, current stage, completion, failure, and cancellation.

This is a strong repeated cross-stack problem: APIs invent job IDs and progress payloads one way, Angular clients poll them another way, and no shared contract exists for operation lifecycle state.

## Goals

- Standardize long-running operation contracts across backend and frontend.
- Provide a .NET package for operation result models, status endpoints, and helper contracts.
- Provide an Angular package for polling, progress, and operation-state rendering.
- Keep progress, completion, and cancellation semantics explicit and typed.
- Compose with `HexGuard.BackgroundJobs` for job execution and `@hexguard/angular-async-state` for lifecycle rendering.

## Non-Goals

- A job scheduler implementation — that's `HexGuard.BackgroundJobs`.
- Queue infrastructure.
- Transport-specific real-time streaming in the first version.

## Decisions

- Treat the pair as a coordinated contract, not unrelated packages.
- Prefer polling-first support with later real-time extensions if needed.
- Keep progress payloads backend-defined but strongly typed.
- Use a single `GET /api/operations/{id}` endpoint for status polling.
- The Angular side uses `injectAsyncValue` internally for the polling lifecycle.

## Proposed Public API

### .NET Contracts

```csharp
public record OperationStatus(
    Guid OperationId,
    string Status,              // "Queued" | "Running" | "Completed" | "Failed" | "Cancelled"
    string? Stage,              // e.g., "Validating", "Processing", "Writing"
    double? ProgressPercent,    // 0–100
    DateTime CreatedAtUtc,
    DateTime? CompletedAtUtc,
    IReadOnlyDictionary<string, object>? Result,
    string? ErrorMessage
);

public static class OperationEndpoints
{
    public static RouteGroupBuilder MapOperationEndpoints(this RouteGroupBuilder group);
    // GET  /{id}           → OperationStatus
    // POST /{id}/cancel    → 202 Accepted
}
```

### Angular

```ts
import { injectOperationStatus } from '@hexguard/angular-operation-status';

const operation = injectOperationStatus('job-abc-123', {
  pollIntervalMs: 2000,
  onComplete: (result) => console.log('Done', result),
});

operation.status;             // Signal<OperationStatus | null>
operation.isRunning;          // Signal<boolean>
operation.isCompleted;        // Signal<boolean>
operation.isFailed;           // Signal<boolean>
operation.progressPercent;    // Signal<number>
operation.stage;              // Signal<string | null>
operation.error;              // Signal<string | null>
operation.cancel();           // POST /api/operations/{id}/cancel
```

## Implementation Plan

### Phase 0: .NET — HexGuard.OperationStatus

1. Scaffold project + tests under `dotnet/src/HexGuard.OperationStatus/` and `dotnet/tests/HexGuard.OperationStatus.Tests/`.
2. Add solution file entries in `HexGuard.slnx`.
3. Define `OperationStatus` record, `OperationEndpoints` route group.
4. Implement `InMemoryOperationStore` with concurrent dictionary and TTL-based cleanup.
5. Implement `IStore<T>` interface for pluggable persistence.
6. Implement minimal-API endpoints: `GET /api/operations/{id}`, `POST /api/operations/{id}/cancel`.
7. Add unit + integration tests via `WebApplicationFactory`.

### Phase 1: Angular — @hexguard/angular-operation-status

8. Scaffold `angular/packages/angular-operation-status/` following existing conventions.
9. Define TypeScript types mirroring .NET contracts.
10. Implement `injectOperationStatus()` with polling timer, auto-cleanup on destroy, and signal updates.
11. Implement `cancel()` — POST to cancel endpoint.
12. Add unit tests for: polling cycle, status transitions, cancel, error handling, cleanup.

### Phase 2: Demo & Docs

13. Add .NET endpoint group to `HexGuard.SampleApi` with a simulated long-running operation.
14. Add Angular demo route at `/packages/angular-operation-status` with progress bar, stage display, cancel button.
15. Add Playwright coverage.
16. Write `docs/packages/hexguard-operation-status.md` and `docs/packages/angular-operation-status.md`.
17. Update READMEs.

### Phase 3: Release

18. Add build/test/verify scripts for both packages.
19. Add release workflows.
20. Run `pnpm dotnet:test`, `pnpm dotnet:build`, `pnpm test:lib:operation-status`, `pnpm build:lib`.

## Validation

- `pnpm dotnet:test` — .NET tests.
- `pnpm test:lib:operation-status` — Angular tests.
- `pnpm test:e2e` — Playwright.
- `pnpm dotnet:build` — .NET builds.

## Follow-Ups

- Revisit SSE push for lower-latency status updates instead of polling.
- Evaluate integration with `HexGuard.BackgroundJobs` for automatic job-status tracking.
- Consider adding batch status endpoint (`GET /api/operations?ids=...`) for dashboards.

