/**
 * Pure functions for business-day (weekday) calculations.
 * All functions are tree-shakeable and framework-independent.
 */

/**
 * Returns true when the date falls on a weekend (Saturday or Sunday).
 */
export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

/**
 * Adds a number of business days to a date, skipping weekends.
 * Use negative `days` to go backwards.
 * @example addBusinessDays(new Date('2026-06-17'), 3) // Mon Jun 22 (skips Sat/Sun)
 */
export function addBusinessDays(date: Date, days: number): Date {
  const result = new Date(date);
  const direction = days >= 0 ? 1 : -1;
  let remaining = Math.abs(days);

  while (remaining > 0) {
    result.setDate(result.getDate() + direction);
    if (!isWeekend(result)) {
      remaining--;
    }
  }
  return result;
}

/**
 * Counts business days (weekdays) between two dates (exclusive of end date).
 * @example businessDaysBetween(new Date('2026-06-14'), new Date('2026-06-21')) // 5
 */
export function businessDaysBetween(start: Date, end: Date): number {
  let count = 0;
  const current = new Date(start);

  while (current < end) {
    if (!isWeekend(current)) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  return count;
}
