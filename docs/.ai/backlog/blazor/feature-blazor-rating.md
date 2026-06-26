---
id: feature-blazor-rating
type: feature
status: proposed
created: 2026-06-25
package: HexGuard.Blazor.Rating
---

# HexGuard.Blazor.Rating

## Summary

Star/rating input state for Blazor — handling full and half-star selection, hover preview, keyboard accessibility, and tooltip display. Rating inputs appear in e-commerce, reviews, feedback forms, and content rating — yet every team re-implements the same hover state, keyboard navigation, and accessibility wiring.

**Competition check (NuGet):** Zero headless Blazor rating state packages exist. UI libraries include star ratings as components but bundle them with rendering.

## Why Wide Adoption

Star ratings are one of the most recognizable UX patterns. E-commerce product reviews, service feedback, content ratings, skill assessments — virtually every public-facing app needs them. A headless approach separates state from star icons.

## Goals

1. Provide `RatingState` with value, hover value, max stars, and half-star support.
2. Support hover preview (set hover on mouseenter, clear on mouseleave).
3. Support keyboard navigation (Arrow keys to adjust, Enter to confirm).
4. Provide accessibility labels for screen readers.
5. Fire `OnChanged` event and expose `AccessibilityLabel`.
6. Pure C# — no JS interop required.

## Proposed Public API

```csharp
public sealed record RatingConfig
{
    public int Max { get; init; } = 5;
    public bool AllowHalf { get; init; } = false;
    public string? Label { get; init; }          // e.g. "Rate this product"
}

public sealed class RatingState
{
    public double Value { get; private set; }        // 0–Max
    public double HoverValue { get; private set; }   // Preview value on hover
    public bool IsInteractive { get; set; } = true;
    public string AccessibilityLabel { get; }
    public event Action? OnChanged;

    public void SetValue(double value);
    public void SetHover(double value);
    public void ClearHover();
    public void HandleKeyDown(string key);     // ArrowLeft/Right, Enter

    // Helpers for rendering
    public bool IsFilled(int starIndex);             // 1-based
    public bool IsHalfFilled(int starIndex);
    public bool IsHovered(int starIndex);
}

// ── Registration ──────────────────────────────────────────

builder.Services.AddTransient<RatingState>();

// ── Usage ─────────────────────────────────────────────────

@inject RatingState Rating

<span role="radiogroup" aria-label="@Rating.AccessibilityLabel"
      @onkeydown="OnKeyDown">
    @for (int i = 1; i <= 5; i++)
    {
        <span role="radio" aria-checked="@(Rating.Value >= i)"
              @onclick="() => Rating.SetValue(i)"
              @onmouseenter="() => Rating.SetHover(i)"
              @onmouseleave="() => Rating.ClearHover()"
              class="@(Rating.IsFilled(i) ? "star-filled" : "star-empty")">
            @(Rating.IsHalfFilled(i) ? "★½" : Rating.IsFilled(i) ? "★" : "☆")
        </span>
    }
</span>
<span>@($"{(int)Rating.Value}/5")</span>

@code {
    private void OnKeyDown(KeyboardEventArgs e)
    {
        Rating.HandleKeyDown(e.Key);
    }
}
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Blazor.Rating/` Razor class library.
2. Implement `RatingConfig`, `RatingState` with value/hover/keyboard/accessibility.
3. Test with bUnit + xUnit.
4. Publish as NuGet.
