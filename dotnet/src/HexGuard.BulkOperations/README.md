# HexGuard.BulkOperations

**Bulk action contracts, response builder, and ASP.NET Core endpoint helpers for HTTP 207 Multi-Status partial-success scenarios.**

Part of the [HexGuard](https://github.com/HexGuard/hexguard) catalog.
Pairs with [`@hexguard/angular-bulk-operations`](https://github.com/HexGuard/hexguard/tree/main/angular/packages/angular-bulk-operations) on the Angular side.

## Install

```shell
dotnet add package HexGuard.BulkOperations
```

Requires `net10.0` or later and a `FrameworkReference` to `Microsoft.AspNetCore.App`.

## Quick Start

```csharp
using HexGuard.BulkOperations;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapPost("/api/bulk-operations/delete", (
    BulkOperationRequest<Order, object?> request) =>
{
    var results = request.Items.Select(item =>
    {
        if (item.Status == "shipped")
        {
            return new BulkOperationResult<Order, DeleteResult>(
                item, false, null,
                new BulkOperationError("CANNOT_DELETE", "Cannot delete shipped order"));
        }
        return new BulkOperationResult<Order, DeleteResult>(
            item, true, new DeleteResult(true), null);
    }).ToList();

    var response = BulkOperationResultBuilder.Build<Order, DeleteResult>(results);
    return Results.Extensions.BulkOperation(response);
});

app.Run();
```

## API Surface

### Core Types

- `BulkOperationStatus` — enum with Completed, PartialFailure, Failed
- `BulkOperationError` — per-item error with Code, Message, optional Field
- `BulkOperationResult<TItem, TResult>` — per-item outcome with Item, Succeeded, optional Result and Error
- `BulkOperationResponse<TItem, TResult>` — response envelope with Status, TotalCount, SuccessCount, FailureCount, Results
- `BulkOperationRequest<TItem, TPayload>` — request with Items, optional SharedPayload, optional PerItemPayloads

### Result Builder

```csharp
var response = BulkOperationResultBuilder.Build(results);
```

Automatically computes:
- `Status`: Completed (all success), PartialFailure (mixed), Failed (all failure)
- `TotalCount`, `SuccessCount`, `FailureCount`

### Minimal API Extensions

```csharp
Results.Extensions.BulkOperation(response)
// Returns 200 OK for Completed, 207 Multi-Status for PartialFailure/Failed
```

### Problem Details

```csharp
var problemDetails = response.ToProblemDetails();
// Returns null for Completed, RFC 9457 JSON for PartialFailure/Failed
```

## Cross-Stack Pairing

| Side | Package |
|---|---|
| .NET | `HexGuard.BulkOperations` |
| Angular | `@hexguard/angular-bulk-operations` |

Both packages share identical contract shapes for end-to-end typed bulk actions.
