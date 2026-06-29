---
id: feature-blazor-reactive
type: feature
status: proposed
created: 2026-06-29
package: 'HexGuard.Blazor.Reactive'
---

# HexGuard.Blazor.Reactive

## Summary

Fine-grained reactive state patterns for Blazor — observable properties with computed/derived values, batch updates, and minimal re-rendering. Brings signal-like reactivity to Blazor without the Angular dependency.

## Pain Point

Blazor components re-render via `StateHasChanged()` or `EventCallback`. There's no built-in equivalent to Angular Signals, React hooks, or Vue refs for fine-grained reactivity:
- Changes to a single property re-render the entire component tree
- Cascading parameters cause cascading re-renders
- No computed/derived values that auto-update
- No batched updates — multiple changes cause multiple renders
- Manual `InvokeAsync(StateHasChanged)` boilerplate everywhere

## Goals

- `Observable<T>` wrapper with change notification
- `Computed<T>` for derived values that auto-update
- Update batching to prevent multiple re-renders
- `ObservableCollection<T>` with change tracking
- Minimal allocations, designed for Blazor's render cycle
- Integration with `ComponentBase` via base class or source generator

## Non-Goals

- No replacement for Blazor's rendering engine
- No state management framework (Flux/Redux pattern)
- No inter-component state synchronization

## Proposed Public API

```csharp
// Observable value
public sealed class Observable<T> : IObservable<T>
{
    public T Value { get; set; }
    public IDisposable Subscribe(Action<T> callback);
    public static implicit operator T(Observable<T> observable) => observable.Value;
}

// Computed value (auto-updates when dependencies change)
public sealed class Computed<T> : IObservable<T>
{
    public T Value { get; }
    public IDisposable Subscribe(Action<T> callback);
}

public static class Computed
{
    public static Computed<TOut> From<T1, TOut>(
        IObservable<T1> dep1,
        Func<T1, TOut> compute);

    public static Computed<TOut> From<T1, T2, TOut>(
        IObservable<T1> dep1, IObservable<T2> dep2,
        Func<T1, T2, TOut> compute);
}

// Observable collection
public sealed class ObservableCollection<T> : IList<T>, INotifyCollectionChanged
{
    public IReadOnlyList<T> AddedItems { get; }
    public IReadOnlyList<T> RemovedItems { get; }
}

// Batching
public static class BatchUpdate
{
    public static IDisposable Begin();
    // All Observable<T> changes within the scope fire once on dispose
}

// Reactive component base
public abstract class ReactiveComponentBase : ComponentBase, IDisposable
{
    protected void Watch<T>(IObservable<T> observable, Action<T> callback);
    protected override void Dispose(bool disposing);
}
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Blazor.Reactive/` with `.csproj` (RCL).
2. Implement `Observable<T>`, `Computed<T>`, `ObservableCollection<T>`, batching.
3. Add `ReactiveComponentBase` with auto-subscription cleanup.
4. Add xunit + bUnit tests. Register in `HexGuard.slnx`.
