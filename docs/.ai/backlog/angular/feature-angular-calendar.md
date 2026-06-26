---
id: feature-angular-calendar
type: feature
status: proposed
created: 2026-06-26
package: '@hexguard/angular-calendar'
---

# @hexguard/angular-calendar

## Summary

Headless calendar view state for Angular — navigate months/weeks/days, generate calendar grid data, track selected dates and ranges, manage view mode. Every scheduling app, date picker, and booking system needs calendar navigation.

**Distinct from `angular-date-utils`** (date formatting/comparison/DateRange model). `angular-calendar` adds **calendar view state**: month grid generation, navigation, view switching.

**Competition check:** No headless Angular calendar state package exists.

## Goals

1. Provide `injectCalendar()` — view state with month/week/day modes.
2. Generate calendar grid data (6-week month grid, week columns).
3. Support date selection (single, range, multi).
4. Support navigation (prev/next, today, go-to-date).
5. Support min/max date constraints.
6. Support locale-aware week start day and month names.

## Proposed Public API

```typescript
export type CalendarViewMode = 'month' | 'week' | 'day';

export interface CalendarCell {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
  iso: string;
}

export interface CalendarConfig {
  viewMode?: CalendarViewMode;
  selected?: Date | Date[] | Signal<Date | Date[]>;
  selectionMode?: 'single' | 'range' | 'multiple';
  minDate?: Date;
  maxDate?: Date;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  locale?: string;
}

export interface CalendarState {
  readonly viewDate: Signal<Date>;
  readonly viewMode: Signal<CalendarViewMode>;
  readonly grid: Signal<CalendarCell[]>;
  readonly weeks: Signal<CalendarCell[][]>;
  readonly selectedDates: Signal<Date[]>;
  readonly rangeStart: Signal<Date | null>;
  readonly rangeEnd: Signal<Date | null>;
  readonly today: Signal<Date>;

  setViewMode(mode: CalendarViewMode): void;
  next(): void; prev(): void;
  goToToday(): void; goToDate(date: Date): void;
  selectDate(date: Date): void; clearSelection(): void;
  isSelected(date: Date): Signal<boolean>;
  isDisabled(date: Date): Signal<boolean>;
  monthLabel: Signal<string>;
  weekDays: Signal<string[]>;
}

export function injectCalendar(config?: CalendarConfig): CalendarState;
```

## Implementation Plan

1. Scaffold `angular/packages/angular-calendar/`.
2. Implement calendar grid generation for month/week/day views.
3. Implement selection modes and navigation.
4. Support locale-aware week start.
5. Add tests: grid generation, selection, navigation, edge cases.
6. Register in workspace.
