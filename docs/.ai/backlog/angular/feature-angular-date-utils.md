---
id: feature-angular-date-utils
type: feature
status: proposed
created: 2026-06-17
package: '@hexguard/angular-date-utils'
---

# Angular Date Utils Package

## Summary

Design `@hexguard/angular-date-utils` as a lightweight Angular package providing date-range state models, relative-time formatting, locale-aware compact notation, and date-comparison helpers that go beyond Angular's built-in `DatePipe` for date-heavy business apps.

The repeated problem is that Angular's built-in `DatePipe` covers basic formatting, but business apps constantly need relative time ("3m ago," "in 2 days"), date range state (start/end with validation), compact date notation ("Jan 5," "2026-06-17"), business-day comparison, and age/elapsed calculation — all of which are rebuilt ad hoc in every project. A small set of pure utility functions and state models would eliminate this boilerplate.

## Goals

- Provide pure utility functions for relative-time formatting (`relativeTime`, `shortRelativeTime`, `exactRelativeTime`).
- Provide a `DateRange` state model with start/end signals, validation (end after start), and preset ranges.
- Provide locale-aware compact date formatting beyond DatePipe's format string.
- Provide business-day helpers (`isWeekend`, `addBusinessDays`, `businessDaysBetween`).
- Provide age/elapsed helpers (`durationBetween`, `ageInYears`, `formatDuration`).
- Keep all utilities pure (input → output), framework-agnostic in logic, wrapped as Angular injectable services for tree-shaking.
- Keep the package dependency-free beyond `@angular/core` and `tslib`.

## Non-Goals

- Replacing or wrapping `@angular/common` `DatePipe` or `registerLocaleData` — consumers still use those for i18n.
- Full calendar or date-picker UI components.
- Timezone conversion beyond what the native `Intl` API provides.
- Date-math for financial or scientific date calculations.

## Decisions

- Prefer pure functions over services where possible — tree-shakeable, testable, framework-independent.
- Wrap related functions in an injectable `DateUtils` service for Angular DI consistency.
- Use the browser's `Intl.RelativeTimeFormat` and `Intl.DateTimeFormat` APIs — no extra locale data needed.
- Keep locale detection from Angular's `LOCALE_ID` injection token, fall back to browser default.
- Provide `DateRange` as a simple immutable model class with factory methods for common presets.

## Proposed Public API

```ts
import { injectDateUtils, DateRange } from '@hexguard/angular-date-utils';

const utils = injectDateUtils();

// Relative time
utils.relativeTime(new Date('2026-06-15')); // "2 days ago"
utils.relativeTime(new Date('2026-06-20')); // "in 3 days"
utils.shortRelativeTime(Date.now() - 300_000); // "5m ago"
utils.shortRelativeTime(Date.now() - 7200_000); // "2h ago"
utils.shortRelativeTime(Date.now() - 86400_000 * 3); // "3d ago"
utils.exactRelativeTime(d); // "2 days, 4 hours ago"

// Compact formatting
utils.compactDate(new Date('2026-06-17')); // "Jun 17"
utils.compactDate(new Date('2025-06-17')); // "Jun 17, 2025" (different year)
utils.compactDateTime(new Date()); // "Jun 17, 3:45 PM"

// Business days
utils.isWeekend(new Date('2026-06-17')); // false (Wednesday)
utils.addBusinessDays(new Date('2026-06-17'), 3); // Mon Jun 22 (skips weekend)
utils.businessDaysBetween(start, end); // number

// Duration
utils.durationBetween(start, end); // { days: 5, hours: 3, minutes: 0 }
utils.formatDuration({ days: 5, hours: 3 }); // "5d 3h"
utils.ageInYears(birthDate); // 34

// Date range model
const range = new DateRange(new Date('2026-06-01'), new Date('2026-06-30'));
range.start; // Date
range.end; // Date
range.isValid; // true (end >= start)
range.durationDays; // 29
range.contains(new Date('2026-06-15')); // true
range.overlaps(otherRange); // boolean

// Preset factories
DateRange.last7Days(); // rolling 7-day window
DateRange.last30Days();
DateRange.thisMonth();
DateRange.lastMonth();
DateRange.next30Days();
DateRange.custom(start, end);
```

## Implementation Plan

### Phase 0: Foundation

1. Scaffold the publishable Angular library under `angular/packages/angular-date-utils/` following existing conventions.
2. Add build and test scripts to `angular/package.json` (`build:lib:date-utils`, `test:lib:date-utils`).

### Phase 1: Core Implementation

3. Implement pure functions for `relativeTime`, `shortRelativeTime`, `exactRelativeTime` using `Intl.RelativeTimeFormat`.
4. Implement `compactDate` and `compactDateTime` using `Intl.DateTimeFormat` with smart year display.
5. Implement `isWeekend`, `addBusinessDays`, `businessDaysBetween` without external dependencies.
6. Implement `durationBetween`, `formatDuration`, `ageInYears` as pure functions.
7. Implement `DateRange` model class with validation, containment, overlap, and preset static factories.
8. Implement `injectDateUtils()` service that wires locale from Angular's `LOCALE_ID` and exposes all functions.
9. Add unit tests for: all relative-time variants, edge cases (future, past, now, same day), business-day math (weekends, holidays aren't configurable yet), duration formatting, DateRange validation and overlap, preset factories, locale-aware formatting, and error handling for invalid dates.

### Phase 2: Demo & Docs

10. Add a demo route at `/packages/angular-date-utils` showing:
    - Live relative-time ticker (updates every second)
    - Date range picker demo with validation
    - Business-day calculator
    - Duration display for countdown or elapsed time
11. Add Playwright coverage for the demo page.
12. Write the deep-dive doc at `docs/packages/angular-date-utils.md`.
13. Update the npm-facing `README.md`.

### Phase 3: Release

14. Add `verify:package:date-utils` to `angular/package.json`.
15. Add `.github/workflows/release-angular-date-utils.yml`.
16. Run `pnpm test:ci` and `pnpm build` for the full validation gate.

## Validation

- `pnpm test:lib:date-utils` — unit tests for all utility functions, DateRange model, locale awareness.
- `pnpm build:lib` — package builds.
- `pnpm test:app` — demo compiles.
- `pnpm test:e2e` — Playwright for demo interactions.
- `pnpm verify:package:date-utils` — tarball smoke test.

## Follow-Ups

- Revisit holiday-calendar integration for business-day calculation if demand arises.
- Evaluate whether a companion `@hexguard/angular-date-range-picker` state model is worth separating once date-range UI patterns emerge.
