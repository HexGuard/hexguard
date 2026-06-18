# HexGuard.BulkOperations

Bulk action contracts, response builder, and ASP.NET Core endpoint helpers for HTTP 207 Multi-Status partial-success scenarios. The .NET counterpart of `@hexguard/angular-bulk-operations`.

## Public API

### Core Types

| Type | Description |
|---|---|
| `BulkOperationStatus` | Enum: Completed, PartialFailure, Failed |
| `BulkOperationError` | Record: Code, Message, Field? |
| `BulkOperationResult<TItem, TResult>` | Record: Item, Succeeded, Result?, Error? |
| `BulkOperationResponse<TItem, TResult>` | Record: Status, TotalCount, SuccessCount, FailureCount, Results |
| `BulkOperationRequest<TItem, TPayload>` | Record: Items, SharedPayload?, PerItemPayloads? |

### Result Builder

```csharp
var response = BulkOperationResultBuilder.Build(items, results);
// response.Status, response.TotalCount, response.SuccessCount, response.FailureCount
```

### Minimal API Integration

```csharp
using HexGuard.BulkOperations;

app.MapPost("/api/bulk-operations/delete", (
    BulkOperationRequest<Order, object?> request) =>
{
    // Process items...
    var results = ...; // per-item results
    var response = BulkOperationResultBuilder.Build<Order, DeleteResult>(results);
    return Results.Extensions.BulkOperation(response);
});
```

The `Results.Extensions.BulkOperation()` factory:
- Returns `200 OK` with JSON body when all items succeed
- Returns `207 Multi-Status` with JSON body when partial or all items fail

### Problem Details Integration

```csharp
var problemDetails = response.ToProblemDetails();
// Returns null for Completed status
// Returns RFC 9457 payload for PartialFailure or Failed with errors in "errors" extension
```

## Demo Endpoints

The shared `HexGuard.SampleApi` exposes:

| Endpoint | Description |
|---|---|
| `POST /api/bulk-operations/delete` | Bulk delete with per-item CANNOT_DELETE errors for shipped orders |
| `POST /api/bulk-operations/approve` | Bulk approve with per-item INVALID_STATUS errors for shipped/cancelled orders |
| `POST /api/bulk-operations/update-status` | Bulk status change with per-item payload and INVALID_STATUS errors for cancelled orders |

## Cross-Stack Pairing

| Side | Package |
|---|---|
| .NET | `HexGuard.BulkOperations` |
| Angular | `@hexguard/angular-bulk-operations` |

Both packages share:
- Identical contract shapes (Request, Response, Result, Error)
- HTTP 207 Multi-Status transport
- RFC 9457 Problem Details error integration on the .NET side
- `@hexguard/angular-api-errors` compatible error shapes
