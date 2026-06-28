---
id: feature-blazor-calendar
type: feature
status: proposed
created: 2026-06-26
package: HexGuard.Blazor.Calendar
---

# HexGuard.Blazor.Calendar

## Summary

Headless calendar view state for Blazor â€” month/week/day navigation, grid generation, date selection. Blazor counterpart to `@hexguard/angular-calendar`.

**Competition check:** Zero Blazor calendar state packages.


## Goals

- Provide reactive headless state for Blazor components
- SSR-safe with interactive server mode compatibility
- Minimal JavaScript interop, preferring native Blazor patterns


## Non-Goals

- No rendered UI components — headless state and services only
- No JavaScript library dependencies
- No server-side API integration (client-side state management only)

## Proposed Public API

```csharp
public sealed class CalendarState
{
    public DateOnly ViewDate { get; private set; }
    public CalendarViewMode ViewMode { get; private set; }
    public IReadOnlyList<CalendarCell> Grid { get; private set; }
    public IReadOnlyList<IReadOnlyList<CalendarCell>> Weeks { get; private set; }
    public IReadOnlyList<DateOnly> SelectedDates { get; private set; }
    public DateOnly Today { get; }
    public event Action? OnChanged;

    public void Next();
    public void Prev();
    public void GoToToday();
    public void GoToDate(DateOnly date);
    public void SetViewMode(CalendarViewMode mode);
    public void SelectDate(DateOnly date);
    public void ClearSelection();
}

public sealed record CalendarCell(
    DateOnly Date, bool IsCurrentMonth, bool IsToday, bool IsSelected, bool IsDisabled);
public enum CalendarViewMode { Month, Week, Day }
```

## Implementation Plan

1. Create `dotnet/src/HexGuard.Blazor.Calendar/` Razor class library.
2. Implement `CalendarState` with grid generation.
3. Test with bUnit.
4. Publish as NuGet.
