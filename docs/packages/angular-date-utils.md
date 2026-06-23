# `@hexguard/angular-date-utils` Deep Dive

This page complements the npm-facing README with repo-specific implementation notes and behavior details.

## Purpose

`@hexguard/angular-date-utils` provides a collection of date-utility functions and a `DateRange` model class for Angular apps. The package is designed in two layers:

1. **Pure functions** — tree-shakeable, framework-independent, usable in Node.js or non-Angular TS
2. **DI facade** — `injectDateUtils()` that captures Angular's `LOCALE_ID` and returns a `DateUtilsFacade`

## Feature Matrix

| Capability              | Status    | Notes                                                         |
| ----------------------- | --------- | ------------------------------------------------------------- |
| `relativeTime()`        | Available | Intl.RelativeTimeFormat, auto unit selection                  |
| `shortRelativeTime()`   | Available | Narrow style for compact UIs                                  |
| `exactRelativeTime()`   | Available | Two-unit precision ("2 days, 4 hours ago")                    |
| `compactDate()`         | Available | Omits year for current-year dates                             |
| `compactDateTime()`     | Available | With time, year-omission logic                                |
| `formatDuration()`      | Available | Up to two most-significant units                              |
| `ageInYears()`          | Available | Full-year age calculation from birth date                     |
| `isWeekend()`           | Available | Checks `getDay()` against 0 (Sunday) and 6 (Saturday)         |
| `addBusinessDays()`     | Available | Iterates day-by-day skipping weekends; supports negatives     |
| `businessDaysBetween()` | Available | Iterates from start to end, counting non-weekend days         |
| `durationBetween()`     | Available | Absolute difference with days/hours/minutes/seconds breakdown |
| `DateRange` class       | Available | Validation, containment, overlap, durationDays, presets       |
| `injectDateUtils()`     | Available | DI facade with LOCALE_ID capture                              |
| Locale override         | Available | Pass `{ locale: 'fr-FR' }` to override Angular LOCALE_ID      |

## Public API Map

| Export                  | Kind     | Role                                                |
| ----------------------- | -------- | --------------------------------------------------- |
| `relativeTime()`        | Function | Human-readable relative time via Intl               |
| `shortRelativeTime()`   | Function | Compact narrow-style relative time                  |
| `exactRelativeTime()`   | Function | Two-unit precision relative time                    |
| `compactDate()`         | Function | Compact date (year omitted for current year)        |
| `compactDateTime()`     | Function | Compact date + time (year omitted for current year) |
| `formatDuration()`      | Function | Compact duration string (up to 2 units)             |
| `ageInYears()`          | Function | Age in full years from birth date                   |
| `isWeekend()`           | Function | Weekend check (Saturday/Sunday)                     |
| `addBusinessDays()`     | Function | Add/subtract business days, skipping weekends       |
| `businessDaysBetween()` | Function | Count business days between dates                   |
| `durationBetween()`     | Function | Duration breakdown between two dates                |
| `DateRange`             | Class    | Immutable date range with validation and presets    |
| `Duration`              | Type     | `{ days, hours, minutes, seconds }`                 |
| `DateUtilsOptions`      | Type     | `{ locale?: string }`                               |
| `DateUtilsFacade`       | Type     | Return type of `injectDateUtils()`                  |

## Behavior Details

### Relative Time Unit Selection

The `relativeTime()` function selects the best unit based on the absolute difference:

| Difference   | Unit   | Example          |
| ------------ | ------ | ---------------- |
| < 10 seconds | —      | "just now"       |
| 10s – 59s    | second | "45 seconds ago" |
| 1m – 59m     | minute | "5 minutes ago"  |
| 1h – 23h     | hour   | "3 hours ago"    |
| 1d – 6d      | day    | "2 days ago"     |
| 1w – 4w      | week   | "3 weeks ago"    |
| 1mo – 11mo   | month  | "2 months ago"   |
| ≥1y          | year   | "1 year ago"     |

