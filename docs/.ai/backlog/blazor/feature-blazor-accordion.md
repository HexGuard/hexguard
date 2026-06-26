---
id: feature-blazor-accordion
type: feature
status: proposed
created: 2026-06-26
package: HexGuard.Blazor.Accordion
---

# HexGuard.Blazor.Accordion

## Summary

Headless accordion/expandable section state for Blazor — expand/collapse with single/multi mode, animation tracking, and ARIA attributes. Blazor counterpart to `@hexguard/angular-accordion`.

**Competition check:** Zero Blazor accordion state packages.

## Proposed Public API

```csharp
public enum AccordionMode { Single, Multi }

public sealed class AccordionState : IDisposable
{
    public AccordionMode Mode { get; set; } = AccordionMode.Single;
    public IReadOnlySet<string> OpenIds { get; private set; }
    public event Action? OnChange;

    public bool IsOpen(string id);
    public void Toggle(string id);
    public void Open(string id);
    public void Close(string id);
    public void OpenAll();
    public void CloseAll();
    public void HandleKeyDown(string id, KeyboardEventArgs e);

    // Animation helpers
    public string GetAnimationClass(string id);
    public string GetHeaderId(string id) => $"accordion-header-{id}";
    public string GetPanelId(string id) => $"accordion-panel-{id}";
}
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Blazor.Accordion/` Razor class library.
2. Implement `AccordionState` with single/multi mode.
3. Add ARIA attribute helpers.
4. Test with bUnit.
5. Publish as NuGet.
