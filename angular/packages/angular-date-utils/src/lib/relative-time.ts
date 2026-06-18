/**
 * Pure functions for relative time formatting using `Intl.RelativeTimeFormat`.
 * All functions are tree-shakeable and framework-independent.
 */

function getRelativeTimeFormatter(locale: string): Intl.RelativeTimeFormat {
  return new Intl.RelativeTimeFormat(locale, { numeric: 'auto', style: 'long' });
}

function getShortFormatter(locale: string): Intl.RelativeTimeFormat {
  return new Intl.RelativeTimeFormat(locale, { numeric: 'auto', style: 'narrow' });
}

/** Time units in milliseconds for internal calculations. */
const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

type Unit = 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second';

interface UnitThreshold {
  unit: Unit;
  ms: number;
  next?: Unit;
}

const THRESHOLDS: UnitThreshold[] = [
  { unit: 'year', ms: YEAR, next: 'month' },
  { unit: 'month', ms: MONTH, next: 'week' },
  { unit: 'week', ms: WEEK, next: 'day' },
  { unit: 'day', ms: DAY, next: 'hour' },
  { unit: 'hour', ms: HOUR, next: 'minute' },
  { unit: 'minute', ms: MINUTE, next: 'second' },
  { unit: 'second', ms: SECOND },
];

function computeDiff(target: Date): number {
  return target.getTime() - Date.now();
}

function computeUnit(diffMs: number): { value: number; unit: Unit } {
  const abs = Math.abs(diffMs);
  for (const t of THRESHOLDS) {
    if (abs >= t.ms) {
      return { value: Math.round(diffMs / t.ms), unit: t.unit };
    }
  }
  return { value: 0, unit: 'second' };
}

/**
 * Formats a date as a human-readable relative time string.
 * @example relativeTime(new Date('2026-06-15')) // "2 days ago"
 * @example relativeTime(new Date('2026-06-20')) // "in 3 days"
 */
export function relativeTime(target: Date, locale = 'en-US'): string {
  const diffMs = computeDiff(target);
  const abs = Math.abs(diffMs);

  if (abs < 10_000) return 'just now';

  const { value, unit } = computeUnit(diffMs);
  const formatter = getRelativeTimeFormatter(locale);
  return formatter.format(value, unit);
}

/**
 * Short relative time (compact notation).
 * @example shortRelativeTime(Date.now() - 300_000) // "5m ago"
 * @example shortRelativeTime(Date.now() - 7200_000) // "2h ago"
 */
export function shortRelativeTime(target: Date, locale = 'en-US'): string {
  const diffMs = computeDiff(target);
  const abs = Math.abs(diffMs);

  if (abs < 10_000) return 'now';

  const { value, unit } = computeUnit(diffMs);
  const formatter = getShortFormatter(locale);

  // Use compact unit labels
  const compactUnit = unit === 'minute' ? 'minute' : unit;
  return formatter.format(value, compactUnit);
}

/**
 * Exact relative time with two units of precision.
 * @example exactRelativeTime(new Date(Date.now() - 190_000_000)) // "2 days, 4 hours ago"
 */
export function exactRelativeTime(target: Date, locale = 'en-US'): string {
  const diffMs = computeDiff(target);
  const abs = Math.abs(diffMs);

  if (abs < 10_000) return 'just now';

  const sign = diffMs < 0 ? 1 : -1;

  const days = Math.floor(abs / DAY);
  const hours = Math.floor((abs % DAY) / HOUR);
  const minutes = Math.floor((abs % HOUR) / MINUTE);

  const parts: string[] = [];
  if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);
  if (hours > 0) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
  if (parts.length === 0 && minutes > 0) parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
  if (parts.length === 0) return 'just now';

  const joined = parts.join(', ');
  return sign < 0 ? `in ${joined}` : `${joined} ago`;
}
