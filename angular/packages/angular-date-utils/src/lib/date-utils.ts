import { inject, LOCALE_ID } from '@angular/core';

import { relativeTime, shortRelativeTime, exactRelativeTime } from './relative-time';
import { compactDate, compactDateTime, formatDuration, ageInYears } from './compact-format';
import { isWeekend, addBusinessDays, businessDaysBetween } from './business-days';
import { durationBetween } from './duration';
import { DateRange } from './date-range';
import type { Duration, DateUtilsOptions } from './types';

export type { Duration, DateUtilsOptions } from './types';

/** The return type of {@link injectDateUtils}. */
export interface DateUtilsFacade {
  /** The resolved locale identifier. */
  readonly locale: string;

  /** Formats a date as relative time (e.g. "2 days ago"). */
  relativeTime(target: Date): string;
  /** Short relative time (e.g. "2h ago"). */
  shortRelativeTime(target: Date): string;
  /** Exact relative time (e.g. "2 days, 4 hours ago"). */
  exactRelativeTime(target: Date): string;
  /** Compact date (e.g. "Jun 17" or "Jun 17, 2025"). */
  compactDate(date: Date): string;
  /** Compact date + time (e.g. "Jun 17, 3:45 PM"). */
  compactDateTime(date: Date): string;
  /** Duration breakdown between two dates. */
  durationBetween(start: Date, end: Date): Duration;
  /** Compact duration string (e.g. "5d 3h"). */
  formatDuration(duration: Duration): string;
  /** Age in full years from a birth date. */
  ageInYears(birthDate: Date): number;
  /** Whether the date falls on a weekend. */
  isWeekend(date: Date): boolean;
  /** Add business days to a date (skips weekends). */
  addBusinessDays(date: Date, days: number): Date;
  /** Count business days between two dates. */
  businessDaysBetween(start: Date, end: Date): number;
  /** The DateRange class for creating range models. */
  readonly DateRange: typeof DateRange;
}

/**
 * Injects a date utilities facade with locale-aware formatting.
 *
 * Must be called within an Angular injection context.
 * Detects locale from Angular's `LOCALE_ID` token, falling back to `'en-US'`.
 *
 * @example
 * ```ts
 * const utils = injectDateUtils();
 * console.log(utils.relativeTime(someDate)); // "2 days ago"
 * ```
 */
export function injectDateUtils(options?: DateUtilsOptions): DateUtilsFacade {
  const locale = options?.locale ?? inject(LOCALE_ID, { optional: true }) ?? 'en-US';

  return {
    locale,
    relativeTime: (target) => relativeTime(target, locale),
    shortRelativeTime: (target) => shortRelativeTime(target, locale),
    exactRelativeTime: (target) => exactRelativeTime(target, locale),
    compactDate: (date) => compactDate(date, locale),
    compactDateTime: (date) => compactDateTime(date, locale),
    durationBetween,
    formatDuration,
    ageInYears,
    isWeekend,
    addBusinessDays,
    businessDaysBetween,
    DateRange,
  };
}
