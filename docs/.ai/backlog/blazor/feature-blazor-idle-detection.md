---
id: feature-blazor-idle-detection
type: feature
status: proposed
created: 2026-06-25
package: HexGuard.Blazor.IdleDetection
---

# HexGuard.Blazor.IdleDetection

## Summary

User inactivity detection for Blazor — detect when a user has been idle for a configurable timeout, fire idle/active events, and track idle duration. Essential for session timeout warnings, auto-save triggers, idle-based UI dimming, and analytics.

**Angular counterpart:** Part of `@hexguard/angular-visibility`

**Competition check (NuGet):** Zero Blazor idle-detection packages exist. Some auth libraries include session timeout but bundle it with full auth flows.

## Why Wide Adoption

Idle detection is needed in virtually every business web app: "Are you still there?" prompts before session timeout, pausing auto-refresh when the user steps away, dimming non-critical UI, and analytics tracking engagement duration. Without a package, every Blazor developer writes the same `Timer` + `@onkeydown`/`@onmousemove` wiring.

## Goals

1. Provide `IdleDetectionService` with configurable idle timeout and polling interval.
2. Fire `OnIdle` event when the user becomes idle, `OnActive` when they return.
3. Expose `IsIdle`, `IdleDuration`, `LastActivityTime` properties.
4. Automatic activity detection via mouse move, key press, click, touch, scroll.
5. `Start()`/`Stop()` lifecycle control.
6. Automatic cleanup on component disposal.
7. Pure C# + minimal JS interop — activity events captured by Blazor's event system where possible.

## Non-Goals

- No session timeout enforcement (consumer decides what to do on idle).
- No UI overlay or "Are you still there?" dialog (headless — provide the state, let the consumer render it).
- No pointer lock or focus detection (use `angular-visibility` patterns for tab visibility).

## Decisions

1. **Blazor circuit-side events**: Keyboard, mouse, and touch events are handled via Blazor's `@onkeydown`, `@onmousemove`, `@onclick` on a root container element. Scroll detection uses a minimal JS interop call.
2. **Timer-based**: Uses `System.Threading.Timer` internally for idle polling.
3. **Scoped service**: Registered as Scoped — each circuit gets its own idle detector.

## Proposed Public API

```csharp
// ── Service ───────────────────────────────────────────────

public sealed class IdleDetectionService : IDisposable
{
    public bool IsIdle { get; private set; }
    public TimeSpan IdleDuration { get; private set; }
    public DateTime LastActivityTime { get; private set; }
    public event Action? OnIdle;
    public event Action? OnActive;
    public event Action? OnStateChanged;

    public void Start(TimeSpan timeout, TimeSpan? pollInterval = null);
    public void Stop();
    public void ResetTimer();         // Called on user activity
}

// ── Registration ──────────────────────────────────────────

builder.Services.AddScoped<IdleDetectionService>();

// ── Usage ─────────────────────────────────────────────────

@implements IDisposable
@inject IdleDetectionService IdleDetector

<div @onkeydown="() => IdleDetector.ResetTimer()"
     @onmousemove="() => IdleDetector.ResetTimer()"
     @onclick="() => IdleDetector.ResetTimer()">

    @if (IdleDetector.IsIdle)
    {
        <div class="idle-overlay">
            <p>You've been idle for @IdleDetector.IdleDuration.TotalMinutes:F0 minutes.</p>
            <button @onclick="() => IdleDetector.ResetTimer()">I'm still here</button>
        </div>
    }
</div>

@code {
    protected override void OnInitialized()
    {
        IdleDetector.OnStateChanged += StateHasChanged;
        IdleDetector.Start(TimeSpan.FromMinutes(5));
    }

    public void Dispose()
    {
        IdleDetector.OnStateChanged -= StateHasChanged;
        IdleDetector.Dispose();
    }
}
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Blazor.IdleDetection/` with Razor class library `.csproj`.
2. Implement `IdleDetectionService` with timer, activity tracking, state events.
3. Create `IdleActivityTracker.razor` root component that wires up native DOM activity events via JS interop (scroll, visibility).
4. Create test project with xUnit + bUnit.
5. Publish as NuGet package `HexGuard.Blazor.IdleDetection`.
