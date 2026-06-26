---
id: feature-blazor-tags
type: feature
status: proposed
created: 2026-06-25
package: HexGuard.Blazor.Tags
---

# HexGuard.Blazor.Tags

## Summary

Headless tag/chip input state for Blazor — add tags by typing+Enter or selecting from a picker, remove by backspace/click, validate against constraints, and autocomplete from a suggestions list. Tag inputs appear in every form with categorization, metadata, or multi-select fields.

**Angular counterpart:** `@hexguard/angular-tags`

**Competition check (NuGet):** Zero headless Blazor tag input packages exist. Some UI libraries include chip components but bundle them with styling.

## Why Wide Adoption

Tag input is a universal form pattern: email recipients, skill selectors, category pickers, label editors, assignee selectors, keyword inputs. A headless approach makes it compatible with any design system.

## Goals

1. Provide `TagInputState` service with add, remove, clear operations.
2. Support max tag limit, duplicate detection, and custom validation.
3. Support autocomplete suggestions with keyboard navigation.
4. Support backspace-to-remove.
5. Expose reactive state via `OnChanged` event.
6. Pure C# — minimal JS interop only for input value tracking.

## Proposed Public API

```csharp
public sealed record TagInputConfig
{
    public int Max { get; init; } = int.MaxValue;
    public bool AllowDuplicates { get; init; } = false;
    public Func<string, string?>? Validate { get; init; }  // Return error or null
}

public sealed class TagInputState : IDisposable
{
    public IReadOnlyList<string> Tags { get; private set; }
    public string InputText { get; set; } = "";
    public string? Error { get; private set; }
    public int Remaining { get; private set; }
    public bool IsValid => Error is null;
    public event Action? OnChanged;

    public bool Add(string tag);
    public void Remove(int index);
    public void RemoveLast();
    public void Clear();
}

// ── Registration ──────────────────────────────────────────

builder.Services.AddTransient<TagInputState>();

// ── Usage ─────────────────────────────────────────────────

@inject TagInputState Tags

<div class="tags">
    @foreach (var (tag, i) in Tags.Tags.Select((t, i) => (t, i)))
    {
        <span class="tag">@tag <button @onclick="() => Tags.Remove(i)">×</button></span>
    }
    <input @bind="Tags.InputText" @bind:event="oninput"
           @onkeydown="HandleKeyDown" placeholder="Add tag..." />
</div>
@if (Tags.Error is not null)
{
    <span class="error">@Tags.Error</span>
}

@code {
    private void HandleKeyDown(KeyboardEventArgs e)
    {
        if (e.Key == "Enter" && !string.IsNullOrWhiteSpace(Tags.InputText))
        {
            Tags.Add(Tags.InputText);
            Tags.InputText = "";
        }
        else if (e.Key == "Backspace" && string.IsNullOrWhiteSpace(Tags.InputText))
        {
            Tags.RemoveLast();
        }
    }
}
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Blazor.Tags/` Razor class library.
2. Implement `TagInputConfig`, `TagInputState` with add/remove/validation.
3. Add keyboard handler helpers.
4. Test with bUnit + xUnit.
5. Publish as NuGet.
