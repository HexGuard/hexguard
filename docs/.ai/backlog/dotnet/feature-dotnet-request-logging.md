---
id: feature-dotnet-request-logging
type: feature
status: proposed
created: 2026-06-26
package: HexGuard.RequestLogging
---

# HexGuard.RequestLogging

## Summary

Structured request/response logging middleware for ASP.NET Core — log every request with HTTP method, path, status code, duration, client IP, and optionally request/response bodies with sensitive data redaction. Every production API needs request logging for debugging, auditing, and performance monitoring, yet every project configures it ad-hoc.

**Competition check:** ASP.NET Core's built-in `UseHttpLogging()` captures raw HTTP data but lacks body capture, redaction, sampling, and structured log output. `Serilog.AspNetCore`'s request logging is popular but tied to Serilog.

## Why Wide Adoption

Request logging is fundamental API infrastructure: debugging production issues, auditing API usage, monitoring performance (slow endpoints), and security forensics. This package provides a drop-in middleware with sensible defaults.

## Goals

1. Provide `UseRequestLogging()` middleware that logs every request.
2. Capture: method, path, status code, duration, client IP, user agent.
3. Support optional request/response body capture with configurable max length.
4. Support sensitive data redaction (passwords, tokens, secrets) via field name patterns.
5. Support sampling — log only a percentage of requests (with 100% for errors and slow requests).
6. Support slow request threshold — always log requests exceeding the threshold.
7. Output structured logs via `ILogger<T>` with consistent property names.

## Proposed Public API

```csharp
public sealed class RequestLoggingOptions
{
    public bool LogRequestBodies { get; set; } = false;
    public bool LogResponseBodies { get; set; } = false;
    public int MaxBodyLength { get; set; } = 4096;        // Truncate bodies
    public string[] RedactFields { get; set; } = [         // Field name patterns
        "password", "token", "secret", "apiKey", "ssn",
        "creditCard", "authorization"
    ];
    public double SampleRate { get; set; } = 1.0;         // 0.0–1.0
    public TimeSpan SlowRequestThreshold { get; set; } = TimeSpan.FromSeconds(5);
    public string[] ExcludePaths { get; set; } = ["/health", "/metrics"];
}

public static class RequestLoggingExtensions
{
    public static IApplicationBuilder UseRequestLogging(
        this IApplicationBuilder app,
        Action<RequestLoggingOptions>? configure = null);
}

// Output shape (via ILogger):
// [13:45:12 INF] HTTP GET /api/products 200 42ms
//   { Method: "GET", Path: "/api/products", StatusCode: 200,
//     DurationMs: 42, ClientIp: "10.0.0.1", UserAgent: "Mozilla/5.0 ..." }
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.RequestLogging/` with standard `.csproj`.
2. Implement `RequestLoggingOptions`.
3. Implement `RequestLoggingMiddleware` — captures timing, status, optional body.
4. Implement body buffering and redaction (replace matched field values with `***`).
5. Implement sampling logic.
6. Add `InternalsVisibleTo` for test project.
7. Create test project with xUnit + `WebApplicationFactory` integration tests.
8. Register in `HexGuard.slnx`.
9. Publish as NuGet.
