---
id: feature-blazor-async-state
type: feature
status: proposed
created: 2026-06-25
package: HexGuard.Blazor.AsyncState
---

# HexGuard.Blazor.AsyncState

## Summary

Signal-style async value and action lifecycle state for Blazor components. Load data, track loading/error/success states, and avoid duplicated concurrent calls. Every Blazor component calls an API and needs to show a spinner on loading, an error on failure, and the data on success — yet Blazor has no built-in primitive for this lifecycle.

**Angular counterpart:** `@hexguard/angular-async-state`

**Competition check (NuGet):** Zero standalone Blazor async-state abstraction packages exist. Some grid libraries have internal loading states but none offer a headless, reusable value/action state primitive.

## Why Wide Adoption

Virtually every Blazor component follows the same pattern: `_data = null; _isLoading = true; StateHasChanged(); try { _data = await api.GetAsync(); } catch { _error = ex; } finally { _isLoading = false; StateHasChanged(); }`. This package eliminates that boilerplate with a reusable, testable state container.

## Goals

1. Provide `AsyncValue<T>` — data container with loading, error, completed, and resolved states.
2. Provide `AsyncAction` — action lifecycle with execution guard (in-flight deduplication).
3. Support `OnStateChanged` event for `StateHasChanged()` notifications.
4. Support explicit `Reset()` to return to idle state.
5. Pure C# — no JS interop required.

## Non-Goals

- No auto-retry or polling (compose with other packages).
- No caching layer (state is in-memory per instance).
- No observable/stream support (pure async value and action patterns).

## Decisions

1. **Service pattern**: `AsyncValue<T>` and `AsyncAction` are standalone classes — register as Scoped or Transient.
2. **State enum**: A tri-state (or four-state) enum drives the UI: `Idle`, `Loading`, `Completed`, `Error`.
3. **In-flight deduplication**: If `LoadAsync` is called while already loading, the second call returns the existing task (matching the Angular pattern).

## Proposed Public API

```csharp
// ── Models ────────────────────────────────────────────────

public enum AsyncStateKind { Idle, Loading, Completed, Error }

// ── AsyncValue ────────────────────────────────────────────

public sealed class AsyncValue<T>
{
    public AsyncStateKind State { get; private set; }
    public T? Data { get; private set; }
    public string? Error { get; private set; }
    public Exception? Exception { get; private set; }
    public bool IsLoading => State == AsyncStateKind.Loading;
    public bool IsCompleted => State == AsyncStateKind.Completed;
    public bool HasError => State == AsyncStateKind.Error;
    public event Action? OnStateChanged;

    public Task<T> LoadAsync(Func<Task<T>> factory);
    public void Reset();                                    // Returns to Idle
}

// ── AsyncAction ───────────────────────────────────────────

public sealed class AsyncAction
{
    public bool IsExecuting { get; private set; }
    public string? Error { get; private set; }
    public Exception? Exception { get; private set; }
    public bool IsCompleted { get; private set; }
    public event Action? OnStateChanged;

    public Task ExecuteAsync(Func<Task> action);            // Deduplicates in-flight
    public void Reset();
}

// ── Registration ──────────────────────────────────────────

builder.Services.AddScoped<AsyncAction>();

// ── Usage ─────────────────────────────────────────────────

@inject AsyncAction SaveAction

<button @onclick="Save" disabled="@SaveAction.IsExecuting">
    @(SaveAction.IsExecuting ? "Saving..." : "Save")
</button>

@if (SaveAction.IsCompleted)
{
    <div class="success">Saved successfully!</div>
}
@if (SaveAction.HasError)
{
    <div class="error">@SaveAction.Error</div>
}

@code {
    private async Task Save()
    {
        await SaveAction.ExecuteAsync(async () =>
        {
            await api.PostAsync("/items", item);
        });
    }
}
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Blazor.AsyncState/` with Razor class library `.csproj`.
2. Implement `AsyncStateKind` enum.
3. Implement `AsyncValue<T>` with load, reset, state transitions, and in-flight dedup.
4. Implement `AsyncAction` with execution guard and state transitions.
5. Create test project with xUnit + bUnit.
6. Publish as NuGet package `HexGuard.Blazor.AsyncState`.
