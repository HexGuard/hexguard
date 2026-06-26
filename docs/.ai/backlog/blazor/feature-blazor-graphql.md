---
id: feature-blazor-graphql
type: feature
status: proposed
created: 2026-06-26
package: HexGuard.Blazor.GraphQL
---

# HexGuard.Blazor.GraphQL

## Summary

Headless GraphQL client state for Blazor — queries/mutations/subscriptions. Blazor counterpart to `@hexguard/angular-graphql`.

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
