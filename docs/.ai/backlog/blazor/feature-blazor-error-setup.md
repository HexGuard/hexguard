---
id: feature-blazor-error-setup
type: feature
status: proposed
created: 2026-06-29
package: 'HexGuard.Blazor.ErrorSetup'
---

# HexGuard.Blazor.ErrorSetup

## Summary

Global error handling pipeline for Blazor — catch unhandled exceptions, render user-friendly error UI, log to configured sinks, and recover gracefully. One `UseBlazorErrorHandling()` call replaces scattered try-catch and error pages.

## Problem

Blazor error handling is fragmented: unhandled exceptions in WASM show a yellow error bar, server-side exceptions kill the circuit, and each component manually implements try-catch. Production apps need: global exception handling, user-friendly error displays, automatic logging, circuit recovery, and component-level error boundaries — all requiring custom infrastructure.

## Goals

- Global unhandled exception handler for WASM and Server
- User-friendly error page (configurable per HTTP status)
- Automatic exception logging to configured sinks
- Circuit disconnection → auto-reconnect with state preservation
- Component-level error boundary integration
- Exception categorization (validation, auth, network, server, unknown)
- Custom error response per exception type
- Development mode detailed error display

## Non-Goals

- No replacement for `error-boundary` component (composes with it)
- No error reporting service (Sentry/AppInsights — delegates to logging)
- No rendered error UI components (headless state)

## Proposed Public API

```csharp
// Program.cs — middleware pipeline
app.UseBlazorErrorHandling(options =>
{
    options.ErrorPage = "/error";
    options.NotFoundPage = "/404";
    options.ForbiddenPage = "/403";
    options.LogExceptions = true;
    options.ReconnectOnCircuitLoss = true;
    options.Development.ShowDetailedErrors = true;
});

// Error state service
public interface IErrorState
{
    Exception? LastError { get; }
    string? ErrorCode { get; }
    string? UserFriendlyMessage { get; }
    bool HasError { get; }
    DateTimeOffset? ErrorTime { get; }
    event Action? ErrorChanged;
    void ClearError();
}

// Usage in error page component
@inject IErrorState ErrorState

@if (ErrorState.HasError)
{
    <p>@ErrorState.UserFriendlyMessage</p>
    <p>Error code: @ErrorState.ErrorCode</p>
    <button @onclick="ErrorState.ClearError">Dismiss</button>
}

// Exception categorization
public static class ExceptionCategories
{
    public static ErrorCategory Categorize(Exception ex) => ex switch
    {
        ValidationException => ErrorCategory.Validation,
        UnauthorizedAccessException => ErrorCategory.Auth,
        HttpRequestException => ErrorCategory.Network,
        _ => ErrorCategory.Server
    };
}
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Blazor.ErrorSetup/` with `.csproj` (RCL).
2. Implement global error handler, middleware pipeline, error state service.
3. Add circuit recovery, exception categorization, status code mapping.
4. Add xunit + bUnit tests. Register in `HexGuard.slnx`.
