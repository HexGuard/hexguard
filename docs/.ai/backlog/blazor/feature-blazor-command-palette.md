---
id: feature-blazor-command-palette
type: feature
status: proposed
created: 2026-06-25
package: HexGuard.Blazor.CommandPalette
---

# HexGuard.Blazor.CommandPalette

## Summary

Headless command registry and searchable palette for Blazor apps. Register commands (with titles, descriptions, keyboard shortcuts, and categories), search them by name/description, and invoke them — all without dictating UI. Opens a gap for Blazor that no existing NuGet package fills.

**Angular counterpart:** `@hexguard/angular-command-palette`

**Competition check (NuGet):** Zero headless Blazor command palette packages exist. Some UI libraries include a "command bar" but bundle it with specific UI rendering.

## Why Wide Adoption

Keyboard-driven navigation ("Ctrl+K" to search commands) has become an expected UX pattern in complex web apps. Every team building a Blazor LOB app eventually builds: a command registry, a search overlay, keyboard shortcut bindings, and context-sensitive command enablement. A headless package eliminates the repeated effort.

## Goals

1. Provide `CommandRegistry` service — register, unregister, search, and enumerate commands.
2. Support command metadata: ID, title, description, keyboard shortcut, category, icon hint.
3. Support context-aware enablement (commands can be enabled/disabled based on app state).
4. Provide `PaletteState` service — isOpen/close/toggle, search query, filtered results.
5. Expose `OnCommandsChanged` and `OnPaletteChanged` events for UI binding.
6. Automatic cleanup on component disposal.
7. No mandatory UI — consumers render their own palette overlay.

## Non-Goals

- No built-in palette overlay UI (headless — provide state, let the consumer render it).
- No focus trap or keyboard navigation implementation (compose with FocusTrap).
- No CSS or styling.

## Decisions

1. **Service pair**: `CommandRegistry` (data) and `PaletteState` (UI state) are separate injectable services.
2. **Pure C#**: No JS interop required — keyboard shortcut detection uses Blazor's `@onkeydown`.
3. **Scoped services**: Both are Scoped — each circuit has its own registry and palette state.

## Proposed Public API

```csharp
// ── Models ────────────────────────────────────────────────

public sealed record Command
{
    public string Id { get; init; } = Guid.NewGuid().ToString();
    public required string Title { get; init; }
    public string? Description { get; init; }
    public string? Shortcut { get; init; }     // e.g. "Ctrl+S", "Escape"
    public string? Category { get; init; }
    public bool Enabled { get; init; } = true;
    public Func<Task> Action { get; init; } = () => Task.CompletedTask;
}

// ── Registry ──────────────────────────────────────────────

public sealed class CommandRegistry : IDisposable
{
    public IReadOnlyList<Command> AllCommands { get; }
    public IEnumerable<Command> Search(string query);
    public string Register(Command command);
    public bool Unregister(string id);
    public void Clear();
    public event Action? OnCommandsChanged;
}

// ── Palette State ─────────────────────────────────────────

public sealed class PaletteState
{
    public bool IsOpen { get; private set; }
    public string Query { get; private set; } = "";
    public IReadOnlyList<Command> Results { get; private set; } = [];
    public int SelectedIndex { get; private set; }
    public event Action? OnStateChanged;

    public void Toggle();
    public void Open();
    public void Close();
    public void SetQuery(string query);
    public void SelectNext();
    public void SelectPrevious();
    public Task InvokeSelected();
}

// ── Registration ──────────────────────────────────────────

builder.Services.AddScoped<CommandRegistry>();
builder.Services.AddScoped<PaletteState>();

// ── Usage ─────────────────────────────────────────────────

@implements IDisposable
@inject CommandRegistry Commands
@inject PaletteState Palette

<button @onclick="Palette.Toggle">Commands (Ctrl+K)</button>

@if (Palette.IsOpen)
{
    <div class="palette-overlay" @onkeydown="HandleKeyDown">
        <input @bind="searchQuery"
               @bind:event="oninput"
               @oninput="() => Palette.SetQuery(searchQuery)"
               placeholder="Search commands..." />
        <ul>
            @foreach (var cmd in Palette.Results)
            {
                <li class="@(cmd == Palette.Results[Palette.SelectedIndex] ? "selected" : "")"
                    @onclick="async () => { await cmd.Action(); Palette.Close(); }">
                    @cmd.Title
                </li>
            }
        </ul>
    </div>
}

@code {
    private string searchQuery = "";

    protected override void OnInitialized()
    {
        Commands.Register(new() {
            Title = "Save", Shortcut = "Ctrl+S",
            Category = "File", Action = Save
        });
        Palette.OnStateChanged += StateHasChanged;
    }

    private async Task Save() { /* ... */ }
    public void Dispose() { Palette.OnStateChanged -= StateHasChanged; }
}
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Blazor.CommandPalette/` with Razor class library `.csproj`.
2. Implement `Command` record.
3. Implement `CommandRegistry` with registration, search, and change notification.
4. Implement `PaletteState` with open/close, query, selection, and result filtering.
5. Create test project with xUnit + bUnit.
6. Publish as NuGet package `HexGuard.Blazor.CommandPalette`.
