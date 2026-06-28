---
id: feature-blazor-graphql
type: feature
status: proposed
created: 2026-06-26
package: HexGuard.Blazor.GraphQL
---

# HexGuard.Blazor.GraphQL

## Summary

Headless GraphQL client state for Blazor â€” queries/mutations/subscriptions. Blazor counterpart to `@hexguard/angular-graphql`.


## Goals

- Provide reactive headless state for Blazor components
- SSR-safe with interactive server mode compatibility
- Minimal JavaScript interop, preferring native Blazor patterns


## Non-Goals

- No rendered UI components — headless state and services only
- No JavaScript library dependencies
- No server-side API integration (client-side state management only)

## Proposed Public API

```csharp
public sealed class GraphqlClient : IDisposable
{
    public GraphqlClient(string endpoint, Action<GraphqlOptions>? configure = null);

    public QueryState<T> Query<T>(string document, object? variables = null);
    public Task<MutationResult<T>> MutateAsync<T>(string document, object? variables = null);
    public SubscriptionState<T> Subscribe<T>(string document, object? variables = null);
}

public sealed class QueryState<T>
{
    public bool IsLoading { get; private set; }
    public T? Data { get; private set; }
    public IReadOnlyList<GraphqlError>? Errors { get; private set; }
    public event Action? OnChanged;
    public Task RefetchAsync();
}
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Blazor.GraphQL/` Razor class library.
2. Implement fetch-based GraphQL client.
3. Test with bUnit.
4. Publish as NuGet.
