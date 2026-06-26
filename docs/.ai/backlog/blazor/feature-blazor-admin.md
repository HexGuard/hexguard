---
id: feature-blazor-admin
type: feature
status: proposed
created: 2026-06-26
package: HexGuard.Blazor.Admin
---

# HexGuard.Blazor.Admin

## Summary

Admin panel shell state for Blazor — sidebar, tabs, breadcrumbs, notification badge. Blazor counterpart to `@hexguard/angular-admin`.

## Proposed Public API

```csharp
public sealed class AdminShellState : IDisposable
{
    public bool SidebarCollapsed { get; private set; }
    public IReadOnlyList<NavItem> Navigation { get; }
    public string? ActiveNavItem { get; private set; }
    public IReadOnlyList<TabState> OpenTabs { get; private set; }
    public int NotificationCount { get; set; }
    public event Action? OnChanged;

    public void ToggleSidebar();
    public void Navigate(string route);
    public void OpenTab(TabState tab);
    public void CloseTab(string id);
}

public sealed record NavItem(string Id, string Label, string? Route, string? Icon, int? Badge);
public sealed record TabState(string Id, string Label, string Route);
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Blazor.Admin/` Razor class library.
2. Implement sidebar, tabs, breadcrumbs state.
3. Test with bUnit.
4. Publish as NuGet.
