---
id: feature-blazor-render-fragments
type: feature
status: proposed
created: 2026-06-30
package: 'HexGuard.Blazor.RenderFragments'
---

# HexGuard.Blazor.RenderFragments

## Summary

Typed RenderFragment composition for Blazor — slot patterns, conditional rendering without disposal, fragment merging, and render callback helpers. For component customization and design systems.

## Pain Point

Blazor's `RenderFragment` is powerful but low-level. Multi-slot components require manual `[Parameter] RenderFragment? Header { get; set; }` per slot with null checks. Conditional slots destroy and recreate content. Merging fragments from multiple sources requires boilerplate. There's no typed way to define "this component accepts slots A, B, C."

## Goals

- Typed slot definitions with required/optional constraints
- Conditional slot rendering without destroying content
- Fragment composition (merge, wrap, wrap-all)
- Render callback helpers for list items, table rows, etc.
- Slot default content
- Slot querying (is slot filled?)

## Non-Goals

- No rendered slot UI
- No dynamic slot creation
- No Web Component interop

## Proposed Public API

```csharp
// Typed slot component
public class CardSlots : SlotContainer
{
    public Slot Header { get; } = new(isRequired: false);
    public Slot Body { get; } = new(isRequired: true);
    public Slot Footer { get; } = new(isRequired: false);

    protected override void Configure(SlotBuilder builder)
    {
        builder
            .DefaultContent(Header, builder => builder.AddMarkup(0, "<h3>Default</h3>"))
            .DefaultContent(Footer, builder => builder.AddMarkup(0, ""));
    }
}

// Usage in component
<div class="card">
    @if (Slots.Header.IsPresent)
    {
        <header>@Slots.Header.Render()</header>
    }
    <div class="body">@Slots.Body.Render()</div>
    @if (Slots.Footer.IsPresent)
    {
        <footer>@Slots.Footer.Render()</footer>
    }
</div>

@code {
    private CardSlots Slots { get; } = new();

    [Parameter] public RenderFragment? Header { get => Slots.Header.Fragment; set => Slots.Header.Fragment = value; }
    [Parameter] public RenderFragment Body { get => Slots.Body.Fragment; set => Slots.Body.Fragment = value; }
    [Parameter] public RenderFragment? Footer { get => Slots.Footer.Fragment; set => Slots.Footer.Fragment = value; }
}

// Fragment merge helper
public static class RenderFragmentExtensions
{
    public static RenderFragment Merge(params RenderFragment?[] fragments);
    public static RenderFragment Wrap(this RenderFragment inner, RenderFragment wrapper);
}

// Render callback for lists
public delegate RenderFragment ItemTemplate<T>(T item);
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Blazor.RenderFragments/` with `.csproj` (RCL).
2. Implement slot system, fragment composition, conditional rendering, callbacks.
3. Add source generator for typed slot parameters.
4. Add xunit + bUnit tests. Register in `HexGuard.slnx`.
