---
id: feature-blazor-error-reporter
type: feature
status: proposed
created: 2026-06-30
package: 'HexGuard.Blazor.ErrorReporter'
---

# HexGuard.Blazor.ErrorReporter

## Summary

Error capture and reporting for Blazor — global exception handling, breadcrumb collection, stack trace enrichment, and reporter adapter. Pluggable backends.

## Pain Point

Blazor error handling is fragmented: WASM exceptions are captured by `App.ErrorBoundary`, server-side circuit exceptions crash the connection, and there's no unified error pipeline. Teams either add try-catch everywhere or lose error visibility in production.

## Goals

- Unified error handler for WASM and Server
- Breadcrumb collection (navigation, user actions, HTTP calls)
- Circuit-aware context enrichment (circuit ID, render mode)
- Pluggable reporter adapter (Sentry, AppInsights, custom)
- Error deduplication
- Offline queue for WASM
- Configurable filter rules

## Non-Goals

- No error monitoring dashboard
- No source map resolution
- No rendered error UI

## Proposed Public API

```csharp
public interface IBlazorErrorReporter
{
    void CaptureException(Exception ex, ErrorContext? context = null);
    void CaptureMessage(string message, ErrorLevel level = ErrorLevel.Error, ErrorContext? context = null);
    void AddBreadcrumb(Breadcrumb breadcrumb);
    void SetUser(string id, string? email = null, string? name = null);
}

public enum ErrorLevel { Fatal, Error, Warning, Info, Debug }

// Registration
builder.Services.AddBlazorErrorReporter(options =>
{
    options.Adapter = new SentryAdapter("https://...@sentry.io/123");
    options.Environment = builder.Environment.EnvironmentName;
    options.Release = "1.0.0";
    options.MaxBreadcrumbs = 100;
    options.CaptureUnhandledExceptions = true;
    options.IgnoreErrors = new[] { "TaskCanceledException" };
});

// Adapter interface
public interface IErrorReporterAdapter
{
    Task CaptureExceptionAsync(NormalizedError error);
    Task CaptureMessageAsync(NormalizedMessage message);
}
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Blazor.ErrorReporter/` with `.csproj` (RCL).
2. Implement global handler, breadcrumbs, context enrichment, adapter interface.
3. Add Sentry adapter, offline queue for WASM, deduplication.
4. Add xunit + bUnit tests. Register in `HexGuard.slnx`.
