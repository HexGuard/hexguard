# @hexguard/angular-date-utils

Locale-aware date formatting, ranges, business-day calculations, and duration helpers for Angular — all tree-shakeable and framework-independent.

**[Deep package notes](https://github.com/HexGuard/hexguard/blob/main/docs/packages/angular-date-utils.md)** ·
**[Demo routes](#demo-routes)** ·
**[Installation](#installation)**

## Installation

```bash
pnpm add @hexguard/angular-date-utils
```

## Quickstart

```ts
import { injectDateUtils } from '@hexguard/angular-date-utils';

@Component({ ... })
class MyComponent {
  private readonly utils = injectDateUtils();

  readonly timestamp = this.utils.relativeTime(someDate);    // "2 days ago"
  readonly compact   = this.utils.compactDate(someDate);      // "Jun 17"
  readonly duration  = this.utils.formatDuration({            // "5d 3h"
    days: 5, hours: 3, minutes: 0, seconds: 0,
  });

  // Pure functions — usable outside Angular DI
  import { DateRange } from '@hexguard/angular-date-utils';
  const range = DateRange.last7Days();                        // rolling 7-day window
  range.contains(new Date());                                 // true
}
```

## Features

| Feature                                | Status | Notes                                               |
| -------------------------------------- | ------ | --------------------------------------------------- |
| Relative time (`"2 days ago"`)         | ✅     | Intl.RelativeTimeFormat, auto unit selection         |
| Short relative time (`"5m ago"`)       | ✅     | Narrow style for compact UIs                        |
| Exact relative time (`"2d 4h ago"`)    | ✅     | Two-unit precision                                  |
| Compact date (`"Jun 17"`)              | ✅     | Omits year for current-year dates                   |
| Compact date+time (`"Jun 17, 3:45 PM"`)| ✅     | With time, year-omission logic                      |
| Duration formatting (`"5d 3h"`)        | ✅     | Up to two most-significant units                    |
| `ageInYears()`                         | ✅     | Full-year age calculation from birth date           |
| `isWeekend() / addBusinessDays()`      | ✅     | Business-day (weekday) math                         |
| `businessDaysBetween()`                | ✅     | Counts weekdays between dates                       |
| `DateRange` model                      | ✅     | Validation, containment, overlap, preset factories  |
| `injectDateUtils()` DI facade          | ✅     | Captures LOCALE_ID from Angular DI                  |
| Zero runtime dependencies              | ✅     | Only `@angular/core` + `tslib` (for DI facade)      |

## Demo routes

| Route                             | Description                                              |
| --------------------------------- | -------------------------------------------------------- |
| `/packages/angular-date-utils`    | Package hub page with catalog overview                   |
| `/packages/angular-date-utils/demo` | Live formatting playground with inspector panel        |

## Public API

| Export                 | Kind     | Description                                      |
| ---------------------- | -------- | ------------------------------------------------ |
| `injectDateUtils()`    | Function | DI facade returning `DateUtilsFacade`            |
| `relativeTime()`       | Function | Human-readable relative time                     |
| `shortRelativeTime()`  | Function | Compact relative time (narrow style)             |
| `exactRelativeTime()`  | Function | Two-unit precision relative time                 |
| `compactDate()`        | Function | Compact date string                              |
| `compactDateTime()`    | Function | Compact date + time string                       |
| `formatDuration()`     | Function | Compact duration string                          |
| `ageInYears()`         | Function | Age in full years                                |
| `isWeekend()`          | Function | Weekend check                                    |
| `addBusinessDays()`    | Function | Add/subtract business days                       |
| `businessDaysBetween()`| Function | Count business days between dates                |
| `durationBetween()`    | Function | Duration breakdown between two dates             |
| `DateRange`            | Class    | Immutable date range model                       |
| `Duration`             | Type     | `{ days, hours, minutes, seconds }`              |
| `DateUtilsOptions`     | Type     | Optional `{ locale }` config                     |
| `DateUtilsFacade`      | Type     | Return type of `injectDateUtils()`               |

## What It Owns

- Pure date-utility functions, all tree-shakeable
- `DateRange` class with validation, containment, overlap, and preset factories
- `injectDateUtils()` DI wrapper that captures Angular's `LOCALE_ID`

## What It Does Not Own

- Date formatting is delegated to `Intl` APIs (no custom date math beyond business-day and duration logic)
- No timezone manipulation — all functions operate on the JS `Date` in the runtime timezone
- No date-picker or calendar UI components
