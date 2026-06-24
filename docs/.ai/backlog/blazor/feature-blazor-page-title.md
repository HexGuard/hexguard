---
id: feature-blazor-page-title
type: feature
status: proposed
created: 2026-06-23
package: HexGuard.Blazor.PageTitle
---

# HexGuard.Blazor.PageTitle

## Summary

Hierarchical page title and breadcrumb management for Blazor apps. Blazor's built-in `<PageTitle>` only sets the document title — it provides no breadcrumb trail, no hierarchy, and no way to react to the current title stack from code.

**Competition check (NuGet):** Zero dedicated Blazor page-title packages. **Greenfield.**

## Why Wide Adoption

Every Blazor app needs to set the page title dynamically. Many also need breadcrumb navigation. Without a package, teams either rely solely on `<PageTitle>` (flat, no hierarchy) or build their own title-stack service. A headless breadcrumb+title manager would be adopted by virtually every multi-page Blazor app.

## Goals

1. Provide `PageTitleManager` service with a title stack — push/pop segments as users navigate.
2. Auto-render the document `<title>` from the full stack (e.g., "Product Details > Products > My App").
3. Expose a breadcrumb trail signal for custom breadcrumb UI rendering.
4. Integrate with Blazor `NavigationManager` for auto-push on navigation.
5. Support custom separators and truncation.

## Non-Goals

- No breadcrumb UI component — headless data only.
- No route-to-title mapping — consumers provide titles explicitly.

## Proposed Public API

```csharp
public sealed class PageTitleManager : IDisposable
{
    public string Separator { get; set; } = " > ";
    public IReadOnlyList<string> Segments => _segments.AsReadOnly();
    public string FullTitle => string.Join(Separator, _segments.AsEnumerable().Reverse());
    public event Action? OnTitleChanged;

    public void PushSegment(string segment);
    public void PopSegment();
    public void SetSegments(params string[] segments);
    public void Clear();
}
```

## Implementation Plan

1. Create package project.
2. Implement `PageTitleManager` service.
3. Create `TitleSetter.razor` component that auto-registers on init and removes on dispose.
4. Test with bUnit.
