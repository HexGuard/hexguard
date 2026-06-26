---
id: feature-blazor-error-boundary
type: feature
status: proposed
created: 2026-06-25
package: HexGuard.Blazor.ErrorBoundary
---

# HexGuard.Blazor.ErrorBoundary

## Summary

Enhanced error boundary for Blazor components — catches render-time exceptions in projected content and provides configurable fallback UI, async error handling, typed error state, and programmatic reset. Blazor's built-in `ErrorBoundary` (introduced in .NET 8) is basic: it catches render errors but offers no async error callback, no typed error state for parent components, and limited customization.

**Angular counterpart:** `@hexguard/angular-error-boundary`

**Competition check (NuGet):** Zero enhanced error boundary packages exist for Blazor. The built-in `ErrorBoundary` covers the basics but lacks the headless, programmable contract that HexGuard packages aim for.

## Why Wide Adoption

Error boundaries are fundamental UI resilience infrastructure. Every non-trivial Blazor app needs to catch rendering errors in one component without crashing the entire page. The built-in `ErrorBoundary` is a good start but doesn't expose error details to parent components for logging, telemetry, or conditional UI.

## Goals

1. Provide `HexGuardErrorBoundary` component that catches render errors in `ChildContent`.
2. Fire `OnError(exception)` callback for logging, telemetry, or parent-component reactions.
3. Expose `HasError`, `LastError`, `LastException` properties for parent component binding.
4. Provide `Recover()` method to reset the error state and re-render child content.
5. Support both default fallback UI and custom `ErrorContent` template.
6. No JS interop — pure Blazor component lifecycle.

## Non-Goals

- No async error catching (error boundaries only catch render/sync errors by design — async errors belong in async-state/action patterns).
- No CSS or styling for the fallback UI.

## Decisions

1. **Extends `ErrorBoundaryBase`**: Wraps the built-in `ErrorBoundary` infrastructure rather than replacing it.
2. **Event-driven**: `OnError` event callback for side effects (logging, telemetry).

## Proposed Public API

```csharp
// ── Component ─────────────────────────────────────────────

@* HexGuardErrorBoundary.razor *@
public partial class HexGuardErrorBoundary : ErrorBoundaryBase
{
    [Parameter] public RenderFragment? ChildContent { get; set; }
    [Parameter] public RenderFragment<Exception>? ErrorContent { get; set; }
    [Parameter] public EventCallback<Exception> OnError { get; set; }

    // State
    public bool HasError { get; private set; }
    public string? LastError { get; private set; }
    public Exception? LastException { get; private set; }

    public new void Recover();   // Reset error state and re-render
}

// ── Usage ─────────────────────────────────────────────────

<HexGuardErrorBoundary OnError="LogError" @ref="errorBoundary">
    <MyComponent />
</HexGuardErrorBoundary>

@if (errorBoundary?.HasError == true)
{
    <button @onclick="() => errorBoundary.Recover()">Retry</button>
}

@code {
    private HexGuardErrorBoundary? errorBoundary;

    private async Task LogError(Exception ex)
    {
        await Telemetry.CaptureAsync(ex);
    }
}
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Blazor.ErrorBoundary/` with Razor class library `.csproj`.
2. Implement `HexGuardErrorBoundary` extending `ErrorBoundaryBase`.
3. Add `OnError` callback, `HasError`/`LastError`/`LastException` state.
4. Add `Recover()` method.
5. Create test project with bUnit + xUnit.
6. Publish as NuGet package `HexGuard.Blazor.ErrorBoundary`.