### `exactRelativeTime` Sign Handling

The function correctly identifies past vs future:

- **Past**: `diffMs < 0` → `"2 days, 4 hours ago"`
- **Future**: `diffMs > 0` → `"in 2 days, 4 hours"`

### `addBusinessDays` Algorithm

Iterates day-by-day, skipping Saturday and Sunday. Supports negative values for backwards calculation. Returns a new `Date` instance — does not mutate the input.

### `DateRange` Preset Factories

All static factory methods create ranges relative to the **current system time**:

| Factory              | Window                     |
| -------------------- | -------------------------- |
| `last7Days()`        | Today - 6 days → Today     |
| `last30Days()`       | Today - 29 days → Today    |
| `next30Days()`       | Today → Today + 29 days    |
| `thisMonth()`        | Current month start → end  |
| `lastMonth()`        | Previous month start → end |
| `custom(start, end)` | Arbitrary start/end        |

### `injectDateUtils()` Options

The `locale` option allows overriding Angular's `LOCALE_ID`:

```ts
// Uses Angular's LOCALE_ID (defaults to 'en-US')
const utils = injectDateUtils();

// Explicit locale override
const utils = injectDateUtils({ locale: 'de-DE' });
```

All formatting functions delegate to `Intl` APIs; the locale affects month names, date order, and relative-time phrasing.

## Edge Cases

| Scenario                            | Behavior                                                                   |
| ----------------------------------- | -------------------------------------------------------------------------- |
| `businessDaysBetween(start, start)` | Returns 0                                                                  |
| `addBusinessDays(date, 0)`          | Returns same date (cloned)                                                 |
| Past date, future date              | `relativeTime` handles both via Intl.RelativeTimeFormat                    |
| Invalid `DateRange`                 | `isValid` returns false; `durationDays` returns 0; `contains` always false |
| `compactDate` with ISO strings      | Works as long as the string can construct a valid `Date`                   |

## Test Coverage

All pure functions are tested directly. The DI facade is tested via `TestBed.runInInjectionContext`. Tests cover:

- Relative time: past, future, "just now", locale override
- Compact dates: same year, different year
- Format duration: all unit combinations, zero case
- Age: birthday edge cases (before, after, same day, newborn)
- Business days: forward, backward, zero, weekend boundaries
- DateRange: validity, containment, overlap, touching ranges, all presets
- injectDateUtils: locale detection and override

## Related Resources

- [Package README](../../angular/packages/angular-date-utils/README.md)
- [Package Catalog](../README.md)
- [Demo Routes](../../angular/apps/demo-angular/src/app/features/packages/angular/angular-date-utils/)
- [Source Code](../../angular/packages/angular-date-utils/src/)

---

## API Review Findings

Review date: 2026-06-22. Findings are observational.

### Observations

| Dimension                 | Finding                                                                                                                                                                                                                          | Severity |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Public API Design         | Two-layer design: pure tree-shakeable functions (`relativeTime()`, `compactDate()`, `formatDuration()`, `ageInYears()`, `isWeekend()`, `addBusinessDays()`, `businessDaysBetween()`) + optional DI facade (`injectDateUtils()`). | praise   |
| Public API Design         | 13 exports — the most of any utility package. Functions are well-named and individually tree-shakeable.                                                                                                                          | praise   |
| Test Coverage             | All pure functions tested directly. DI facade tested via `TestBed.runInInjectionContext`. Locale detection and override tested.                                                                                                  | praise   |
| Test Coverage             | **No release workflow** — missing `.github/workflows/release-angular-date-utils.yml`.                                                                                                                                            | moderate |
| Cross-package Consistency | **Not integrated into `build:lib`, `test:lib`, `test:ci`, or `verify:package` chains**. Only standalone `build:lib:date-utils` exists.                                                                                           | moderate |
| Cross-package Consistency | Not listed in `docs/packages/README.md` catalog overview table.                                                                                                                                                                  | minor    |
