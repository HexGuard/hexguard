---
id: feature-blazor-app-shell
type: feature
status: proposed
created: 2026-06-29
package: 'HexGuard.Blazor.AppShell'
---

# HexGuard.Blazor.AppShell

## Summary

Headless app shell state management — layout configuration, responsive sidebar, dark mode, navigation state, and breadcrumbs. The app shell every Blazor project rebuilds from scratch.

## Problem

Every Blazor project reimplements the same app shell patterns: MainLayout with NavMenu, responsive sidebar toggle, dark/light theme switching, page breadcrumbs, and navigation highlighting. Each takes 100+ lines of boilerplate that varies subtly across projects.

## Goals

- Layout state signals (sidebar open, sidebar width, layout mode)
- Responsive breakpoint-driven sidebar behavior (overlay vs push)
- Dark/light/system theme toggle with persistence
- Navigation menu state with active item tracking
- Breadcrumb generation from route data
- Page title management from route/breadcrumb
- Mobile-friendly gesture support for sidebar
- Keyboard shortcuts for common shell actions

## Non-Goals

- No rendered layout components — state and services only
- No CSS framework dependency
- No routing engine (uses built-in NavigationManager)

## Proposed Public API

```csharp
// One-call setup
builder.Services.AddBlazorAppShell(options =>
{
    options.Sidebar = new SidebarOptions
    {
        DefaultOpen = true,
        Breakpoint = "md",    // overlay below md
        SaveState = true       // persist to localStorage
    };
    options.Theme = new ThemeOptions
    {
        Default = "system",   // system | light | dark
        SavePreference = true
    };
});

// App shell state
public interface IAppShell
{
    // Sidebar
    bool SidebarOpen { get; set; }
    SidebarMode SidebarMode { get; }   // Push | Overlay
    int SidebarWidth { get; set; }
    event Action? ShellChanged;

    // Theme
    Theme CurrentTheme { get; }
    void SetTheme(Theme theme);
    event Action<Theme>? ThemeChanged;

    // Navigation
    string CurrentTitle { get; }
    IReadOnlyList<BreadcrumbItem> Breadcrumbs { get; }
    string ActiveNavItem { get; set; }
    void SetPageTitle(string title);

    // Keyboard
    IDisposable RegisterShortcut(string key, Action handler);
}

// Usage in component
@inject IAppShell Shell
@implements IDisposable

protected override void OnInitialized()
{
    Shell.SetPageTitle("Products");
    Shell.ActiveNavItem = "/products";
}
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Blazor.AppShell/` with `.csproj` (RCL).
2. Implement sidebar/layout state, theme management, navigation, breadcrumbs.
3. Add responsive breakpoint support, persistence, keyboard shortcuts.
4. Add xunit + bUnit tests. Register in `HexGuard.slnx`.
