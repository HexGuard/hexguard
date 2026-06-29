---
id: feature-blazor-prerender-state
type: feature
status: proposed
created: 2026-06-29
package: 'HexGuard.Blazor.PrerenderState'
---

# HexGuard.Blazor.PrerenderState

## Summary

Typed state transfer for Blazor SSR → CSR hydration. Eliminates double-fetching data during pre-rendering by serializing server state into the HTML and restoring it on the client.

## Pain Point

Blazor's pre-rendering model (Static SSR → Interactive WASM/Server) causes a **double fetch**: data is loaded once during SSR, the HTML is sent, then the interactive renderer re-fetches the same data. The built-in `PersistentComponentState` API requires manual serialization and `TryTakeFromJson` calls with exact type matching. Developers often skip pre-rendering entirely to avoid this complexity, sacrificing SEO and perceived performance.

## Goals

- Typed state registration on server during pre-render
- Automatic JSON serialization into the render tree
- Automatic state restoration on interactive startup
- Support for scoped state (per component) and global state (per circuit)
- State invalidation (skip stale state if too old)
- Streaming support (register state before async completes)

## Non-Goals

- No replacement for `PersistentComponentState` — thin typed wrapper
- No caching strategy decisions
- No server-side state management

## Proposed Public API

```csharp
// Register state during OnInitializedAsync (pre-render)
public interface IPrerenderState
{
    void Register<T>(string key, T value);
    void RegisterAsync<T>(string key, Task<T> valueTask);
    T? Restore<T>(string key);
    bool TryRestore<T>(string key, out T? value);
    bool HasState(string key);
}

// Component usage
@implements IAsyncDisposable

@code {
    [Inject] public IPrerenderState PrerenderState { get; set; } = default!;

    private List<Product>? _products;

    protected override async Task OnInitializedAsync()
    {
        // Restore if available (CSR hydration), otherwise fetch
        if (!PrerenderState.TryRestore<List<Product>>("products", out _products))
        {
            _products = await ProductService.GetProductsAsync();
            PrerenderState.Register("products", _products);
        }
    }
}

// Service registration
public static IServiceCollection AddBlazorPrerenderState(this IServiceCollection services);
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Blazor.PrerenderState/` with `.csproj` (RCL).
2. Implement typed wrapper over `PersistentComponentState` with auto serialization.
3. Add state expiration, streaming support, and DI registration.
4. Add xunit + bUnit tests. Register in `HexGuard.slnx`.
