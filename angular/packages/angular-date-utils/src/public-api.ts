/**
 * Public API for `@hexguard/angular-date-utils`.
 *
 * Provides pure date-utility functions and a DateRange model for Angular apps.
 */
export { DateRange } from './lib/date-range';
export type { Duration } from './lib/types';
export type { DateUtilsOptions, DateUtilsFacade } from './lib/date-utils';

export { injectDateUtils } from './lib/date-utils';

export { relativeTime, shortRelativeTime, exactRelativeTime } from './lib/relative-time';
export { compactDate, compactDateTime, formatDuration, ageInYears } from './lib/compact-format';
export { isWeekend, addBusinessDays, businessDaysBetween } from './lib/business-days';
export { durationBetween } from './lib/duration';
