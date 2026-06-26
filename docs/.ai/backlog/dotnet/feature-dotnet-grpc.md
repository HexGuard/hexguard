---
id: feature-dotnet-grpc
type: feature
status: proposed
created: 2026-06-26
package: HexGuard.Grpc
---

# HexGuard.Grpc

## Summary

gRPC conventions for .NET — typed client factory, gRPC status → ProblemDetails error mapping, deadline propagation, and logging interceptor.

**Competition check:** ASP.NET Core gRPC integration handles the basics but lacks ergonomic error mapping.

## Proposed Public API

```csharp
builder.Services.AddHexGuardGrpcClient<ICatalogService>(options =>
{
    options.Address = "https://catalog:5001";
    options.DefaultDeadline = TimeSpan.FromSeconds(5);
    options.MapGrpcErrors = true;  // gRPC status → ProblemDetails
    options.EnableCallLogging = true;
});

// Error mapping:
// gRPC NotFound → 404 ProblemDetails
// gRPC InvalidArgument → 400 ValidationProblemDetails
// gRPC Internal → 500 ProblemDetails
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Grpc/`.
2. Implement typed client factory with interceptors.
3. Implement gRPC → ProblemDetails error mapping.
4. Add tests.
5. Register in `HexGuard.slnx`.
6. Publish as NuGet.
