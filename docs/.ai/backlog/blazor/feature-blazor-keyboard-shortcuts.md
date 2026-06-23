---
id: feature-blazor-keyboard-shortcuts
type: feature
status: proposed
created: 2026-06-23
package: HexGuard.Blazor.KeyboardShortcuts
---

# HexGuard.Blazor.KeyboardShortcuts

## Summary

Declarative global and scoped keyboard shortcut registration for Blazor components. Register `Ctrl+S`, `Escape`, `Shift+?`, or any key combination as a named shortcut with automatic cleanup on component disposal.

**Competition check (NuGet):** `BlazorHotkeys` (2,337 downloads, last updated 2021) — outdated, .NET 5 only. No other meaningful packages. **Greenfield.**

## Why Wide Adoption

Every Blazor app needs keyboard shortcuts — save (`Ctrl+S`), close (`Escape`), search (`Ctrl+K`), navigate (`1`, `2`, `3`). Without a package, developers must write raw JS interop (bloating every component) or copy-paste the same `addEventListener('keydown', ...)` pattern.

## Goals

1. Provide `KeyboardShortcutRegistrar` service with `Register(shortcut, callback)` and `Unregister(id)`.
2. Support modifier keys (`Ctrl`, `Alt`, `Shift`, `Meta`) + regular keys.
3. Support scoped shortcuts (only active when a specific component is mounted).
4. Support shortcut descriptions for a "Keyboard shortcuts help" overlay.
5. Automatic cleanup via `IDisposable` when the component disposes.
6. No JS interop required for core functionality — pure Blazor circuit-side event handling.

## Non-Goals

- No built-in keyboard help overlay UI (headless — provide the data, let the consumer render it).
- No focus management or tab trapping.

## Decisions

1. **Blazor circuit-side**: `@onkeydown` on a root container div captures keyboard events natively — no JS interop needed for most use cases.
2. **Service pattern**: `KeyboardShortcutRegistrar` is registered Scoped. Components inject it and register shortcuts.
3. **Priority ordering**: Exact matches win over modifier-only; first-registered wins on conflicts.

## Proposed Public API

```csharp
// ── Models ────────────────────────────────────────────────

public sealed record KeyboardShortcut
{
    public string Id { get; init; } = Guid.NewGuid().ToString();
    public string? Description { get; init; }
    public required string Key { get; init; }           // "s", "Escape", "F1"
    public bool Ctrl { get; init; }
    public bool Alt { get; init; }
    public bool Shift { get; init; }
    public bool Meta { get; init; }
    public bool PreventDefault { get; init; } = true;
    public Func<Task> Callback { get; init; } = () => Task.CompletedTask;
}

// ── Service ───────────────────────────────────────────────

public sealed class KeyboardShortcutRegistrar : IDisposable
{
    public string Register(KeyboardShortcut shortcut);
    public bool Unregister(string id);
    public void Clear();
    public IReadOnlyList<KeyboardShortcut> ActiveShortcuts { get; }
    public event Action? OnShortcutsChanged;

    // Called by a root-level KeyDown handler component
    public Task HandleKeyDown(KeyboardEventArgs e);
}

// ── Registration ──────────────────────────────────────────

builder.Services.AddScoped<KeyboardShortcutRegistrar>();

// ── Usage ─────────────────────────────────────────────────

@inject KeyboardShortcutRegistrar Shortcuts
@implements IDisposable

<div @onkeydown="Shortcuts.HandleKeyDown" tabindex="0">
    @* app content *@
</div>

@code {
    protected override void OnInitialized()
    {
        Shortcuts.Register(new() { Key = "s", Ctrl = true, Description = "Save",
            Callback = async () => await SaveAsync() });
        Shortcuts.Register(new() { Key = "Escape", Description = "Close",
            Callback = async () => isOpen = false });
    }

    public void Dispose() => Shortcuts.Clear();
}
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Blazor.KeyboardShortcuts/` Razor class library.
2. Implement `KeyboardShortcut`, `KeyboardShortcutRegistrar`.
3. Create `KeyboardShortcutHandler.razor` root component.
4. Add conflict detection and priority resolution.
5. Test with bUnit.
6. Publish as NuGet.
