---
id: feature-scheduling-cross-stack
type: feature
status: proposed
created: 2026-06-17
package: 'HexGuard.Scheduling + @hexguard/angular-scheduling'
---

# Scheduling Cross-Stack Package Pair

## Summary

Design a coordinated `.NET + Angular` package pair (`HexGuard.Scheduling` + `@hexguard/angular-scheduling`) for standardized time-slot availability, booking request, and appointment management contracts with calendar state and slot-selection signals.

The repeated problem is that service, healthcare, booking, and appointment apps all need time-slot availability, reservation, and scheduling logic, but every team builds the same time-range generation, slot occupancy tracking, and booking-state machine.

## Goals

- Define shared time-slot and booking contracts.
- .NET: Provide `TimeSlot`, `AvailabilityCalendar`, `BookingRequest` types, and availability-calculation helpers.
- .NET: Provide endpoint helpers for slot queries and booking operations.
- Angular: Provide slot-selection state signals and calendar navigation signals.
- Keep the contract calendar-agnostic (no specific date UI library dependency).

## Proposed Public API

```csharp
public record TimeSlot(DateTime StartUtc, DateTime EndUtc, bool IsAvailable, string? SlotId);
public record AvailabilityQuery(DateTime Date, string? ResourceId, TimeSpan Duration);
public record BookingRequest(string SlotId, string ResourceId, string CustomerId, string? Notes);
```

```ts
const calendar = injectCalendarState({
  selectedDate: signal(new Date()),
  slotDurationMinutes: 30,
  availableSlots: derived(() => fetchSlots(calendar.selectedDate())),
});

calendar.selectedDate;        // Signal<Date>
calendar.weekDays;            // Signal<Date[]>
calendar.availableSlots;      // Signal<TimeSlot[]>
calendar.selectedSlot;        // Signal<TimeSlot | null>

calendar.selectSlot(slot);
calendar.nextWeek();
calendar.previousWeek();
```

## Implementation Plan

1. Scaffold .NET `HexGuard.Scheduling` + Angular `angular-scheduling` projects.
2. Define shared `TimeSlot`, `AvailabilityQuery`, `BookingRequest` models.
3. .NET: Implement availability-calculation helpers (generate slots, mark occupied, check overlaps).
4. .NET: Implement sample endpoint in `HexGuard.SampleApi`.
5. Angular: Implement `injectCalendarState()` with date navigation, slot selection, week view.
6. Add unit tests: slot generation, overlap detection, date navigation, slot selection.
7. Add demo, docs, release.
