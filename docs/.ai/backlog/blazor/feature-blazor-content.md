---
id: feature-blazor-content
type: feature
status: proposed
created: 2026-06-26
package: HexGuard.Blazor.Content
---

# HexGuard.Blazor.Content

## Summary

CMS content editing state for Blazor. Counterpart to `@hexguard/angular-content`.


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
public sealed class ContentService<T> where T : ContentEntry
{
    public IReadOnlyList<T> Entries { get; private set; }
    public T? Selected { get; private set; }
    public event Action? OnChanged;

    public Task LoadAsync(string contentTypeId);
    public Task CreateAsync(T entry);
    public Task UpdateAsync(T entry);
    public Task PublishAsync(string id);
    public Task ArchiveAsync(string id);
}
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Blazor.Content/` Razor class library.
2. Implement CRUD + publish/archive state.
3. Test with bUnit.
4. Publish as NuGet.
