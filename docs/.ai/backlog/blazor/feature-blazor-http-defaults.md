---
id: feature-blazor-http-defaults
type: feature
status: proposed
created: 2026-06-29
package: 'HexGuard.Blazor.HttpDefaults'
---

# HexGuard.Blazor.HttpDefaults

## Summary

Pre-configured HttpClient factory for Blazor — base address, retry with exponential backoff, circuit breaker, timeout, auth header injection, and request/response logging. Replace 30 lines of HttpClient setup with a single `AddBlazorHttp()` call.

## Problem

Every Blazor project repeats the same HttpClient setup: configure base address from config, add Polly retry (3x exponential backoff), add circuit breaker (5 failures → break 30s), set timeouts, wire up auth token handler, add logging handler. This is boilerplate that shouldn't need to be rewritten per project.

## Goals

- Single `AddBlazorHttp()` call with opinionated defaults
- Automatic base address from `appsettings.json`
- Polly resilience pipeline (retry, circuit breaker, timeout)
- Automatic auth token attachment from `IAuthState`
- Request/response logging with configurable detail level
- Typed client generation from interface definitions
- Correlation ID propagation
- Configurable per-endpoint resilience overrides

## Non-Goals

- No API client code generation
- No caching layer
- No request/response transformation

## Proposed Public API

```csharp
// Program.cs — one-call setup
builder.Services.AddBlazorHttp(options =>
{
    options.BaseAddress = new Uri(builder.Configuration["Api:BaseUrl"]!);
    options.Resilience = new ResilienceOptions
    {
        RetryCount = 3,
        RetryBackoff = BackoffStrategy.Exponential,
        CircuitBreakerThreshold = 5,
        CircuitBreakerDuration = TimeSpan.FromSeconds(30),
        Timeout = TimeSpan.FromSeconds(10)
    };
    options.EnableRequestLogging = true;
});

// Typed client
public interface IProductsClient
{
    [Get("/api/products")]
    Task<IReadOnlyList<Product>> GetProductsAsync();

    [Get("/api/products/{id}")]
    Task<Product?> GetProductAsync(string id);
}

// Register typed client
builder.Services.AddBlazorHttpClient<IProductsClient>();

// Manual usage
@inject HttpClient Http

var products = await Http.GetFromJsonAsync<List<Product>>("api/products");

// Correlation ID propagation
// Every request automatically gets X-Correlation-ID header
// Responses propagate X-Request-ID for end-to-end tracing
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Blazor.HttpDefaults/` with `.csproj` (RCL).
2. Implement opinionated HttpClient factory, Polly resilience, auth handler, logging handler.
3. Add typed client registration and correlation ID propagation.
4. Add xunit + bUnit tests. Register in `HexGuard.slnx`.
