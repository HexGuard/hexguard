---
id: feature-blazor-component-variants
type: feature
status: proposed
created: 2026-06-30
package: 'HexGuard.Blazor.ComponentVariants'
---

# HexGuard.Blazor.ComponentVariants

## Summary

Declarative component variant system for Blazor — fluent variant definition API with auto-generated CSS classes, ARIA attributes, and conflict detection. Eliminates manual `$"btn {Size switch {...}}"` string building.

## Goals

- Fluent `VariantBuilder` API per component
- Auto-generated CSS class strings from variant state
- Variant composition (size + color + state)
- Default variant resolution
- ARIA attribute generation from variant state
- Conflict detection (invalid combinations)

## Non-Goals

- No rendered component library
- No CSS framework
- No Figma integration

## Proposed Public API

```csharp
public sealed class ButtonVariants : ComponentVariants
{
    public Variant<string> Size { get; } = new("md", "sm", "md", "lg");
    public Variant<string> Color { get; } = new("primary", "primary", "secondary", "outline", "ghost");
    public Variant<bool> Loading { get; } = new(false);
    public Variant<bool> Disabled { get; } = new(false);

    protected override void Configure(VariantBuilder builder)
    {
        builder
            .Map(Size, s => s switch { "sm" => "btn-sm", "md" => "btn-md", "lg" => "btn-lg" })
            .Map(Color, c => c switch { "primary" => "btn-primary", "secondary" => "btn-secondary", "outline" => "btn-outline", "ghost" => "btn-ghost" })
            .Map(Loading, l => l ? "btn-loading" : "")
            .Aria(Loading, "aria-busy", "true")
            .Aria(Disabled, "aria-disabled", "true")
            .Default(Size, "md").Default(Color, "primary")
            .Conflict(Loading, Disabled);
    }
}

// Usage
<button class="@Variants.Class" @attributes="Variants.AriaAttributes">...</button>
```

## Implementation Plan
1. Create `dotnet/src/HexGuard.Blazor.ComponentVariants/` with `.csproj` (RCL).
2. Implement `VariantBuilder`, `ComponentVariants` base, CSS class + ARIA generation.
3. Add source generator for compile-time variant parameters.
4. Add xunit + bUnit tests. Register in `HexGuard.slnx`.
