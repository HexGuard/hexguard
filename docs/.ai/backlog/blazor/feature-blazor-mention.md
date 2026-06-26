---
id: feature-blazor-mention
type: feature
status: proposed
created: 2026-06-25
package: HexGuard.Blazor.Mention
---

# HexGuard.Blazor.Mention

## Summary

Headless mention/autocomplete detection for Blazor text inputs — detect `@` or `#` triggers as the user types, filter a candidate list, and handle selection. Mention inputs appear in chat apps, comment forms, document editors, and social features.

**Angular counterpart:** `@hexguard/angular-mention`

**Competition check (NuGet):** Zero Blazor mention detection packages exist.

## Why Wide Adoption

Mention inputs (`@username`, `#channel`, `:emoji:`, `#ticket`) are a universal UX pattern in collaborative apps. Every team re-implements the same trigger detection and popover positioning logic.

## Goals

1. Provide `MentionState` service that detects trigger characters in text input.
2. Expose `IsActive`, `Query`, `TriggerChar`, `CursorPosition`, `FilteredCandidates`.
3. Support custom trigger characters.
4. Support keyboard navigation (ArrowUp/Down, Enter, Escape).
5. Support `Select(index)` — replace trigger+query text with selected item.

## Non-Goals

- No popover UI component.
- No async candidate loading.

## Decisions

1. **JS interop required**: Reading cursor position and replacing text in `<input>` requires JS interop. A small `mention.js` module (~30 lines) handles this.
2. **IJSRuntime-based**: Uses `IJSRuntime.InvokeAsync<CursorPosition>` to get cursor position.

## Proposed Public API

```csharp
public sealed record MentionTrigger
{
    public char Char { get; init; } = '@';
    public int MinLength { get; init; } = 1;
}

public sealed class MentionState : IAsyncDisposable
{
    public bool IsActive { get; private set; }
    public string Query { get; private set; } = "";
    public char ActiveTrigger { get; private set; }
    public (double Top, double Left) CursorPosition { get; private set; }
    public IReadOnlyList<string> FilteredCandidates { get; private set; } = [];
    public int HighlightedIndex { get; private set; }
    public event Action? OnStateChanged;

    public void SetCandidates(IReadOnlyList<string> candidates);
    public Task HandleInputAsync(ElementReference inputElement);
    public Task SelectAsync(int index, ElementReference inputElement);
    public void Cancel();
    public void HighlightNext();
    public void HighlightPrev();
}

// ── Registration ──────────────────────────────────────────

builder.Services.AddScoped<MentionState>();
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Blazor.Mention/` Razor class library.
2. Create `mention.js` module (cursor position, text replacement).
3. Implement `MentionState` with trigger detection and candidate filtering.
4. Implement keyboard navigation.
5. Test with bUnit + mocked IJSRuntime.
6. Publish as NuGet.
