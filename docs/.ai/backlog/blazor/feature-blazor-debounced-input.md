---
id: feature-blazor-debounced-input
type: feature
status: proposed
created: 2026-06-23
package: HexGuard.Blazor.DebouncedInput
---

# HexGuard.Blazor.DebouncedInput

## Summary

Debounced input handling for Blazor components — delay value changes until the user stops typing, with configurable debounce window, leading/trailing invocation, and cancellation. Essential for search-as-you-type, form auto-save, and live-filter scenarios.

**Competition check (NuGet):** No standalone Blazor debounced input package exists. Some grid/table libraries include debounced search internally, but none offer a headless, reusable debounce primitive. **Greenfield.**

## Why Wide Adoption

Autocomplete search, live-filter tables, and auto-save forms all need debounce — wait until the user pauses before firing the expensive operation. Without a package, every Blazor developer writes the same `CancellationTokenSource` + `Task.Delay` pattern, or uses `@oninput` with raw JS interop timers. A headless debounce utility would be adopted by virtually every Blazor app with search or filter functionality.

## Goals

1. Provide `DebouncedValue<T>` service that delays value propagation by a configurable interval.
2. Support trailing (default), leading, and leading+trailing invocation modes.
3. Support cancellation of in-flight debounced operations when the component disposes.
4. Pure .NET — no JS interop required.
5. `IDisposable` for automatic cleanup.

## Non-Goals

- No input component UI — headless value debouncing only.
- No UI framework integration (works with any Blazor input).

## Decisions

1. **Pure C#**: Uses `CancellationTokenSource` + `Task.Delay` — no JS interop needed.
2. **Value-based**: `DebouncedValue<T>` wraps any value type. The consumer provides a callback that fires after the debounce window.
3. **Thread-safe**: Designed for Blazor's single-threaded synchronization context.

## Proposed Public API

```csharp
// ── Options ───────────────────────────────────────────────

public enum DebounceMode
{
    Trailing,      // Fire after pause (default)
    Leading,       // Fire immediately, then ignore until pause
    LeadingAndTrailing // Fire immediately and after pause
}

// ── Service ───────────────────────────────────────────────

public sealed class DebouncedValue<T> : IDisposable
{
    public DebouncedValue(Func<T, Task> onValue,
        int delayMs = 300, DebounceMode mode = DebounceMode.Trailing);

    public void Push(T value);      // Called from @oninput or @onchange
    public void Flush();            // Immediately invoke with latest value
    public void Cancel();
    public T? LastProcessed { get; }
}

// ── Registration ──────────────────────────────────────────

// Transient — each search field gets its own instance
builder.Services.AddTransient<DebouncedValue<T>>();

// ── Usage ─────────────────────────────────────────────────

@inject DebouncedValue<string> SearchDebounce

<input @oninput="OnSearch" @bind-value="searchText" placeholder="Search..." />

<ul>
    @foreach (var item in results)
    {
        <li>@item.Name</li>
    }
</ul>

@code {
    private string searchText = "";
    private List<Item> results = [];

    protected override void OnInitialized()
    {
        SearchDebounce = new DebouncedValue<string>(async (query) =>
        {
            results = await Api.SearchAsync(query);
        }, delayMs: 400);
    }

    private void OnSearch(ChangeEventArgs e)
    {
        searchText = e.Value?.ToString() ?? "";
        SearchDebounce.Push(searchText);
    }

    public void Dispose() => SearchDebounce.Dispose();
}
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Blazor.DebouncedInput/` Razor class library.
2. Implement `DebouncedValue<T>` with Timer + CancellationTokenSource.
3. Support Trailing, Leading, LeadingAndTrailing modes.
4. Add `Flush()` for immediate invocation.
5. Test with xUnit (controlled timing).
6. Publish as NuGet.
